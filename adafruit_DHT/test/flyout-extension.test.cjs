const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const extensions = new Map();
const Blockly = {
  Extensions: {
    isRegistered(name) {
      return extensions.has(name);
    },
    register(name, callback) {
      extensions.set(name, callback);
    },
    unregister(name) {
      extensions.delete(name);
    },
  },
  FieldDropdown: class FieldDropdown {
    constructor(options) {
      this.options = options;
    }
  },
};
const Arduino = { forBlock: {} };
const context = {
  Arduino,
  Blockly,
  window: {
    boardConfig: {
      digitalPins: [['PA2', '2']],
      i2c: [['I2C', 'Wire']],
    },
  },
};

const generatorPath = path.join(__dirname, '..', 'generator.js');
vm.runInNewContext(fs.readFileSync(generatorPath, 'utf8'), context, {
  filename: generatorPath,
});

const extension = extensions.get('dht_init_dynamic');
assert.equal(typeof extension, 'function', 'DHT extension should be registered');

function createBlock(workspace) {
  const typeField = { setValidator() {} };
  const variableField = {
    validator: null,
    getValidator() {
      return null;
    },
    setValidator(callback) {
      this.validator = callback;
    },
  };
  const dummyInput = {
    appendField() {
      return this;
    },
  };

  return {
    workspace,
    getInput() {
      return null;
    },
    appendDummyInput() {
      return dummyInput;
    },
    getField(name) {
      return name === 'TYPE' ? typeField : variableField;
    },
    getFieldValue(name) {
      return name === 'TYPE' ? 'DHT11' : 'dht';
    },
  };
}

let flyoutVariableCreates = 0;
const flyoutWorkspace = {
  isFlyout: true,
  getVariable() {
    return null;
  },
  createVariable() {
    flyoutVariableCreates += 1;
    extension.call(createBlock(flyoutWorkspace));
    return { getId: () => 'flyout-dht' };
  },
};

assert.doesNotThrow(
  () => extension.call(createBlock(flyoutWorkspace)),
  'rendering the toolbox flyout must not recursively create variables',
);
assert.equal(flyoutVariableCreates, 0, 'flyout blocks must not create variables');

let mainVariableCreates = 0;
const mainWorkspace = {
  isFlyout: false,
  getVariable() {
    return null;
  },
  createVariable() {
    mainVariableCreates += 1;
    return { getId: () => 'main-dht' };
  },
};

extension.call(createBlock(mainWorkspace));
assert.equal(mainVariableCreates, 1, 'a real workspace block should register its DHT variable');

console.log('DHT flyout extension regression test passed');

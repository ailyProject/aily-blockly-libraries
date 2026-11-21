const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const extensions = new Map();
let timeoutCount = 0;
const mainWorkspace = {
  addChangeListener() {}
};

function FieldDropdown() {}
FieldDropdown.prototype.doClassValidation_ = function (value) {
  return value;
};

const Blockly = {
  Field: {},
  FieldDropdown,
  Events: { FINISHED_LOADING: 'finished_loading' },
  Extensions: {
    isRegistered(name) {
      return extensions.has(name);
    },
    unregister(name) {
      extensions.delete(name);
    },
    register(name, callback) {
      extensions.set(name, callback);
    }
  },
  getMainWorkspace() {
    return mainWorkspace;
  }
};

const Arduino = {
  forBlock: Object.create(null),
  ORDER_ATOMIC: 0,
  ORDER_FUNCTION_CALL: 1,
  valueToCode() {
    return '';
  }
};

vm.runInNewContext(
  fs.readFileSync(path.join(__dirname, 'generator.js'), 'utf8'),
  {
    Arduino,
    Blockly,
    window: {
      boardConfig: {
        uploadParam: 'esptool --chip esp32s3'
      }
    },
    setTimeout() {
      timeoutCount += 1;
      return timeoutCount;
    }
  },
  { filename: 'core-serial/generator.js' }
);

test('ESP32-S3 custom serial exposes UART2 before saved fields are restored', () => {
  const extension = extensions.get('serial_begin_esp32_custom_extension');
  assert.equal(typeof extension, 'function');
  const timeoutCountBeforeExtension = timeoutCount;

  const uartField = {
    value: 'UART0',
    menuGenerator_: [['UART0', 'UART0'], ['UART1', 'UART1']],
    getValue() {
      return this.value;
    },
    setValue(value) {
      const isValid = this.getOptions().some(([, optionValue]) => optionValue === value);
      if (isValid) this.value = value;
    },
    getOptions() {
      return this.menuGenerator_;
    }
  };

  extension.call({
    isInFlyout: true,
    getField(name) {
      return name === 'UART' ? uartField : null;
    }
  });

  assert.equal(timeoutCount, timeoutCountBeforeExtension);

  assert.deepEqual(
    Array.from(uartField.getOptions(), (option) => Array.from(option)),
    [['UART0', 'UART0'], ['UART1', 'UART1'], ['UART2', 'UART2']]
  );

  uartField.setValue('UART2');
  assert.equal(uartField.getValue(), 'UART2');
});

let realBlockly;
try {
  const host = process.env.AILY_BLOCKLY_ROOT || path.resolve(__dirname, '../../aily-blockly');
  require(require.resolve('blockly/core', { paths: [host] }));
  realBlockly = require(require.resolve('blockly', { paths: [host] }));
} catch {}

test('real Blockly restores and round-trips ESP32-S3 UART2 and generates port 2', {
  skip: !realBlockly && 'requires Blockly from AILY_BLOCKLY_ROOT or sibling aily-blockly'
}, () => {
  const board = { core: 'esp32:esp32', uploadParam: 'esptool --chip esp32s3',
    digitalPins: [['GPIO4', '4'], ['GPIO5', '5']], serialSpeed: [['115200', '115200']] };
  const Arduino = { forBlock: {}, ORDER_ATOMIC: 0, ORDER_FUNCTION_CALL: 1 };
  const workspace = new realBlockly.Workspace();
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'generator.js'), 'utf8'), {
    Arduino, Blockly: { ...realBlockly, getMainWorkspace: () => workspace },
    window: { boardConfig: board }, setTimeout() {}, console
  });
  const definition = JSON.parse(JSON.stringify(require('./block.json').find(block => block.type === 'serial_begin_esp32_custom'))
    .replace(/"\$\{board\.(\w+)\}"/g, (_, key) => JSON.stringify(board[key])));
  realBlockly.defineBlocksWithJsonArray([definition]);
  try {
    const saved = { type: definition.type, fields: { VAR: 'SerialCustom', UART: 'UART2', SPEED: '115200', RX: '4', TX: '5' } };
    let block = realBlockly.serialization.blocks.append(saved, workspace);
    assert.equal(block.getFieldValue('UART'), 'UART2');
    const roundTrip = realBlockly.serialization.blocks.save(block);
    block.dispose();
    block = realBlockly.serialization.blocks.append(roundTrip, workspace);
    assert.equal(block.getFieldValue('UART'), 'UART2');
    const declarations = new Map(), setup = new Map();
    Arduino.forBlock.serial_begin_esp32_custom(block, {
      addLibrary() {}, addObject: (name, code) => declarations.set(name, code),
      addSetupBegin: (name, code) => setup.set(name, code)
    });
    assert.equal(declarations.get('SerialCustom'), 'HardwareSerial SerialCustom(2);');
    assert.equal(setup.get('serial_SerialCustom_begin'), 'SerialCustom.begin(115200, SERIAL_8N1, 4, 5);\n');
  } finally { workspace.dispose(); }
});

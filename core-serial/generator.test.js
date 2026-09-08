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

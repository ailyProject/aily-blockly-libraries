'use strict';

const layoutMap = {
  '4x4': { rows: 4, cols: 4 },
  '4x3': { rows: 4, cols: 3 },
  '3x4': { rows: 3, cols: 4 },
  '3x3': { rows: 3, cols: 3 },
  '3x1': { rows: 3, cols: 1 },
  '1x3': { rows: 1, cols: 3 }
};

// ─── Extension: dynamic row/col pin inputs ───
if (typeof Blockly !== 'undefined') {
  if (Blockly.Extensions.isRegistered('simple_keypad_dynamic_pins')) {
    Blockly.Extensions.unregister('simple_keypad_dynamic_pins');
  }

  Blockly.Extensions.register('simple_keypad_dynamic_pins', function() {
    const block = this;

    function getBoardDigitalPins() {
      const boardConfig = window['boardConfig'];
      if (boardConfig && boardConfig.digitalPins) {
        return boardConfig.digitalPins;
      }
      return [
        ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'],
        ['12', '12'], ['13', '13'], ['14', '14'], ['15', '15'],
        ['16', '16'], ['17', '17'], ['18', '18'], ['19', '19'],
        ['21', '21'], ['22', '22'], ['23', '23'], ['25', '25'],
        ['26', '26'], ['27', '27']
      ];
    }

    block.updateShape_ = function() {
      const layout = block.getFieldValue('LAYOUT');
      const dims = layoutMap[layout] || { rows: 4, cols: 4 };

      // Remove all dynamic inputs
      for (let i = block.inputList.length - 1; i >= 0; i--) {
        const input = block.inputList[i];
        if (input.name && (input.name.startsWith('ROW_') || input.name.startsWith('COL_') || input.name === 'ROW_LABELS' || input.name === 'COL_LABELS')) {
          block.removeInput(input.name);
        }
      }

      const pinOptions = getBoardDigitalPins();

      // Row pins
      block.appendDummyInput('ROW_LABELS').appendField('  row pins:');
      for (let r = 0; r < dims.rows; r++) {
        const fieldName = 'ROW_' + r;
        block.appendDummyInput(fieldName)
          .appendField('    R' + (r + 1))
          .appendField(new Blockly.FieldDropdown(pinOptions), fieldName);
      }

      // Col pins
      block.appendDummyInput('COL_LABELS').appendField('  col pins:');
      for (let c = 0; c < dims.cols; c++) {
        const fieldName = 'COL_' + c;
        block.appendDummyInput(fieldName)
          .appendField('    C' + (c + 1))
          .appendField(new Blockly.FieldDropdown(pinOptions), fieldName);
      }
    };

    const layoutField = block.getField('LAYOUT');
    if (layoutField) {
      layoutField.setValidator(function(newValue) {
        block.updateShape_();
        return newValue;
      });
    }

    block.updateShape_();
  });
}

// ─── Init block ───
Arduino.forBlock['simple_keypad_init'] = function(block, generator) {
  if (!block._keypadVarMonitorAttached) {
    block._keypadVarMonitorAttached = true;
    block._keypadVarLastName = block.getFieldValue('VAR') || 'keypad';
    registerVariableToBlockly(block._keypadVarLastName, 'SimpleKeypad');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._keypadVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'SimpleKeypad');
          block._keypadVarLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'keypad';
  const layout = block.getFieldValue('LAYOUT');
  const keymap = block.getFieldValue('KEYMAP') || '123A456B789C*0#D';
  const dims = layoutMap[layout] || { rows: 4, cols: 4 };

  const rowPins = [];
  for (let i = 0; i < dims.rows; i++) {
    rowPins.push(block.getFieldValue('ROW_' + i) || '0');
  }
  const colPins = [];
  for (let i = 0; i < dims.cols; i++) {
    colPins.push(block.getFieldValue('COL_' + i) || '0');
  }

  generator.addLibrary('SimpleKeypad', '#include "SimpleKeypad.h"');
  registerVariableToBlockly(varName, 'SimpleKeypad');

  generator.addVariable(varName + '_keys', 'char ' + varName + '_keys[] = "' + keymap + '";');
  generator.addVariable(varName + '_rowPins', 'byte ' + varName + '_rowPins[] = {' + rowPins.join(', ') + '};');
  generator.addVariable(varName + '_colPins', 'byte ' + varName + '_colPins[] = {' + colPins.join(', ') + '};');
  generator.addObject(varName, 'SimpleKeypad ' + varName + '(' + varName + '_keys, ' + varName + '_rowPins, ' + varName + '_colPins, ' + dims.rows + ', ' + dims.cols + ');');

  return '';
};

// ─── Get key block ───
Arduino.forBlock['simple_keypad_get_key'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'keypad';

  generator.addLibrary('SimpleKeypad', '#include "SimpleKeypad.h"');

  generator.addFunction('simple_keypad_get_str',
    'String simpleKeypadGetKeyStr(SimpleKeypad& kp) {\n' +
    '  char k = kp.getKey();\n' +
    '  return k ? String(k) : String("");\n' +
    '}\n', true);

  return ['simpleKeypadGetKeyStr(' + varName + ')', generator.ORDER_FUNCTION_CALL];
};

'use strict';

function getCSTVarName(block) {
  const varField = block.getField('VAR');
  return varField ? varField.getText() : 'touch';
}

Arduino.forBlock['cst816s_init'] = function(block, generator) {
  const CST816S_TYPE = 'CST816S';

  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'touch';
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._varLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, CST816S_TYPE);
          block._varLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'touch';
  const wire = block.getFieldValue('WIRE') || 'Wire';
  const rst = generator.valueToCode(block, 'RST', generator.ORDER_ATOMIC) || '4';
  const irq = generator.valueToCode(block, 'IRQ', generator.ORDER_ATOMIC) || '5';

  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('cst816s', '#include "CST816S.h"');
  registerVariableToBlockly(varName, CST816S_TYPE);
  generator.addObject(varName, 'CST816S ' + varName + ';');
  generator.addSetup('wire_' + wire + '_begin', wire + '.begin();');
  ensureSerialBegin('Serial', generator);

  let setupCode = varName + '.begin(' + rst + ', ' + irq + ', &' + wire + ');\n';
  return setupCode;
};

Arduino.forBlock['cst816s_read_gesture'] = function(block, generator) {
  const varName = getCSTVarName(block);
  return [varName + '.gesture()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['cst816s_read_position'] = function(block, generator) {
  const varName = getCSTVarName(block);
  const type = block.getFieldValue('TYPE') || 'x';

  const methodMap = {
    'x': 'data.x',
    'y': 'data.y',
    'points': 'data.points',
    'event': 'data.event'
  };

  const method = methodMap[type];
  if (method) {
    return [varName + '.' + method, generator.ORDER_MEMBER];
  }
  return ['0', generator.ORDER_ATOMIC];
};

Arduino.forBlock['cst816s_is_available'] = function(block, generator) {
  const varName = getCSTVarName(block);
  return [varName + '.available()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['cst816s_enable_double_click'] = function(block, generator) {
  const varName = getCSTVarName(block);
  return varName + '.enable_double_click();\n';
};

Arduino.forBlock['cst816s_enable_auto_sleep'] = function(block, generator) {
  const varName = getCSTVarName(block);
  return varName + '.enable_auto_sleep();\n';
};

Arduino.forBlock['cst816s_disable_auto_sleep'] = function(block, generator) {
  const varName = getCSTVarName(block);
  return varName + '.disable_auto_sleep();\n';
};

Arduino.forBlock['cst816s_sleep'] = function(block, generator) {
  const varName = getCSTVarName(block);
  return varName + '.sleep();\n';
};

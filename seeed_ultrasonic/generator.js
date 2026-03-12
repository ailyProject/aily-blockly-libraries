// Ultrasonic Ranger 代码生成器
// SeeedStudio Ultrasonic Ranger library for Aily Blockly

Arduino.forBlock['ultrasonic_create'] = function(block, generator) {
  // 变量重命名监听
  if (!block._ultrasonicVarMonitorAttached) {
    block._ultrasonicVarMonitorAttached = true;
    block._ultrasonicVarLastName = block.getFieldValue('VAR') || 'ultrasonic';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._ultrasonicVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'Ultrasonic');
          block._ultrasonicVarLastName = newName;
        }
        return newName;
      });
    }
  }

  // 参数提取
  const varName = block.getFieldValue('VAR') || 'ultrasonic';
  const pin = block.getFieldValue('PIN');

  // 库和变量管理
  generator.addLibrary('#include <Ultrasonic.h>', '#include <Ultrasonic.h>');
  registerVariableToBlockly(varName, 'Ultrasonic');
  generator.addVariable('Ultrasonic ' + varName, 'Ultrasonic ' + varName + '(' + pin + ');');

  return '';
};

Arduino.forBlock['ultrasonic_measure_cm'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ultrasonic';

  generator.addLibrary('#include <Ultrasonic.h>', '#include <Ultrasonic.h>');

  return [varName + '.MeasureInCentimeters()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['ultrasonic_measure_mm'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ultrasonic';

  generator.addLibrary('#include <Ultrasonic.h>', '#include <Ultrasonic.h>');

  return [varName + '.MeasureInMillimeters()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['ultrasonic_measure_inch'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ultrasonic';

  generator.addLibrary('#include <Ultrasonic.h>', '#include <Ultrasonic.h>');

  return [varName + '.MeasureInInches()', generator.ORDER_ATOMIC];
};

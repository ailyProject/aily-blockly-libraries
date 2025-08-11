Arduino.forBlock['onebutton_setup'] = function (block, generator) {
  // 监听VAR输入值的变化，自动重命名Blockly变量
  if (!block._onebuttonVarMonitorAttached) {
    block._onebuttonVarMonitorAttached = true;
    block._onebuttonVarLastName = block.getFieldValue('VAR') || 'button';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._onebuttonVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'OneButton');
          block._onebuttonVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'button';

  registerVariableToBlockly(varName, 'OneButton');

  const pin = block.getFieldValue('PIN');
  const pinMode = block.getFieldValue('PIN_MODE');
  const activeLow = block.getFieldValue('ACTIVE_LOW') === 'TRUE';

  generator.addLibrary('#include <OneButton.h>', '#include <OneButton.h>');
  generator.addVariable('OneButton ' + varName, 'OneButton ' + varName + ';');

  generator.addLoopBegin(varName + '.tick();', varName + '.tick();');
  
  return varName + '.setup(' + pin + ', ' + pinMode + ', ' + activeLow + ');\n';
};

Arduino.forBlock['onebutton_attachClick'] = function (block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'button';

  let callbackName = 'click_callback_' + varName;
  let callbackBody = generator.statementToCode(block, 'CLICK_FUNC') || '';
  
  const functionDef = 'void ' + callbackName + '() {\n' + callbackBody + '}\n';
  generator.addFunction(callbackName, functionDef);
  
  return varName + '.attachClick(' + callbackName + ');\n';
};

Arduino.forBlock['onebutton_attachDoubleClick'] = function (block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'button';
  
  let callbackName = 'double_click_callback_' + varName;
  let callbackBody = generator.statementToCode(block, 'DOUBLE_CLICK_FUNC') || '';
  
  const functionDef = 'void ' + callbackName + '() {\n' + callbackBody + '}\n';
  generator.addFunction(callbackName, functionDef);
  
  return varName + '.attachDoubleClick(' + callbackName + ');\n';
};

Arduino.forBlock['onebutton_attachLongPressStart'] = function (block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'button';
  
  let callbackName = 'long_press_start_callback_' + varName;
  let callbackBody = generator.statementToCode(block, 'LONG_PRESS_START_FUNC') || '';
  
  const functionDef = 'void ' + callbackName + '() {\n' + callbackBody + '}\n';
  generator.addFunction(callbackName, functionDef);
  
  return varName + '.attachLongPressStart(' + callbackName + ');\n';
};

Arduino.forBlock['onebutton_attachLongPressStop'] = function (block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'button';
  
  let callbackName = 'long_press_stop_callback_' + varName;
  let callbackBody = generator.statementToCode(block, 'LONG_PRESS_STOP_FUNC') || '';
  
  const functionDef = 'void ' + callbackName + '() {\n' + callbackBody + '}\n';
  generator.addFunction(callbackName, functionDef);
  
  return varName + '.attachLongPressStop(' + callbackName + ');\n';
};

Arduino.forBlock['onebutton_attachDuringLongPress'] = function (block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'button';
  
  let callbackName = 'during_long_press_callback_' + varName;
  let callbackBody = generator.statementToCode(block, 'DURING_LONG_PRESS_FUNC') || '';
  
  const functionDef = 'void ' + callbackName + '() {\n' + callbackBody + '}\n';
  generator.addFunction(callbackName, functionDef);
  
  return varName + '.attachDuringLongPress(' + callbackName + ');\n';
};

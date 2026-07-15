Arduino.forBlock['optical_mouse_init'] = function(block, generator) {
  // Variable rename listener
  if (!block._opticalMouseVarMonitorAttached) {
    block._opticalMouseVarMonitorAttached = true;
    block._opticalMouseVarLastName = block.getFieldValue('VAR') || 'mouse';
    registerVariableToBlockly(block._opticalMouseVarLastName, 'OpticalMouse');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._opticalMouseVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'OpticalMouse');
          block._opticalMouseVarLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'mouse';
  const sclkPin = block.getFieldValue('SCLK');
  const dioPin = block.getFieldValue('DIO');
  const csPin = block.getFieldValue('CS');
  const resolution = block.getFieldValue('RESOLUTION') || '0.0405';

  generator.addLibrary('optical_mouse', '#include "optical_mouse.h"');
  generator.addObject(varName, 'OpticalMouse ' + varName + '(' + sclkPin + ', ' + dioPin + ', ' + csPin + ', ' + resolution + 'f);');

  return varName + '.begin();\n';
};

Arduino.forBlock['optical_mouse_update'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mouse';
  return varName + '.update();\n';
};

Arduino.forBlock['optical_mouse_get_x'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mouse';
  return [varName + '.getX()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['optical_mouse_get_y'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mouse';
  return [varName + '.getY()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['optical_mouse_has_motion'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mouse';
  return [varName + '.hasMotion()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['optical_mouse_reset'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mouse';
  return varName + '.reset();\n';
};

Arduino.forBlock['five_line_tracker_v3_setup'] = function(block, generator) {
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'lineTracker';
    registerVariableToBlockly(block._varLastName, 'FiveLineTracker');
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
          renameVariableInBlockly(block, oldName, newName, 'FiveLineTracker');
          block._varLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'lineTracker';
  const i2cAddress = block.getFieldValue('I2C_ADDRESS') || '0x50';

  generator.addLibrary('five_line_tracker_v3', '#include <five_line_tracker_v3.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
  registerVariableToBlockly(varName, 'FiveLineTracker');
  generator.addVariable(varName, 'emakefun::FiveLineTracker ' + varName + '(Wire, ' + i2cAddress + ');');

  generator.addSetupBegin('Wire.begin()', 'Wire.begin();');
  return varName + '.Initialize();\n';
};

Arduino.forBlock['five_line_tracker_v3_get_device_id'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'lineTracker';
  
  generator.addLibrary('five_line_tracker_v3', '#include <five_line_tracker_v3.h>');
  
  return [varName + '.DeviceId()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['five_line_tracker_v3_get_firmware_version'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'lineTracker';
  
  generator.addLibrary('five_line_tracker_v3', '#include <five_line_tracker_v3.h>');
  
  return [varName + '.FirmwareVersion()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['five_line_tracker_v3_set_high_threshold'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'lineTracker';
  const channel = block.getFieldValue('CHANNEL') || '0';
  const threshold = generator.valueToCode(block, 'THRESHOLD', generator.ORDER_ATOMIC) || '850';
  
  generator.addLibrary('five_line_tracker_v3', '#include <five_line_tracker_v3.h>');
  
  return varName + '.HighThreshold(' + channel + ', ' + threshold + ');\n';
};

Arduino.forBlock['five_line_tracker_v3_set_low_threshold'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'lineTracker';
  const channel = block.getFieldValue('CHANNEL') || '0';
  const threshold = generator.valueToCode(block, 'THRESHOLD', generator.ORDER_ATOMIC) || '800';
  
  generator.addLibrary('five_line_tracker_v3', '#include <five_line_tracker_v3.h>');
  
  return varName + '.LowThreshold(' + channel + ', ' + threshold + ');\n';
};

Arduino.forBlock['five_line_tracker_v3_get_analog_value'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'lineTracker';
  const channel = block.getFieldValue('CHANNEL') || '0';
  
  generator.addLibrary('five_line_tracker_v3', '#include <five_line_tracker_v3.h>');
  
  return [varName + '.AnalogValue(' + channel + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['five_line_tracker_v3_get_digital_value'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'lineTracker';
  const channel = block.getFieldValue('CHANNEL') || '0';
  
  generator.addLibrary('five_line_tracker_v3', '#include <five_line_tracker_v3.h>');
  
  return [varName + '.DigitalValue(' + channel + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['five_line_tracker_v3_get_all_digital_values'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'lineTracker';
  
  generator.addLibrary('five_line_tracker_v3', '#include <five_line_tracker_v3.h>');
  
  return [varName + '.DigitalValues()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['five_line_tracker_v3_check_error'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'lineTracker';
  
  generator.addLibrary('five_line_tracker_v3', '#include <five_line_tracker_v3.h>');
  
  return ['(emakefun::FiveLineTracker::kOK == ' + varName + '.Initialize())', generator.ORDER_ATOMIC];
};

function sfa40EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('DFRobot_SFA40', '#include <DFRobot_SFA40.h>');
}

function sfa40GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'sfa40');
}

function sfa40AttachVar(block) {
  if (block._sfa40VarAttached) return;
  block._sfa40VarAttached = true;
  block._sfa40VarLastName = block.getFieldValue('VAR') || 'sfa40';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._sfa40VarLastName, 'DFRobot_SFA40');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._sfa40VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._sfa40VarLastName, newName, 'DFRobot_SFA40');
      block._sfa40VarLastName = newName;
    }
  };
}

Arduino.forBlock['sfa40_init_i2c'] = function(block, generator) {
  sfa40AttachVar(block);
  sfa40EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'sfa40';
  var wire = block.getFieldValue('WIRE') || 'Wire';
  generator.addObject(varName, 'DFRobot_SFA40 ' + varName + '(&' + wire + ');');
  return 'while (' + varName + '.begin() != 0) {\n  delay(1000);\n}\n';
};

Arduino.forBlock['sfa40_measurement'] = function(block, generator) {
  sfa40EnsureLib(generator);
  var method = (block.getFieldValue('ACTION') || 'START') === 'STOP' ? 'stopMeasurement' : 'startMeasurement';
  return sfa40GetVar(block) + '.' + method + '();\n';
};

Arduino.forBlock['sfa40_read_data'] = function(block, generator) {
  sfa40EnsureLib(generator);
  return [sfa40GetVar(block) + '.readMeasurementData()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['sfa40_value'] = function(block, generator) {
  sfa40EnsureLib(generator);
  var varName = sfa40GetVar(block);
  var map = {
    HCHO: varName + '.HCHO',
    HUMIDITY: varName + '.humidity',
    TEMP_C: varName + '.temperatureC',
    TEMP_F: varName + '.temperatureF'
  };
  return [map[block.getFieldValue('DATA') || 'HCHO'] || map.HCHO, generator.ORDER_ATOMIC];
};

Arduino.forBlock['sfa40_read_serial'] = function(block, generator) {
  sfa40EnsureLib(generator);
  return sfa40GetVar(block) + '.getSerialNumber();\n';
};

Arduino.forBlock['sfa40_serial_length'] = function(block, generator) {
  sfa40EnsureLib(generator);
  return [sfa40GetVar(block) + '.serialNumberLen', generator.ORDER_ATOMIC];
};

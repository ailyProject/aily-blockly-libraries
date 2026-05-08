function as7331EnsureLibrary(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('AS7331', '#include <SparkFun_AS7331.h>');
}

function as7331GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'as7331');
}

function as7331AttachVar(block) {
  if (block._as7331VarAttached) return;
  block._as7331VarAttached = true;
  block._as7331VarLastName = block.getFieldValue('VAR') || 'as7331';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._as7331VarLastName, 'SfeAS7331ArdI2C');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._as7331VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._as7331VarLastName, newName, 'SfeAS7331ArdI2C');
      block._as7331VarLastName = newName;
    }
  };
}

function as7331EnsureHelpers(generator) {
  generator.addFunction('as7331_take_measurement_helper', 'bool as7331TakeMeasurement(SfeAS7331ArdI2C &sensor) {\n  if (ksfTkErrOk != sensor.setStartState(true)) return false;\n  delay(2 + sensor.getConversionTimeMillis());\n  return (ksfTkErrOk == sensor.readAllUV());\n}\n');
  generator.addFunction('as7331_data_ready_helper', 'bool as7331DataReady(SfeAS7331ArdI2C &sensor) {\n  sfe_as7331_reg_meas_osr_status_t status;\n  if (ksfTkErrOk != sensor.getStatus(status)) return false;\n  return status.ndata;\n}\n');
  generator.addFunction('as7331_read_temperature_helper', 'float as7331ReadTemperature(SfeAS7331ArdI2C &sensor) {\n  sensor.readTemp();\n  return sensor.getTemp();\n}\n');
}

Arduino.forBlock['as7331_init'] = function(block, generator) {
  as7331AttachVar(block);
  as7331EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'as7331';
  var address = block.getFieldValue('ADDRESS') || '0x74';
  var mode = block.getFieldValue('MODE') || 'MEAS_MODE_CMD';
  generator.addVariable(varName, 'SfeAS7331ArdI2C ' + varName + ';');
  generator.addVariable(varName + '_ready', 'bool ' + varName + '_ready = false;');
  return 'Wire.begin();\n' + varName + '_ready = ' + varName + '.begin(' + address + ', Wire);\nif (' + varName + '_ready) ' + varName + '.prepareMeasurement(' + mode + ');\n';
};

Arduino.forBlock['as7331_is_ready'] = function(block, generator) {
  return [as7331GetVar(block) + '_ready', generator.ORDER_ATOMIC];
};

Arduino.forBlock['as7331_is_connected'] = function(block, generator) {
  return [as7331GetVar(block) + '.isConnected()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['as7331_take_measurement'] = function(block, generator) {
  as7331EnsureLibrary(generator);
  as7331EnsureHelpers(generator);
  return 'as7331TakeMeasurement(' + as7331GetVar(block) + ');\n';
};

Arduino.forBlock['as7331_read_uv'] = function(block, generator) {
  return [as7331GetVar(block) + '.' + (block.getFieldValue('CHANNEL') || 'getUVA') + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['as7331_read_temperature'] = function(block, generator) {
  as7331EnsureLibrary(generator);
  as7331EnsureHelpers(generator);
  return ['as7331ReadTemperature(' + as7331GetVar(block) + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['as7331_data_ready'] = function(block, generator) {
  as7331EnsureLibrary(generator);
  as7331EnsureHelpers(generator);
  return ['as7331DataReady(' + as7331GetVar(block) + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['as7331_prepare_measurement'] = function(block) {
  return as7331GetVar(block) + '.prepareMeasurement(' + (block.getFieldValue('MODE') || 'MEAS_MODE_CMD') + ');\n';
};

Arduino.forBlock['as7331_set_gain'] = function(block) {
  return as7331GetVar(block) + '.setGain(' + (block.getFieldValue('GAIN') || 'GAIN_2') + ');\n';
};

Arduino.forBlock['as7331_set_conversion_time'] = function(block) {
  return as7331GetVar(block) + '.setConversionTime(' + (block.getFieldValue('TIME') || 'TIME_64MS') + ');\n';
};
function stcc4EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('DFRobot_STCC4', '#include <DFRobot_STCC4.h>');
}

function stcc4GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'stcc4');
}

function stcc4Value(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function stcc4AttachVar(block) {
  if (block._stcc4VarAttached) return;
  block._stcc4VarAttached = true;
  block._stcc4VarLastName = block.getFieldValue('VAR') || 'stcc4';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._stcc4VarLastName, 'DFRobot_STCC4_I2C');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._stcc4VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._stcc4VarLastName, newName, 'DFRobot_STCC4_I2C');
      block._stcc4VarLastName = newName;
    }
  };
}

function stcc4Names(varName) {
  return {
    co2: varName + 'CO2',
    temperature: varName + 'Temperature',
    humidity: varName + 'Humidity',
    status: varName + 'Status',
    correction: varName + 'FrcCorrection'
  };
}

function stcc4EnsureDataVars(generator, varName) {
  var names = stcc4Names(varName);
  generator.addObject(names.co2, 'uint16_t ' + names.co2 + ' = 0;');
  generator.addObject(names.temperature, 'float ' + names.temperature + ' = 0;');
  generator.addObject(names.humidity, 'float ' + names.humidity + ' = 0;');
  generator.addObject(names.status, 'uint16_t ' + names.status + ' = 0;');
  generator.addObject(names.correction, 'uint16_t ' + names.correction + ' = 0;');
  return names;
}

Arduino.forBlock['stcc4_init'] = function(block, generator) {
  stcc4AttachVar(block);
  stcc4EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'stcc4';
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var address = block.getFieldValue('ADDRESS') || '0x64';
  generator.addObject(varName, 'DFRobot_STCC4_I2C ' + varName + '(&' + wire + ', ' + address + ');');
  return 'while (!' + varName + '.begin()) {\n  delay(500);\n}\n' +
    varName + '.wakeup();\n' +
    'delay(10);\n' +
    varName + '.startMeasurement();\n';
};

Arduino.forBlock['stcc4_read'] = function(block, generator) {
  stcc4EnsureLib(generator);
  var varName = stcc4GetVar(block);
  var names = stcc4EnsureDataVars(generator, varName);
  return [varName + '.measurement(&' + names.co2 + ', &' + names.temperature + ', &' + names.humidity + ', &' + names.status + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['stcc4_get_data'] = function(block, generator) {
  stcc4EnsureLib(generator);
  var varName = stcc4GetVar(block);
  var names = stcc4EnsureDataVars(generator, varName);
  var data = block.getFieldValue('DATA') || 'CO2';
  var map = {
    CO2: names.co2,
    TEMPERATURE: names.temperature,
    HUMIDITY: names.humidity,
    STATUS: names.status,
    FRC_CORRECTION: names.correction
  };
  return [map[data] || names.co2, generator.ORDER_ATOMIC];
};

Arduino.forBlock['stcc4_get_id'] = function(block, generator) {
  stcc4EnsureLib(generator);
  return [stcc4GetVar(block) + '.getID()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['stcc4_measurement_control'] = function(block, generator) {
  stcc4EnsureLib(generator);
  var varName = stcc4GetVar(block);
  var action = block.getFieldValue('ACTION') || 'startMeasurement';
  if (action === 'singleMeasurement') {
    return varName + '.singleMeasurement();\ndelay(500);\n';
  }
  return varName + '.' + action + '();\n';
};

Arduino.forBlock['stcc4_power_control'] = function(block, generator) {
  stcc4EnsureLib(generator);
  var varName = stcc4GetVar(block);
  var action = block.getFieldValue('ACTION') || 'wakeup';
  return varName + '.' + action + '();\n';
};

Arduino.forBlock['stcc4_reset'] = function(block, generator) {
  stcc4EnsureLib(generator);
  var varName = stcc4GetVar(block);
  var type = block.getFieldValue('TYPE') || 'softRest';
  return varName + '.' + type + '();\n';
};

Arduino.forBlock['stcc4_set_rht_compensation'] = function(block, generator) {
  stcc4EnsureLib(generator);
  var varName = stcc4GetVar(block);
  var temperature = stcc4Value(block, generator, 'TEMPERATURE', '25');
  var humidity = stcc4Value(block, generator, 'HUMIDITY', '50');
  return varName + '.setRHTcompensation(' + temperature + ', ' + humidity + ');\n';
};

Arduino.forBlock['stcc4_set_pressure_compensation'] = function(block, generator) {
  stcc4EnsureLib(generator);
  var varName = stcc4GetVar(block);
  var pressure = stcc4Value(block, generator, 'PRESSURE', '1013');
  return varName + '.setPressureCompensation(' + pressure + ');\n';
};

Arduino.forBlock['stcc4_forced_recalibration'] = function(block, generator) {
  stcc4EnsureLib(generator);
  var varName = stcc4GetVar(block);
  var names = stcc4EnsureDataVars(generator, varName);
  var target = stcc4Value(block, generator, 'TARGET_PPM', '400');
  return [varName + '.forcedRecalibration(' + target + ', &' + names.correction + ')', generator.ORDER_FUNCTION_CALL];
};

function bmv080EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('DFRobot_BMV080', '#include <DFRobot_BMV080.h>');
  generator.addVariable('bmv080_loop_stack_size', 'SET_LOOP_TASK_STACK_SIZE(60 * 1024);');
}

function bmv080GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'bmv080');
}

function bmv080Value(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function bmv080AttachVar(block) {
  if (block._bmv080VarAttached) return;
  block._bmv080VarAttached = true;
  block._bmv080VarLastName = block.getFieldValue('VAR') || 'bmv080';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._bmv080VarLastName, 'DFRobot_BMV080');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._bmv080VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._bmv080VarLastName, newName, 'DFRobot_BMV080');
      block._bmv080VarLastName = newName;
    }
  };
}

function bmv080EnsureDataVars(generator, varName) {
  generator.addVariable(varName + '_pm_values', 'float ' + varName + '_pm1 = 0;\nfloat ' + varName + '_pm25 = 0;\nfloat ' + varName + '_pm10 = 0;');
}

function bmv080InitCode(varName) {
  return 'while (' + varName + '.begin() != 0) {\n  delay(1000);\n}\nwhile (' + varName + '.openBmv080() != 0) {\n  delay(1000);\n}\n';
}

Arduino.forBlock['bmv080_init_i2c'] = function(block, generator) {
  bmv080AttachVar(block);
  bmv080EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'bmv080';
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var address = block.getFieldValue('ADDRESS') || '0x57';
  generator.addObject(varName, 'DFRobot_BMV080_I2C ' + varName + '(&' + wire + ', ' + address + ');');
  return bmv080InitCode(varName);
};

Arduino.forBlock['bmv080_init_spi'] = function(block, generator) {
  bmv080AttachVar(block);
  bmv080EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'bmv080';
  var spi = block.getFieldValue('SPI') || 'SPI';
  var cs = bmv080Value(block, generator, 'CS', '17');
  generator.addObject(varName, 'DFRobot_BMV080_SPI ' + varName + '(&' + spi + ', ' + cs + ');');
  return bmv080InitCode(varName);
};

Arduino.forBlock['bmv080_set_mode'] = function(block, generator) {
  bmv080EnsureLib(generator);
  return bmv080GetVar(block) + '.setBmv080Mode(' + (block.getFieldValue('MODE') || 'CONTINUOUS_MODE') + ');\n';
};

Arduino.forBlock['bmv080_set_duty_cycle'] = function(block, generator) {
  bmv080EnsureLib(generator);
  var period = bmv080Value(block, generator, 'PERIOD', '20');
  var integration = bmv080Value(block, generator, 'INTEGRATION', '10.0');
  var varName = bmv080GetVar(block);
  return varName + '.setDutyCyclingPeriod(' + period + ');\n' + varName + '.setIntegrationTime(' + integration + ');\n';
};

Arduino.forBlock['bmv080_set_algorithm'] = function(block, generator) {
  bmv080EnsureLib(generator);
  return bmv080GetVar(block) + '.setMeasurementAlgorithm(' + (block.getFieldValue('ALGORITHM') || 'BALANCED') + ');\n';
};

Arduino.forBlock['bmv080_set_feature'] = function(block, generator) {
  bmv080EnsureLib(generator);
  var method = (block.getFieldValue('FEATURE') || 'OBSTRUCTION') === 'VIBRATION' ? 'setDoVibrationFiltering' : 'setObstructionDetection';
  return bmv080GetVar(block) + '.' + method + '(' + (block.getFieldValue('STATE') || 'true') + ');\n';
};

Arduino.forBlock['bmv080_read_data'] = function(block, generator) {
  bmv080EnsureLib(generator);
  var varName = bmv080GetVar(block);
  bmv080EnsureDataVars(generator, varName);
  return [varName + '.getBmv080Data(&' + varName + '_pm1, &' + varName + '_pm25, &' + varName + '_pm10)', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bmv080_pm_value'] = function(block, generator) {
  bmv080EnsureLib(generator);
  var varName = bmv080GetVar(block);
  bmv080EnsureDataVars(generator, varName);
  var map = { PM1: varName + '_pm1', PM25: varName + '_pm25', PM10: varName + '_pm10' };
  return [map[block.getFieldValue('DATA') || 'PM25'] || map.PM25, generator.ORDER_ATOMIC];
};

Arduino.forBlock['bmv080_get_status'] = function(block, generator) {
  bmv080EnsureLib(generator);
  var varName = bmv080GetVar(block);
  var map = {
    ALGORITHM: varName + '.getMeasurementAlgorithm()',
    INTEGRATION: varName + '.getIntegrationTime()',
    PERIOD: varName + '.getDutyCyclingPeriod()',
    OBSTRUCTION_FEATURE: varName + '.getObstructionDetection()',
    VIBRATION_FEATURE: varName + '.getDoVibrationFiltering()',
    OBSTRUCTED: varName + '.ifObstructed()'
  };
  return [map[block.getFieldValue('DATA') || 'OBSTRUCTED'] || map.OBSTRUCTED, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bmv080_command'] = function(block, generator) {
  bmv080EnsureLib(generator);
  var method = { STOP: 'stopBmv080', RESET: 'resetBmv080', CLOSE: 'closeBmv080' }[block.getFieldValue('COMMAND') || 'STOP'] || 'stopBmv080';
  return bmv080GetVar(block) + '.' + method + '();\n';
};

function bmi270EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFunBMI270', '#include <SparkFun_BMI270_Arduino_Library.h>');
}

function bmi270GetVar(block) {
  var f = block.getField('VAR');
  return f ? f.getText() : (block.getFieldValue('VAR') || 'imu');
}

Arduino.forBlock['bmi270_init_i2c'] = function(block, generator) {
  // Variable rename listener
  if (!block._bmi270VarMonitorAttached) {
    block._bmi270VarMonitorAttached = true;
    block._bmi270VarLastName = block.getFieldValue('VAR') || 'imu';
    registerVariableToBlockly(block._bmi270VarLastName, 'BMI270');
    var varField = block.getField('VAR');
    if (varField) {
      var originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') originalFinishEditing.call(this, newName);
        var oldName = block._bmi270VarLastName;
        if (newName && newName !== oldName && typeof renameVariableInBlockly === 'function') {
          renameVariableInBlockly(block, oldName, newName, 'BMI270');
          block._bmi270VarLastName = newName;
        }
      };
    }
  }

  var varName = block.getFieldValue('VAR') || 'imu';
  var addr = block.getFieldValue('ADDR') || '0x68';

  bmi270EnsureLib(generator);
  generator.addVariable(varName, 'BMI270 ' + varName + ';');

  return 'Wire.begin();\n' +
    'while (' + varName + '.beginI2C(' + addr + ') != 0) { delay(100); }\n';
};

Arduino.forBlock['bmi270_get_data'] = function(block, generator) {
  bmi270EnsureLib(generator);
  return bmi270GetVar(block) + '.getSensorData();\n';
};

Arduino.forBlock['bmi270_get_accel'] = function(block, generator) {
  bmi270EnsureLib(generator);
  var axis = block.getFieldValue('AXIS') || 'accelX';
  return [bmi270GetVar(block) + '.data.' + axis, generator.ORDER_MEMBER];
};

Arduino.forBlock['bmi270_get_gyro'] = function(block, generator) {
  bmi270EnsureLib(generator);
  var axis = block.getFieldValue('AXIS') || 'gyroX';
  return [bmi270GetVar(block) + '.data.' + axis, generator.ORDER_MEMBER];
};

Arduino.forBlock['bmi270_get_temperature'] = function(block, generator) {
  bmi270EnsureLib(generator);
  var varName = bmi270GetVar(block);
  var tempVar = '_bmi270_temp_' + varName;
  generator.addVariable(tempVar, 'float ' + tempVar + ' = 0;');
  // We generate an expression that calls getTemperature and returns the value
  // using a comma expression trick: (imu.getTemperature(&_temp), _temp)
  return ['(' + varName + '.getTemperature(&' + tempVar + '), ' + tempVar + ')', generator.ORDER_COMMA];
};

Arduino.forBlock['bmi270_enable_step_counter'] = function(block, generator) {
  bmi270EnsureLib(generator);
  var varName = bmi270GetVar(block);
  return varName + '.enableFeature(BMI2_STEP_DETECTOR);\n' +
         varName + '.enableFeature(BMI2_STEP_COUNTER);\n' +
         varName + '.enableFeature(BMI2_STEP_ACTIVITY);\n';
};

Arduino.forBlock['bmi270_get_step_count'] = function(block, generator) {
  bmi270EnsureLib(generator);
  var varName = bmi270GetVar(block);
  var countVar = '_bmi270_steps_' + varName;
  generator.addVariable(countVar, 'uint32_t ' + countVar + ' = 0;');
  return ['(' + varName + '.getStepCount(&' + countVar + '), ' + countVar + ')', generator.ORDER_COMMA];
};

Arduino.forBlock['bmi270_reset_step_count'] = function(block, generator) {
  bmi270EnsureLib(generator);
  return bmi270GetVar(block) + '.resetStepCount();\n';
};

Arduino.forBlock['bmi270_get_step_activity'] = function(block, generator) {
  bmi270EnsureLib(generator);
  var varName = bmi270GetVar(block);
  var actVar = '_bmi270_activity_' + varName;
  generator.addVariable(actVar, 'uint8_t ' + actVar + ' = 0;');
  return ['(' + varName + '.getStepActivity(&' + actVar + '), ' + actVar + ')', generator.ORDER_COMMA];
};

function soilMoistureEnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFun_Soil_Moisture', '#include <SparkFun_Soil_Moisture_Sensor_Arduino_Library.h>');
}

function soilMoistureGetVar(block) {
  var f = block.getField('VAR');
  return f ? f.getText() : (block.getFieldValue('VAR') || 'soilSensor');
}

function soilMoistureAttachVar(block) {
  if (block._soilMoistureVarAttached) return;
  block._soilMoistureVarAttached = true;
  block._soilMoistureVarLastName = block.getFieldValue('VAR') || 'soilSensor';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._soilMoistureVarLastName, 'SparkFunSoilMoistureSensor');
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._soilMoistureVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._soilMoistureVarLastName, newName, 'SparkFunSoilMoistureSensor');
      block._soilMoistureVarLastName = newName;
    }
  };
}

Arduino.forBlock['soil_moisture_init'] = function(block, generator) {
  soilMoistureAttachVar(block);
  soilMoistureEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'soilSensor';
  generator.addVariable(varName, 'SparkFunSoilMoistureSensor ' + varName + ';');
  return 'Wire.begin();\n' + varName + '.begin();\n';
};

Arduino.forBlock['soil_moisture_read_value'] = function(block, generator) {
  soilMoistureEnsureLib(generator);
  return [soilMoistureGetVar(block) + '.readMoistureValue()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['soil_moisture_read_percentage'] = function(block, generator) {
  soilMoistureEnsureLib(generator);
  return [soilMoistureGetVar(block) + '.readMoisturePercentage()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['soil_moisture_led'] = function(block, generator) {
  soilMoistureEnsureLib(generator);
  var state = block.getFieldValue('STATE') || 'ON';
  return soilMoistureGetVar(block) + (state === 'ON' ? '.LEDOn()' : '.LEDOff()') + ';\n';
};

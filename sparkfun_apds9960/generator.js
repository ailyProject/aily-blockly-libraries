function apds9960EnsureLibrary(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('APDS9960', '#include <SparkFun_APDS-9960_Sensor_Arduino_Library/SparkFun_APDS9960.h>');
}

function apds9960GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'apds9960');
}

function apds9960AttachVar(block) {
  if (block._apds9960VarAttached) return;
  block._apds9960VarAttached = true;
  block._apds9960VarLastName = block.getFieldValue('VAR') || 'apds9960';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._apds9960VarLastName, 'SparkFun_APDS9960');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._apds9960VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._apds9960VarLastName, newName, 'SparkFun_APDS9960');
      block._apds9960VarLastName = newName;
    }
  };
}

function apds9960EnsureHelpers(generator) {
  generator.addFunction('apds9960_read_light_helper', 'uint16_t apds9960ReadLight(SparkFun_APDS9960 &sensor, byte channel) {\n  uint16_t value = 0;\n  if (channel == 1) sensor.readRedLight(value);\n  else if (channel == 2) sensor.readGreenLight(value);\n  else if (channel == 3) sensor.readBlueLight(value);\n  else sensor.readAmbientLight(value);\n  return value;\n}\n');
  generator.addFunction('apds9960_read_proximity_helper', 'uint8_t apds9960ReadProximity(SparkFun_APDS9960 &sensor) {\n  uint8_t value = 0;\n  sensor.readProximity(value);\n  return value;\n}\n');
}

Arduino.forBlock['apds9960_init'] = function(block, generator) {
  apds9960AttachVar(block);
  apds9960EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'apds9960';
  generator.addVariable(varName, 'SparkFun_APDS9960 ' + varName + ';');
  generator.addVariable(varName + '_ready', 'bool ' + varName + '_ready = false;');
  return 'Wire.begin();\n' + varName + '_ready = ' + varName + '.init();\nif (' + varName + '_ready) ' + varName + '.enablePower();\n';
};

Arduino.forBlock['apds9960_is_ready'] = function(block, generator) {
  return [apds9960GetVar(block) + '_ready', generator.ORDER_ATOMIC];
};

Arduino.forBlock['apds9960_enable_light'] = function(block) {
  return apds9960GetVar(block) + '.enableLightSensor(' + (block.getFieldValue('INTERRUPT') || 'false') + ');\n';
};

Arduino.forBlock['apds9960_enable_proximity'] = function(block) {
  return apds9960GetVar(block) + '.enableProximitySensor(' + (block.getFieldValue('INTERRUPT') || 'false') + ');\n';
};

Arduino.forBlock['apds9960_enable_gesture'] = function(block) {
  return apds9960GetVar(block) + '.enableGestureSensor(' + (block.getFieldValue('INTERRUPT') || 'true') + ');\n';
};

Arduino.forBlock['apds9960_read_light'] = function(block, generator) {
  apds9960EnsureLibrary(generator);
  apds9960EnsureHelpers(generator);
  return ['apds9960ReadLight(' + apds9960GetVar(block) + ', ' + (block.getFieldValue('CHANNEL') || '0') + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['apds9960_read_proximity'] = function(block, generator) {
  apds9960EnsureLibrary(generator);
  apds9960EnsureHelpers(generator);
  return ['apds9960ReadProximity(' + apds9960GetVar(block) + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['apds9960_gesture_available'] = function(block, generator) {
  return [apds9960GetVar(block) + '.isGestureAvailable()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['apds9960_read_gesture'] = function(block, generator) {
  return [apds9960GetVar(block) + '.readGesture()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['apds9960_set_ambient_gain'] = function(block) {
  return apds9960GetVar(block) + '.setAmbientLightGain(' + (block.getFieldValue('GAIN') || 'AGAIN_4X') + ');\n';
};

Arduino.forBlock['apds9960_set_proximity_gain'] = function(block) {
  return apds9960GetVar(block) + '.setProximityGain(' + (block.getFieldValue('GAIN') || 'PGAIN_4X') + ');\n';
};
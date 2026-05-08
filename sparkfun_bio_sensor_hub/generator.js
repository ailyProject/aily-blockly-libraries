function biohubEnsureLibrary(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('BioSensorHub', '#include <SparkFun_Bio_Sensor_Hub_Library.h>');
}

function biohubGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'bioHub');
}

function biohubEnsureData(generator, varName) {
  generator.addVariable(varName + '_data', 'bioData ' + varName + '_data;');
  generator.addVariable(varName + '_status', 'uint8_t ' + varName + '_status = 0;');
}

function biohubAttachVar(block) {
  if (block._biohubVarAttached) return;
  block._biohubVarAttached = true;
  block._biohubVarLastName = block.getFieldValue('VAR') || 'bioHub';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._biohubVarLastName, 'SparkFun_Bio_Sensor_Hub');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._biohubVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._biohubVarLastName, newName, 'SparkFun_Bio_Sensor_Hub');
      block._biohubVarLastName = newName;
    }
  };
}

Arduino.forBlock['biohub_init'] = function(block, generator) {
  biohubAttachVar(block);
  biohubEnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'bioHub';
  var resetPin = block.getFieldValue('RESET_PIN') || '4';
  var mfioPin = block.getFieldValue('MFIO_PIN') || '13';
  generator.addVariable(varName, 'SparkFun_Bio_Sensor_Hub ' + varName + ';');
  generator.addVariable(varName + '_ready', 'bool ' + varName + '_ready = false;');
  biohubEnsureData(generator, varName);
  return 'Wire.begin();\n' + varName + '_status = ' + varName + '.begin(Wire, ' + resetPin + ', ' + mfioPin + ');\n' + varName + '_ready = (' + varName + '_status == SFE_BIO_SUCCESS);\n';
};

Arduino.forBlock['biohub_is_ready'] = function(block, generator) {
  return [biohubGetVar(block) + '_ready', generator.ORDER_ATOMIC];
};

Arduino.forBlock['biohub_config_bpm'] = function(block, generator) {
  var varName = biohubGetVar(block);
  biohubEnsureData(generator, varName);
  return varName + '_status = ' + varName + '.configBpm(' + (block.getFieldValue('MODE') || 'MODE_ONE') + ');\n';
};

Arduino.forBlock['biohub_config_sensor_bpm'] = function(block, generator) {
  var varName = biohubGetVar(block);
  biohubEnsureData(generator, varName);
  return varName + '_status = ' + varName + '.configSensorBpm(' + (block.getFieldValue('MODE') || 'MODE_ONE') + ');\n';
};

Arduino.forBlock['biohub_read_bpm'] = function(block, generator) {
  var varName = biohubGetVar(block);
  biohubEnsureData(generator, varName);
  return varName + '_data = ' + varName + '.readBpm();\n';
};

Arduino.forBlock['biohub_read_sensor_bpm'] = function(block, generator) {
  var varName = biohubGetVar(block);
  biohubEnsureData(generator, varName);
  return varName + '_data = ' + varName + '.readSensorBpm();\n';
};

Arduino.forBlock['biohub_value'] = function(block, generator) {
  var varName = biohubGetVar(block);
  biohubEnsureData(generator, varName);
  return [varName + '_data.' + (block.getFieldValue('FIELD') || 'heartRate'), generator.ORDER_ATOMIC];
};

Arduino.forBlock['biohub_set_pulse_width'] = function(block, generator) {
  var varName = biohubGetVar(block);
  biohubEnsureData(generator, varName);
  return varName + '_status = ' + varName + '.setPulseWidth(' + (block.getFieldValue('WIDTH') || '69') + ');\n';
};

Arduino.forBlock['biohub_set_sample_rate'] = function(block, generator) {
  var varName = biohubGetVar(block);
  biohubEnsureData(generator, varName);
  return varName + '_status = ' + varName + '.setSampleRate(' + (block.getFieldValue('RATE') || '100') + ');\n';
};

Arduino.forBlock['biohub_set_adc_range'] = function(block, generator) {
  var varName = biohubGetVar(block);
  biohubEnsureData(generator, varName);
  return varName + '_status = ' + varName + '.setAdcRange(' + (block.getFieldValue('RANGE') || '2048') + ');\n';
};
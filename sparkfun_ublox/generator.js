function ubloxEnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFun_Ublox', '#include <SparkFun_Ublox_Arduino_Library.h>');
}

function ubloxGetVar(block) {
  var f = block.getField('VAR');
  return f ? f.getText() : (block.getFieldValue('VAR') || 'gps');
}

function ubloxAttachVar(block) {
  if (block._ubloxVarAttached) return;
  block._ubloxVarAttached = true;
  block._ubloxVarLastName = block.getFieldValue('VAR') || 'gps';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._ubloxVarLastName, 'SFE_UBLOX_GPS');
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._ubloxVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._ubloxVarLastName, newName, 'SFE_UBLOX_GPS');
      block._ubloxVarLastName = newName;
    }
  };
}

Arduino.forBlock['ublox_init'] = function(block, generator) {
  ubloxAttachVar(block);
  ubloxEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'gps';
  generator.addVariable(varName, 'SFE_UBLOX_GPS ' + varName + ';');
  return 'Wire.begin();\n' + varName + '.begin();\n';
};

Arduino.forBlock['ublox_get_pvt'] = function(block, generator) {
  ubloxEnsureLib(generator);
  return [ubloxGetVar(block) + '.getPVT()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ublox_get_latitude'] = function(block, generator) {
  ubloxEnsureLib(generator);
  return [ubloxGetVar(block) + '.getLatitude()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ublox_get_longitude'] = function(block, generator) {
  ubloxEnsureLib(generator);
  return [ubloxGetVar(block) + '.getLongitude()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ublox_get_altitude'] = function(block, generator) {
  ubloxEnsureLib(generator);
  return [ubloxGetVar(block) + '.getAltitude()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ublox_get_siv'] = function(block, generator) {
  ubloxEnsureLib(generator);
  return [ubloxGetVar(block) + '.getSIV()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ublox_get_fix_type'] = function(block, generator) {
  ubloxEnsureLib(generator);
  return [ubloxGetVar(block) + '.getFixType()', generator.ORDER_FUNCTION_CALL];
};

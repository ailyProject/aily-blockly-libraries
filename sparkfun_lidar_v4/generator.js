function lidarv4EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('LIDARLitev4', '#include <LIDARLite_v4LED.h>');
}

function lidarv4GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'lidar');
}

function lidarv4AttachVar(block) {
  if (block._lidarv4VarAttached) return;
  block._lidarv4VarAttached = true;
  block._lidarv4VarLastName = block.getFieldValue('VAR') || 'lidar';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._lidarv4VarLastName, 'LIDARv4');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._lidarv4VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._lidarv4VarLastName, newName, 'LIDARv4');
      block._lidarv4VarLastName = newName;
    }
  };
}

Arduino.forBlock['lidarv4_init'] = function(block, generator) {
  lidarv4AttachVar(block);
  lidarv4EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'lidar';
  generator.addVariable(varName, 'LIDARLite_v4LED ' + varName + ';');
  return 'Wire.begin();\n' + varName + '.begin();\n';
};

Arduino.forBlock['lidarv4_get_distance'] = function(block, generator) {
  lidarv4EnsureLib(generator);
  var varName = lidarv4GetVar(block);
  return [varName + '.getDistance()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['lidarv4_configure'] = function(block, generator) {
  lidarv4EnsureLib(generator);
  var varName = lidarv4GetVar(block);
  var mode = block.getFieldValue('MODE') || '0';
  return varName + '.configure(' + mode + ');\n';
};

Arduino.forBlock['lidarv4_is_connected'] = function(block, generator) {
  lidarv4EnsureLib(generator);
  var varName = lidarv4GetVar(block);
  return [varName + '.isConnected()', generator.ORDER_FUNCTION_CALL];
};

function qwiicMP3EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFun_Qwiic_MP3_Trigger', '#include <SparkFun_Qwiic_MP3_Trigger_Arduino_Library.h>');
}

function qwiicMP3GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'mp3');
}

function qwiicMP3AttachVar(block) {
  if (block._mp3VarAttached) return;
  block._mp3VarAttached = true;
  block._mp3VarLastName = block.getFieldValue('VAR') || 'mp3';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._mp3VarLastName, 'QwiicMP3');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._mp3VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._mp3VarLastName, newName, 'QwiicMP3');
      block._mp3VarLastName = newName;
    }
  };
}

Arduino.forBlock['qwiic_mp3_init'] = function(block, generator) {
  qwiicMP3AttachVar(block);
  qwiicMP3EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'mp3';
  generator.addVariable(varName, 'MP3TRIGGER ' + varName + ';');
  return varName + '.begin();\n';
};

Arduino.forBlock['qwiic_mp3_play_track'] = function(block, generator) {
  qwiicMP3EnsureLib(generator);
  var varName = qwiicMP3GetVar(block);
  var track = generator.valueToCode(block, 'TRACK', generator.ORDER_NONE) || '1';
  return varName + '.playTrack(' + track + ');\n';
};

Arduino.forBlock['qwiic_mp3_play_file'] = function(block, generator) {
  qwiicMP3EnsureLib(generator);
  var varName = qwiicMP3GetVar(block);
  var fileNum = generator.valueToCode(block, 'FILENUM', generator.ORDER_NONE) || '1';
  return varName + '.playFile(' + fileNum + ');\n';
};

Arduino.forBlock['qwiic_mp3_play_next'] = function(block, generator) {
  qwiicMP3EnsureLib(generator);
  return qwiicMP3GetVar(block) + '.playNext();\n';
};

Arduino.forBlock['qwiic_mp3_play_prev'] = function(block, generator) {
  qwiicMP3EnsureLib(generator);
  return qwiicMP3GetVar(block) + '.playPrevious();\n';
};

Arduino.forBlock['qwiic_mp3_pause'] = function(block, generator) {
  qwiicMP3EnsureLib(generator);
  return qwiicMP3GetVar(block) + '.pause();\n';
};

Arduino.forBlock['qwiic_mp3_stop'] = function(block, generator) {
  qwiicMP3EnsureLib(generator);
  return qwiicMP3GetVar(block) + '.stop();\n';
};

Arduino.forBlock['qwiic_mp3_set_volume'] = function(block, generator) {
  qwiicMP3EnsureLib(generator);
  var varName = qwiicMP3GetVar(block);
  var vol = generator.valueToCode(block, 'VOLUME', generator.ORDER_NONE) || '15';
  return varName + '.setVolume(' + vol + ');\n';
};

Arduino.forBlock['qwiic_mp3_is_playing'] = function(block, generator) {
  qwiicMP3EnsureLib(generator);
  return [qwiicMP3GetVar(block) + '.isPlaying()', generator.ORDER_FUNCTION_CALL];
};

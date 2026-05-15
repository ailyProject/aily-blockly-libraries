function my1690EnsureLibrary(generator) {
  generator.addLibrary('MY1690', '#include <SparkFun_MY1690_MP3_Decoder_Arduino_Library/SparkFun_MY1690_MP3_Library.h>');
}

function my1690GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'mp3');
}

function my1690AttachVar(block) {
  if (block._my1690VarAttached) return;
  block._my1690VarAttached = true;
  block._my1690VarLastName = block.getFieldValue('VAR') || 'mp3';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._my1690VarLastName, 'MY1690');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._my1690VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._my1690VarLastName, newName, 'MY1690');
      block._my1690VarLastName = newName;
    }
  };
}

Arduino.forBlock['my1690_init'] = function(block, generator) {
  my1690AttachVar(block);
  my1690EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'mp3';
  var serial = block.getFieldValue('SERIAL') || 'Serial';
  generator.addVariable(varName, 'SparkFunMY1690 ' + varName + ';');
  return serial + '.begin(9600);\n' + varName + '.begin(' + serial + ');\n';
};

Arduino.forBlock['my1690_play'] = function(block, generator) {
  my1690EnsureLibrary(generator);
  return my1690GetVar(block) + '.play();\n';
};

Arduino.forBlock['my1690_pause'] = function(block, generator) {
  my1690EnsureLibrary(generator);
  return my1690GetVar(block) + '.pause();\n';
};

Arduino.forBlock['my1690_stop'] = function(block, generator) {
  my1690EnsureLibrary(generator);
  return my1690GetVar(block) + '.stopPlaying();\n';
};

Arduino.forBlock['my1690_next'] = function(block, generator) {
  my1690EnsureLibrary(generator);
  return my1690GetVar(block) + '.playNext();\n';
};

Arduino.forBlock['my1690_previous'] = function(block, generator) {
  my1690EnsureLibrary(generator);
  return my1690GetVar(block) + '.playPrevious();\n';
};

Arduino.forBlock['my1690_play_track'] = function(block, generator) {
  my1690EnsureLibrary(generator);
  var varName = my1690GetVar(block);
  var track = generator.valueToCode(block, 'TRACK', generator.ORDER_NONE) || '1';
  return varName + '.playTrackNumber(' + track + ');\n';
};

Arduino.forBlock['my1690_set_volume'] = function(block, generator) {
  my1690EnsureLibrary(generator);
  var varName = my1690GetVar(block);
  var vol = generator.valueToCode(block, 'VOLUME', generator.ORDER_NONE) || '15';
  return varName + '.setVolume(' + vol + ');\n';
};

Arduino.forBlock['my1690_volume_up'] = function(block, generator) {
  my1690EnsureLibrary(generator);
  return my1690GetVar(block) + '.volumeUp();\n';
};

Arduino.forBlock['my1690_volume_down'] = function(block, generator) {
  my1690EnsureLibrary(generator);
  return my1690GetVar(block) + '.volumeDown();\n';
};

Arduino.forBlock['my1690_set_eq'] = function(block, generator) {
  my1690EnsureLibrary(generator);
  var varName = my1690GetVar(block);
  var eq = block.getFieldValue('EQ') || '0';
  return varName + '.setEQ(' + eq + ');\n';
};

Arduino.forBlock['my1690_set_play_mode'] = function(block, generator) {
  my1690EnsureLibrary(generator);
  var varName = my1690GetVar(block);
  var mode = block.getFieldValue('MODE') || '4';
  return varName + '.setPlayMode(' + mode + ');\n';
};

Arduino.forBlock['my1690_get_status'] = function(block, generator) {
  my1690EnsureLibrary(generator);
  return [my1690GetVar(block) + '.getPlayStatus()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['my1690_get_volume'] = function(block, generator) {
  my1690EnsureLibrary(generator);
  return [my1690GetVar(block) + '.getVolume()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['my1690_get_song_count'] = function(block, generator) {
  my1690EnsureLibrary(generator);
  return [my1690GetVar(block) + '.getSongCount()', generator.ORDER_FUNCTION_CALL];
};

function si4703EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFun_Si4703', '#include <SparkFunSi4703.h>');
}

function si4703GetVar(block) {
  var f = block.getField('VAR');
  return f ? f.getText() : (block.getFieldValue('VAR') || 'radio');
}

function si4703AttachVar(block) {
  if (block._si4703VarAttached) return;
  block._si4703VarAttached = true;
  block._si4703VarLastName = block.getFieldValue('VAR') || 'radio';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._si4703VarLastName, 'Si4703_Breakout');
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._si4703VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._si4703VarLastName, newName, 'Si4703_Breakout');
      block._si4703VarLastName = newName;
    }
  };
}

Arduino.forBlock['si4703_init'] = function(block, generator) {
  si4703AttachVar(block);
  si4703EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'radio';
  var rst = generator.valueToCode(block, 'RST', generator.ORDER_NONE) || '2';
  var sdio = generator.valueToCode(block, 'SDIO', generator.ORDER_NONE) || 'A4';
  var sclk = generator.valueToCode(block, 'SCLK', generator.ORDER_NONE) || 'A5';
  generator.addVariable(varName, 'Si4703_Breakout ' + varName + '(' + rst + ', ' + sdio + ', ' + sclk + ');');
  return varName + '.powerOn();\n';
};

Arduino.forBlock['si4703_set_channel'] = function(block, generator) {
  si4703EnsureLib(generator);
  var ch = generator.valueToCode(block, 'CHANNEL', generator.ORDER_NONE) || '1017';
  return si4703GetVar(block) + '.setChannel(' + ch + ');\n';
};

Arduino.forBlock['si4703_seek'] = function(block, generator) {
  si4703EnsureLib(generator);
  var dir = block.getFieldValue('DIR') || 'UP';
  return si4703GetVar(block) + (dir === 'UP' ? '.seekUp()' : '.seekDown()') + ';\n';
};

Arduino.forBlock['si4703_set_volume'] = function(block, generator) {
  si4703EnsureLib(generator);
  var vol = generator.valueToCode(block, 'VOLUME', generator.ORDER_NONE) || '8';
  return si4703GetVar(block) + '.setVolume(' + vol + ');\n';
};

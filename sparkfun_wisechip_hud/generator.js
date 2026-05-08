function wisechipHudEnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('WiseChipHUD', '#include <WiseChipHUD.h>');
}

function wisechipHudGetVar(block) {
  var f = block.getField('VAR');
  return f ? f.getText() : (block.getFieldValue('VAR') || 'hud');
}

function wisechipHudAttachVar(block) {
  if (block._wisechipHudVarAttached) return;
  block._wisechipHudVarAttached = true;
  block._wisechipHudVarLastName = block.getFieldValue('VAR') || 'hud';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._wisechipHudVarLastName, 'WiseChipHUD');
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._wisechipHudVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._wisechipHudVarLastName, newName, 'WiseChipHUD');
      block._wisechipHudVarLastName = newName;
    }
  };
}

Arduino.forBlock['wisechip_hud_init'] = function(block, generator) {
  wisechipHudAttachVar(block);
  wisechipHudEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'hud';
  generator.addVariable(varName, 'WiseChipHUD ' + varName + ';');
  return 'Wire.begin();\n' + varName + '.begin();\n';
};

Arduino.forBlock['wisechip_hud_icon_level'] = function(block, generator) {
  wisechipHudEnsureLib(generator);
  var icon = generator.valueToCode(block, 'ICON', generator.ORDER_NONE) || '0';
  var level = generator.valueToCode(block, 'LEVEL', generator.ORDER_NONE) || '0';
  return wisechipHudGetVar(block) + '.AdjustIconLevel(' + icon + ', ' + level + ');\n';
};

Arduino.forBlock['wisechip_hud_nav'] = function(block, generator) {
  wisechipHudEnsureLib(generator);
  var cmd = block.getFieldValue('CMD') || 'nav_TurnLeft';
  return wisechipHudGetVar(block) + '.' + cmd + '(1);\n';
};

Arduino.forBlock['wisechip_hud_compass'] = function(block, generator) {
  wisechipHudEnsureLib(generator);
  var type = block.getFieldValue('TYPE') || 'compassCircle';
  var sel = generator.valueToCode(block, 'SELECT', generator.ORDER_NONE) || '0';
  return wisechipHudGetVar(block) + '.' + type + '(' + sel + ');\n';
};

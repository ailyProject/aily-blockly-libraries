
function sen0715GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'liquid');
}
function sen0715Value(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}
function sen0715Core() {
  if (typeof window === 'undefined' || !window.boardConfig) return '';
  return String(window.boardConfig.core || window.boardConfig.board || '');
}
function sen0715AttachVar(block, typeName) {
  if (block.sen0715VarMonitorAttached) return;
  block.sen0715VarMonitorAttached = true;
  block.sen0715VarLastName = block.getFieldValue('VAR') || 'liquid';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block.sen0715VarLastName, typeName);
  }
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block.sen0715VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block.sen0715VarLastName, newName, typeName);
      block.sen0715VarLastName = newName;
    }
  };
}

Arduino.forBlock['sen0715_init'] = function(block, generator) {
  sen0715AttachVar(block, 'SEN0715');
  var varName = block.getFieldValue('VAR') || 'liquid';
  var pin = block.getFieldValue('PIN') || '5';
  generator.addObject(varName + '_pin', 'int ' + varName + '_pin = ' + pin + ';');
  return 'pinMode(' + varName + '_pin, INPUT);\n';
};
Arduino.forBlock['sen0715_detected'] = function(block, generator) {
  var varName = sen0715GetVar(block);
  return ['digitalRead(' + varName + '_pin) == HIGH', generator.ORDER_EQUALITY];
};
Arduino.forBlock['sen0715_read'] = function(block, generator) {
  var varName = sen0715GetVar(block);
  return ['digitalRead(' + varName + '_pin)', generator.ORDER_ATOMIC];
};

function vkeyEnsureLib(generator) {
  generator.addLibrary('SparkFun_VKey', '#include <SparkFun_VKey.h>');
}

function vkeyGetVar(block) {
  var f = block.getField('VAR');
  return f ? f.getText() : (block.getFieldValue('VAR') || 'keypad');
}

function vkeyAttachVar(block) {
  if (block._vkeyVarAttached) return;
  block._vkeyVarAttached = true;
  block._vkeyVarLastName = block.getFieldValue('VAR') || 'keypad';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._vkeyVarLastName, 'VKey');
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._vkeyVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._vkeyVarLastName, newName, 'VKey');
      block._vkeyVarLastName = newName;
    }
  };
}

Arduino.forBlock['vkey_init'] = function(block, generator) {
  vkeyAttachVar(block);
  vkeyEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'keypad';
  var pin = generator.valueToCode(block, 'PIN', generator.ORDER_NONE) || 'A0';
  generator.addVariable(varName, 'VKey ' + varName + '(' + pin + ');');
  return '';
};

Arduino.forBlock['vkey_read_key'] = function(block, generator) {
  vkeyEnsureLib(generator);
  return [vkeyGetVar(block) + '.getKey()', generator.ORDER_FUNCTION_CALL];
};

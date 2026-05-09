function qwiicRelayEnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFun_Qwiic_Relay', '#include <SparkFun_Qwiic_Relay.h>');
}

function qwiicRelayGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'relay');
}

function qwiicRelayAttachVar(block) {
  if (block._relayVarAttached) return;
  block._relayVarAttached = true;
  block._relayVarLastName = block.getFieldValue('VAR') || 'relay';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._relayVarLastName, 'QwiicRelay');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._relayVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._relayVarLastName, newName, 'QwiicRelay');
      block._relayVarLastName = newName;
    }
  };
}

Arduino.forBlock['qwiic_relay_init'] = function(block, generator) {
  qwiicRelayAttachVar(block);
  qwiicRelayEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'relay';
  var addr = block.getFieldValue('ADDR') || 'SINGLE_RELAY_DEFAULT_ADDRESS';
  generator.addVariable(varName, 'Qwiic_Relay ' + varName + '(' + addr + ');');
  return varName + '.begin();\n';
};

Arduino.forBlock['qwiic_relay_on'] = function(block, generator) {
  qwiicRelayEnsureLib(generator);
  return qwiicRelayGetVar(block) + '.turnRelayOn();\n';
};

Arduino.forBlock['qwiic_relay_off'] = function(block, generator) {
  qwiicRelayEnsureLib(generator);
  return qwiicRelayGetVar(block) + '.turnRelayOff();\n';
};

Arduino.forBlock['qwiic_relay_toggle'] = function(block, generator) {
  qwiicRelayEnsureLib(generator);
  return qwiicRelayGetVar(block) + '.toggleRelay();\n';
};

Arduino.forBlock['qwiic_relay_on_num'] = function(block, generator) {
  qwiicRelayEnsureLib(generator);
  var varName = qwiicRelayGetVar(block);
  var num = generator.valueToCode(block, 'NUM', generator.ORDER_NONE) || '1';
  return varName + '.turnRelayOn(' + num + ');\n';
};

Arduino.forBlock['qwiic_relay_off_num'] = function(block, generator) {
  qwiicRelayEnsureLib(generator);
  var varName = qwiicRelayGetVar(block);
  var num = generator.valueToCode(block, 'NUM', generator.ORDER_NONE) || '1';
  return varName + '.turnRelayOff(' + num + ');\n';
};

Arduino.forBlock['qwiic_relay_all_on'] = function(block, generator) {
  qwiicRelayEnsureLib(generator);
  return qwiicRelayGetVar(block) + '.turnAllRelaysOn();\n';
};

Arduino.forBlock['qwiic_relay_all_off'] = function(block, generator) {
  qwiicRelayEnsureLib(generator);
  return qwiicRelayGetVar(block) + '.turnAllRelaysOff();\n';
};

Arduino.forBlock['qwiic_relay_get_state'] = function(block, generator) {
  qwiicRelayEnsureLib(generator);
  var code = qwiicRelayGetVar(block) + '.getState()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

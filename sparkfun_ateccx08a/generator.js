function ateccx08aEnsureLibrary(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('ATECCX08A', '#include <SparkFun_ATECCX08a_Arduino_Library.h>');
}

function ateccx08aGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'atecc');
}

function ateccx08aAttachVar(block) {
  if (block._ateccx08aVarAttached) return;
  block._ateccx08aVarAttached = true;
  block._ateccx08aVarLastName = block.getFieldValue('VAR') || 'atecc';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._ateccx08aVarLastName, 'ATECCX08A');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._ateccx08aVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._ateccx08aVarLastName, newName, 'ATECCX08A');
      block._ateccx08aVarLastName = newName;
    }
  };
}

Arduino.forBlock['ateccx08a_init'] = function(block, generator) {
  ateccx08aAttachVar(block);
  ateccx08aEnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'atecc';
  var address = block.getFieldValue('ADDRESS') || 'ATECC508A_ADDRESS_DEFAULT';
  generator.addVariable(varName, 'ATECCX08A ' + varName + ';');
  generator.addVariable(varName + '_ready', 'bool ' + varName + '_ready = false;');
  return 'Wire.begin();\n' + varName + '_ready = ' + varName + '.begin(' + address + ');\n';
};

Arduino.forBlock['ateccx08a_is_ready'] = function(block, generator) {
  return [ateccx08aGetVar(block) + '_ready', generator.ORDER_ATOMIC];
};

Arduino.forBlock['ateccx08a_wakeup'] = function(block, generator) {
  return [ateccx08aGetVar(block) + '.wakeUp()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ateccx08a_sleep'] = function(block) {
  return ateccx08aGetVar(block) + '.sleep();\n';
};

Arduino.forBlock['ateccx08a_read_config'] = function(block) {
  return ateccx08aGetVar(block) + '.readConfigZone(false);\n';
};

Arduino.forBlock['ateccx08a_lock_status'] = function(block, generator) {
  var fields = { CONFIG: 'configLockStatus', DATA_OTP: 'dataOTPLockStatus', SLOT0: 'slot0LockStatus' };
  return [ateccx08aGetVar(block) + '.' + fields[block.getFieldValue('FIELD') || 'CONFIG'], generator.ORDER_ATOMIC];
};

Arduino.forBlock['ateccx08a_random'] = function(block, generator) {
  var methods = { BYTE: 'getRandomByte', INT: 'getRandomInt', LONG: 'getRandomLong' };
  return [ateccx08aGetVar(block) + '.' + methods[block.getFieldValue('TYPE') || 'BYTE'] + '(false)', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ateccx08a_update_random'] = function(block) {
  return ateccx08aGetVar(block) + '.updateRandom32Bytes(false);\n';
};

Arduino.forBlock['ateccx08a_create_key_pair'] = function(block, generator) {
  var slot = generator.valueToCode(block, 'SLOT', generator.ORDER_ATOMIC) || '0';
  return [ateccx08aGetVar(block) + '.createNewKeyPair(' + slot + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ateccx08a_generate_public_key'] = function(block, generator) {
  var slot = generator.valueToCode(block, 'SLOT', generator.ORDER_ATOMIC) || '0';
  return [ateccx08aGetVar(block) + '.generatePublicKey(' + slot + ', false)', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ateccx08a_write_config_sparkfun'] = function(block) {
  return ateccx08aGetVar(block) + '.writeConfigSparkFun();\n';
};

Arduino.forBlock['ateccx08a_lock_zone'] = function(block) {
  var methods = { CONFIG: 'lockConfig', DATA_OTP: 'lockDataAndOTP', SLOT0: 'lockDataSlot0' };
  return ateccx08aGetVar(block) + '.' + methods[block.getFieldValue('ZONE') || 'CONFIG'] + '();\n';
};
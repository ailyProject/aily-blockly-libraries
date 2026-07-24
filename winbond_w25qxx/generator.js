// _varMonitorAttached: the init field hook below monitors variable renames.
function winbond_w25qxxEnsureLibrary(generator) {
  generator.addLibrary('winbond_w25qxx_0', '#include <Aily_W25QXX.h>');
}

function winbond_w25qxxVariable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'w25qxx');
}

function winbond_w25qxxAttachVariable(block) {
  if (block._winbond_w25qxxVariableAttached) return;
  block._winbond_w25qxxVariableAttached = true;
  block._winbond_w25qxxLastName = block.getFieldValue('VAR') || 'w25qxx';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._winbond_w25qxxLastName, 'AilyW25QXX');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._winbond_w25qxxLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._winbond_w25qxxLastName, newName, 'AilyW25QXX');
      block._winbond_w25qxxLastName = newName;
    }
  };
}

function winbond_w25qxxEnsureExtras(generator, varName) {
  // No cached data objects required.
}

Arduino.forBlock['winbond_w25qxx_init'] = function(block, generator) {
  winbond_w25qxxAttachVariable(block);
  winbond_w25qxxEnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'w25qxx';
  var cs = block.getFieldValue('CS') || "10";
  var objectCode = "AilyW25QXX " + String(varName) + "(" + String(cs) + ", &SPI);";
  generator.addObject('winbond_w25qxx_object_' + varName, objectCode);
  winbond_w25qxxEnsureExtras(generator, varName);
  var beginCall = String(varName) + ".begin()";
  generator.addSetupBegin('winbond_w25qxx_begin_' + varName, 'while (!(' + beginCall + ')) { delay(100); }');
  return '';
};

Arduino.forBlock['winbond_w25qxx_read'] = function(block, generator) {
  winbond_w25qxxEnsureLibrary(generator);
  var varName = winbond_w25qxxVariable(block);
  winbond_w25qxxEnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "byte";
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var expressions = {
    "byte": String(varName) + ".readByte((uint32_t)" + String(index) + ")",
    "busy": String(varName) + ".busy()",
    "jedec": String(varName) + ".jedecId()"
  };
  return [expressions[data] || expressions["byte"], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['winbond_w25qxx_action'] = function(block, generator) {
  winbond_w25qxxEnsureLibrary(generator);
  var varName = winbond_w25qxxVariable(block);
  winbond_w25qxxEnsureExtras(generator, varName);
  var action = block.getFieldValue('ACTION') || "erase_chip";
  var actions = {
    "erase_chip": String(varName) + ".eraseChip();",
    "sleep": String(varName) + ".powerDown();",
    "wake": String(varName) + ".wake();"
  };
  return (actions[action] || actions["erase_chip"]) + '\n';
};

Arduino.forBlock['winbond_w25qxx_set'] = function(block, generator) {
  winbond_w25qxxEnsureLibrary(generator);
  var varName = winbond_w25qxxVariable(block);
  winbond_w25qxxEnsureExtras(generator, varName);
  var setting = block.getFieldValue('SETTING') || "erase_sector";
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || "0";
  var settings = {
    "erase_sector": String(varName) + ".eraseSector((uint32_t)" + String(value) + ");"
  };
  return (settings[setting] || settings["erase_sector"]) + '\n';
};

Arduino.forBlock['winbond_w25qxx_write'] = function(block, generator) {
  winbond_w25qxxEnsureLibrary(generator);
  var varName = winbond_w25qxxVariable(block);
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  return String(varName) + ".writeByte((uint32_t)" + String(index) + ", (uint8_t)" + String(value) + ");" + '\n';
};

function rfidReaderEnsureLib(generator) {
  generator.addLibrary('SparkFun_RFID', '#include <SparkFun_UHF_RFID_Reader.h>');
}

function rfidReaderGetVar(block) {
  var f = block.getField('VAR');
  return f ? f.getText() : (block.getFieldValue('VAR') || 'rfid');
}

function rfidReaderAttachVar(block) {
  if (block._rfidReaderVarAttached) return;
  block._rfidReaderVarAttached = true;
  block._rfidReaderVarLastName = block.getFieldValue('VAR') || 'rfid';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._rfidReaderVarLastName, 'RFID');
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._rfidReaderVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._rfidReaderVarLastName, newName, 'RFID');
      block._rfidReaderVarLastName = newName;
    }
  };
}

Arduino.forBlock['rfid_reader_init'] = function(block, generator) {
  rfidReaderAttachVar(block);
  rfidReaderEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'rfid';
  var port = block.getFieldValue('PORT') || 'Serial1';
  generator.addVariable(varName, 'RFID ' + varName + ';');
  return port + '.begin(115200);\n' + varName + '.begin(' + port + ');\n';
};

Arduino.forBlock['rfid_reader_start'] = function(block, generator) {
  rfidReaderEnsureLib(generator);
  return rfidReaderGetVar(block) + '.startReading();\n';
};

Arduino.forBlock['rfid_reader_stop'] = function(block, generator) {
  rfidReaderEnsureLib(generator);
  return rfidReaderGetVar(block) + '.stopReading();\n';
};

Arduino.forBlock['rfid_reader_check_tag'] = function(block, generator) {
  rfidReaderEnsureLib(generator);
  return [rfidReaderGetVar(block) + '.check()', generator.ORDER_FUNCTION_CALL];
};

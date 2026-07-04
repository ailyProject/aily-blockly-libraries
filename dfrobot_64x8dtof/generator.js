function dtof64x8EnsureLib(generator) {
  generator.addLibrary('DFRobot_64x8DTOF', '#include <DFRobot_64x8DTOF.h>');
}

function dtof64x8GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'dtof64x8');
}

function dtof64x8Value(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function dtof64x8AttachVar(block) {
  if (block._dtof64x8VarAttached) return;
  block._dtof64x8VarAttached = true;
  block._dtof64x8VarLastName = block.getFieldValue('VAR') || 'dtof64x8';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._dtof64x8VarLastName, 'DFRobot_64x8DTOF');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._dtof64x8VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._dtof64x8VarLastName, newName, 'DFRobot_64x8DTOF');
      block._dtof64x8VarLastName = newName;
    }
  };
}

function dtof64x8RetryCall(varName, call) {
  return 'while (!' + varName + '.' + call + ') {\n  delay(200);\n}\n';
}

Arduino.forBlock['dtof64x8_init_uart'] = function(block, generator) {
  dtof64x8AttachVar(block);
  dtof64x8EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'dtof64x8';
  var serialName = block.getFieldValue('SERIAL') || 'Serial1';
  var rx = dtof64x8Value(block, generator, 'RX', '25');
  var tx = dtof64x8Value(block, generator, 'TX', '26');
  generator.addObject(varName, 'DFRobot_64x8DTOF ' + varName + '(' + serialName + ', SERIAL_8N1, ' + rx + ', ' + tx + ');');
  return 'while (!' + varName + '.begin()) {\n  delay(1000);\n}\n';
};

Arduino.forBlock['dtof64x8_config_frame_single'] = function(block, generator) {
  dtof64x8EnsureLib(generator);
  var varName = dtof64x8GetVar(block);
  return dtof64x8RetryCall(varName, 'configFrameMode(DFRobot_64x8DTOF::eFrameSingle)');
};

Arduino.forBlock['dtof64x8_config_full'] = function(block, generator) {
  dtof64x8EnsureLib(generator);
  return dtof64x8RetryCall(dtof64x8GetVar(block), 'configMeasureMode()');
};

Arduino.forBlock['dtof64x8_config_line'] = function(block, generator) {
  dtof64x8EnsureLib(generator);
  var line = dtof64x8Value(block, generator, 'LINE', '4');
  return dtof64x8RetryCall(dtof64x8GetVar(block), 'configMeasureMode(' + line + ')');
};

Arduino.forBlock['dtof64x8_config_point'] = function(block, generator) {
  dtof64x8EnsureLib(generator);
  var line = dtof64x8Value(block, generator, 'LINE', '4');
  var point = dtof64x8Value(block, generator, 'POINT', '32');
  return dtof64x8RetryCall(dtof64x8GetVar(block), 'configMeasureMode(' + line + ', ' + point + ')');
};

Arduino.forBlock['dtof64x8_config_points'] = function(block, generator) {
  dtof64x8EnsureLib(generator);
  var line = dtof64x8Value(block, generator, 'LINE', '3');
  var start = dtof64x8Value(block, generator, 'START', '1');
  var end = dtof64x8Value(block, generator, 'END', '64');
  return dtof64x8RetryCall(dtof64x8GetVar(block), 'configMeasureMode(' + line + ', ' + start + ', ' + end + ')');
};

Arduino.forBlock['dtof64x8_read_data'] = function(block, generator) {
  dtof64x8EnsureLib(generator);
  var timeout = dtof64x8Value(block, generator, 'TIMEOUT', '300');
  return [dtof64x8GetVar(block) + '.getData(' + timeout + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['dtof64x8_point_value'] = function(block, generator) {
  dtof64x8EnsureLib(generator);
  var varName = dtof64x8GetVar(block);
  var index = dtof64x8Value(block, generator, 'INDEX', '0');
  var data = block.getFieldValue('DATA') || 'Z';
  var member = { X: 'xBuf', Y: 'yBuf', Z: 'zBuf', I: 'iBuf' }[data] || 'zBuf';
  return [varName + '.point.' + member + '[' + index + ']', generator.ORDER_ATOMIC];
};

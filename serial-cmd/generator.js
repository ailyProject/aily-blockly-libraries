if (typeof Arduino === 'undefined') var Arduino = {};

Arduino.forBlock['serial_cmd_init'] = function(block, generator) {
  const port = block.getFieldValue('PORT') || 'Serial';
  const speed = block.getFieldValue('SPEED') || '115200';
  
  generator.addLibrary('SerialCmd', '#include <SerialCmd.h>');
  generator.addLoopBegin('SerialCmd.tick();', 'SerialCmd.tick();');
  
  let initCode = port + '.begin(' + speed + ');\n';
  initCode += 'SerialCmd.begin(' + port + ');\n';
  
  return initCode;
};

Arduino.forBlock['serial_cmd_on_received'] = function(block, generator) {
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'serialCmd_onReceived';

  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';
  generator.addFunction(callbackName, functionDef);

  const setupCode = 'SerialCmd.onReceived(' + callbackName + ');\n';
  generator.addSetupEnd('serialCmd_callback_setup', setupCode);

  return '';
};

Arduino.forBlock['serial_cmd_get_cmd'] = function(block, generator) {
  return ['SerialCmd.getCmd()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['serial_cmd_get_param_int'] = function(block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  return ['SerialCmd.getParamInt(' + index + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['serial_cmd_get_cmd_type'] = function(block, generator) {
  return ['SerialCmd.getCmdType()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['serial_cmd_reply_ok'] = function(block, generator) {
  const msg = generator.valueToCode(block, 'MSG', generator.ORDER_ATOMIC) || '""';
  return 'SerialCmd.replyOk(' + msg + ');\n';
};

Arduino.forBlock['serial_cmd_reply_err'] = function(block, generator) {
  const msg = generator.valueToCode(block, 'MSG', generator.ORDER_ATOMIC) || '""';
  return 'SerialCmd.replyErr(' + msg + ');\n';
};

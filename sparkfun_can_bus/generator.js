function canbusEnsureLibrary(generator) {
  generator.addLibrary('Canbus', '#include <Canbus.h>');
  generator.addLibrary('CanbusDefaults', '#include <defaults.h>');
  generator.addLibrary('CanbusGlobal', '#include <global.h>');
  generator.addLibrary('MCP2515', '#include <mcp2515.h>');
  generator.addLibrary('MCP2515Defs', '#include <mcp2515_defs.h>');
}

function canbusEnsureHelpers(generator) {
  generator.addVariable('canbus_ready', 'bool canbus_ready = false;');
  generator.addVariable('canbus_last_message', 'tCAN canbus_last_message;');
  generator.addVariable('canbus_rx_buffer', 'unsigned char canbus_rx_buffer[8] = {0, 0, 0, 0, 0, 0, 0, 0};');
  generator.addVariable('canbus_obd_buffer', 'char canbus_obd_buffer[24] = {0};');
  generator.addFunction('canbus_read_message_helper', 'bool canbusReadMessage() {\n  if (mcp2515_check_message()) {\n    if (mcp2515_get_message(&canbus_last_message)) {\n      for (byte i = 0; i < 8; i++) {\n        canbus_rx_buffer[i] = canbus_last_message.data[i];\n      }\n      return true;\n    }\n  }\n  return false;\n}\n');
  generator.addFunction('canbus_request_pid_helper', 'char *canbusRequestPid(unsigned char pid) {\n  canbus_obd_buffer[0] = \'\\0\';\n  Canbus.ecu_req(pid, canbus_obd_buffer);\n  return canbus_obd_buffer;\n}\n');
  generator.addFunction('canbus_send_frame_helper', 'bool canbusSendFrame(unsigned int id, byte length, byte d0, byte d1, byte d2, byte d3, byte d4, byte d5, byte d6, byte d7) {\n  tCAN message;\n  byte data[8] = {d0, d1, d2, d3, d4, d5, d6, d7};\n  message.id = id;\n  message.header.rtr = 0;\n  message.header.length = length > 8 ? 8 : length;\n  for (byte i = 0; i < 8; i++) {\n    message.data[i] = data[i];\n  }\n  mcp2515_bit_modify(CANCTRL, (1 << REQOP2) | (1 << REQOP1) | (1 << REQOP0), 0);\n  return mcp2515_send_message(&message);\n}\n');
}

Arduino.forBlock['canbus_init'] = function(block, generator) {
  canbusEnsureLibrary(generator);
  canbusEnsureHelpers(generator);
  return 'canbus_ready = Canbus.init(' + (block.getFieldValue('SPEED') || 'CANSPEED_500') + ');\n';
};

Arduino.forBlock['canbus_is_ready'] = function(block, generator) {
  canbusEnsureLibrary(generator);
  canbusEnsureHelpers(generator);
  return ['canbus_ready', generator.ORDER_ATOMIC];
};

Arduino.forBlock['canbus_send_test'] = function(block, generator) {
  canbusEnsureLibrary(generator);
  return ['Canbus.message_tx()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['canbus_read_message'] = function(block, generator) {
  canbusEnsureLibrary(generator);
  canbusEnsureHelpers(generator);
  return ['canbusReadMessage()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['canbus_last_id'] = function(block, generator) {
  canbusEnsureLibrary(generator);
  canbusEnsureHelpers(generator);
  return ['canbus_last_message.id', generator.ORDER_ATOMIC];
};

Arduino.forBlock['canbus_last_length'] = function(block, generator) {
  canbusEnsureLibrary(generator);
  canbusEnsureHelpers(generator);
  return ['canbus_last_message.header.length', generator.ORDER_ATOMIC];
};

Arduino.forBlock['canbus_data_byte'] = function(block, generator) {
  canbusEnsureLibrary(generator);
  canbusEnsureHelpers(generator);
  return ['canbus_rx_buffer[' + (block.getFieldValue('INDEX') || '0') + ']', generator.ORDER_ATOMIC];
};

Arduino.forBlock['canbus_obd_request'] = function(block, generator) {
  canbusEnsureLibrary(generator);
  canbusEnsureHelpers(generator);
  return ['canbusRequestPid(' + (block.getFieldValue('PID') || 'ENGINE_RPM') + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['canbus_send_message'] = function(block, generator) {
  canbusEnsureLibrary(generator);
  canbusEnsureHelpers(generator);
  var id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '0x7DF';
  var length = block.getFieldValue('LENGTH') || '8';
  var bytes = [];
  for (var index = 0; index < 8; index++) {
    bytes.push(generator.valueToCode(block, 'D' + index, generator.ORDER_ATOMIC) || '0');
  }
  return 'canbusSendFrame(' + id + ', ' + length + ', ' + bytes.join(', ') + ');\n';
};
// ============== Helper Functions ==============

// Ensure WiFi library is included based on board type
function nmbs_ensureWiFiLib(generator) {
  var boardConfig = window['boardConfig'];
  if (boardConfig && boardConfig.core && boardConfig.core.indexOf('renesas_uno') > -1) {
    generator.addLibrary('WiFi', '#include <WiFiS3.h>');
  } else {
    generator.addLibrary('WiFi', '#include <WiFi.h>');
  }
}

// Add TCP read/write callback functions
function nmbs_addTcpCallbacks(generator) {
  var readFunc = '';
  readFunc += 'int32_t nmbs_read_tcp(uint8_t* buf, uint16_t count, int32_t byte_timeout_ms, void* arg) {\n';
  readFunc += '  WiFiClient* client = (WiFiClient*) arg;\n';
  readFunc += '  unsigned long start = millis();\n';
  readFunc += '  unsigned long timeout = (byte_timeout_ms < 0) ? 0xFFFFFFFF : (unsigned long) byte_timeout_ms;\n';
  readFunc += '  while (client->available() < (int) count) {\n';
  readFunc += '    if (millis() - start >= timeout) return 0;\n';
  readFunc += '    if (!client->connected()) return -1;\n';
  readFunc += '    delay(1);\n';
  readFunc += '  }\n';
  readFunc += '  return client->readBytes(buf, count);\n';
  readFunc += '}\n';
  generator.addFunction('nmbs_read_tcp', readFunc);

  var writeFunc = '';
  writeFunc += 'int32_t nmbs_write_tcp(const uint8_t* buf, uint16_t count, int32_t byte_timeout_ms, void* arg) {\n';
  writeFunc += '  WiFiClient* client = (WiFiClient*) arg;\n';
  writeFunc += '  (void) byte_timeout_ms;\n';
  writeFunc += '  if (!client->connected()) return -1;\n';
  writeFunc += '  return client->write(buf, count);\n';
  writeFunc += '}\n';
  generator.addFunction('nmbs_write_tcp', writeFunc);
}

// Add TCP server poll helper function
function nmbs_addTcpServerPollHelper(generator) {
  var func = '';
  func += 'void nmbs_tcp_server_poll(nmbs_t* nmbs, WiFiServer* server, WiFiClient* client) {\n';
  func += '  WiFiClient newClient = server->available();\n';
  func += '  if (newClient) {\n';
  func += '    *client = newClient;\n';
  func += '  }\n';
  func += '  if (*client && client->connected()) {\n';
  func += '    if (client->available()) {\n';
  func += '      nmbs_server_poll(nmbs);\n';
  func += '    }\n';
  func += '  } else if (*client) {\n';
  func += '    client->stop();\n';
  func += '  }\n';
  func += '}\n';
  generator.addFunction('nmbs_tcp_server_poll', func);
}

// Add serial read/write callback functions for a specific serial port
function nmbs_addSerialCallbacks(generator, serialPort) {
  var readFunc = '';
  readFunc += 'int32_t nmbs_read_' + serialPort + '(uint8_t* buf, uint16_t count, int32_t byte_timeout_ms, void* arg) {\n';
  readFunc += '  ' + serialPort + '.setTimeout(byte_timeout_ms > 0 ? byte_timeout_ms : 1000);\n';
  readFunc += '  return ' + serialPort + '.readBytes(buf, count);\n';
  readFunc += '}\n';

  var writeFunc = '';
  writeFunc += 'int32_t nmbs_write_' + serialPort + '(const uint8_t* buf, uint16_t count, int32_t byte_timeout_ms, void* arg) {\n';
  writeFunc += '  ' + serialPort + '.setTimeout(byte_timeout_ms > 0 ? byte_timeout_ms : 1000);\n';
  writeFunc += '  return ' + serialPort + '.write(buf, count);\n';
  writeFunc += '}\n';

  generator.addFunction('nmbs_read_' + serialPort, readFunc);
  generator.addFunction('nmbs_write_' + serialPort, writeFunc);
}

// Add client read helper functions
function nmbs_addClientHelpers(generator) {
  var readCoilFunc = '';
  readCoilFunc += 'bool nmbs_helper_read_coil(nmbs_t* nmbs, uint16_t addr) {\n';
  readCoilFunc += '  nmbs_bitfield bf = {0};\n';
  readCoilFunc += '  nmbs_read_coils(nmbs, addr, 1, bf);\n';
  readCoilFunc += '  return nmbs_bitfield_read(bf, 0);\n';
  readCoilFunc += '}\n';
  generator.addFunction('nmbs_helper_read_coil', readCoilFunc);

  var readDiscreteFunc = '';
  readDiscreteFunc += 'bool nmbs_helper_read_discrete(nmbs_t* nmbs, uint16_t addr) {\n';
  readDiscreteFunc += '  nmbs_bitfield bf = {0};\n';
  readDiscreteFunc += '  nmbs_read_discrete_inputs(nmbs, addr, 1, bf);\n';
  readDiscreteFunc += '  return nmbs_bitfield_read(bf, 0);\n';
  readDiscreteFunc += '}\n';
  generator.addFunction('nmbs_helper_read_discrete', readDiscreteFunc);

  var readHoldingFunc = '';
  readHoldingFunc += 'uint16_t nmbs_helper_read_holding(nmbs_t* nmbs, uint16_t addr) {\n';
  readHoldingFunc += '  uint16_t val = 0;\n';
  readHoldingFunc += '  nmbs_read_holding_registers(nmbs, addr, 1, &val);\n';
  readHoldingFunc += '  return val;\n';
  readHoldingFunc += '}\n';
  generator.addFunction('nmbs_helper_read_holding', readHoldingFunc);

  var readInputFunc = '';
  readInputFunc += 'uint16_t nmbs_helper_read_input(nmbs_t* nmbs, uint16_t addr) {\n';
  readInputFunc += '  uint16_t val = 0;\n';
  readInputFunc += '  nmbs_read_input_registers(nmbs, addr, 1, &val);\n';
  readInputFunc += '  return val;\n';
  readInputFunc += '}\n';
  generator.addFunction('nmbs_helper_read_input', readInputFunc);
}

// Add server data model and callback functions
function nmbs_addServerModel(generator) {
  generator.addVariable('nmbs_srv_coils', 'nmbs_bitfield nmbs_srv_coils = {0};');
  generator.addVariable('nmbs_srv_discrete_inputs', 'nmbs_bitfield nmbs_srv_discrete_inputs = {0};');
  generator.addVariable('nmbs_srv_holding_regs', 'uint16_t nmbs_srv_holding_regs[33] = {0};');
  generator.addVariable('nmbs_srv_input_regs', 'uint16_t nmbs_srv_input_regs[33] = {0};');

  var readCoilsCb = '';
  readCoilsCb += 'nmbs_error nmbs_cb_read_coils(uint16_t address, uint16_t quantity, nmbs_bitfield coils_out, uint8_t unit_id, void* arg) {\n';
  readCoilsCb += '  if (address + quantity > 101) return NMBS_EXCEPTION_ILLEGAL_DATA_ADDRESS;\n';
  readCoilsCb += '  for (uint16_t i = 0; i < quantity; i++) {\n';
  readCoilsCb += '    nmbs_bitfield_write(coils_out, i, nmbs_bitfield_read(nmbs_srv_coils, address + i));\n';
  readCoilsCb += '  }\n';
  readCoilsCb += '  return NMBS_ERROR_NONE;\n';
  readCoilsCb += '}\n';
  generator.addFunction('nmbs_cb_read_coils', readCoilsCb);

  var writeSingleCoilCb = '';
  writeSingleCoilCb += 'nmbs_error nmbs_cb_write_single_coil(uint16_t address, bool value, uint8_t unit_id, void* arg) {\n';
  writeSingleCoilCb += '  if (address > 100) return NMBS_EXCEPTION_ILLEGAL_DATA_ADDRESS;\n';
  writeSingleCoilCb += '  nmbs_bitfield_write(nmbs_srv_coils, address, value);\n';
  writeSingleCoilCb += '  return NMBS_ERROR_NONE;\n';
  writeSingleCoilCb += '}\n';
  generator.addFunction('nmbs_cb_write_single_coil', writeSingleCoilCb);

  var writeMultiCoilsCb = '';
  writeMultiCoilsCb += 'nmbs_error nmbs_cb_write_multi_coils(uint16_t address, uint16_t quantity, const nmbs_bitfield coils, uint8_t unit_id, void* arg) {\n';
  writeMultiCoilsCb += '  if (address + quantity > 101) return NMBS_EXCEPTION_ILLEGAL_DATA_ADDRESS;\n';
  writeMultiCoilsCb += '  for (uint16_t i = 0; i < quantity; i++) {\n';
  writeMultiCoilsCb += '    nmbs_bitfield_write(nmbs_srv_coils, address + i, nmbs_bitfield_read(coils, i));\n';
  writeMultiCoilsCb += '  }\n';
  writeMultiCoilsCb += '  return NMBS_ERROR_NONE;\n';
  writeMultiCoilsCb += '}\n';
  generator.addFunction('nmbs_cb_write_multi_coils', writeMultiCoilsCb);

  var readHoldingRegsCb = '';
  readHoldingRegsCb += 'nmbs_error nmbs_cb_read_holding_regs(uint16_t address, uint16_t quantity, uint16_t* registers_out, uint8_t unit_id, void* arg) {\n';
  readHoldingRegsCb += '  if (address + quantity > 33) return NMBS_EXCEPTION_ILLEGAL_DATA_ADDRESS;\n';
  readHoldingRegsCb += '  for (uint16_t i = 0; i < quantity; i++) {\n';
  readHoldingRegsCb += '    registers_out[i] = nmbs_srv_holding_regs[address + i];\n';
  readHoldingRegsCb += '  }\n';
  readHoldingRegsCb += '  return NMBS_ERROR_NONE;\n';
  readHoldingRegsCb += '}\n';
  generator.addFunction('nmbs_cb_read_holding_regs', readHoldingRegsCb);

  var writeSingleRegCb = '';
  writeSingleRegCb += 'nmbs_error nmbs_cb_write_single_reg(uint16_t address, uint16_t value, uint8_t unit_id, void* arg) {\n';
  writeSingleRegCb += '  if (address > 32) return NMBS_EXCEPTION_ILLEGAL_DATA_ADDRESS;\n';
  writeSingleRegCb += '  nmbs_srv_holding_regs[address] = value;\n';
  writeSingleRegCb += '  return NMBS_ERROR_NONE;\n';
  writeSingleRegCb += '}\n';
  generator.addFunction('nmbs_cb_write_single_reg', writeSingleRegCb);

  var writeMultiRegsCb = '';
  writeMultiRegsCb += 'nmbs_error nmbs_cb_write_multi_regs(uint16_t address, uint16_t quantity, const uint16_t* registers, uint8_t unit_id, void* arg) {\n';
  writeMultiRegsCb += '  if (address + quantity > 33) return NMBS_EXCEPTION_ILLEGAL_DATA_ADDRESS;\n';
  writeMultiRegsCb += '  for (uint16_t i = 0; i < quantity; i++) {\n';
  writeMultiRegsCb += '    nmbs_srv_holding_regs[address + i] = registers[i];\n';
  writeMultiRegsCb += '  }\n';
  writeMultiRegsCb += '  return NMBS_ERROR_NONE;\n';
  writeMultiRegsCb += '}\n';
  generator.addFunction('nmbs_cb_write_multi_regs', writeMultiRegsCb);

  var readDiscreteInputsCb = '';
  readDiscreteInputsCb += 'nmbs_error nmbs_cb_read_discrete_inputs(uint16_t address, uint16_t quantity, nmbs_bitfield inputs_out, uint8_t unit_id, void* arg) {\n';
  readDiscreteInputsCb += '  if (address + quantity > 101) return NMBS_EXCEPTION_ILLEGAL_DATA_ADDRESS;\n';
  readDiscreteInputsCb += '  for (uint16_t i = 0; i < quantity; i++) {\n';
  readDiscreteInputsCb += '    nmbs_bitfield_write(inputs_out, i, nmbs_bitfield_read(nmbs_srv_discrete_inputs, address + i));\n';
  readDiscreteInputsCb += '  }\n';
  readDiscreteInputsCb += '  return NMBS_ERROR_NONE;\n';
  readDiscreteInputsCb += '}\n';
  generator.addFunction('nmbs_cb_read_discrete_inputs', readDiscreteInputsCb);

  var readInputRegsCb = '';
  readInputRegsCb += 'nmbs_error nmbs_cb_read_input_regs(uint16_t address, uint16_t quantity, uint16_t* registers_out, uint8_t unit_id, void* arg) {\n';
  readInputRegsCb += '  if (address + quantity > 33) return NMBS_EXCEPTION_ILLEGAL_DATA_ADDRESS;\n';
  readInputRegsCb += '  for (uint16_t i = 0; i < quantity; i++) {\n';
  readInputRegsCb += '    registers_out[i] = nmbs_srv_input_regs[address + i];\n';
  readInputRegsCb += '  }\n';
  readInputRegsCb += '  return NMBS_ERROR_NONE;\n';
  readInputRegsCb += '}\n';
  generator.addFunction('nmbs_cb_read_input_regs', readInputRegsCb);
}

// ============== Client Blocks ==============

// Client Create
Arduino.forBlock['nmbs_client_create'] = function(block, generator) {
  // Variable rename listener
  if (!block._nmbsVarMonitorAttached) {
    block._nmbsVarMonitorAttached = true;
    block._nmbsVarLastName = block.getFieldValue('VAR') || 'modbusClient';
    registerVariableToBlockly(block._nmbsVarLastName, 'NanoModbus');
    var varField = block.getField('VAR');
    if (varField) {
      var originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        var workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        var oldName = block._nmbsVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'NanoModbus');
          block._nmbsVarLastName = newName;
        }
      };
    }
  }

  var varName = block.getFieldValue('VAR') || 'modbusClient';
  var serialPort = block.getFieldValue('SERIAL') || 'Serial1';
  var baudrate = block.getFieldValue('BAUDRATE') || '9600';

  generator.addLibrary('nanomodbus', '#include <nanomodbus.h>');
  registerVariableToBlockly(varName, 'NanoModbus');
  nmbs_addSerialCallbacks(generator, serialPort);
  generator.addVariable(varName, 'nmbs_t ' + varName + ';');

  var code = '';
  code += serialPort + '.begin(' + baudrate + ');\n';
  code += '{\n';
  code += '  nmbs_platform_conf platform_conf;\n';
  code += '  nmbs_platform_conf_create(&platform_conf);\n';
  code += '  platform_conf.transport = NMBS_TRANSPORT_RTU;\n';
  code += '  platform_conf.read = nmbs_read_' + serialPort + ';\n';
  code += '  platform_conf.write = nmbs_write_' + serialPort + ';\n';
  code += '  nmbs_client_create(&' + varName + ', &platform_conf);\n';
  code += '}\n';
  code += 'nmbs_set_read_timeout(&' + varName + ', 1000);\n';
  code += 'nmbs_set_byte_timeout(&' + varName + ', 100);\n';

  return code;
};

// TCP Client Create
Arduino.forBlock['nmbs_client_tcp_create'] = function(block, generator) {
  // Variable rename listener
  if (!block._nmbsVarMonitorAttached) {
    block._nmbsVarMonitorAttached = true;
    block._nmbsVarLastName = block.getFieldValue('VAR') || 'modbusClient';
    registerVariableToBlockly(block._nmbsVarLastName, 'NanoModbus');
    var varField = block.getField('VAR');
    if (varField) {
      var originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        var workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        var oldName = block._nmbsVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'NanoModbus');
          block._nmbsVarLastName = newName;
        }
      };
    }
  }

  var varName = block.getFieldValue('VAR') || 'modbusClient';
  var ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '"your_ssid"';
  var pass = generator.valueToCode(block, 'PASS', generator.ORDER_ATOMIC) || '"your_password"';
  var ip = generator.valueToCode(block, 'IP', generator.ORDER_ATOMIC) || '"192.168.1.100"';
  var port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '502';

  generator.addLibrary('nanomodbus', '#include <nanomodbus.h>');
  nmbs_ensureWiFiLib(generator);
  nmbs_addTcpCallbacks(generator);
  registerVariableToBlockly(varName, 'NanoModbus');
  generator.addVariable(varName, 'nmbs_t ' + varName + ';');
  generator.addObject('nmbs_wc_' + varName, 'WiFiClient nmbs_wc_' + varName + ';');

  var code = '';
  code += 'WiFi.begin(' + ssid + ', ' + pass + ');\n';
  code += 'while (WiFi.status() != WL_CONNECTED) { delay(500); }\n';
  code += 'nmbs_wc_' + varName + '.connect(' + ip + ', ' + port + ');\n';
  code += '{\n';
  code += '  nmbs_platform_conf platform_conf;\n';
  code += '  nmbs_platform_conf_create(&platform_conf);\n';
  code += '  platform_conf.transport = NMBS_TRANSPORT_TCP;\n';
  code += '  platform_conf.read = nmbs_read_tcp;\n';
  code += '  platform_conf.write = nmbs_write_tcp;\n';
  code += '  platform_conf.arg = &nmbs_wc_' + varName + ';\n';
  code += '  nmbs_client_create(&' + varName + ', &platform_conf);\n';
  code += '}\n';
  code += 'nmbs_set_read_timeout(&' + varName + ', 1000);\n';

  return code;
};

// Set Destination Address
Arduino.forBlock['nmbs_set_dest_address'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'modbusClient';
  var address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '1';

  generator.addLibrary('nanomodbus', '#include <nanomodbus.h>');

  return 'nmbs_set_destination_rtu_address(&' + varName + ', ' + address + ');\n';
};

// Set Timeout
Arduino.forBlock['nmbs_set_timeout'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'modbusClient';
  var readTimeout = generator.valueToCode(block, 'READ_TIMEOUT', generator.ORDER_ATOMIC) || '1000';
  var byteTimeout = generator.valueToCode(block, 'BYTE_TIMEOUT', generator.ORDER_ATOMIC) || '100';

  generator.addLibrary('nanomodbus', '#include <nanomodbus.h>');

  var code = '';
  code += 'nmbs_set_read_timeout(&' + varName + ', ' + readTimeout + ');\n';
  code += 'nmbs_set_byte_timeout(&' + varName + ', ' + byteTimeout + ');\n';

  return code;
};

// Read Holding Register (FC03)
Arduino.forBlock['nmbs_read_holding_register'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'modbusClient';
  var address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';

  generator.addLibrary('nanomodbus', '#include <nanomodbus.h>');
  nmbs_addClientHelpers(generator);

  return ['nmbs_helper_read_holding(&' + varName + ', ' + address + ')', generator.ORDER_FUNCTION_CALL];
};

// Read Input Register (FC04)
Arduino.forBlock['nmbs_read_input_register'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'modbusClient';
  var address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';

  generator.addLibrary('nanomodbus', '#include <nanomodbus.h>');
  nmbs_addClientHelpers(generator);

  return ['nmbs_helper_read_input(&' + varName + ', ' + address + ')', generator.ORDER_FUNCTION_CALL];
};

// Read Coil (FC01)
Arduino.forBlock['nmbs_read_coil'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'modbusClient';
  var address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';

  generator.addLibrary('nanomodbus', '#include <nanomodbus.h>');
  nmbs_addClientHelpers(generator);

  return ['nmbs_helper_read_coil(&' + varName + ', ' + address + ')', generator.ORDER_FUNCTION_CALL];
};

// Read Discrete Input (FC02)
Arduino.forBlock['nmbs_read_discrete_input'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'modbusClient';
  var address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';

  generator.addLibrary('nanomodbus', '#include <nanomodbus.h>');
  nmbs_addClientHelpers(generator);

  return ['nmbs_helper_read_discrete(&' + varName + ', ' + address + ')', generator.ORDER_FUNCTION_CALL];
};

// Write Single Coil (FC05)
Arduino.forBlock['nmbs_write_single_coil'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'modbusClient';
  var address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || 'false';

  generator.addLibrary('nanomodbus', '#include <nanomodbus.h>');

  return 'nmbs_write_single_coil(&' + varName + ', ' + address + ', ' + value + ');\n';
};

// Write Single Register (FC06)
Arduino.forBlock['nmbs_write_single_register'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'modbusClient';
  var address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';

  generator.addLibrary('nanomodbus', '#include <nanomodbus.h>');

  return 'nmbs_write_single_register(&' + varName + ', ' + address + ', ' + value + ');\n';
};

// ============== Server Blocks ==============

// Server Create
Arduino.forBlock['nmbs_server_create'] = function(block, generator) {
  // Variable rename listener
  if (!block._nmbsVarMonitorAttached) {
    block._nmbsVarMonitorAttached = true;
    block._nmbsVarLastName = block.getFieldValue('VAR') || 'modbusServer';
    registerVariableToBlockly(block._nmbsVarLastName, 'NanoModbus');
    var varField = block.getField('VAR');
    if (varField) {
      var originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        var workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        var oldName = block._nmbsVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'NanoModbus');
          block._nmbsVarLastName = newName;
        }
      };
    }
  }

  var varName = block.getFieldValue('VAR') || 'modbusServer';
  var serialPort = block.getFieldValue('SERIAL') || 'Serial1';
  var baudrate = block.getFieldValue('BAUDRATE') || '9600';
  var address = block.getFieldValue('ADDRESS') || 1;

  generator.addLibrary('nanomodbus', '#include <nanomodbus.h>');
  registerVariableToBlockly(varName, 'NanoModbus');
  nmbs_addSerialCallbacks(generator, serialPort);
  nmbs_addServerModel(generator);
  generator.addVariable(varName, 'nmbs_t ' + varName + ';');

  var code = '';
  code += serialPort + '.begin(' + baudrate + ');\n';
  code += '{\n';
  code += '  nmbs_platform_conf platform_conf;\n';
  code += '  nmbs_platform_conf_create(&platform_conf);\n';
  code += '  platform_conf.transport = NMBS_TRANSPORT_RTU;\n';
  code += '  platform_conf.read = nmbs_read_' + serialPort + ';\n';
  code += '  platform_conf.write = nmbs_write_' + serialPort + ';\n';
  code += '  nmbs_callbacks callbacks;\n';
  code += '  nmbs_callbacks_create(&callbacks);\n';
  code += '  callbacks.read_coils = nmbs_cb_read_coils;\n';
  code += '  callbacks.write_single_coil = nmbs_cb_write_single_coil;\n';
  code += '  callbacks.write_multiple_coils = nmbs_cb_write_multi_coils;\n';
  code += '  callbacks.read_holding_registers = nmbs_cb_read_holding_regs;\n';
  code += '  callbacks.write_single_register = nmbs_cb_write_single_reg;\n';
  code += '  callbacks.write_multiple_registers = nmbs_cb_write_multi_regs;\n';
  code += '  callbacks.read_discrete_inputs = nmbs_cb_read_discrete_inputs;\n';
  code += '  callbacks.read_input_registers = nmbs_cb_read_input_regs;\n';
  code += '  nmbs_server_create(&' + varName + ', ' + address + ', &platform_conf, &callbacks);\n';
  code += '}\n';
  code += 'nmbs_set_read_timeout(&' + varName + ', 1000);\n';
  code += 'nmbs_set_byte_timeout(&' + varName + ', 100);\n';

  return code;
};

// Server Poll (RTU)
Arduino.forBlock['nmbs_server_poll'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'modbusServer';

  generator.addLibrary('nanomodbus', '#include <nanomodbus.h>');

  return 'nmbs_server_poll(&' + varName + ');\n';
};

// TCP Server Create
Arduino.forBlock['nmbs_server_tcp_create'] = function(block, generator) {
  // Variable rename listener
  if (!block._nmbsVarMonitorAttached) {
    block._nmbsVarMonitorAttached = true;
    block._nmbsVarLastName = block.getFieldValue('VAR') || 'modbusServer';
    registerVariableToBlockly(block._nmbsVarLastName, 'NanoModbus');
    var varField = block.getField('VAR');
    if (varField) {
      var originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        var workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        var oldName = block._nmbsVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'NanoModbus');
          block._nmbsVarLastName = newName;
        }
      };
    }
  }

  var varName = block.getFieldValue('VAR') || 'modbusServer';
  var ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '"your_ssid"';
  var pass = generator.valueToCode(block, 'PASS', generator.ORDER_ATOMIC) || '"your_password"';
  var port = block.getFieldValue('PORT') || 502;

  generator.addLibrary('nanomodbus', '#include <nanomodbus.h>');
  nmbs_ensureWiFiLib(generator);
  nmbs_addTcpCallbacks(generator);
  nmbs_addServerModel(generator);
  nmbs_addTcpServerPollHelper(generator);
  registerVariableToBlockly(varName, 'NanoModbus');
  generator.addVariable(varName, 'nmbs_t ' + varName + ';');
  generator.addObject('nmbs_ws_' + varName, 'WiFiServer nmbs_ws_' + varName + '(' + port + ');');
  generator.addObject('nmbs_wcc_' + varName, 'WiFiClient nmbs_wcc_' + varName + ';');

  var code = '';
  code += 'WiFi.begin(' + ssid + ', ' + pass + ');\n';
  code += 'while (WiFi.status() != WL_CONNECTED) { delay(500); }\n';
  code += 'nmbs_ws_' + varName + '.begin();\n';
  code += '{\n';
  code += '  nmbs_platform_conf platform_conf;\n';
  code += '  nmbs_platform_conf_create(&platform_conf);\n';
  code += '  platform_conf.transport = NMBS_TRANSPORT_TCP;\n';
  code += '  platform_conf.read = nmbs_read_tcp;\n';
  code += '  platform_conf.write = nmbs_write_tcp;\n';
  code += '  platform_conf.arg = &nmbs_wcc_' + varName + ';\n';
  code += '  nmbs_callbacks callbacks;\n';
  code += '  nmbs_callbacks_create(&callbacks);\n';
  code += '  callbacks.read_coils = nmbs_cb_read_coils;\n';
  code += '  callbacks.write_single_coil = nmbs_cb_write_single_coil;\n';
  code += '  callbacks.write_multiple_coils = nmbs_cb_write_multi_coils;\n';
  code += '  callbacks.read_holding_registers = nmbs_cb_read_holding_regs;\n';
  code += '  callbacks.write_single_register = nmbs_cb_write_single_reg;\n';
  code += '  callbacks.write_multiple_registers = nmbs_cb_write_multi_regs;\n';
  code += '  callbacks.read_discrete_inputs = nmbs_cb_read_discrete_inputs;\n';
  code += '  callbacks.read_input_registers = nmbs_cb_read_input_regs;\n';
  code += '  nmbs_server_create(&' + varName + ', 0, &platform_conf, &callbacks);\n';
  code += '}\n';
  code += 'nmbs_set_read_timeout(&' + varName + ', 1000);\n';

  return code;
};

// TCP Server Poll
Arduino.forBlock['nmbs_server_tcp_poll'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'modbusServer';

  generator.addLibrary('nanomodbus', '#include <nanomodbus.h>');

  return 'nmbs_tcp_server_poll(&' + varName + ', &nmbs_ws_' + varName + ', &nmbs_wcc_' + varName + ');\n';
};

// Server Set Coil
Arduino.forBlock['nmbs_server_set_coil'] = function(block, generator) {
  var address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || 'false';

  generator.addLibrary('nanomodbus', '#include <nanomodbus.h>');

  return 'nmbs_bitfield_write(nmbs_srv_coils, ' + address + ', ' + value + ');\n';
};

// Server Get Coil
Arduino.forBlock['nmbs_server_get_coil'] = function(block, generator) {
  var address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';

  generator.addLibrary('nanomodbus', '#include <nanomodbus.h>');

  return ['nmbs_bitfield_read(nmbs_srv_coils, ' + address + ')', generator.ORDER_FUNCTION_CALL];
};

// Server Set Register
Arduino.forBlock['nmbs_server_set_register'] = function(block, generator) {
  var address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';

  generator.addLibrary('nanomodbus', '#include <nanomodbus.h>');

  return 'nmbs_srv_holding_regs[' + address + '] = ' + value + ';\n';
};

// Server Get Register
Arduino.forBlock['nmbs_server_get_register'] = function(block, generator) {
  var address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';

  generator.addLibrary('nanomodbus', '#include <nanomodbus.h>');

  return ['nmbs_srv_holding_regs[' + address + ']', generator.ORDER_MEMBER];
};

// Server Set Input Register
Arduino.forBlock['nmbs_server_set_input_register'] = function(block, generator) {
  var address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';

  generator.addLibrary('nanomodbus', '#include <nanomodbus.h>');

  return 'nmbs_srv_input_regs[' + address + '] = ' + value + ';\n';
};

// Server Get Input Register
Arduino.forBlock['nmbs_server_get_input_register'] = function(block, generator) {
  var address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';

  generator.addLibrary('nanomodbus', '#include <nanomodbus.h>');

  return ['nmbs_srv_input_regs[' + address + ']', generator.ORDER_MEMBER];
};

// Server Set Discrete Input
Arduino.forBlock['nmbs_server_set_discrete_input'] = function(block, generator) {
  var address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || 'false';

  generator.addLibrary('nanomodbus', '#include <nanomodbus.h>');

  return 'nmbs_bitfield_write(nmbs_srv_discrete_inputs, ' + address + ', ' + value + ');\n';
};

// Server Get Discrete Input
Arduino.forBlock['nmbs_server_get_discrete_input'] = function(block, generator) {
  var address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';

  generator.addLibrary('nanomodbus', '#include <nanomodbus.h>');

  return ['nmbs_bitfield_read(nmbs_srv_discrete_inputs, ' + address + ')', generator.ORDER_FUNCTION_CALL];
};

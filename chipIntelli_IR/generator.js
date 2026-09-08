'use strict';

function ensureChipIntelliIR(generator) {
  generator.addLibrary('chipintelli_ir', '#include <ChipIntelliIR.h>');
}

function ensureChipIntelliIRDatabase(generator) {
  ensureChipIntelliIR(generator);
  generator.addMacro('chipintelli_ir_database', '#define CHIPINTELLI_IR_DATABASE 1');
}

function chipIntelliIRValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function ensureChipIntelliIRRawBuffer(generator) {
  ensureChipIntelliIR(generator);
  generator.addVariable('chipintelli_ir_raw_buffer',
    'uint32_t ailyChipIntelliIRRaw[ChipIntelliIRClass::MaxRawEntries] = {};');
  generator.addVariable('chipintelli_ir_raw_count', 'size_t ailyChipIntelliIRRawCount = 0;');
}

function ensureChipIntelliIRRawParser(generator) {
  ensureChipIntelliIRRawBuffer(generator);
  generator.addFunction('chipintelli_ir_parse_raw',
    'bool ailyChipIntelliIRParseRaw(const String &text) {\n' +
    '  ailyChipIntelliIRRawCount = 0;\n' +
    '  size_t parsedCount = 0;\n' +
    '  uint32_t value = 0;\n' +
    '  bool hasValue = false;\n' +
    '  for (size_t index = 0; index <= text.length(); ++index) {\n' +
    '    const char c = index < text.length() ? text[index] : \'\\0\';\n' +
    '    if (c >= \'0\' && c <= \'9\') {\n' +
    '      value = value * 10U + (uint32_t)(c - \'0\');\n' +
    '      if (value > ChipIntelliIRClass::MaxRawDurationUs) return false;\n' +
    '      hasValue = true;\n' +
    '      continue;\n' +
    '    }\n' +
    '    const bool separator = c == \'\\0\' || c == \',\' || c == \';\' || c == \' \' || c == \'\\t\' || c == \'\\r\' || c == \'\\n\';\n' +
    '    if (!separator) return false;\n' +
    '    if (hasValue) {\n' +
    '      if (value < 200U || parsedCount >= ChipIntelliIRClass::MaxRawEntries) return false;\n' +
    '      ailyChipIntelliIRRaw[parsedCount++] = value;\n' +
    '      value = 0;\n' +
    '      hasValue = false;\n' +
    '    }\n' +
    '  }\n' +
    '  ailyChipIntelliIRRawCount = parsedCount;\n' +
    '  return parsedCount > 0;\n' +
    '}\n');
  generator.addFunction('chipintelli_ir_send_raw_text',
    'bool ailyChipIntelliIRSendRawText(const String &text) {\n' +
    '  return ailyChipIntelliIRParseRaw(text) &&\n' +
    '         ChipIntelliIR.sendRaw(ailyChipIntelliIRRaw, ailyChipIntelliIRRawCount);\n' +
    '}\n');
}

function ensureChipIntelliIRRawText(generator) {
  ensureChipIntelliIRRawBuffer(generator);
  generator.addFunction('chipintelli_ir_raw_text',
    'String ailyChipIntelliIRRawText() {\n' +
    '  String text;\n' +
    '  text.reserve(ailyChipIntelliIRRawCount * 7U);\n' +
    '  for (size_t index = 0; index < ailyChipIntelliIRRawCount; ++index) {\n' +
    '    if (index != 0) text += \',\';\n' +
    '    text += ailyChipIntelliIRRaw[index];\n' +
    '  }\n' +
    '  return text;\n' +
    '}\n');
}

function ensureChipIntelliIRSearch(generator) {
  ensureChipIntelliIR(generator);
  generator.addVariable('chipintelli_ir_search_pending', 'volatile bool ailyChipIntelliIRSearchPending = false;');
  generator.addVariable('chipintelli_ir_search_event', 'volatile uint8_t ailyChipIntelliIRSearchEvent = 0;');
  generator.addVariable('chipintelli_ir_search_code', 'volatile int32_t ailyChipIntelliIRSearchCode = -1;');
  generator.addFunction('chipintelli_ir_search_callback',
    'void ailyChipIntelliIRSearchCallback(ChipIntelliIRClass::AirSearchEvent event, int32_t codeId, void *context) {\n' +
    '  (void)context;\n' +
    '  ailyChipIntelliIRSearchEvent = static_cast<uint8_t>(event);\n' +
    '  ailyChipIntelliIRSearchCode = codeId;\n' +
    '  ailyChipIntelliIRSearchPending = true;\n' +
    '}\n');
}

function ensureChipIntelliIRNECResult(generator) {
  ensureChipIntelliIRRawBuffer(generator);
  generator.addVariable('chipintelli_ir_nec_result',
    'ChipIntelliIRClass::NECDecodeResult ailyChipIntelliIRNECResult;');
}

function chipIntelliIRWaitUntilIdle(block, generator) {
  ensureChipIntelliIR(generator);
  generator.addFunction('chipintelli_ir_wait_until_idle',
    'bool ailyChipIntelliIRWaitUntilIdle(int64_t timeoutMs) {\n' +
    '  const uint32_t timeout = timeoutMs < 0 ? 0U :\n' +
    '    (timeoutMs > INT32_MAX ? (uint32_t)INT32_MAX : (uint32_t)timeoutMs);\n' +
    '  return ChipIntelliIR.waitUntilIdle(timeout);\n' +
    '}\n');
  const timeout = chipIntelliIRValue(block, generator, 'TIMEOUT', '30000');
  return 'ailyChipIntelliIRWaitUntilIdle(' + timeout + ')';
}

Arduino.forBlock['chipintelli_ir_init_default'] = function(block, generator) {
  if (block.getFieldValue('MODE') === 'AirConditioner') {
    ensureChipIntelliIRDatabase(generator);
    return 'ChipIntelliIR.beginAirConditioner();\n';
  }
  ensureChipIntelliIR(generator);
  return 'ChipIntelliIR.begin();\n';
};

Arduino.forBlock['chipintelli_ir_init_raw'] = function(block, generator) {
  ensureChipIntelliIR(generator);
  const tx = chipIntelliIRValue(block, generator, 'TX_PIN', 'ChipIntelliIRClass::DefaultTransmitPin');
  const rx = chipIntelliIRValue(block, generator, 'RX_PIN', 'ChipIntelliIRClass::DefaultReceivePin');
  const timer = ['0', '1', '2'].indexOf(block.getFieldValue('TIMER')) >= 0 ? block.getFieldValue('TIMER') : '2';
  return 'ChipIntelliIR.begin((uint8_t)(' + tx + '), (uint8_t)(' + rx + '), ' + timer + ');\n';
};

Arduino.forBlock['chipintelli_ir_init_air'] = function(block, generator) {
  ensureChipIntelliIRDatabase(generator);
  const tx = chipIntelliIRValue(block, generator, 'TX_PIN', 'ChipIntelliIRClass::DefaultTransmitPin');
  const rx = chipIntelliIRValue(block, generator, 'RX_PIN', 'ChipIntelliIRClass::DefaultReceivePin');
  const resource = chipIntelliIRValue(block, generator, 'RESOURCE_ID', '50000');
  const timer = ['0', '1', '2'].indexOf(block.getFieldValue('TIMER')) >= 0 ? block.getFieldValue('TIMER') : '2';
  return 'ChipIntelliIR.beginAirConditioner((uint8_t)(' + tx + '), (uint8_t)(' + rx + '), ' + timer + ', (uint16_t)(' + resource + '));\n';
};

Arduino.forBlock['chipintelli_ir_send_raw'] = function(block, generator) {
  ensureChipIntelliIRRawParser(generator);
  const durations = chipIntelliIRValue(block, generator, 'DURATIONS', '"9000,4500,560,560"');
  return 'ailyChipIntelliIRSendRawText(String(' + durations + '));\n';
};

Arduino.forBlock['chipintelli_ir_send_nec'] = function(block, generator) {
  ensureChipIntelliIR(generator);
  const address = chipIntelliIRValue(block, generator, 'ADDRESS', '16');
  const command = chipIntelliIRValue(block, generator, 'COMMAND', '32');
  const repeats = chipIntelliIRValue(block, generator, 'REPEATS', '0');
  return 'ChipIntelliIR.sendNEC((uint8_t)(' + address + '), (uint8_t)(' + command + '), (uint8_t)constrain((int)(' + repeats + '), 0, 239));\n';
};

Arduino.forBlock['chipintelli_ir_send_extended_nec'] = function(block, generator) {
  ensureChipIntelliIR(generator);
  const address = chipIntelliIRValue(block, generator, 'ADDRESS', '13483');
  const command = chipIntelliIRValue(block, generator, 'COMMAND', '32');
  const repeats = chipIntelliIRValue(block, generator, 'REPEATS', '0');
  return 'ChipIntelliIR.sendExtendedNEC((uint16_t)(' + address + '), (uint8_t)(' + command + '), (uint8_t)constrain((int)(' + repeats + '), 0, 239));\n';
};

Arduino.forBlock['chipintelli_ir_start_receive'] = function(block, generator) {
  ensureChipIntelliIR(generator);
  const timeout = chipIntelliIRValue(block, generator, 'TIMEOUT', '5000');
  return 'ChipIntelliIR.startReceive((uint32_t)constrain((long)(' + timeout + '), 1L, 60000L));\n';
};

Arduino.forBlock['chipintelli_ir_stop_receive'] = function(block, generator) {
  ensureChipIntelliIR(generator);
  return 'ChipIntelliIR.stopReceive();\n';
};

Arduino.forBlock['chipintelli_ir_read_received'] = function(block, generator) {
  ensureChipIntelliIRRawBuffer(generator);
  const handler = generator.statementToCode(block, 'HANDLER') || '';
  return 'if (ChipIntelliIR.receiveStatus() == ChipIntelliIRClass::ReceiveStatus::Ready &&\n' +
    '    ChipIntelliIR.readRaw(ailyChipIntelliIRRaw, ChipIntelliIRClass::MaxRawEntries, ailyChipIntelliIRRawCount)) {\n' +
    handler + '}\n';
};

Arduino.forBlock['chipintelli_ir_replay_received'] = function(block, generator) {
  ensureChipIntelliIRRawBuffer(generator);
  return 'if (ailyChipIntelliIRRawCount != 0) {\n' +
    '  ChipIntelliIR.sendRaw(ailyChipIntelliIRRaw, ailyChipIntelliIRRawCount);\n' +
    '}\n';
};

Arduino.forBlock['chipintelli_ir_received_count'] = function(block, generator) {
  ensureChipIntelliIRRawBuffer(generator);
  return ['ailyChipIntelliIRRawCount', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_ir_received_text'] = function(block, generator) {
  ensureChipIntelliIRRawText(generator);
  return ['ailyChipIntelliIRRawText()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_ir_decode_nec'] = function(block, generator) {
  ensureChipIntelliIRNECResult(generator);
  generator.addFunction('chipintelli_ir_nec_tolerance',
    'static constexpr uint8_t ailyChipIntelliIRNECTolerance(int64_t percent) {\n' +
    '  return percent < 0 ? 0 : (percent > ChipIntelliIRClass::MaximumNECTolerancePercent ?\n' +
    '    ChipIntelliIRClass::MaximumNECTolerancePercent : static_cast<uint8_t>(percent));\n' +
    '}\n');
  const tolerance = chipIntelliIRValue(block, generator, 'TOLERANCE', '25');
  const handler = generator.statementToCode(block, 'HANDLER') || '';
  return 'if (ChipIntelliIRClass::decodeNEC(ailyChipIntelliIRRaw, ailyChipIntelliIRRawCount,\n' +
    '    ailyChipIntelliIRNECResult, ailyChipIntelliIRNECTolerance(' + tolerance + '))) {\n' +
    handler + '}\n';
};

Arduino.forBlock['chipintelli_ir_nec_field'] = function(block, generator) {
  ensureChipIntelliIRNECResult(generator);
  const selected = block.getFieldValue('FIELD');
  const field = ['type', 'address', 'command', 'repeatCount'].indexOf(selected) >= 0 ? selected : 'type';
  const code = 'ailyChipIntelliIRNECResult.' + field;
  return [field === 'type' ? 'static_cast<uint8_t>(' + code + ')' : code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_ir_nec_frame_type'] = function(block, generator) {
  const value = block.getFieldValue('FRAME_TYPE');
  return [['0', '1', '2', '3'].indexOf(value) >= 0 ? value : '0', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_ir_receive_status'] = function(block, generator) {
  ensureChipIntelliIR(generator);
  return ['static_cast<uint8_t>(ChipIntelliIR.receiveStatus())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_ir_receive_status_value'] = function(block, generator) {
  const value = block.getFieldValue('STATUS');
  return [['0', '1', '2', '3', '4'].indexOf(value) >= 0 ? value : '0', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_ir_is_busy'] = function(block, generator) {
  ensureChipIntelliIR(generator);
  return ['ChipIntelliIR.isBusy()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_ir_wait_until_idle'] = function(block, generator) {
  return chipIntelliIRWaitUntilIdle(block, generator) + ';\n';
};

Arduino.forBlock['chipintelli_ir_wait_until_idle_result'] = function(block, generator) {
  return [chipIntelliIRWaitUntilIdle(block, generator), generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_ir_select_air_brand'] = function(block, generator) {
  ensureChipIntelliIR(generator);
  const brands = ['LG', 'Gree', 'Midea', 'Aux', 'Haier', 'Changhong', 'Chigo', 'TCL', 'Hisense', 'Panasonic',
    'GreeMideaAuxHaierChanghong', 'Hitachi', 'Daikin', 'Mitsubishi', 'Xiaomi', 'Whirlpool', 'Galanz', 'Fujitsu',
    'Sanshui', 'York', 'Skyworth', 'Shinco', 'Chunlan', 'Cheblo', 'Samsung', 'Aucma', 'Xinfei', 'Toshiba',
    'Sampo', 'Yuetu', 'Yair', 'Amoi', 'Sharp', 'Konka', 'Rongshida', 'Toyo'];
  const selected = block.getFieldValue('BRAND');
  const brand = brands.indexOf(selected) >= 0 ? selected : 'Gree';
  return 'ChipIntelliIR.selectAirBrand(ChipIntelliIRClass::AirBrand::' + brand + ');\n';
};

Arduino.forBlock['chipintelli_ir_select_air_code'] = function(block, generator) {
  ensureChipIntelliIR(generator);
  const codeId = chipIntelliIRValue(block, generator, 'CODE_ID', '0');
  return 'ChipIntelliIR.selectAirCode((uint32_t)(' + codeId + '));\n';
};

Arduino.forBlock['chipintelli_ir_air_code'] = function(block, generator) {
  ensureChipIntelliIR(generator);
  return ['ChipIntelliIR.airCode()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_ir_air_send_status'] = function(block, generator) {
  ensureChipIntelliIR(generator);
  return ['static_cast<uint8_t>(ChipIntelliIR.airSendStatus())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_ir_air_send_status_value'] = function(block, generator) {
  const value = block.getFieldValue('STATUS');
  return [['0', '1', '2', '3', '4'].indexOf(value) >= 0 ? value : '0', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_ir_send_air_command'] = function(block, generator) {
  ensureChipIntelliIR(generator);
  const commands = [
    'PowerOn', 'PowerOff', 'FanHigh', 'FanMedium', 'FanLow', 'FanAuto', 'SwingStop', 'SwingStart',
    'SwingVertical', 'SwingHorizontal', 'SwingVerticalStop', 'SwingHorizontalStop', 'TemperatureUp',
    'TemperatureDown', 'FanUp', 'FanDown', 'ModeCool', 'ModeHeat', 'ModeFan', 'ModeDry', 'ModeAuto',
    'ElectricHeatOn', 'ElectricHeatOff', 'EnergySavingOn', 'EnergySavingOff', 'SleepOff', 'SleepMode1',
    'SleepMode2', 'SleepMode3', 'AirCleanOff', 'AirCleanOn', 'HealthOff', 'HealthOn', 'DisplayOff',
    'DisplayOn', 'MuteOff', 'MuteOn', 'PowerfulOff', 'PowerfulOn', 'FollowMeOff', 'FollowMeOn',
    'FreshAirOff', 'FreshAirOn', 'WindToPersonOff', 'WindToPersonOn'
  ];
  const selected = block.getFieldValue('COMMAND');
  const command = commands.indexOf(selected) >= 0 ? selected : 'PowerOn';
  return 'ChipIntelliIR.sendAir(ChipIntelliIRClass::AirCommand::' + command + ');\n';
};

Arduino.forBlock['chipintelli_ir_set_air_temperature'] = function(block, generator) {
  ensureChipIntelliIR(generator);
  const temperature = chipIntelliIRValue(block, generator, 'TEMPERATURE', '26');
  return 'ChipIntelliIR.setTemperature((uint8_t)constrain((int)(' + temperature + '), 16, 30));\n';
};

Arduino.forBlock['chipintelli_ir_air_power'] = function(block, generator) {
  ensureChipIntelliIR(generator);
  const power = block.getFieldValue('POWER') === 'false' ? 'false' : 'true';
  return 'ChipIntelliIR.power(' + power + ');\n';
};

Arduino.forBlock['chipintelli_ir_start_air_search'] = function(block, generator) {
  ensureChipIntelliIRSearch(generator);
  const searchType = block.getFieldValue('SEARCH_TYPE') === 'CurrentBrandModels' ? 'CurrentBrandModels' : 'AllBrands';
  const sendCount = chipIntelliIRValue(block, generator, 'SEND_COUNT', '3');
  const interval = chipIntelliIRValue(block, generator, 'INTERVAL', '3000');
  return 'ChipIntelliIR.startAirSearch(ChipIntelliIRClass::AirSearchType::' + searchType +
    ', ailyChipIntelliIRSearchCallback, nullptr, (uint8_t)constrain((int)(' + sendCount +
    '), 3, 255), (uint32_t)constrain((long)(' + interval + '), 3000L, 2147483647L));\n';
};

Arduino.forBlock['chipintelli_ir_stop_air_search'] = function(block, generator) {
  ensureChipIntelliIR(generator);
  return 'ChipIntelliIR.stopAirSearch();\n';
};

Arduino.forBlock['chipintelli_ir_read_air_search_event'] = function(block, generator) {
  ensureChipIntelliIRSearch(generator);
  const handler = generator.statementToCode(block, 'HANDLER') || '';
  return 'if (ailyChipIntelliIRSearchPending) {\n' +
    '  ailyChipIntelliIRSearchPending = false;\n' + handler + '}\n';
};

Arduino.forBlock['chipintelli_ir_air_search_event'] = function(block, generator) {
  ensureChipIntelliIRSearch(generator);
  return ['ailyChipIntelliIRSearchEvent', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_ir_air_search_code'] = function(block, generator) {
  ensureChipIntelliIRSearch(generator);
  return ['ailyChipIntelliIRSearchCode', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_ir_air_search_event_value'] = function(block, generator) {
  const value = block.getFieldValue('EVENT');
  return [['0', '1', '2'].indexOf(value) >= 0 ? value : '0', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_ir_mode'] = function(block, generator) {
  ensureChipIntelliIR(generator);
  return ['static_cast<uint8_t>(ChipIntelliIR.mode())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_ir_last_error'] = function(block, generator) {
  ensureChipIntelliIR(generator);
  return ['static_cast<uint8_t>(ChipIntelliIR.lastError())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_ir_error_string'] = function(block, generator) {
  ensureChipIntelliIR(generator);
  return ['String(ChipIntelliIR.errorString())', generator.ORDER_ATOMIC];
};

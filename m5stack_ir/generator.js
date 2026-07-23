'use strict';

function m5stackIRBoardName() {
  const config = (typeof window !== 'undefined' && window['boardConfig']) ? window['boardConfig'] : {};
  return String(config.name || config.board || '').toLowerCase();
}

function m5stackIRPin() {
  const name = m5stackIRBoardName();
  if (name.indexOf('stickcplus2') >= 0 || name.indexOf('stickc_plus2') >= 0) return 19;
  if (name.indexOf('stickcplus') >= 0 || name.indexOf('stickc_plus') >= 0) return 9;
  if (name.indexOf('stickc') >= 0) return 9;
  if (name.indexOf('cardputer') >= 0) return 44;
  if (name.indexOf('nanoc6') >= 0) return 3;
  if (name.indexOf('capsule') >= 0) return 4;
  if (name.indexOf('atom') >= 0) return 12;
  return -1;
}

function ensureM5StackIR(generator) {
  const pin = m5stackIRPin();
  generator.addLibrary('irremote_include', '#include <IRremote.hpp>');
  generator.addSetupBegin('irremote_sender_begin', 'IrSender.begin(' + pin + ', DISABLE_LED_FEEDBACK);');
}

function m5stackIRValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC || Arduino.ORDER_ATOMIC) || fallback;
}

function ensureM5StackIRRaw(generator) {
  generator.addFunction('aily_m5_ir_parse_raw',
    'bool ailyM5IRParseRaw(const String& text, uint16_t* timings, uint16_t& count) {\n' +
    '  count = 0; uint32_t value = 0; bool hasValue = false;\n' +
    '  for (size_t i = 0; i <= text.length(); ++i) {\n' +
    '    char c = i < text.length() ? text[i] : \'\\0\';\n' +
    '    if (c >= \'0\' && c <= \'9\') { value = value * 10 + (c - \'0\'); if (value > 65535) return false; hasValue = true; continue; }\n' +
    '    bool separator = c == \'\\0\' || c == \',\' || c == \';\' || c == \' \' || c == \'\\t\' || c == \'\\r\' || c == \'\\n\';\n' +
    '    if (!separator) return false;\n' +
    '    if (hasValue) { if (!value || count >= 256) return false; timings[count++] = (uint16_t)value; value = 0; hasValue = false; }\n' +
    '  }\n' +
    '  return count > 0;\n' +
    '}\n');
  generator.addFunction('aily_m5_ir_send_raw',
    'bool ailyM5IRSendRaw(const String& text, int frequency, int repeatPeriod, int repeats) {\n' +
    '  static uint16_t timings[256]; uint16_t count = 0;\n' +
    '  if (!ailyM5IRParseRaw(text, timings, count)) return false;\n' +
    '  uint8_t khz = (uint8_t)constrain(frequency, 20, 60); repeats = constrain(repeats, 0, 127);\n' +
    '  if (repeats > 0) { if (repeatPeriod <= 0) return false; IrSender.sendRaw(timings, count, khz, (uint16_t)constrain(repeatPeriod, 1, 65535), (int_fast8_t)repeats); }\n' +
    '  else IrSender.sendRaw(timings, count, khz);\n' +
    '  return true;\n' +
    '}\n');
}

function ensureM5StackIRPronto(generator) {
  generator.addFunction('aily_m5_ir_send_pronto',
    'bool ailyM5IRSendPronto(const String& input, int repeats) {\n' +
    '  String code = input; code.trim(); if (!code.length()) return false;\n' +
    '  String normalized; if (!normalized.reserve(code.length())) return false; uint16_t preamble[4] = {0, 0, 0, 0}; uint16_t words = 0;\n' +
    '  for (size_t i = 0; i < code.length();) {\n' +
    '    while (i < code.length() && (code[i] == \' \' || code[i] == \'\\t\' || code[i] == \'\\r\' || code[i] == \'\\n\')) ++i;\n' +
    '    if (i >= code.length()) break; if (words >= 256) return false;\n' +
    '    size_t start = i; uint16_t value = 0; uint8_t digits = 0;\n' +
    '    while (i < code.length()) { char c = code[i]; uint8_t nibble;\n' +
    '      if (c >= \'0\' && c <= \'9\') nibble = c - \'0\'; else if (c >= \'A\' && c <= \'F\') nibble = c - \'A\' + 10; else if (c >= \'a\' && c <= \'f\') nibble = c - \'a\' + 10; else break;\n' +
    '      if (++digits > 4) return false; value = (uint16_t)((value << 4) | nibble); ++i;\n' +
    '    }\n' +
    '    if (digits != 4 || (i < code.length() && code[i] != \' \' && code[i] != \'\\t\' && code[i] != \'\\r\' && code[i] != \'\\n\')) return false;\n' +
    '    if (words) normalized += \' \'; normalized += code.substring(start, start + 4); if (words < 4) preamble[words] = value; ++words;\n' +
    '  }\n' +
    '  if (words < 4 || (preamble[0] != 0x0000 && preamble[0] != 0x0100) || preamble[1] == 0) return false;\n' +
    '  uint32_t expected = 4UL + 2UL * ((uint32_t)preamble[2] + preamble[3]); if (expected != words || expected == 4) return false;\n' +
    '  IrSender.sendPronto(normalized.c_str(), (int_fast8_t)constrain(repeats, 0, 127)); return true;\n' +
    '}\n');
}

Arduino.forBlock['m5stack_ir_init'] = function(block, generator) {
  ensureM5StackIR(generator);
  return '';
};

Arduino.forBlock['m5stack_ir_send'] = function(block, generator) {
  ensureM5StackIR(generator);
  const supported = [
    'NEC', 'NEC2', 'SAMSUNG', 'SAMSUNG48', 'SAMSUNGLG', 'SONY', 'PANASONIC',
    'DENON', 'SHARP', 'LG', 'JVC', 'RC5', 'RC6', 'KASEIKYO_JVC',
    'KASEIKYO_DENON', 'KASEIKYO_SHARP', 'KASEIKYO_MITSUBISHI', 'ONKYO',
    'APPLE', 'BOSEWAVE', 'FAST', 'LEGO_PF', 'OPENLASIR'
  ];
  const selected = block.getFieldValue('PROTOCOL') || 'NEC';
  const protocol = supported.indexOf(selected) >= 0 ? selected : 'NEC';
  const address = m5stackIRValue(block, generator, 'ADDRESS', '0');
  const command = m5stackIRValue(block, generator, 'COMMAND', '0');
  const repeats = m5stackIRValue(block, generator, 'REPEATS', '0');
  return 'IrSender.write(' + protocol + ', (uint16_t)(' + address + '), (uint16_t)(' + command + '), (int_fast8_t)constrain((int)(' + repeats + '), -1, 127));\n';
};

Arduino.forBlock['m5stack_ir_send_repeat_frame'] = function(block, generator) {
  ensureM5StackIR(generator);
  const methods = { NEC: 'sendNECRepeat', LG: 'sendLGRepeat', SAMSUNGLG: 'sendSamsungLGRepeat', OPENLASIR: 'sendOpenLASIRRepeat' };
  const method = methods[block.getFieldValue('PROTOCOL')] || methods.NEC;
  return 'IrSender.' + method + '();\n';
};

Arduino.forBlock['m5stack_ir_send_pronto'] = function(block, generator) {
  ensureM5StackIR(generator); ensureM5StackIRPronto(generator);
  const code = m5stackIRValue(block, generator, 'CODE', '""');
  const repeats = m5stackIRValue(block, generator, 'REPEATS', '0');
  return ['ailyM5IRSendPronto(String(' + code + '), ' + repeats + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_ir_send_raw'] = function(block, generator) {
  ensureM5StackIR(generator); ensureM5StackIRRaw(generator);
  const data = m5stackIRValue(block, generator, 'DATA', '""');
  const frequency = m5stackIRValue(block, generator, 'FREQUENCY', '38');
  return ['ailyM5IRSendRaw(String(' + data + '), ' + frequency + ', 0, 0)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_ir_send_raw_repeat'] = function(block, generator) {
  ensureM5StackIR(generator); ensureM5StackIRRaw(generator);
  const data = m5stackIRValue(block, generator, 'DATA', '""');
  const frequency = m5stackIRValue(block, generator, 'FREQUENCY', '38');
  const period = m5stackIRValue(block, generator, 'PERIOD', '110');
  const repeats = m5stackIRValue(block, generator, 'REPEATS', '1');
  return ['ailyM5IRSendRaw(String(' + data + '), ' + frequency + ', ' + period + ', ' + repeats + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_ir_send_pulse_distance'] = function(block, generator) {
  ensureM5StackIR(generator);
  const value = function(name, fallback) { return m5stackIRValue(block, generator, name, fallback); };
  const order = block.getFieldValue('ORDER') === 'MSB' ? 'PROTOCOL_IS_MSB_FIRST' : 'PROTOCOL_IS_LSB_FIRST';
  return 'IrSender.sendPulseDistanceWidth(' +
    '(uint8_t)constrain((int)(' + value('FREQUENCY', '38') + '), 20, 60), ' +
    '(uint16_t)(' + value('HEADER_MARK', '9000') + '), (uint16_t)(' + value('HEADER_SPACE', '4500') + '), ' +
    '(uint16_t)(' + value('ONE_MARK', '560') + '), (uint16_t)(' + value('ONE_SPACE', '1690') + '), ' +
    '(uint16_t)(' + value('ZERO_MARK', '560') + '), (uint16_t)(' + value('ZERO_SPACE', '560') + '), ' +
    '(IRDecodedRawDataType)(' + value('DATA', '0') + '), ' +
    '(uint8_t)constrain((int)(' + value('BITS', '32') + '), 1, (int)(sizeof(IRDecodedRawDataType) * 8)), ' +
    order + ', (uint16_t)constrain((int)(' + value('PERIOD', '110') + '), 0, 65535), ' +
    '(int_fast8_t)constrain((int)(' + value('REPEATS', '0') + '), 0, 127));\n';
};

Arduino.forBlock['m5stack_ir_send_biphase'] = function(block, generator) {
  ensureM5StackIR(generator);
  const frequency = m5stackIRValue(block, generator, 'FREQUENCY', '36');
  const unit = m5stackIRValue(block, generator, 'TIME_UNIT', '889');
  const data = m5stackIRValue(block, generator, 'DATA', '0');
  const bits = m5stackIRValue(block, generator, 'BITS', '14');
  const start = block.getFieldValue('START_BIT') === 'FALSE' ? 'false' : 'true';
  return 'IrSender.enableIROut((uint8_t)constrain((int)(' + frequency + '), 20, 60));\n' +
    'IrSender.sendBiphaseData((uint16_t)(' + unit + '), (uint32_t)(' + data + '), (uint8_t)constrain((int)(' + bits + '), 1, 32), ' + start + ');\n';
};

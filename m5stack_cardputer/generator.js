'use strict';

function ensureM5Cardputer(generator) {
  if (typeof ensureM5StackDevice === 'function') {
    ensureM5StackDevice(generator);
    return;
  }
  generator.addLibrary('m5stack_cardputer', '#include <M5Cardputer.h>');
  generator.addSetupBegin('m5stack_device_begin', 'auto ailyM5Config = M5.config();\nM5Cardputer.begin(ailyM5Config, true);');
  generator.addLoopBegin('m5stack_device_update', 'M5Cardputer.update();');
}

Arduino.forBlock['m5cardputer_keyboard_init'] = function(block, generator) {
  ensureM5Cardputer(generator);
  return '';
};

Arduino.forBlock['m5cardputer_keyboard_any'] = function(block, generator) {
  ensureM5Cardputer(generator);
  return ['(M5Cardputer.Keyboard.isPressed() > 0)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5cardputer_keyboard_changed'] = function(block, generator) {
  ensureM5Cardputer(generator);
  generator.addFunction('aily_m5cardputer_keyboard_changed',
    'bool ailyM5CardputerKeyboardChanged() {\n' +
    '  String current;\n' +
    '  for (const auto& key : M5Cardputer.Keyboard.keyList()) {\n' +
    '    current += String(key.x); current += ","; current += String(key.y); current += ";";\n' +
    '  }\n' +
    '  static String previous;\n' +
    '  static bool initialized = false;\n' +
    '  bool changed = initialized && current != previous;\n' +
    '  previous = current; initialized = true;\n' +
    '  return changed;\n' +
    '}\n');
  return ['ailyM5CardputerKeyboardChanged()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5cardputer_keyboard_key'] = function(block, generator) {
  ensureM5Cardputer(generator);
  const key = generator.valueToCode(block, 'KEY', generator.ORDER_ATOMIC || Arduino.ORDER_ATOMIC) || '""';
  generator.addFunction('aily_m5cardputer_key_pressed',
    'bool ailyM5CardputerKeyPressed(const String& key) {\n' +
    '  return key.length() && M5Cardputer.Keyboard.isKeyPressed(key[0]);\n' +
    '}\n');
  return ['ailyM5CardputerKeyPressed(String(' + key + '))', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5cardputer_keyboard_special'] = function(block, generator) {
  ensureM5Cardputer(generator);
  const allowed = ['tab', 'fn', 'shift', 'ctrl', 'opt', 'alt', 'backspace', 'del', 'enter', 'space', 'esc', 'up', 'down', 'left', 'right', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12'];
  const key = block.getFieldValue('KEY');
  const member = allowed.indexOf(key) >= 0 ? key : 'enter';
  return ['M5Cardputer.Keyboard.keysState().' + member, generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5cardputer_keyboard_text'] = function(block, generator) {
  ensureM5Cardputer(generator);
  generator.addFunction('aily_m5cardputer_text',
    'String ailyM5CardputerText() {\n' +
    '  String result;\n' +
    '  for (char value : M5Cardputer.Keyboard.keysState().word) result += value;\n' +
    '  return result;\n' +
    '}\n');
  return ['ailyM5CardputerText()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5cardputer_keyboard_caps'] = function(block, generator) {
  ensureM5Cardputer(generator);
  return ['M5Cardputer.Keyboard.capslocked()', generator.ORDER_ATOMIC];
};

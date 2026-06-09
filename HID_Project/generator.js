'use strict';

function ailySafeName(name, fallback) {
  const raw = String(name || fallback || 'obj').trim();
  const safe = raw.replace(/[^A-Za-z0-9_]/g, '_').replace(/^[^A-Za-z_]+/, '');
  return safe || fallback || 'obj';
}

function ailyFieldVar(block, field, fallback) {
  const varField = block.getField(field);
  return ailySafeName(varField ? varField.getText() : block.getFieldValue(field), fallback);
}

function ailyValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function ailyRegister(name, type) {
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(name, type);
  }
}

function ailyBlockId(block) {
  return String(block.id || Math.random().toString(36).slice(2)).replace(/[^A-Za-z0-9_]/g, '_');
}


function hidEnsure(generator) {
  generator.addLibrary('HID_Project', '#include <HID-Project.h>');
}
Arduino.forBlock['hid_project_begin'] = function(block, generator) { hidEnsure(generator); return block.getFieldValue('DEVICE') + '.begin();\n'; };
Arduino.forBlock['hid_project_end'] = function(block, generator) { hidEnsure(generator); return block.getFieldValue('DEVICE') + '.end();\n'; };
Arduino.forBlock['hid_keyboard_print'] = function(block, generator) { hidEnsure(generator); const text = ailyValue(block, generator, 'TEXT', '"Hello"'); return 'Keyboard.print(' + text + ');\n'; };
Arduino.forBlock['hid_keyboard_key'] = function(block, generator) { hidEnsure(generator); return 'Keyboard.' + block.getFieldValue('ACTION') + '(' + block.getFieldValue('KEY') + ');\n'; };
Arduino.forBlock['hid_keyboard_release_all'] = function(block, generator) { hidEnsure(generator); return 'Keyboard.releaseAll();\n'; };
Arduino.forBlock['hid_consumer_write'] = function(block, generator) { hidEnsure(generator); return 'Consumer.write(' + block.getFieldValue('KEY') + ');\n'; };
Arduino.forBlock['hid_mouse_move'] = function(block, generator) { hidEnsure(generator); const x = ailyValue(block, generator, 'X', '0'); const y = ailyValue(block, generator, 'Y', '0'); const w = ailyValue(block, generator, 'WHEEL', '0'); return 'Mouse.move(' + x + ', ' + y + ', ' + w + ');\n'; };
Arduino.forBlock['hid_mouse_button'] = function(block, generator) { hidEnsure(generator); return 'Mouse.' + block.getFieldValue('ACTION') + '(' + block.getFieldValue('BUTTON') + ');\n'; };
Arduino.forBlock['hid_gamepad_button'] = function(block, generator) { hidEnsure(generator); const b = ailyValue(block, generator, 'BUTTON', '1'); return 'Gamepad.' + block.getFieldValue('ACTION') + '(' + b + ');\n'; };
Arduino.forBlock['hid_gamepad_axis'] = function(block, generator) { hidEnsure(generator); const v = ailyValue(block, generator, 'VALUE', '0'); return 'Gamepad.' + block.getFieldValue('AXIS') + '(' + v + ');\n'; };
Arduino.forBlock['hid_gamepad_write'] = function(block, generator) { hidEnsure(generator); return 'Gamepad.write();\n'; };

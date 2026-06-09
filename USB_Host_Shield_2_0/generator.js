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


function usbhostEnsure(generator) {
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('Usb', '#include <Usb.h>');
  generator.addObject('usbhost_usb', 'USB Usb;');
}
function usbhostInitCode(halt) {
  if (halt) return 'if (Usb.Init() == -1) {\n  while (1);\n}\n';
  return 'Usb.Init();\n';
}
function usbhostEnsurePS4(generator) {
  usbhostEnsure(generator);
  generator.addLibrary('PS4USB', '#include <PS4USB.h>');
  generator.addObject('usbhost_ps4', 'PS4USB PS4(&Usb);');
}
Arduino.forBlock['usbhost_begin'] = function(block, generator) { usbhostEnsure(generator); generator.addLoopBegin('usbhost_task', 'Usb.Task();'); return usbhostInitCode(block.getFieldValue('HALT') === 'TRUE'); };
Arduino.forBlock['usbhost_task'] = function(block, generator) { usbhostEnsure(generator); return 'Usb.Task();\n'; };
Arduino.forBlock['usbhost_ps4_begin'] = function(block, generator) { usbhostEnsurePS4(generator); generator.addLoopBegin('usbhost_task', 'Usb.Task();'); return usbhostInitCode(block.getFieldValue('HALT') === 'TRUE'); };
Arduino.forBlock['usbhost_ps4_connected'] = function(block, generator) { usbhostEnsurePS4(generator); return ['PS4.connected()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['usbhost_ps4_button'] = function(block, generator) { usbhostEnsurePS4(generator); return ['PS4.' + block.getFieldValue('MODE') + '(' + block.getFieldValue('BUTTON') + ')', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['usbhost_ps4_hat'] = function(block, generator) { usbhostEnsurePS4(generator); return ['PS4.getAnalogHat(' + block.getFieldValue('HAT') + ')', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['usbhost_ps4_rumble'] = function(block, generator) { usbhostEnsurePS4(generator); return 'PS4.setRumbleOn(' + ailyValue(block, generator, 'LOW', '0') + ', ' + ailyValue(block, generator, 'HIGH', '128') + ');\n'; };
Arduino.forBlock['usbhost_ps4_led'] = function(block, generator) { usbhostEnsurePS4(generator); return 'PS4.setLed(' + block.getFieldValue('COLOR') + ');\n'; };

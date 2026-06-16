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


function csEnsure(generator) { generator.addLibrary('Control_Surface', '#include <Control_Surface.h>'); }
Arduino.forBlock['control_surface_usb_interface'] = function(block, generator) { csEnsure(generator); const name = ailySafeName(block.getFieldValue('VAR'), 'midi'); ailyRegister(name, 'ControlSurfaceMIDI'); generator.addObject('cs_usb_' + name, 'USBMIDI_Interface ' + name + ';'); return ''; };
Arduino.forBlock['control_surface_serial_interface'] = function(block, generator) { csEnsure(generator); const name = ailySafeName(block.getFieldValue('VAR'), 'midi'); const serial = block.getFieldValue('SERIAL') || 'Serial1'; ailyRegister(name, 'ControlSurfaceMIDI'); generator.addObject('cs_serial_' + name, 'HardwareSerialMIDI_Interface ' + name + ' {' + serial + ', MIDI_BAUD};'); return ''; };
Arduino.forBlock['control_surface_begin'] = function(block, generator) { csEnsure(generator); generator.addLoopBegin('control_surface_loop', 'Control_Surface.loop();'); return 'Control_Surface.begin();\n'; };
Arduino.forBlock['control_surface_loop'] = function(block, generator) { csEnsure(generator); return 'Control_Surface.loop();\n'; };
Arduino.forBlock['control_surface_cc_pot'] = function(block, generator) { csEnsure(generator); const name = ailySafeName(block.getFieldValue('VAR'), 'pot'); const pin = ailyValue(block, generator, 'PIN', 'A0'); const cc = ailyValue(block, generator, 'CC', '7'); const channel = block.getFieldValue('CHANNEL') || 'Channel_1'; generator.addObject('cs_ccpot_' + name, 'CCPotentiometer ' + name + ' {' + pin + ', {' + cc + ', ' + channel + '}};'); return ''; };
Arduino.forBlock['control_surface_note_button'] = function(block, generator) { csEnsure(generator); const name = ailySafeName(block.getFieldValue('VAR'), 'button'); const pin = ailyValue(block, generator, 'PIN', '2'); const note = ailyValue(block, generator, 'NOTE', '60'); const channel = block.getFieldValue('CHANNEL') || 'Channel_1'; generator.addObject('cs_notebutton_' + name, 'NoteButton ' + name + ' {' + pin + ', {' + note + ', ' + channel + '}};'); return ''; };
Arduino.forBlock['control_surface_send_note'] = function(block, generator) { csEnsure(generator); const name = ailyFieldVar(block, 'VAR', 'midi'); const note = ailyValue(block, generator, 'NOTE', '60'); const vel = ailyValue(block, generator, 'VELOCITY', '127'); const channel = block.getFieldValue('CHANNEL') || 'Channel_1'; return name + '.' + block.getFieldValue('ACTION') + '({' + note + ', ' + channel + '}, ' + vel + ');\n'; };
Arduino.forBlock['control_surface_send_cc'] = function(block, generator) { csEnsure(generator); const name = ailyFieldVar(block, 'VAR', 'midi'); const cc = ailyValue(block, generator, 'CC', '7'); const value = ailyValue(block, generator, 'VALUE', '100'); const channel = block.getFieldValue('CHANNEL') || 'Channel_1'; return name + '.sendControlChange({' + cc + ', ' + channel + '}, ' + value + ');\n'; };

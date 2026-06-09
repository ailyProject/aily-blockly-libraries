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


function midiEnsure(generator) {
  generator.addLibrary('MIDI', '#include <MIDI.h>');
  generator.addObject('midi_default_instance', 'MIDI_CREATE_DEFAULT_INSTANCE();');
}
Arduino.forBlock['midi_begin'] = function(block, generator) { midiEnsure(generator); return 'MIDI.begin(' + ailyValue(block, generator, 'CHANNEL', '1') + ');\n'; };
Arduino.forBlock['midi_read'] = function(block, generator) { midiEnsure(generator); return ['MIDI.read()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['midi_send_note_on'] = function(block, generator) { midiEnsure(generator); return 'MIDI.sendNoteOn(' + ailyValue(block, generator, 'NOTE', '60') + ', ' + ailyValue(block, generator, 'VELOCITY', '127') + ', ' + ailyValue(block, generator, 'CHANNEL', '1') + ');\n'; };
Arduino.forBlock['midi_send_note_off'] = function(block, generator) { midiEnsure(generator); return 'MIDI.sendNoteOff(' + ailyValue(block, generator, 'NOTE', '60') + ', ' + ailyValue(block, generator, 'VELOCITY', '0') + ', ' + ailyValue(block, generator, 'CHANNEL', '1') + ');\n'; };
Arduino.forBlock['midi_send_control_change'] = function(block, generator) { midiEnsure(generator); return 'MIDI.sendControlChange(' + ailyValue(block, generator, 'CC', '7') + ', ' + ailyValue(block, generator, 'VALUE', '100') + ', ' + ailyValue(block, generator, 'CHANNEL', '1') + ');\n'; };
Arduino.forBlock['midi_send_program_change'] = function(block, generator) { midiEnsure(generator); return 'MIDI.sendProgramChange(' + ailyValue(block, generator, 'PROGRAM', '1') + ', ' + ailyValue(block, generator, 'CHANNEL', '1') + ');\n'; };
Arduino.forBlock['midi_send_pitch_bend'] = function(block, generator) { midiEnsure(generator); return 'MIDI.sendPitchBend(' + ailyValue(block, generator, 'VALUE', '0') + ', ' + ailyValue(block, generator, 'CHANNEL', '1') + ');\n'; };
Arduino.forBlock['midi_get_data'] = function(block, generator) { midiEnsure(generator); return ['MIDI.' + block.getFieldValue('FIELD') + '()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['midi_turn_thru'] = function(block, generator) { midiEnsure(generator); return 'MIDI.' + block.getFieldValue('STATE') + '();\n'; };
Arduino.forBlock['midi_on_note_on'] = function(block, generator) { midiEnsure(generator); const cv = ailySafeName(block.getFieldValue('CHANNELVAR'), 'midiChannel'); const nv = ailySafeName(block.getFieldValue('NOTEVAR'), 'midiNote'); const vv = ailySafeName(block.getFieldValue('VELOCITYVAR'), 'midiVelocity'); const body = generator.statementToCode(block, 'DO') || ''; ailyRegister(cv, 'Number'); ailyRegister(nv, 'Number'); ailyRegister(vv, 'Number'); const fn = 'ailyMidiNoteOn'; generator.addFunction(fn, 'void ' + fn + '(byte channel, byte note, byte velocity) {\n  byte ' + cv + ' = channel;\n  byte ' + nv + ' = note;\n  byte ' + vv + ' = velocity;\n' + body + '}\n'); generator.addSetupEnd('midi_note_on_cb', 'MIDI.setHandleNoteOn(' + fn + ');'); generator.addLoopBegin('midi_read_loop', 'MIDI.read();'); return ''; };
Arduino.forBlock['midi_on_control_change'] = function(block, generator) { midiEnsure(generator); const cv = ailySafeName(block.getFieldValue('CHANNELVAR'), 'midiChannel'); const cc = ailySafeName(block.getFieldValue('CCVAR'), 'midiCC'); const vv = ailySafeName(block.getFieldValue('VALUEVAR'), 'midiValue'); const body = generator.statementToCode(block, 'DO') || ''; ailyRegister(cv, 'Number'); ailyRegister(cc, 'Number'); ailyRegister(vv, 'Number'); const fn = 'ailyMidiControlChange'; generator.addFunction(fn, 'void ' + fn + '(byte channel, byte number, byte value) {\n  byte ' + cv + ' = channel;\n  byte ' + cc + ' = number;\n  byte ' + vv + ' = value;\n' + body + '}\n'); generator.addSetupEnd('midi_cc_cb', 'MIDI.setHandleControlChange(' + fn + ');'); generator.addLoopBegin('midi_read_loop', 'MIDI.read();'); return ''; };

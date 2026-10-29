// @aily-project/lib-otto

Arduino.forBlock["otto_init"] = function (block, generator) {
  registerVariableToBlockly(block.getFieldValue("NAME"), "Otto");
  const name = block.getFieldValue('NAME'); const cal = block.getFieldValue('CAL') === 'TRUE' ? 'true' : 'false'; generator.addLibrary('otto', '#include <Otto.h>'); generator.addObject('otto_obj_' + name, 'Otto ' + name + ';'); generator.addSetupBegin('otto_init_' + name, name + '.init(' + block.getFieldValue('YL') + ', ' + block.getFieldValue('YR') + ', ' + block.getFieldValue('RL') + ', ' + block.getFieldValue('RR') + ', ' + cal + ', ' + block.getFieldValue('BUZZER') + ');\n'); return ''
};

Arduino.forBlock["otto_init_matrix"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); generator.addLibrary('otto', '#include <Otto.h>'); return v + '.initMATRIX(' + block.getFieldValue('DIN') + ', ' + block.getFieldValue('CS') + ', ' + block.getFieldValue('CLK') + ', ' + block.getFieldValue('ROT') + ');\n'
};

Arduino.forBlock["otto_attach_servos"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); generator.addLibrary('otto', '#include <Otto.h>'); return v + '.attachServos();\n'
};

Arduino.forBlock["otto_detach_servos"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); generator.addLibrary('otto', '#include <Otto.h>'); return v + '.detachServos();\n'
};

Arduino.forBlock["otto_home"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); generator.addLibrary('otto', '#include <Otto.h>'); return v + '.home();\n'
};

Arduino.forBlock["otto_set_rest_state"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); generator.addLibrary('otto', '#include <Otto.h>'); return v + '.setRestState(' + block.getFieldValue('STATE') + ');\n'
};

Arduino.forBlock["otto_get_rest_state"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); generator.addLibrary('otto', '#include <Otto.h>'); return [v + '.getRestState()', Arduino.ORDER_ATOMIC]
};

Arduino.forBlock["otto_jump"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); const steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '1'; const t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '2000'; generator.addLibrary('otto', '#include <Otto.h>'); return v + '.jump(' + steps + ', ' + t + ');\n'
};

Arduino.forBlock["otto_walk"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); const steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '4'; const t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '1000'; generator.addLibrary('otto', '#include <Otto.h>'); return v + '.walk(' + steps + ', ' + t + ', ' + block.getFieldValue('DIR') + ');\n'
};

Arduino.forBlock["otto_turn"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); const steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '4'; const t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '2000'; generator.addLibrary('otto', '#include <Otto.h>'); return v + '.turn(' + steps + ', ' + t + ', ' + block.getFieldValue('DIR') + ');\n'
};

Arduino.forBlock["otto_bend"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); const steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '1'; const t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '1400'; generator.addLibrary('otto', '#include <Otto.h>'); return v + '.bend(' + steps + ', ' + t + ', ' + block.getFieldValue('DIR') + ');\n'
};

Arduino.forBlock["otto_shake_leg"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); const steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '1'; const t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '2000'; generator.addLibrary('otto', '#include <Otto.h>'); return v + '.shakeLeg(' + steps + ', ' + t + ', ' + block.getFieldValue('DIR') + ');\n'
};

Arduino.forBlock["otto_updown"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); const steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '1'; const t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '1000'; const h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '20'; generator.addLibrary('otto', '#include <Otto.h>'); return v + '.updown(' + steps + ', ' + t + ', ' + h + ');\n'
};

Arduino.forBlock["otto_swing"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); const steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '1'; const t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '1000'; const h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '20'; generator.addLibrary('otto', '#include <Otto.h>'); return v + '.swing(' + steps + ', ' + t + ', ' + h + ');\n'
};

Arduino.forBlock["otto_tiptoe_swing"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); const steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '1'; const t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '900'; const h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '20'; generator.addLibrary('otto', '#include <Otto.h>'); return v + '.tiptoeSwing(' + steps + ', ' + t + ', ' + h + ');\n'
};

Arduino.forBlock["otto_jitter"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); const steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '1'; const t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '500'; const h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '20'; generator.addLibrary('otto', '#include <Otto.h>'); return v + '.jitter(' + steps + ', ' + t + ', ' + h + ');\n'
};

Arduino.forBlock["otto_ascending_turn"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); const steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '1'; const t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '900'; const h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '20'; generator.addLibrary('otto', '#include <Otto.h>'); return v + '.ascendingTurn(' + steps + ', ' + t + ', ' + h + ');\n'
};

Arduino.forBlock["otto_moonwalker"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); const steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '1'; const t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '900'; const h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '20'; generator.addLibrary('otto', '#include <Otto.h>'); return v + '.moonwalker(' + steps + ', ' + t + ', ' + h + ', ' + block.getFieldValue('DIR') + ');\n'
};

Arduino.forBlock["otto_crusaito"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); const steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '1'; const t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '900'; const h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '20'; generator.addLibrary('otto', '#include <Otto.h>'); return v + '.crusaito(' + steps + ', ' + t + ', ' + h + ', ' + block.getFieldValue('DIR') + ');\n'
};

Arduino.forBlock["otto_flapping"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); const steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '1'; const t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '1000'; const h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '20'; generator.addLibrary('otto', '#include <Otto.h>'); return v + '.flapping(' + steps + ', ' + t + ', ' + h + ', ' + block.getFieldValue('DIR') + ');\n'
};

Arduino.forBlock["otto_move_single"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); const pos = generator.valueToCode(block, 'POS', Arduino.ORDER_ATOMIC) || '90'; generator.addLibrary('otto', '#include <Otto.h>'); return v + '._moveSingle(' + pos + ', ' + block.getFieldValue('SERVO') + ');\n'
};

Arduino.forBlock["otto_move_servos"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); const g = function (n) { return generator.valueToCode(block, n, Arduino.ORDER_ATOMIC) || '90' }; const t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '1000'; generator.addLibrary('otto', '#include <Otto.h>'); return '{ int otto_target[4] = {' + g('P0') + ', ' + g('P1') + ', ' + g('P2') + ', ' + g('P3') + '}; ' + v + '._moveServos(' + t + ', otto_target); }\n'
};

Arduino.forBlock["otto_oscillate_servos"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); const g = function (n, d) { return generator.valueToCode(block, n, Arduino.ORDER_ATOMIC) || d }; generator.addLibrary('otto', '#include <Otto.h>'); return '{ int otto_A[4] = {' + g('A0', '45') + ', ' + g('A1', '45') + ', ' + g('A2', '45') + ', ' + g('A3', '45') + '}; int otto_O[4] = {' + g('O0', '0') + ', ' + g('O1', '0') + ', ' + g('O2', '0') + ', ' + g('O3', '0') + '}; double otto_phase[4] = {' + g('PH0', '0') + ', ' + g('PH1', '0') + ', ' + g('PH2', '0') + ', ' + g('PH3', '0') + '}; ' + v + '.oscillateServos(otto_A, otto_O, ' + g('T', '1000') + ', otto_phase, ' + g('CYC', '1') + '); }\n'
};

Arduino.forBlock["otto_tone"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); const g = function (n, d) { return generator.valueToCode(block, n, Arduino.ORDER_ATOMIC) || d }; generator.addLibrary('otto', '#include <Otto.h>'); return v + '._tone(' + g('FREQ', '440') + ', ' + g('DUR', '200') + ', ' + g('SILENT', '100') + ');\n'
};

Arduino.forBlock["otto_bend_tones"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); const g = function (n, d) { return generator.valueToCode(block, n, Arduino.ORDER_ATOMIC) || d }; generator.addLibrary('otto', '#include <Otto.h>'); return v + '.bendTones(' + g('F0', '880') + ', ' + g('F1', '2093') + ', ' + g('PROP', '1.02') + ', ' + g('DUR', '18') + ', ' + g('SILENT', '1') + ');\n'
};

Arduino.forBlock["otto_sing"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); generator.addLibrary('otto', '#include <Otto.h>'); return v + '.sing(' + block.getFieldValue('SONG') + ');\n'
};

Arduino.forBlock["otto_put_mouth"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); generator.addLibrary('otto', '#include <Otto.h>'); return v + '.putMouth(' + block.getFieldValue('MOUTH') + ', true);\n'
};

Arduino.forBlock["otto_put_mouth_raw"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); const bits = generator.valueToCode(block, 'BITS', Arduino.ORDER_ATOMIC) || '0'; generator.addLibrary('otto', '#include <Otto.h>'); return v + '.putMouth(' + bits + ', false);\n'
};

Arduino.forBlock["otto_put_animation_mouth"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); const idx = generator.valueToCode(block, 'INDEX', Arduino.ORDER_ATOMIC) || '0'; generator.addLibrary('otto', '#include <Otto.h>'); return v + '.putAnimationMouth(' + block.getFieldValue('ANIM') + ', ' + idx + ');\n'
};

Arduino.forBlock["otto_clear_mouth"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); generator.addLibrary('otto', '#include <Otto.h>'); return v + '.clearMouth();\n'
};

Arduino.forBlock["otto_matrix_intensity"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); const i = generator.valueToCode(block, 'INTENSITY', Arduino.ORDER_ATOMIC) || '8'; generator.addLibrary('otto', '#include <Otto.h>'); return v + '.matrixIntensity(' + i + ');\n'
};

Arduino.forBlock["otto_set_led"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); const g = function (n, d) { return generator.valueToCode(block, n, Arduino.ORDER_ATOMIC) || d }; generator.addLibrary('otto', '#include <Otto.h>'); return v + '.setLed(' + g('X', '0') + ', ' + g('Y', '0') + ', ' + block.getFieldValue('VALUE') + ');\n'
};

Arduino.forBlock["otto_write_text"] = function (block, generator) {
  const v = generator.getValue(block, 'VAR', 'field_variable'); const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '"OTTO"'; const speed = generator.valueToCode(block, 'SPEED', Arduino.ORDER_ATOMIC) || '100'; generator.addLibrary('otto', '#include <Otto.h>'); return v + '.writeText(' + text + ', ' + speed + ');\n'
};

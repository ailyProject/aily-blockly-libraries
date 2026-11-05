function ottoObjectName(block, generator) {
  const workspace = block.workspace;
  const variables = workspace && workspace.getVariableMap && workspace.getVariableMap();
  const type = 'Otto9';
  function sync(name) {
    name = name || 'otto';
    let model = variables && variables.getVariableById(block._ottoVariableId);
    if (model && name !== block._ottoLastName) {
      variables.renameVariable(model, name);
      model = variables.getVariable(name, type);
    }
    if (!model && variables) model = variables.getVariable(name, type) || workspace.createVariable(name, type);
    block._ottoLastName = name;
    if (model) block._ottoVariableId = model.getId();
    return model;
  }
  const raw = block.getFieldValue('NAME') || 'otto';
  if (!block._ottoNameMonitor) {
    registerVariableToBlockly(raw, type);
    sync(raw);
    block._ottoNameMonitor = true;
    const field = block.getField('NAME');
    const originalFinish = field && field.onFinishEditing_;
    if (field) field.onFinishEditing_ = function(newName) {
      if (typeof originalFinish === 'function') originalFinish.call(this, newName);
      sync(newName);
    };
  }
  const model = sync(raw);
  registerVariableToBlockly(raw, type);
  if (generator.nameDB_ && model) return generator.nameDB_.getName(model.getId(), 'VARIABLE');
  return raw;
}

// @aily-project/lib-otto9

Arduino.forBlock["otto_init"] = function (block, generator) {
  var name = ottoObjectName(block, generator); generator.addLibrary('otto9', '#include "Otto9.h"'); generator.addObject('otto9_' + name, 'class Otto9 ' + name + ';'); return name + '.init(' + block.getFieldValue('YL') + ', ' + block.getFieldValue('YR') + ', ' + block.getFieldValue('RL') + ', ' + block.getFieldValue('RR') + ', ' + block.getFieldValue('CALIB') + ', ' + block.getFieldValue('NOISE') + ', ' + block.getFieldValue('BUZZER') + ', ' + block.getFieldValue('TRIG') + ', ' + block.getFieldValue('ECHO') + ');\n';
};

Arduino.forBlock["otto_init_matrix"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); return name + '.initMATRIX(' + block.getFieldValue('DIN') + ', ' + block.getFieldValue('CS') + ', ' + block.getFieldValue('CLK') + ', ' + block.getFieldValue('ROTATE') + ');\n';
};

Arduino.forBlock["otto_attach_servos"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); return name + '.attachServos();\n';
};

Arduino.forBlock["otto_detach_servos"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); return name + '.detachServos();\n';
};

Arduino.forBlock["otto_set_trims"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); var yl = generator.valueToCode(block, 'YL', Arduino.ORDER_ATOMIC) || '0'; var yr = generator.valueToCode(block, 'YR', Arduino.ORDER_ATOMIC) || '0'; var rl = generator.valueToCode(block, 'RL', Arduino.ORDER_ATOMIC) || '0'; var rr = generator.valueToCode(block, 'RR', Arduino.ORDER_ATOMIC) || '0'; return name + '.setTrims(' + yl + ', ' + yr + ', ' + rl + ', ' + rr + ');\n';
};

Arduino.forBlock["otto_save_trims"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); return name + '.saveTrimsOnEEPROM();\n';
};

Arduino.forBlock["otto_home"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); return name + '.home();\n';
};

Arduino.forBlock["otto_get_rest_state"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); return [name + '.getRestState()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["otto_set_rest_state"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); return name + '.setRestState(' + block.getFieldValue('STATE') + ');\n';
};

Arduino.forBlock["otto_jump"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); var steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '1'; var t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '2000'; return name + '.jump(' + steps + ', ' + t + ');\n';
};

Arduino.forBlock["otto_walk"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); var steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '4'; var t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '1000'; return name + '.walk(' + steps + ', ' + t + ', ' + block.getFieldValue('DIR') + ');\n';
};

Arduino.forBlock["otto_turn"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); var steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '4'; var t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '2000'; return name + '.turn(' + steps + ', ' + t + ', ' + block.getFieldValue('DIR') + ');\n';
};

Arduino.forBlock["otto_bend"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); var steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '1'; var t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '1400'; return name + '.bend(' + steps + ', ' + t + ', ' + block.getFieldValue('DIR') + ');\n';
};

Arduino.forBlock["otto_shake_leg"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); var steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '1'; var t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '2000'; return name + '.shakeLeg(' + steps + ', ' + t + ', ' + block.getFieldValue('DIR') + ');\n';
};

Arduino.forBlock["otto_updown"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); var steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '1'; var t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '1000'; var h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '20'; return name + '.updown(' + steps + ', ' + t + ', ' + h + ');\n';
};

Arduino.forBlock["otto_swing"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); var steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '1'; var t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '1000'; var h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '20'; return name + '.swing(' + steps + ', ' + t + ', ' + h + ');\n';
};

Arduino.forBlock["otto_tiptoe_swing"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); var steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '1'; var t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '900'; var h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '20'; return name + '.tiptoeSwing(' + steps + ', ' + t + ', ' + h + ');\n';
};

Arduino.forBlock["otto_jitter"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); var steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '1'; var t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '500'; var h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '20'; return name + '.jitter(' + steps + ', ' + t + ', ' + h + ');\n';
};

Arduino.forBlock["otto_ascending_turn"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); var steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '1'; var t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '900'; var h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '20'; return name + '.ascendingTurn(' + steps + ', ' + t + ', ' + h + ');\n';
};

Arduino.forBlock["otto_moonwalker"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); var steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '1'; var t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '900'; var h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '20'; return name + '.moonwalker(' + steps + ', ' + t + ', ' + h + ', ' + block.getFieldValue('DIR') + ');\n';
};

Arduino.forBlock["otto_crusaito"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); var steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '1'; var t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '900'; var h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '20'; return name + '.crusaito(' + steps + ', ' + t + ', ' + h + ', ' + block.getFieldValue('DIR') + ');\n';
};

Arduino.forBlock["otto_flapping"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); var steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC) || '1'; var t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '1000'; var h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '20'; return name + '.flapping(' + steps + ', ' + t + ', ' + h + ', ' + block.getFieldValue('DIR') + ');\n';
};

Arduino.forBlock["otto_get_distance"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); return [name + '.getDistance()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["otto_touch_pressed"] = function (block, generator) {
  var pin = block.getFieldValue('PIN');
  generator.addSetupBegin('otto_touch_' + pin, 'pinMode(' + pin + ', INPUT);\n');
  return ['(digitalRead(' + pin + ') == HIGH)', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["otto_sound_triggered"] = function (block, generator) {
  var pin = block.getFieldValue('PIN');
  var th = generator.valueToCode(block, 'THRESHOLD', Arduino.ORDER_ATOMIC) || '600';
  return ['(analogRead(' + pin + ') > ' + th + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["otto_matrix_intensity"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); var v = generator.valueToCode(block, 'INTENSITY', Arduino.ORDER_ATOMIC) || '5'; return name + '.matrixIntensity(' + v + ');\n';
};

Arduino.forBlock["otto_put_mouth"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); return name + '.putMouth(' + block.getFieldValue('MOUTH') + ');\n';
};

Arduino.forBlock["otto_put_mouth_bitmap"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); var code = generator.valueToCode(block, 'CODE', Arduino.ORDER_ATOMIC) || '0'; return name + '.putMouth((unsigned long int)(' + code + '), false);\n';
};

Arduino.forBlock["otto_put_animation_mouth"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); var idx = generator.valueToCode(block, 'INDEX', Arduino.ORDER_ATOMIC) || '0'; return name + '.putAnimationMouth(' + block.getFieldValue('ANIM') + ', ' + idx + ');\n';
};

Arduino.forBlock["otto_clear_mouth"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); return name + '.clearMouth();\n';
};

Arduino.forBlock["otto_set_led"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); var x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0'; var y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0'; var v = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '1'; return name + '.setLed(' + x + ', ' + y + ', ' + v + ');\n';
};

Arduino.forBlock["otto_write_text"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_NONE) || '"HI"'; var speed = generator.valueToCode(block, 'SPEED', Arduino.ORDER_ATOMIC) || '100'; return name + '.writeText(' + text + ', ' + speed + ');\n';
};

Arduino.forBlock["otto_tone"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); var f = generator.valueToCode(block, 'FREQ', Arduino.ORDER_ATOMIC) || '523'; var d = generator.valueToCode(block, 'DURATION', Arduino.ORDER_ATOMIC) || '100'; var s = generator.valueToCode(block, 'SILENT', Arduino.ORDER_ATOMIC) || '50'; return name + '._tone(' + f + ', ' + d + ', ' + s + ');\n';
};

Arduino.forBlock["otto_bend_tones"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); var i = generator.valueToCode(block, 'INITF', Arduino.ORDER_ATOMIC) || '500'; var f = generator.valueToCode(block, 'FINALF', Arduino.ORDER_ATOMIC) || '1000'; var p = generator.valueToCode(block, 'PROP', Arduino.ORDER_ATOMIC) || '1.02'; var d = generator.valueToCode(block, 'DUR', Arduino.ORDER_ATOMIC) || '20'; var s = generator.valueToCode(block, 'SILENT', Arduino.ORDER_ATOMIC) || '10'; return name + '.bendTones(' + i + ', ' + f + ', ' + p + ', ' + d + ', ' + s + ');\n';
};

Arduino.forBlock["otto_sing"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); return name + '.sing(' + block.getFieldValue('SONG') + ');\n';
};

Arduino.forBlock["otto_move_single"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); var pos = generator.valueToCode(block, 'POSITION', Arduino.ORDER_ATOMIC) || '90'; return name + '._moveSingle(' + pos + ', ' + block.getFieldValue('SERVO') + ');\n';
};

Arduino.forBlock["otto_move_servos"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); var t = generator.valueToCode(block, 'TIME', Arduino.ORDER_ATOMIC) || '500'; var yl = generator.valueToCode(block, 'YL', Arduino.ORDER_ATOMIC) || '90'; var yr = generator.valueToCode(block, 'YR', Arduino.ORDER_ATOMIC) || '90'; var rl = generator.valueToCode(block, 'RL', Arduino.ORDER_ATOMIC) || '90'; var rr = generator.valueToCode(block, 'RR', Arduino.ORDER_ATOMIC) || '90'; return '{\n  int ottoTarget[4] = {' + yl + ', ' + yr + ', ' + rl + ', ' + rr + '};\n  ' + name + '._moveServos(' + t + ', ottoTarget);\n}\n';
};

Arduino.forBlock["otto_oscillate_servos"] = function (block, generator) {
  var name = generator.getValue(block, 'NAME', 'field_variable'); var ayl = generator.valueToCode(block, 'AYL', Arduino.ORDER_ATOMIC) || '20'; var ayr = generator.valueToCode(block, 'AYR', Arduino.ORDER_ATOMIC) || '20'; var arl = generator.valueToCode(block, 'ARL', Arduino.ORDER_ATOMIC) || '20'; var arr = generator.valueToCode(block, 'ARR', Arduino.ORDER_ATOMIC) || '20'; var oyl = generator.valueToCode(block, 'OYL', Arduino.ORDER_ATOMIC) || '0'; var oyr = generator.valueToCode(block, 'OYR', Arduino.ORDER_ATOMIC) || '0'; var orl = generator.valueToCode(block, 'ORL', Arduino.ORDER_ATOMIC) || '0'; var orr = generator.valueToCode(block, 'ORR', Arduino.ORDER_ATOMIC) || '0'; var t = generator.valueToCode(block, 'T', Arduino.ORDER_ATOMIC) || '1000'; var c = generator.valueToCode(block, 'CYCLE', Arduino.ORDER_ATOMIC) || '1'; return '{\n  int ottoAmp[4] = {' + ayl + ', ' + ayr + ', ' + arl + ', ' + arr + '};\n  int ottoOff[4] = {' + oyl + ', ' + oyr + ', ' + orl + ', ' + orr + '};\n  double ottoPhase[4] = {' + block.getFieldValue('PYL') + ', ' + block.getFieldValue('PYR') + ', ' + block.getFieldValue('PRL') + ', ' + block.getFieldValue('PRR') + '};\n  ' + name + '.oscillateServos(ottoAmp, ottoOff, ' + t + ', ottoPhase, ' + c + ');\n}\n';
};
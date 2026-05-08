function fpsEnsureLibrary(generator) {
  generator.addLibrary('FPS_GT511C3', '#include <Fingerprint_Scanner-TTL/FPS_GT511C3.h>');
}

function fpsGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'fps');
}

function fpsAttachVar(block) {
  if (block._fpsVarAttached) return;
  block._fpsVarAttached = true;
  block._fpsVarLastName = block.getFieldValue('VAR') || 'fps';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._fpsVarLastName, 'FPS_GT511C3');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._fpsVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._fpsVarLastName, newName, 'FPS_GT511C3');
      block._fpsVarLastName = newName;
    }
  };
}

Arduino.forBlock['fps_init'] = function(block, generator) {
  fpsAttachVar(block);
  fpsEnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'fps';
  var rx = block.getFieldValue('RX') || '4';
  var tx = block.getFieldValue('TX') || '5';
  generator.addVariable(varName, 'FPS_GT511C3 ' + varName + '(' + rx + ', ' + tx + ');');
  return varName + '.Open();\n';
};

Arduino.forBlock['fps_led'] = function(block) {
  return fpsGetVar(block) + '.SetLED(' + (block.getFieldValue('STATE') || 'true') + ');\n';
};

Arduino.forBlock['fps_enroll_count'] = function(block, generator) {
  return [fpsGetVar(block) + '.GetEnrollCount()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['fps_is_pressed'] = function(block, generator) {
  return [fpsGetVar(block) + '.IsPressFinger()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['fps_capture'] = function(block, generator) {
  return [fpsGetVar(block) + '.CaptureFinger(' + (block.getFieldValue('QUALITY') || 'true') + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['fps_identify'] = function(block, generator) {
  return [fpsGetVar(block) + '.Identify1_N()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['fps_verify'] = function(block, generator) {
  var id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '0';
  return [fpsGetVar(block) + '.Verify1_1(' + id + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['fps_check_enrolled'] = function(block, generator) {
  var id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '0';
  return [fpsGetVar(block) + '.CheckEnrolled(' + id + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['fps_enroll_start'] = function(block, generator) {
  var id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '0';
  return [fpsGetVar(block) + '.EnrollStart(' + id + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['fps_enroll_step'] = function(block, generator) {
  var step = block.getFieldValue('STEP') || 'Enroll1';
  return [fpsGetVar(block) + '.' + step + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['fps_delete_id'] = function(block, generator) {
  var id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '0';
  return fpsGetVar(block) + '.DeleteID(' + id + ');\n';
};

Arduino.forBlock['fps_delete_all'] = function(block) {
  return fpsGetVar(block) + '.DeleteAll();\n';
};
// grokEyes 2.2.0. Display configuration is supplied by lib-tft-espi.
Arduino.grokEyesIdentifier = function(value) {
  let name = String(value || 'eyes').replace(/[^A-Za-z0-9_]/gu,
    ch => '_u' + ch.codePointAt(0).toString(16) + '_');
  if (!/^[A-Za-z]/.test(name)) name = 'eyes_' + name;
  // Prefix C++ keywords and the library type without changing ordinary names.
  if (/^(grokEyes|auto|bool|break|case|char|class|const|continue|default|delete|do|double|else|enum|extern|false|float|for|if|int|long|namespace|new|nullptr|operator|private|protected|public|register|return|short|signed|sizeof|static|struct|switch|template|this|throw|true|try|typedef|typename|union|unsigned|using|virtual|void|volatile|while)$/.test(name)) {
    name = 'eyes_' + name;
  }
  return name;
};

Arduino.grokEyesVariable = function(block) {
  const field = block.getField('VAR');
  return Arduino.grokEyesIdentifier(field ? field.getText() : 'eyes');
};

Arduino.grokEyesInclude = function(generator) {
  generator.addLibrary('grokEyes', '#include <grokEyes.h>');
};

Arduino.grokEyesValue = function(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || String(fallback);
};

Arduino.grokEyesCall = function(block, generator, method, args) {
  Arduino.grokEyesInclude(generator);
  return Arduino.grokEyesVariable(block) + '.' + method + '(' + (args || []).join(', ') + ');\n';
};

Arduino.grokEyesMonitor = function(block) {
  const name = block.getFieldValue('VAR') || 'eyes';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(name, 'grokEyes');
  if (block._grokEyesVarMonitorAttached) return;
  block._grokEyesVarMonitorAttached = true;
  block._grokEyesLastName = name;
  const field = block.getField('VAR');
  if (!field) return;
  const original = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof original === 'function') original.call(this, newName);
    const oldName = block._grokEyesLastName;
    if (newName && newName !== oldName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, oldName, newName, 'grokEyes');
      block._grokEyesLastName = newName;
    }
  };
};

Arduino.forBlock['grok_eyes_init'] = function(block, generator) {
  Arduino.grokEyesMonitor(block);
  Arduino.grokEyesInclude(generator);
  const name = Arduino.grokEyesIdentifier(block.getFieldValue('VAR'));
  const displayField = block.getField('DISPLAY');
  const display = displayField ? displayField.getText() : 'tft';
  const fps = Arduino.grokEyesValue(block, generator, 'FPS', 50);
  const width = Arduino.grokEyesValue(block, generator, 'WIDTH', 0);
  const height = Arduino.grokEyesValue(block, generator, 'HEIGHT', 0);
  generator.addObject('grok_eyes_' + name, 'grokEyes ' + name + '(' + display + ');');
  generator.addVariable('grok_eyes_ready_' + name, 'bool grok_eyes_ready_' + name + ' = false;');
  if (block.getFieldValue('AUTO_UPDATE') === 'TRUE') {
    generator.addLoopBegin('grok_eyes_update_' + name,
      'if (grok_eyes_ready_' + name + ') ' + name + '.update();');
  }
  return 'grok_eyes_ready_' + name + ' = ' + name + '.begin(' + fps + ', ' + width + ', ' + height + ');\n';
};

Arduino.forBlock['grok_eyes_set_expression'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'setGrokExpression', [
    'grokEyes::' + block.getFieldValue('EXPRESSION'),
    Arduino.grokEyesValue(block, generator, 'DURATION', 65535)]);
};

Arduino.forBlock['grok_eyes_set_alias'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'setXiaozhiExpression', [
    'grokEyes::' + block.getFieldValue('EXPRESSION'),
    Arduino.grokEyesValue(block, generator, 'DURATION', 65535)]);
};

Arduino.forBlock['grok_eyes_set_expression_name'] = function(block, generator) {
  Arduino.grokEyesInclude(generator);
  const name = Arduino.grokEyesValue(block, generator, 'NAME', '"happy"');
  const duration = Arduino.grokEyesValue(block, generator, 'DURATION', 65535);
  // String accepts both Arduino String expressions and string literals.
  return [Arduino.grokEyesVariable(block) + '.setExpression(String(' + name + ').c_str(), ' + duration + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['grok_eyes_set_shape'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'setShape', [
    'grokEyes::' + block.getFieldValue('SHAPE'), Arduino.grokEyesValue(block, generator, 'DURATION', 300)]);
};

Arduino.forBlock['grok_eyes_set_state'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'setState', [
    'grokEyes::' + block.getFieldValue('STATE'), Arduino.grokEyesValue(block, generator, 'AUTO_EXPRESSION', 'true'),
    Arduino.grokEyesValue(block, generator, 'DURATION', 65535)]);
};

Arduino.forBlock['grok_eyes_blink'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'blinkEye', [
    'grokEyes::' + block.getFieldValue('EYE'), Arduino.grokEyesValue(block, generator, 'DURATION', 0)]);
};

Arduino.forBlock['grok_eyes_set_blink_timing'] = function(block, generator) {
  Arduino.grokEyesInclude(generator);
  const name = Arduino.grokEyesVariable(block);
  const close = Arduino.grokEyesValue(block, generator, 'CLOSE', 90);
  const hold = Arduino.grokEyesValue(block, generator, 'HOLD', 40);
  const open = Arduino.grokEyesValue(block, generator, 'OPEN', 190);
  const scale = Arduino.grokEyesValue(block, generator, 'SCALE', 0.035);
  return '{\n  grokEyes::BlinkConfig config;\n  config.closeMs = ' + close + ';\n  config.holdMs = ' + hold +
    ';\n  config.openMs = ' + open + ';\n  config.closedScale = ' + scale + ';\n  ' + name + '.setBlinkConfig(config);\n}\n';
};

Arduino.forBlock['grok_eyes_set_gaze'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'setGaze', [
    Arduino.grokEyesValue(block, generator, 'X', 0), Arduino.grokEyesValue(block, generator, 'Y', 0),
    Arduino.grokEyesValue(block, generator, 'DURATION', 220)]);
};

Arduino.forBlock['grok_eyes_center_gaze'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'centerGaze', [Arduino.grokEyesValue(block, generator, 'DURATION', 220)]);
};

Arduino.forBlock['grok_eyes_set_turn'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'setTurn', [
    Arduino.grokEyesValue(block, generator, 'DEGREES', 45), Arduino.grokEyesValue(block, generator, 'DURATION', 300)]);
};

Arduino.forBlock['grok_eyes_spin'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'spin', [
    Arduino.grokEyesValue(block, generator, 'TURNS', 1), Arduino.grokEyesValue(block, generator, 'DURATION', 1200)]);
};

Arduino.forBlock['grok_eyes_set_position'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'setPosition', [
    Arduino.grokEyesValue(block, generator, 'X', 120), Arduino.grokEyesValue(block, generator, 'Y', 120),
    Arduino.grokEyesValue(block, generator, 'DURATION', 300)]);
};

Arduino.forBlock['grok_eyes_set_spacing'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'setEyeSpacing', [
    Arduino.grokEyesValue(block, generator, 'PERCENT', 100), Arduino.grokEyesValue(block, generator, 'DURATION', 300)]);
};

Arduino.forBlock['grok_eyes_set_eye_offset'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'setEyeOffset', [
    'grokEyes::' + block.getFieldValue('EYE'), Arduino.grokEyesValue(block, generator, 'X', 0),
    Arduino.grokEyesValue(block, generator, 'Y', 0), Arduino.grokEyesValue(block, generator, 'DURATION', 300)]);
};

Arduino.forBlock['grok_eyes_set_eye_size'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'setEyeSize', [
    'grokEyes::' + block.getFieldValue('EYE'), Arduino.grokEyesValue(block, generator, 'WIDTH', 100),
    Arduino.grokEyesValue(block, generator, 'HEIGHT', 100), Arduino.grokEyesValue(block, generator, 'DURATION', 300)]);
};

Arduino.forBlock['grok_eyes_set_eye_scale'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'setEyeScale', [
    Arduino.grokEyesValue(block, generator, 'PERCENT', 100), Arduino.grokEyesValue(block, generator, 'DURATION', 300)]);
};

Arduino.forBlock['grok_eyes_reset_layout'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'resetLayout', [Arduino.grokEyesValue(block, generator, 'DURATION', 300)]);
};

Arduino.forBlock['grok_eyes_set_feature'] = function(block, generator) {
  const methods = {MOTION: 'setMotionEnabled', LIVELY: 'setLively', AUTO_EXPRESSION: 'setAutoExpression',
    SPRING: 'setSpringEnabled', FLIP_X: 'setFlipX', ANTIALIASING: 'setAntialiasing', EMPHASIS: 'setEmphasis'};
  return Arduino.grokEyesCall(block, generator, methods[block.getFieldValue('FEATURE')] || methods.MOTION,
    [Arduino.grokEyesValue(block, generator, 'ENABLED', 'true')]);
};

Arduino.forBlock['grok_eyes_set_spring_frequency'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'setSpringFrequency', [Arduino.grokEyesValue(block, generator, 'FREQUENCY', 18)]);
};

Arduino.forBlock['grok_eyes_set_auto_blink'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'setAutoBlink', [
    Arduino.grokEyesValue(block, generator, 'ENABLED', 'true'), Arduino.grokEyesValue(block, generator, 'INTERVAL', 0),
    Arduino.grokEyesValue(block, generator, 'VARIATION', 0)]);
};

Arduino.forBlock['grok_eyes_use_state_blink'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'useStateBlinkCadence');
};

Arduino.forBlock['grok_eyes_set_idle'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'setIdle', [
    Arduino.grokEyesValue(block, generator, 'ENABLED', 'true'), Arduino.grokEyesValue(block, generator, 'INTERVAL', 1800)]);
};

Arduino.forBlock['grok_eyes_set_framerate'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'setFrameRate', [Arduino.grokEyesValue(block, generator, 'FPS', 50)]);
};

Arduino.forBlock['grok_eyes_set_fit'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'setFitMode', ['grokEyes::' + block.getFieldValue('MODE')]);
};

Arduino.forBlock['grok_eyes_set_theme'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'setTheme', [
    block.getFieldValue('THEME') === 'LIGHT' ? 'grokEyes::lightTheme()' : 'grokEyes::darkTheme()']);
};

Arduino.forBlock['grok_eyes_set_colors'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'setColors', [
    Arduino.grokEyesValue(block, generator, 'BACKGROUND', 0), Arduino.grokEyesValue(block, generator, 'EYE_COLOR', 65535),
    Arduino.grokEyesValue(block, generator, 'ACCENT', 0)]);
};

Arduino.forBlock['grok_eyes_render'] = function(block, generator) {
  const methods = {UPDATE: 'update', DRAW: 'draw', DRAW_TO_SPRITE: 'drawToSprite'};
  return Arduino.grokEyesCall(block, generator, methods[block.getFieldValue('MODE')] || methods.UPDATE);
};

Arduino.forBlock['grok_eyes_reset'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'reset');
};

Arduino.forBlock['grok_eyes_end'] = function(block, generator) {
  return Arduino.grokEyesCall(block, generator, 'end') + 'grok_eyes_ready_' + Arduino.grokEyesVariable(block) + ' = false;\n';
};

Arduino.forBlock['grok_eyes_is_ready'] = function(block, generator) {
  return ['grok_eyes_ready_' + Arduino.grokEyesVariable(block), generator.ORDER_ATOMIC];
};

Arduino.forBlock['grok_eyes_is_animating'] = function(block, generator) {
  Arduino.grokEyesInclude(generator);
  const method = block.getFieldValue('MODE') === 'TRANSITION' ? 'isTransitioning' : 'isAnimating';
  return [Arduino.grokEyesVariable(block) + '.' + method + '()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['grok_eyes_get_number'] = function(block, generator) {
  Arduino.grokEyesInclude(generator);
  const methods = {EXPRESSION: 'grokExpression', SHAPE: 'shape', STATE: 'state', WIDTH: 'canvasWidth',
    HEIGHT: 'canvasHeight', FRAMES: 'renderedFrames', SPRING_FREQUENCY: 'springFrequency'};
  return [Arduino.grokEyesVariable(block) + '.' + (methods[block.getFieldValue('PROPERTY')] || methods.EXPRESSION) + '()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['grok_eyes_get_name'] = function(block, generator) {
  Arduino.grokEyesInclude(generator);
  const name = Arduino.grokEyesVariable(block);
  const methods = {EXPRESSION: ['expressionName', 'grokExpression'], SHAPE: ['shapeName', 'shape'], STATE: ['stateName', 'state']};
  const pair = methods[block.getFieldValue('PROPERTY')] || methods.EXPRESSION;
  return ['String(grokEyes::' + pair[0] + '(' + name + '.' + pair[1] + '()))', generator.ORDER_ATOMIC];
};

Arduino.forBlock['grok_eyes_wait'] = function(block, generator) {
  Arduino.grokEyesInclude(generator);
  const duration = Arduino.grokEyesValue(block, generator, 'DURATION', 1000);
  generator.addFunction('grok_eyes_wait',
    'void grok_eyes_wait(grokEyes &eyes, uint32_t duration) {\n' +
    '  const uint32_t start = millis();\n' +
    '  while ((uint32_t)(millis() - start) < duration) {\n' +
    '    eyes.update();\n    delay(1);\n  }\n}');
  return 'grok_eyes_wait(' + Arduino.grokEyesVariable(block) + ', ' + duration + ');\n';
};

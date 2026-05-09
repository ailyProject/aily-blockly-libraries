// Grove手势传感器PAJ7620 generator.js

Arduino.forBlock['gesture_init'] = function(block, generator) {
  generator.addLibrary('Gesture_H', '#include <Gesture.h>');
  generator.addVariable('gesture_sensor', 'paj7620 gesture_sensor;');
  return 'gesture_sensor.init();\n';
};

Arduino.forBlock['gesture_read'] = function(block, generator) {
  generator.addLibrary('Gesture_H', '#include <Gesture.h>');
  generator.addVariable('gesture_sensor', 'paj7620 gesture_sensor;');
  generator.addVariable('gesture_result', 'paj7620_gesture_t gesture_result;');

  generator.addFunction('gesture_readGesture', [
    'int gesture_readGesture() {',
    '  if (gesture_sensor.getResult(gesture_result)) {',
    '    return (int)gesture_result;',
    '  }',
    '  return -1;',
    '}'
  ].join('\n'));

  return ['gesture_readGesture()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['gesture_is'] = function(block, generator) {
  generator.addLibrary('Gesture_H', '#include <Gesture.h>');
  generator.addVariable('gesture_sensor', 'paj7620 gesture_sensor;');
  generator.addVariable('gesture_result', 'paj7620_gesture_t gesture_result;');
  var gesture = block.getFieldValue('GESTURE') || 'UP';

  generator.addFunction('gesture_readGesture', [
    'int gesture_readGesture() {',
    '  if (gesture_sensor.getResult(gesture_result)) {',
    '    return (int)gesture_result;',
    '  }',
    '  return -1;',
    '}'
  ].join('\n'));

  return ['(gesture_readGesture() == (int)' + gesture + ')', generator.ORDER_EQUALITY];
};

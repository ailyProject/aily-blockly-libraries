'use strict';

// ─── Init block ───
Arduino.forBlock['paj7620_init'] = function(block, generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('PAJ7620', '#include "paj7620.h"');

  generator.addSetupBegin('Wire_begin', 'Wire.begin();');

  ensureSerialBegin('Serial', generator);

  return 'paj7620Init();\n';
};

// ─── Get gesture block ───
Arduino.forBlock['paj7620_get_gesture'] = function(block, generator) {
  generator.addLibrary('PAJ7620', '#include "paj7620.h"');

  const helperFunc =
    'String paj7620GetGesture() {\n' +
    '  uint8_t data = 0, data1 = 0;\n' +
    '  paj7620ReadReg(0x43, 1, &data);\n' +
    '  paj7620ReadReg(0x44, 1, &data1);\n' +
    '  if (data & GES_RIGHT_FLAG)         return String("Right");\n' +
    '  else if (data & GES_LEFT_FLAG)     return String("Left");\n' +
    '  else if (data & GES_UP_FLAG)       return String("Up");\n' +
    '  else if (data & GES_DOWN_FLAG)     return String("Down");\n' +
    '  else if (data & GES_FORWARD_FLAG)  return String("Forward");\n' +
    '  else if (data & GES_BACKWARD_FLAG) return String("Backward");\n' +
    '  else if (data & GES_CLOCKWISE_FLAG) return String("Clockwise");\n' +
    '  else if (data & GES_COUNT_CLOCKWISE_FLAG) return String("Anti-clockwise");\n' +
    '  else if (data1 & GES_WAVE_FLAG)    return String("Wave");\n' +
    '  return String("");\n' +
    '}\n';

  generator.addFunction('paj7620GetGesture', helperFunc, true);

  return ['paj7620GetGesture()', generator.ORDER_FUNCTION_CALL];
};



'use strict';

function ensureM5DinMeter(generator) {
  if (typeof ensureM5StackDevice === 'function') {
    ensureM5StackDevice(generator);
    return;
  }
  generator.addLibrary('m5stack_dinmeter', '#include <M5DinMeter.h>');
  generator.addSetupBegin('m5stack_device_begin', 'auto ailyM5Config = M5.config();\nDinMeter.begin(ailyM5Config, true);');
  generator.addLoopBegin('m5stack_device_update', 'DinMeter.update();');
}

Arduino.forBlock['m5dinmeter_encoder_init'] = function(block, generator) {
  ensureM5DinMeter(generator);
  return '';
};

Arduino.forBlock['m5dinmeter_encoder_position'] = function(block, generator) {
  ensureM5DinMeter(generator);
  return ['DinMeter.Encoder.read()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5dinmeter_encoder_delta'] = function(block, generator) {
  ensureM5DinMeter(generator);
  return ['DinMeter.Encoder.readAndReset()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5dinmeter_encoder_write'] = function(block, generator) {
  ensureM5DinMeter(generator);
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC || Arduino.ORDER_ATOMIC) || '0';
  return 'DinMeter.Encoder.write(' + value + ');\n';
};

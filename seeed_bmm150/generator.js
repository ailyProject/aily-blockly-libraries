function ensureBmm150(generator) {
  generator.addLibrary('include_bmm150', '#include "bmm150.h"');
  generator.addVariable('bmm150_object', 'BMM150 bmm150;');
}

Arduino.forBlock['bmm150_init'] = function(block, generator) {
  ensureBmm150(generator);
  generator.addSetupBegin('bmm150_begin', 'bmm150.initialize();');
  return '';
};

Arduino.forBlock['bmm150_retry'] = function(block, generator) {
  ensureBmm150(generator);
  return 'bmm150.initialize();\n';
};

Arduino.forBlock['bmm150_initialized'] = function(block, generator) {
  ensureBmm150(generator);
  return ['bmm150.isInitialized()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bmm150_read_x'] = function(block, generator) {
  ensureBmm150(generator);
  return ["bmm150.readAxis('x')", Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bmm150_read_y'] = function(block, generator) {
  ensureBmm150(generator);
  return ["bmm150.readAxis('y')", Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bmm150_read_z'] = function(block, generator) {
  ensureBmm150(generator);
  return ["bmm150.readAxis('z')", Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bmm150_read_heading'] = function(block, generator) {
  ensureBmm150(generator);
  return ['bmm150.headingDegrees()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bmm150_set_preset_mode'] = function(block, generator) {
  ensureBmm150(generator);
  const mode = block.getFieldValue('MODE') || 'BMM150_PRESETMODE_LOWPOWER';
  return 'if (bmm150.isInitialized()) bmm150.set_presetmode(' + mode + ');\n';
};

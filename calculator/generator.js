// Calculator - Generator
// Global object pattern: uses `Calc` singleton

Arduino.forBlock['calc_begin'] = function(block, generator) {
  generator.addLibrary('Calculator', '#include "calculator.h"');
  return 'Calc.begin();\n';
};

Arduino.forBlock['calc_show'] = function(block, generator) {
  generator.addLibrary('Calculator', '#include "calculator.h"');
  return 'Calc.show();\n';
};

Arduino.forBlock['calc_handle_btns'] = function(block, generator) {
  generator.addLibrary('Calculator', '#include "calculator.h"');
  return 'Calc.handleBtns();\n';
};

Arduino.forBlock['calc_is_edit_mode'] = function(block, generator) {
  generator.addLibrary('Calculator', '#include "calculator.h"');
  return ['Calc.isEditMode()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['calc_reset'] = function(block, generator) {
  generator.addLibrary('Calculator', '#include "calculator.h"');
  return 'Calc.reset();\n';
};

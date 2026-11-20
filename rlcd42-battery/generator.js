// @aily-project/lib-rlcd42-battery

Arduino.forBlock["rlcd42_batt_init"] = function (block, generator) {
  generator.addLibrary('rlcd42_batt', '#include "Battery42.h"');
  return 'batt42Begin();\n';
};

Arduino.forBlock["rlcd42_batt_read"] = function (block, generator) {
  generator.addLibrary('rlcd42_batt', '#include "Battery42.h"');
  return 'batt42Read();\n';
};

Arduino.forBlock["rlcd42_batt_percent"] = function (block, generator) {
  generator.addLibrary('rlcd42_batt', '#include "Battery42.h"');
  return ['batt42Percent()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["rlcd42_batt_voltage"] = function (block, generator) {
  generator.addLibrary('rlcd42_batt', '#include "Battery42.h"');
  return ['batt42Voltage()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["rlcd42_batt_draw"] = function (block, generator) {
  generator.addLibrary('rlcd42_batt', '#include "Battery42.h"');
  generator.addLibrary('rlcd42', '#include "Rlcd42.h"');
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
  const w = generator.valueToCode(block, 'W', Arduino.ORDER_ATOMIC) || '40';
  const h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '18';
  const black = block.getFieldValue('COLOR') === 'BLACK' ? 'true' : 'false';
  const showPct = block.getFieldValue('SHOW_PCT') === 'TRUE';
  if (showPct) {
    // Percentage text sits just right of the body; "100%" is 4 glyphs wide.
    const textX = '(' + x + ') + (' + w + ') + 6';
    return 'batt42DrawMeterWithText(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + black + ', ' + textX + ', 1);\n';
  }
  return 'batt42DrawMeter(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + black + ');\n';
};

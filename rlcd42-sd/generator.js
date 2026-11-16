// @aily-project/lib-rlcd42-sd

Arduino.forBlock["rlcd42_sd_init"] = function (block, generator) {
  generator.addLibrary('rlcd42_sd', '#include "Sd42.h"');
  const clk = generator.valueToCode(block, 'CLK', Arduino.ORDER_ATOMIC) || '38';
  const cmd = generator.valueToCode(block, 'CMD', Arduino.ORDER_ATOMIC) || '21';
  const d0 = generator.valueToCode(block, 'D0', Arduino.ORDER_ATOMIC) || '39';
  return 'sd42Begin(' + clk + ', ' + cmd + ', ' + d0 + ');\n';
};

Arduino.forBlock["rlcd42_sd_ok"] = function (block, generator) {
  generator.addLibrary('rlcd42_sd', '#include "Sd42.h"');
  return ['sd42Ok()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["rlcd42_sd_size_mb"] = function (block, generator) {
  generator.addLibrary('rlcd42_sd', '#include "Sd42.h"');
  return ['sd42SizeMb()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["rlcd42_sd_free_mb"] = function (block, generator) {
  generator.addLibrary('rlcd42_sd', '#include "Sd42.h"');
  return ['sd42FreeMb()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["rlcd42_sd_read"] = function (block, generator) {
  generator.addLibrary('rlcd42_sd', '#include "Sd42.h"');
  const path = generator.valueToCode(block, 'PATH', Arduino.ORDER_ATOMIC) || '"/sdcard/a.txt"';
  return ['sd42ReadFile(' + path + ')', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["rlcd42_sd_write"] = function (block, generator) {
  generator.addLibrary('rlcd42_sd', '#include "Sd42.h"');
  const path = generator.valueToCode(block, 'PATH', Arduino.ORDER_ATOMIC) || '"/sdcard/a.txt"';
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  return 'sd42WriteFile(' + path + ', ' + text + ');\n';
};

Arduino.forBlock["rlcd42_sd_append"] = function (block, generator) {
  generator.addLibrary('rlcd42_sd', '#include "Sd42.h"');
  const path = generator.valueToCode(block, 'PATH', Arduino.ORDER_ATOMIC) || '"/sdcard/a.txt"';
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  return 'sd42AppendFile(' + path + ', ' + text + ');\n';
};

Arduino.forBlock["rlcd42_sd_exists"] = function (block, generator) {
  generator.addLibrary('rlcd42_sd', '#include "Sd42.h"');
  const path = generator.valueToCode(block, 'PATH', Arduino.ORDER_ATOMIC) || '"/sdcard/a.txt"';
  return ['sd42Exists(' + path + ')', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["rlcd42_sd_list"] = function (block, generator) {
  generator.addLibrary('rlcd42_sd', '#include "Sd42.h"');
  const path = generator.valueToCode(block, 'PATH', Arduino.ORDER_ATOMIC) || '"/sdcard"';
  return ['sd42List(' + path + ')', Arduino.ORDER_FUNCTION_CALL];
};

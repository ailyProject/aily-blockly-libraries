// @aily-project/lib-iching-fortune

Arduino.forBlock["iching_kw_index"] = function (block, generator) {
  generator.addLibrary('IchingData', '#include "IchingData.h"');
  const bin = generator.valueToCode(block, 'BIN', Arduino.ORDER_ATOMIC) || '0';
  return ['ichingKwIndex(' + bin + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["iching_name"] = function (block, generator) {
  generator.addLibrary('IchingData', '#include "IchingData.h"');
  const kw = generator.valueToCode(block, 'KW', Arduino.ORDER_ATOMIC) || '0';
  return ['ichingGetName(' + kw + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["iching_guaci"] = function (block, generator) {
  generator.addLibrary('IchingData', '#include "IchingData.h"');
  const kw = generator.valueToCode(block, 'KW', Arduino.ORDER_ATOMIC) || '0';
  return ['ichingGetGuaCi(' + kw + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["iching_xiang"] = function (block, generator) {
  generator.addLibrary('IchingData', '#include "IchingData.h"');
  const kw = generator.valueToCode(block, 'KW', Arduino.ORDER_ATOMIC) || '0';
  return ['ichingGetXiang(' + kw + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["iching_advice"] = function (block, generator) {
  generator.addLibrary('IchingData', '#include "IchingData.h"');
  const kw = generator.valueToCode(block, 'KW', Arduino.ORDER_ATOMIC) || '0';
  const cat = generator.valueToCode(block, 'CAT', Arduino.ORDER_ATOMIC) || '0';
  return ['ichingGetAdvice(' + kw + ', ' + cat + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["liuren_position"] = function (block, generator) {
  generator.addLibrary('IchingData', '#include "IchingData.h"');
  const m = generator.valueToCode(block, 'MONTH', Arduino.ORDER_ATOMIC) || '1';
  const d = generator.valueToCode(block, 'DAY', Arduino.ORDER_ATOMIC) || '1';
  const h = generator.valueToCode(block, 'HOUR', Arduino.ORDER_ATOMIC) || '0';
  return ['liurenPosition(' + m + ', ' + d + ', ' + h + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["liuren_name"] = function (block, generator) {
  generator.addLibrary('IchingData', '#include "IchingData.h"');
  const p = generator.valueToCode(block, 'POS', Arduino.ORDER_ATOMIC) || '0';
  return ['liurenGetName(' + p + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["liuren_meaning"] = function (block, generator) {
  generator.addLibrary('IchingData', '#include "IchingData.h"');
  const p = generator.valueToCode(block, 'POS', Arduino.ORDER_ATOMIC) || '0';
  return ['liurenGetMeaning(' + p + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["liuren_judgment"] = function (block, generator) {
  generator.addLibrary('IchingData', '#include "IchingData.h"');
  const p = generator.valueToCode(block, 'POS', Arduino.ORDER_ATOMIC) || '0';
  return ['liurenGetJudgment(' + p + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["liuren_hour_name"] = function (block, generator) {
  generator.addLibrary('IchingData', '#include "IchingData.h"');
  const h = generator.valueToCode(block, 'HOUR', Arduino.ORDER_ATOMIC) || '0';
  return ['liurenHourName(' + h + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['iching_cat_name'] = function(block, generator) {
generator.addLibrary('IchingData', '#include "IchingData.h"');
const cat = generator.valueToCode(block, 'CAT', Arduino.ORDER_ATOMIC) || '0';
return ['ichingGetCategoryName(' + cat + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['fortune_god_seg_x'] = function(block, generator) {
generator.addLibrary('IchingData', '#include "IchingData.h"');
const p = generator.valueToCode(block, 'POS', Arduino.ORDER_ATOMIC) || '0';
return ['ichingGetGodSegX(' + p + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['fortune_god_seg_y'] = function(block, generator) {
generator.addLibrary('IchingData', '#include "IchingData.h"');
const p = generator.valueToCode(block, 'POS', Arduino.ORDER_ATOMIC) || '0';
return ['ichingGetGodSegY(' + p + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['fortune_draw_palm'] = function(block, generator) {
generator.addLibrary('TFT_eSPI', '#include <TFT_eSPI.h>');
generator.addLibrary('cn_font', '#include "cn_font.h"');
generator.addLibrary('IchingData', '#include "IchingData.h"');
generator.addVariable('tft', 'TFT_eSPI tft = TFT_eSPI();');
return "{\n  tft.fillRect(24, 194, 174, 14, TFT_DARKGREY);\n  tft.fillRect(24, 124, 28, 32, TFT_WHITE);\n  tft.fillRect(24, 158, 28, 32, TFT_WHITE);\n  tft.fillRect(62, 94, 28, 32, TFT_WHITE);\n  tft.fillRect(98, 80, 28, 32, TFT_WHITE);\n  tft.fillRect(134, 94, 28, 32, TFT_WHITE);\n  tft.fillRect(170, 72, 28, 32, TFT_WHITE);\n  tft.fillRect(170, 106, 28, 32, TFT_WHITE);\n  tft.fillRect(170, 140, 28, 32, TFT_WHITE);\n  for (int fg_i = 0; fg_i < 6; fg_i++) { tft.fillRect(ichingGetGodSegX(fg_i), ichingGetGodSegY(fg_i), 28, 32, TFT_WHITE); }\n  for (int fg_i = 0; fg_i < 6; fg_i++) {\n    String fg_n = liurenGetName(fg_i);\n    tftcn_draw_string(ichingGetGodSegX(fg_i) + 6, ichingGetGodSegY(fg_i), fg_n.substring(0, 3), TFT_ORANGE, 1);\n    tftcn_draw_string(ichingGetGodSegX(fg_i) + 6, ichingGetGodSegY(fg_i) + 17, fg_n.substring(3, 6), TFT_ORANGE, 1);\n  }\n  tftcn_draw_string(22, 214, \"拇指\", TFT_LIGHTGREY, 1);\n  tftcn_draw_string(60, 214, \"食指\", TFT_LIGHTGREY, 1);\n  tftcn_draw_string(96, 214, \"中指\", TFT_LIGHTGREY, 1);\n  tftcn_draw_string(132, 214, \"环指\", TFT_LIGHTGREY, 1);\n  tftcn_draw_string(170, 214, \"小指\", TFT_LIGHTGREY, 1);\n}\n";
};

Arduino.forBlock['fortune_light_god'] = function(block, generator) {
const p = generator.valueToCode(block, 'POS', Arduino.ORDER_ATOMIC) || '0';
generator.addLibrary('TFT_eSPI', '#include <TFT_eSPI.h>');
generator.addLibrary('cn_font', '#include "cn_font.h"');
generator.addLibrary('IchingData', '#include "IchingData.h"');
generator.addVariable('tft', 'TFT_eSPI tft = TFT_eSPI();');
return "{\n  for (int fg_i = 0; fg_i < 6; fg_i++) {\n    bool fg_hi = (fg_i == ' + p + ');\n    tft.fillRect(ichingGetGodSegX(fg_i), ichingGetGodSegY(fg_i), 28, 32, fg_hi ? TFT_YELLOW : TFT_WHITE);\n    String fg_n = liurenGetName(fg_i);\n    tftcn_draw_string(ichingGetGodSegX(fg_i) + 6, ichingGetGodSegY(fg_i), fg_n.substring(0, 3), fg_hi ? TFT_BLACK : TFT_ORANGE, 1);\n    tftcn_draw_string(ichingGetGodSegX(fg_i) + 6, ichingGetGodSegY(fg_i) + 17, fg_n.substring(3, 6), fg_hi ? TFT_BLACK : TFT_ORANGE, 1);\n  }\n}\n";
};

Arduino.forBlock['fortune_lunar_month'] = function(block, generator) {
generator.addLibrary('IchingData', '#include "IchingData.h"');
const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
const m = generator.valueToCode(block, 'M', Arduino.ORDER_ATOMIC) || '0';
const d = generator.valueToCode(block, 'D', Arduino.ORDER_ATOMIC) || '0';
return ['fortuneLunarMonth(' + y + ', ' + m + ', ' + d + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['fortune_lunar_day'] = function(block, generator) {
generator.addLibrary('IchingData', '#include "IchingData.h"');
const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
const m = generator.valueToCode(block, 'M', Arduino.ORDER_ATOMIC) || '0';
const d = generator.valueToCode(block, 'D', Arduino.ORDER_ATOMIC) || '0';
return ['fortuneLunarDay(' + y + ', ' + m + ', ' + d + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['fortune_hour_index'] = function(block, generator) {
generator.addLibrary('IchingData', '#include "IchingData.h"');
const h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '0';
return ['fortuneHourIndex(' + h + ')', Arduino.ORDER_ATOMIC];
};

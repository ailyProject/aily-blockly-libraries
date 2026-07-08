// lib-ui-animation generator.js
// UI动画库代码生成器

Arduino.forBlock['ui_begin'] = function(block, generator) {
  const tftField = block.getField('TFT');
  const tftVar = tftField ? tftField.getText() : 'tft';
  generator.addLibrary('UIAnimation', '#include "ui_animation.h"');
  return 'UI.begin(&' + tftVar + ', &u8f);\n';
};

Arduino.forBlock['ui_set_font'] = function(block, generator) {
  const font = block.getFieldValue('FONT') || 'chinese_city_gb2312';
  generator.addLibrary('UIAnimation', '#include "ui_animation.h"');
  return 'UI.setFont(' + font + ');\n';
};

Arduino.forBlock['ui_set_fg_color'] = function(block, generator) {
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0xFFFF';
  generator.addLibrary('UIAnimation', '#include "ui_animation.h"');
  return 'UI.setFgColor(' + color + ');\n';
};

Arduino.forBlock['ui_print_cn'] = function(block, generator) {
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  generator.addLibrary('UIAnimation', '#include "ui_animation.h"');
  return 'UI.printCn(' + x + ', ' + y + ', String(' + text + '));\n';
};

Arduino.forBlock['ui_welcome'] = function(block, generator) {
  const title = block.getFieldValue('TITLE') || 'Powered by';
  const name = block.getFieldValue('NAME') || 'Bryan';
  const subtitle = block.getFieldValue('SUBTITLE') || 'WEATHER STATION';
  generator.addLibrary('UIAnimation', '#include "ui_animation.h"');
  return 'UI.welcome("' + title + '", "' + name + '", "' + subtitle + '");\n';
};

Arduino.forBlock['ui_walk_init'] = function(block, generator) {
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '70';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '4';
  const w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '60';
  const h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '90';
  const fps = generator.valueToCode(block, 'FPS', generator.ORDER_ATOMIC) || '80';
  generator.addLibrary('UIAnimation', '#include "ui_animation.h"');
  return 'UI.walkInit(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + fps + ');\n';
};

Arduino.forBlock['ui_walk_frames'] = function(block, generator) {
  const arr = block.getFieldValue('ARR') || 'epd_bitmap_allArray';
  const count = generator.valueToCode(block, 'COUNT', generator.ORDER_ATOMIC) || '7';
  const sw = generator.valueToCode(block, 'SW', generator.ORDER_ATOMIC) || '80';
  const sh = generator.valueToCode(block, 'SH', generator.ORDER_ATOMIC) || '120';
  generator.addLibrary('UIAnimation', '#include "ui_animation.h"');
  return 'UI.walkSetFrames((const unsigned char**)' + arr + ', ' + count + ', ' + sw + ', ' + sh + ');\n';
};

Arduino.forBlock['ui_walk_update'] = function(block, generator) {
  generator.addLibrary('UIAnimation', '#include "ui_animation.h"');
  return 'UI.walkUpdate();\n';
};

Arduino.forBlock['ui_strength_init'] = function(block, generator) {
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '40';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '4';
  const w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '80';
  const h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '120';
  generator.addLibrary('UIAnimation', '#include "ui_animation.h"');
  return 'UI.strengthInit(' + x + ', ' + y + ', ' + w + ', ' + h + ');\n';
};

Arduino.forBlock['ui_strength_frames'] = function(block, generator) {
  const arr = block.getFieldValue('ARR') || 'strongFrames';
  const count = generator.valueToCode(block, 'COUNT', generator.ORDER_ATOMIC) || '4';
  generator.addLibrary('UIAnimation', '#include "ui_animation.h"');
  return 'UI.strengthSetFrames((const unsigned char**)' + arr + ', ' + count + ');\n';
};

Arduino.forBlock['ui_strength_play'] = function(block, generator) {
  const cycles = generator.valueToCode(block, 'CYCLES', generator.ORDER_ATOMIC) || '3';
  const delayMs = generator.valueToCode(block, 'DELAY', generator.ORDER_ATOMIC) || '150';
  generator.addLibrary('UIAnimation', '#include "ui_animation.h"');
  return 'UI.strengthPlay(' + cycles + ', ' + delayMs + ');\n';
};

Arduino.forBlock['ui_draw_bg'] = function(block, generator) {
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '160';
  const h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '128';
  generator.addLibrary('UIAnimation', '#include "ui_animation.h"');
  return 'UI.drawBg(' + x + ', ' + y + ', ' + w + ', ' + h + ');\n';
};

Arduino.forBlock['ui_draw_stars'] = function(block, generator) {
  generator.addLibrary('UIAnimation', '#include "ui_animation.h"');
  return 'UI.drawStars();\n';
};

Arduino.forBlock['ui_btn_add'] = function(block, generator) {
  const id = block.getFieldValue('ID') || '0';
  const pin = block.getFieldValue('PIN') || '27';
  generator.addLibrary('UIAnimation', '#include "ui_animation.h"');
  return 'UI.btnAdd(' + id + ', ' + pin + ');\n';
};

Arduino.forBlock['ui_btn_scan'] = function(block, generator) {
  generator.addLibrary('UIAnimation', '#include "ui_animation.h"');
  return 'UI.btnScan();\n';
};

Arduino.forBlock['ui_btn_pressed'] = function(block, generator) {
  const id = block.getFieldValue('ID') || '0';
  generator.addLibrary('UIAnimation', '#include "ui_animation.h"');
  return ['UI.btnPressed(' + id + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['ui_btn_is_pressed'] = function(block, generator) {
  const id = block.getFieldValue('ID') || '0';
  generator.addLibrary('UIAnimation', '#include "ui_animation.h"');
  return ['UI.btnIsPressed(' + id + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['ui_btn_set_debounce'] = function(block, generator) {
  const ms = generator.valueToCode(block, 'MS', generator.ORDER_ATOMIC) || '200';
  generator.addLibrary('UIAnimation', '#include "ui_animation.h"');
  return 'UI.btnSetDebounce(' + ms + ');\n';
};

Arduino.forBlock['ui_page_count'] = function(block, generator) {
  const count = generator.valueToCode(block, 'COUNT', generator.ORDER_ATOMIC) || '3';
  generator.addLibrary('UIAnimation', '#include "ui_animation.h"');
  return 'UI.pageSetCount(' + count + ');\n';
};

Arduino.forBlock['ui_page_current'] = function(block, generator) {
  generator.addLibrary('UIAnimation', '#include "ui_animation.h"');
  return ['UI.pageGetCurrent()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['ui_page_changed'] = function(block, generator) {
  generator.addLibrary('UIAnimation', '#include "ui_animation.h"');
  return ['UI.pageChanged()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['ui_page_next'] = function(block, generator) {
  generator.addLibrary('UIAnimation', '#include "ui_animation.h"');
  return 'UI.pageNext();\n';
};

Arduino.forBlock['ui_page_prev'] = function(block, generator) {
  generator.addLibrary('UIAnimation', '#include "ui_animation.h"');
  return 'UI.pagePrev();\n';
};

Arduino.forBlock['ui_page_set'] = function(block, generator) {
  const page = generator.valueToCode(block, 'PAGE', generator.ORDER_ATOMIC) || '0';
  generator.addLibrary('UIAnimation', '#include "ui_animation.h"');
  return 'UI.pageSetCurrent(' + page + ');\n';
};

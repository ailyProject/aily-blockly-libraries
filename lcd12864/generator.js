// @aily-project/lib-lcd12864

Arduino.forBlock["lcd12864_init"] = function (block, generator) {
  generator.addLibrary('lcd12864', '#include "LCD12864.h"');
  const cs = block.getFieldValue('CS');
  const sid = block.getFieldValue('SID');
  const sclk = block.getFieldValue('SCLK');
  return 'LCD12864.begin(' + cs + ', ' + sid + ', ' + sclk + ');\n';
};

Arduino.forBlock["lcd12864_clear"] = function (block, generator) {
  generator.addLibrary('lcd12864', '#include "LCD12864.h"');
  return 'LCD12864.clear();\n';
};

Arduino.forBlock["lcd12864_print"] = function (block, generator) {
  generator.addLibrary('lcd12864', '#include "LCD12864.h"');
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  return 'LCD12864.print(' + text + ');\n';
};

Arduino.forBlock["lcd12864_autowrap"] = function (block, generator) {
  generator.addLibrary('lcd12864', '#include "LCD12864.h"');
  const on = block.getFieldValue('MODE') === 'on';
  return 'LCD12864.setAutoWrap(' + (on ? 'true' : 'false') + ');\n';
};

Arduino.forBlock["lcd12864_stopfull"] = function (block, generator) {
  generator.addLibrary('lcd12864', '#include "LCD12864.h"');
  const on = block.getFieldValue('MODE') === 'on';
  return 'LCD12864.setStopAtFull(' + (on ? 'true' : 'false') + ');\n';
};

Arduino.forBlock["lcd12864_halfpad"] = function (block, generator) {
  generator.addLibrary('lcd12864', '#include "LCD12864.h"');
  const on = block.getFieldValue('MODE') === 'on';
  return 'LCD12864.setHalfWidthPad(' + (on ? 'true' : 'false') + ');\n';
};

Arduino.forBlock["lcd12864_encoding"] = function (block, generator) {
  generator.addLibrary('lcd12864', '#include "LCD12864.h"');
  const enc = block.getFieldValue('ENC');
  return 'LCD12864.setEncoding(' + (enc === 'gb2312' ? 'LCD12864_ENC_GB2312' : 'LCD12864_ENC_UTF8') + ');\n';
};

Arduino.forBlock["lcd12864_home"] = function (block, generator) {
  generator.addLibrary('lcd12864', '#include "LCD12864.h"');
  return 'LCD12864.home();\n';
};

Arduino.forBlock["lcd12864_setcursor"] = function (block, generator) {
  generator.addLibrary('lcd12864', '#include "LCD12864.h"');
  const col = generator.valueToCode(block, 'COL', Arduino.ORDER_ATOMIC) || '0';
  const row = generator.valueToCode(block, 'ROW', Arduino.ORDER_ATOMIC) || '0';
  return 'LCD12864.setCursor(' + col + ', ' + row + ');\n';
};

Arduino.forBlock["lcd12864_cgram"] = function (block, generator) {
  generator.addLibrary('lcd12864', '#include "LCD12864.h"');
  const index = block.getFieldValue('INDEX');
  const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC) || '""';
  return 'LCD12864.writeCGRAM(' + index + ', ' + data + ');\n';
};

Arduino.forBlock["lcd12864_cgram_char"] = function (block, generator) {
  generator.addLibrary('lcd12864', '#include "LCD12864.h"');
  const index = block.getFieldValue('INDEX');
  return 'LCD12864.writeCGRAMChar(' + index + ');\n';
};

Arduino.forBlock["lcd12864_invert"] = function (block, generator) {
  generator.addLibrary('lcd12864', '#include "LCD12864.h"');
  const on = block.getFieldValue('MODE') === 'on';
  return 'LCD12864.setInvert(' + (on ? 'true' : 'false') + ');\n';
};

Arduino.forBlock["lcd12864_graphic"] = function (block, generator) {
  generator.addLibrary('lcd12864', '#include "LCD12864.h"');
  const on = block.getFieldValue('MODE') === 'on';
  return on ? 'LCD12864.enterGraphicMode();\n' : 'LCD12864.exitGraphicMode();\n';
};

// @aily-project/lib-inksight generator
// Wraps the InkSight /api/render client (src/InkSight) for Aily Blockly.

function inksightEscapeCString(value) {
  return String(value == null ? '' : value)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');
}

Arduino.forBlock['inksight_wifi'] = function (block, generator) {
  var ssid = inksightEscapeCString(block.getFieldValue('SSID'));
  var password = inksightEscapeCString(block.getFieldValue('PASSWORD'));
  generator.addLibrary('InkSight', '#include <InkSight.h>');
  return 'inksightWifiBegin("' + ssid + '", "' + password + '");\n';
};

Arduino.forBlock['inksight_setup'] = function (block, generator) {
  var server = inksightEscapeCString(block.getFieldValue('SERVER'));
  var token = inksightEscapeCString(block.getFieldValue('TOKEN'));
  generator.addLibrary('InkSight', '#include <InkSight.h>');
  return 'inksightBegin("' + server + '", "' + token + '");\n';
};

Arduino.forBlock['inksight_pair'] = function (block, generator) {
  var code = inksightEscapeCString(block.getFieldValue('PAIRCODE'));
  generator.addLibrary('InkSight', '#include <InkSight.h>');
  return 'inksightPair("' + code + '");\n';
};

Arduino.forBlock['inksight_fetch'] = function (block, generator) {
  generator.addLibrary('InkSight', '#include <InkSight.h>');
  return ['inksightFetch(20000)', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['inksight_draw'] = function (block, generator) {
  var varName = generator.getValue(block, 'VAR', 'field_variable');
  generator.addLibrary('InkSight', '#include <InkSight.h>');
  generator.addLibrary('Adafruit_GFX', '#include <Adafruit_GFX.h>');
  generator.addLibrary('GxEPD2_3C', '#include <GxEPD2_3C.h>');
  return varName + '.fillScreen(GxEPD_WHITE);\n' +
    varName + '.drawInvertedBitmap(0, 0, inksightImage(), INKSIGHT_WIDTH, INKSIGHT_HEIGHT, GxEPD_BLACK);\n';
};

Arduino.forBlock['inksight_draw_color'] = function (block, generator) {
  var varName = generator.getValue(block, 'VAR', 'field_variable');
  generator.addLibrary('InkSight', '#include <InkSight.h>');
  generator.addLibrary('Adafruit_GFX', '#include <Adafruit_GFX.h>');
  generator.addLibrary('GxEPD2_3C', '#include <GxEPD2_3C.h>');
  return 'inksightDrawColor(' + varName + ');\n';
};

Arduino.forBlock['inksight_mode'] = function (block, generator) {
  var mode = block.getFieldValue('MODE') || 'INTERVAL';
  generator.addLibrary('InkSight', '#include <InkSight.h>');
  return 'inksightSetMode(' + (mode === 'ACTIVE' ? 'true' : 'false') + ');\n';
};

Arduino.forBlock['inksight_changed'] = function (block, generator) {
  generator.addLibrary('InkSight', '#include <InkSight.h>');
  return ['inksightContentChanged()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['inksight_show_cached'] = function (block, generator) {
  var varName = generator.getValue(block, 'VAR', 'field_variable');
  generator.addLibrary('InkSight', '#include <InkSight.h>');
  generator.addLibrary('Adafruit_GFX', '#include <Adafruit_GFX.h>');
  generator.addLibrary('GxEPD2_3C', '#include <GxEPD2_3C.h>');
  return 'if (inksightRestoreCache()) {\n' +
    '  ' + varName + '.setFullWindow();\n' +
    '  ' + varName + '.firstPage();\n' +
    '  do {\n' +
    '    inksightDrawColor(' + varName + ');\n' +
    '  } while (' + varName + '.nextPage());\n' +
    '  ' + varName + '.hibernate();\n' +
    '}\n';
};

Arduino.forBlock['inksight_led'] = function (block, generator) {
  var pin = block.getFieldValue('PIN') || '4';
  generator.addLibrary('InkSight', '#include <InkSight.h>');
  return 'inksightLedBegin(' + pin + ');\n';
};

Arduino.forBlock['inksight_red_style'] = function (block, generator) {
  var style = block.getFieldValue('STYLE') || 'BLACK';
  var v = style === 'YELLOW' ? 1 : (style === 'RED' ? 2 : 0);
  generator.addLibrary('InkSight', '#include <InkSight.h>');
  return 'inksightSetRedStyle(' + v + ');\n';
};

Arduino.forBlock['inksight_colors'] = function (block, generator) {
  var mode = block.getFieldValue('MODE') || 'COLOR';
  generator.addLibrary('InkSight', '#include <InkSight.h>');
  return 'inksightSetColorMode(' + (mode === 'COLOR' ? 'true' : 'false') + ');\n';
};

Arduino.forBlock['inksight_ready'] = function (block, generator) {
  generator.addLibrary('InkSight', '#include <InkSight.h>');
  return ['inksightHasImage()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['inksight_refresh_ms'] = function (block, generator) {
  generator.addLibrary('InkSight', '#include <InkSight.h>');
  return ['inksightRefreshMs()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['inksight_due'] = function (block, generator) {
  generator.addLibrary('InkSight', '#include <InkSight.h>');
  return ['inksightDue()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['inksight_error'] = function (block, generator) {
  generator.addLibrary('InkSight', '#include <InkSight.h>');
  return ['inksightLastError()', Arduino.ORDER_ATOMIC];
};

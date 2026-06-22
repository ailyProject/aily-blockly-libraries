/**
 * Sentry Vision Sensor - Code Generator
 * Supports Sentry1 and Sentry2 vision sensors
 */

// LED color mapping
var ledColorMap = {
  'kLedClose': 'kLedClose',
  'kLedRed': 'kLedRed',
  'kLedGreen': 'kLedGreen',
  'kLedYellow': 'kLedYellow',
  'kLedBlue': 'kLedBlue',
  'kLedPurple': 'kLedPurple',
  'kLedCyan': 'kLedCyan',
  'kLedWhite': 'kLedWhite'
};

// ======================== Sentry2 Begin ========================
Arduino.forBlock['sentry2_begin'] = function(block, generator) {
  var port = block.getFieldValue('PORT') || 'Wire';
  var addr = block.getFieldValue('ADDR') || '0x60';

  generator.addLibrary('Sentry', '#include <Sentry.h>');
  generator.addObject('sentry', 'Sentry2 sentry(' + addr + ');');

  if (port === 'Wire') {
    generator.addLibrary('Wire', '#include <Wire.h>');
    var wireBeginKey = 'wire_Wire_begin';
    if (!generator.setupCodes_ || !generator.setupCodes_[wireBeginKey]) {
      generator.addSetup(wireBeginKey, 'Wire.begin();\n');
    }
    return 'while (SENTRY_OK != sentry.begin(&Wire)) {yield();}\n';
  } else {
    ensureSerialBegin(port, generator, 9600);
    return 'while (SENTRY_OK != sentry.begin(&' + port + ')) {yield();}\n';
  }
};

Arduino.forBlock['sentry2_set_default'] = function(block, generator) {
  return 'sentry.SensorSetDefault();\n';
};

Arduino.forBlock['sentry2_set_vision_status'] = function(block, generator) {
  var status = block.getFieldValue('STATUS');
  var vision = block.getFieldValue('VISION');
  return 'sentry.Vision' + status + '(' + vision + ');\n';
};

Arduino.forBlock['sentry2_set_awb'] = function(block, generator) {
  var awb = block.getFieldValue('AWB');
  return 'sentry.CameraSetAwb(' + awb + ');\n';
};

Arduino.forBlock['sentry2_set_param_num'] = function(block, generator) {
  var vision = block.getFieldValue('VISION');
  var num = generator.valueToCode(block, 'NUM', generator.ORDER_ATOMIC) || '1';
  return 'sentry.SetParamNum(' + vision + ',' + num + ');\n';
};

Arduino.forBlock['sentry2_set_color_param'] = function(block, generator) {
  var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '50';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '50';
  var w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '3';
  var h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '4';
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '1';

  generator.addVariable('sentry_object_t param', 'sentry_object_t param;\n');

  var code = '';
  code += 'param.x_value = ' + x + ';\n';
  code += 'param.y_value = ' + y + ';\n';
  code += 'param.width = ' + w + ';\n';
  code += 'param.height = ' + h + ';\n';
  code += 'param.label = 0;\n';
  code += 'sentry.SetParam(Sentry2::kVisionColor,&param,' + index + ');\n';
  return code;
};

Arduino.forBlock['sentry2_set_blob_param'] = function(block, generator) {
  var w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '3';
  var h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '4';
  var color = block.getFieldValue('COLOR');
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '1';

  generator.addVariable('sentry_object_t param', 'sentry_object_t param;\n');

  var code = '';
  code += 'param.x_value = 0;\n';
  code += 'param.y_value = 0;\n';
  code += 'param.width = ' + w + ';\n';
  code += 'param.height = ' + h + ';\n';
  code += 'param.label = ' + color + ';\n';
  code += 'sentry.SetParam(Sentry2::kVisionBlob,&param,' + index + ');\n';
  return code;
};

Arduino.forBlock['sentry2_set_custom_param'] = function(block, generator) {
  var vision = block.getFieldValue('VISION');
  var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  var w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '0';
  var h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '0';
  var label = generator.valueToCode(block, 'LABEL', generator.ORDER_ATOMIC) || '0';
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '1';

  generator.addVariable('sentry_object_t param', 'sentry_object_t param;\n');

  var code = '';
  code += 'param.x_value = ' + x + ';\n';
  code += 'param.y_value = ' + y + ';\n';
  code += 'param.width = ' + w + ';\n';
  code += 'param.height = ' + h + ';\n';
  code += 'param.label = ' + label + ';\n';
  code += 'sentry.SetParam(' + vision + ',&param,' + index + ');\n';
  return code;
};

// ======================== Sentry2 Value Blocks ========================
Arduino.forBlock['sentry2_detected_count'] = function(block, generator) {
  var vision = block.getFieldValue('VISION');
  return ['sentry.GetValue(' + vision + ', kStatus)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sentry2_get_value'] = function(block, generator) {
  var vision = block.getFieldValue('VISION');
  var value = block.getFieldValue('VALUE');
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '1';
  return ['sentry.GetValue(' + vision + ',' + value + ',' + index + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sentry2_get_color_value'] = function(block, generator) {
  var value = block.getFieldValue('VALUE');
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '1';
  return ['sentry.GetValue(Sentry2::kVisionColor,' + value + ',' + index + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sentry2_get_line_value'] = function(block, generator) {
  var value = block.getFieldValue('VALUE');
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '1';
  return ['sentry.GetValue(Sentry2::kVisionLine,' + value + ',' + index + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sentry2_get_qr_value'] = function(block, generator) {
  return ['String(sentry.GetQrCodeValue())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sentry2_get_qr_position'] = function(block, generator) {
  var value = block.getFieldValue('VALUE');
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '1';
  return ['sentry.GetValue(Sentry2::kVisionQrCode,' + value + ',' + index + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sentry2_get_custom_value'] = function(block, generator) {
  var value = block.getFieldValue('VALUE');
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '1';
  return ['sentry.GetValue(Sentry2::kVisionCustom,' + value + ',' + index + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sentry2_check_blob_color'] = function(block, generator) {
  var color = block.getFieldValue('COLOR');
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '1';
  return ['(sentry.GetValue(Sentry2::kVisionBlob,kLabel,' + index + ')==' + color + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sentry2_check_card'] = function(block, generator) {
  var card = block.getFieldValue('CARD');
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '1';
  return ['(sentry.GetValue(Sentry2::kVisionCard,kLabel,' + index + ')==' + card + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sentry2_check_20class'] = function(block, generator) {
  var cls = block.getFieldValue('CLASS');
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '1';
  return ['(sentry.GetValue(Sentry2::kVision20Classes,kLabel,' + index + ')==' + cls + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sentry2_rows'] = function(block, generator) {
  return ['sentry.rows()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sentry2_cols'] = function(block, generator) {
  return ['sentry.cols()', generator.ORDER_ATOMIC];
};

// ======================== Sentry1 Begin ========================
Arduino.forBlock['sentry1_begin'] = function(block, generator) {
  var port = block.getFieldValue('PORT') || 'Wire';
  var addr = block.getFieldValue('ADDR') || '0x60';

  generator.addLibrary('Sentry', '#include <Sentry.h>');
  generator.addObject('sentry1', 'Sentry1 sentry1(' + addr + ');');

  if (port === 'Wire') {
    generator.addLibrary('Wire', '#include <Wire.h>');
    var wireBeginKey = 'wire_Wire_begin';
    if (!generator.setupCodes_ || !generator.setupCodes_[wireBeginKey]) {
      generator.addSetup(wireBeginKey, 'Wire.begin();\n');
    }
    return 'while (SENTRY_OK != sentry1.begin(&Wire)) {yield();}\n';
  } else {
    ensureSerialBegin(port, generator, 9600);
    return 'while (SENTRY_OK != sentry1.begin(&' + port + ')) {yield();}\n';
  }
};

Arduino.forBlock['sentry1_set_default'] = function(block, generator) {
  return 'sentry1.SensorSetDefault();\n';
};

Arduino.forBlock['sentry1_led_set_color'] = function(block, generator) {
  var color1 = ledColorMap[block.getFieldValue('COLOR1')] || 'kLedClose';
  var color2 = ledColorMap[block.getFieldValue('COLOR2')] || 'kLedClose';
  var level = generator.valueToCode(block, 'LEVEL', generator.ORDER_ATOMIC) || '1';
  return 'sentry1.LedSetColor(' + color1 + ',' + color2 + ',' + level + ');\n';
};

Arduino.forBlock['sentry1_set_vision_status'] = function(block, generator) {
  var status = block.getFieldValue('STATUS');
  var vision = block.getFieldValue('VISION');
  return 'sentry1.Vision' + status + '(' + vision + ');\n';
};

Arduino.forBlock['sentry1_set_awb'] = function(block, generator) {
  var awb = block.getFieldValue('AWB');
  return 'sentry1.CameraSetAwb(' + awb + ');\n';
};

Arduino.forBlock['sentry1_set_param_num'] = function(block, generator) {
  var vision = block.getFieldValue('VISION');
  var num = generator.valueToCode(block, 'NUM', generator.ORDER_ATOMIC) || '1';
  return 'sentry1.SetParamNum(' + vision + ',' + num + ');\n';
};

Arduino.forBlock['sentry1_set_color_param'] = function(block, generator) {
  var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '50';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '50';
  var w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '3';
  var h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '4';

  generator.addVariable('sentry_object_t param', 'sentry_object_t param;\n');

  var code = '';
  code += 'param.x_value = ' + x + ';\n';
  code += 'param.y_value = ' + y + ';\n';
  code += 'param.width = ' + w + ';\n';
  code += 'param.height = ' + h + ';\n';
  code += 'param.label = 0;\n';
  code += 'sentry1.SetParam(Sentry1::kVisionColor,&param,1);\n';
  return code;
};

Arduino.forBlock['sentry1_set_blob_param'] = function(block, generator) {
  var w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '3';
  var h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '4';
  var color = block.getFieldValue('COLOR');

  generator.addVariable('sentry_object_t param', 'sentry_object_t param;\n');

  var code = '';
  code += 'param.x_value = 0;\n';
  code += 'param.y_value = 0;\n';
  code += 'param.width = ' + w + ';\n';
  code += 'param.height = ' + h + ';\n';
  code += 'param.label = ' + color + ';\n';
  code += 'sentry1.SetParam(Sentry1::kVisionBlob,&param,1);\n';
  return code;
};

// ======================== Sentry1 Value Blocks ========================
Arduino.forBlock['sentry1_detected_count'] = function(block, generator) {
  var vision = block.getFieldValue('VISION');
  return ['sentry1.GetValue(' + vision + ', kStatus)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sentry1_get_value'] = function(block, generator) {
  var vision = block.getFieldValue('VISION');
  var value = block.getFieldValue('VALUE');
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '1';
  return ['sentry1.GetValue(' + vision + ',' + value + ',' + index + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sentry1_get_color_value'] = function(block, generator) {
  var value = block.getFieldValue('VALUE');
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '1';
  return ['sentry1.GetValue(Sentry1::kVisionColor,' + value + ',' + index + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sentry1_get_line_value'] = function(block, generator) {
  var value = block.getFieldValue('VALUE');
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '1';
  return ['sentry1.GetValue(Sentry1::kVisionLine,' + value + ',' + index + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sentry1_get_qr_value'] = function(block, generator) {
  return ['String(sentry1.GetQrCodeValue())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sentry1_get_qr_position'] = function(block, generator) {
  var value = block.getFieldValue('VALUE');
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '1';
  return ['sentry1.GetValue(Sentry1::kVisionQrCode,' + value + ',' + index + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sentry1_check_blob_color'] = function(block, generator) {
  var color = block.getFieldValue('COLOR');
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '1';
  return ['(sentry1.GetValue(Sentry1::kVisionBlob,kLabel,' + index + ')==' + color + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sentry1_check_card'] = function(block, generator) {
  var card = block.getFieldValue('CARD');
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '1';
  return ['(sentry1.GetValue(Sentry1::kVisionCard,kLabel,' + index + ')==' + card + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sentry1_check_ball'] = function(block, generator) {
  var ball = block.getFieldValue('BALL');
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '1';
  return ['(sentry1.GetValue(Sentry1::kVisionBall,kLabel,' + index + ')==' + ball + ')', generator.ORDER_ATOMIC];
};

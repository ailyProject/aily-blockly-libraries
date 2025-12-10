'use strict';

// Sentry2视觉传感器库的代码生成器

// I2C初始化块
Arduino.forBlock['sentry2_begin_i2c'] = function(block, generator) {
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '96';
  const wire = block.getFieldValue('WIRE') || 'Wire';
  
  // 添加库引用
  generator.addLibrary('SentryInclude', '#include <Sentry.h>');
  generator.addLibrary('WireInclude', '#include <Wire.h>');
  

  const addressNum = parseInt(address);
  const addressHex = isNaN(addressNum) ? address : '0x' + addressNum.toString(16).toUpperCase();

  generator.addObject('sentry.Object', 'Sentry2 sentry(' + addressHex + ');');
  
  //串口初始化
  if (!Arduino.addedSerialInitCode) Arduino.addedSerialInitCode = new Set();
  if (!Arduino.addedSerialInitCode.has('Serial')) {
    generator.addSetupBegin('serial_Serial_begin', 'Serial.begin(115200);');
    Arduino.addedSerialInitCode.add('Serial');
  }
  
  generator.addSetup(`wire_${wire}_begin`, '' + wire + '.begin(); // 初始化I2C ' + wire);
  
  // 传感器初始化代码（在积木块位置执行）
  let code = 'while (SENTRY_OK != sentry.begin(&' + wire + ')) {\n';
  code += '  Serial.println("Sentry2 init failed!");\n';
  code += '  yield();\n';
  code += '}\n';
  
  return code;
};

// 设置白平衡模式
Arduino.forBlock['sentry2_camera_set_awb'] = function(block, generator) {
  const awb = block.getFieldValue('AWB');
  return 'sentry.CameraSetAwb(' + awb + ');\n';
};

// 设置算法开关
Arduino.forBlock['sentry2_vision_set'] = function(block, generator) {
  const vision_type = block.getFieldValue('VISION_TYPE');
  const vision_sta = block.getFieldValue('VISION_STA');
  return vision_sta === 'ON' ? 'sentry.VisionBegin(' + vision_type + ');\n' : 'sentry.VisionEnd(' + vision_type + ');\n';
};

// 设置参数组数量
Arduino.forBlock['sentry2_set_param_num'] = function(block, generator) {
  const vision_type = block.getFieldValue('VISION_TYPE');
  const num = block.getFieldValue('NUM');
  return 'sentry.SetParamNum(' + vision_type + ', (int)' + num + ');\n';
};

// 设置颜色识别参数
Arduino.forBlock['sentry2_set_color_param'] = function(block, generator) {
  const num = block.getFieldValue('NUM');
  const x = block.getFieldValue('XVALUE');
  const y = block.getFieldValue('YVALUE');
  const w = block.getFieldValue('WIDTH');
  const h = block.getFieldValue('HIGHT');
  generator.addObject('param_obj', 'sentry_object_t param;');
  let code = 'param.x_value = ' + x + ';\nparam.y_value = ' + y + ';\nparam.width = ' + w + ';\nparam.height = ' + h + ';\n';
  code += 'sentry.SetParam(Sentry2::kVisionColor, &param, (int)' + num + ');\n';
  return code;
};

// 设置色块检测参数
Arduino.forBlock['sentry2_set_blob_param'] = function(block, generator) {
  const num = block.getFieldValue('NUM');
  const l = block.getFieldValue('COLOR_LABLE');
  const w = block.getFieldValue('WIDTH');
  const h = block.getFieldValue('HIGHT');
  generator.addObject('param_obj', 'sentry_object_t param;');
  let code = 'param.width = ' + w + ';\nparam.height = ' + h + ';\nparam.label = ' + l + ';\n';
  code += 'sentry.SetParam(Sentry2::kVisionBlob, &param, (int)' + num + ');\n';
  return code;
};

// 设置自定义视觉算法参数
Arduino.forBlock['sentry2_set_vision_param'] = function(block, generator) {
  const vision_type = block.getFieldValue('VISION_TYPE');
  const num = block.getFieldValue('NUM');
  const x = block.getFieldValue('XVALUE');
  const y = block.getFieldValue('YVALUE');
  const w = block.getFieldValue('WIDTH');
  const h = block.getFieldValue('HIGHT');
  const l = block.getFieldValue('COLOR_LABLE');
  generator.addObject('param_obj', 'sentry_object_t param;');
  let code = 'param.x_value = ' + x + ';\nparam.y_value = ' + y + ';\nparam.width = ' + w + ';\nparam.height = ' + h + ';\nparam.label = ' + l + ';\n';
  code += 'sentry.SetParam(' + vision_type + ', &param, (int)' + num + ');\n';
  return code;
};

// 获取算法结果数量
Arduino.forBlock['sentry2_get_vision_result'] = function(block, generator) {
  const vision_type = block.getFieldValue('VISION_TYPE');
  const code = 'sentry.GetValue(' + vision_type + ', kStatus)';
  return [code, Arduino.ORDER_ATOMIC];
};

// 获取颜色识别值
Arduino.forBlock['sentry2_get_color_value'] = function(block, generator) {
  const num = block.getFieldValue('NUM');
  const obj = block.getFieldValue('OBJ_INFO');
  const code = 'sentry.GetValue(Sentry2::kVisionColor, ' + obj + ', (int)' + num + ')';
  return [code, Arduino.ORDER_ATOMIC];
};

// 获取通用算法值
Arduino.forBlock['sentry2_get_value'] = function(block, generator) {
  const vision_type = block.getFieldValue('VISION_TYPE');
  const num = block.getFieldValue('NUM');
  const obj = block.getFieldValue('OBJ_INFO');
  const code = 'sentry.GetValue(' + vision_type + ', ' + obj + ', (int)' + num + ')';
  return [code, Arduino.ORDER_ATOMIC];
};

// 获取线条检测值
Arduino.forBlock['sentry2_get_line_value'] = function(block, generator) {
  const num = block.getFieldValue('NUM');
  const obj = block.getFieldValue('OBJ_INFO');
  const code = 'sentry.GetValue(Sentry2::kVisionLine, ' + obj + ', (int)' + num + ')';
  return [code, Arduino.ORDER_ATOMIC];
};

// 获取二维码识别值
Arduino.forBlock['sentry2_get_qrcode_value'] = function(block, generator) {
  const num = block.getFieldValue('NUM');
  const obj = block.getFieldValue('OBJ_INFO');
  const code = 'sentry.GetValue(Sentry2::kVisionQrCode, ' + obj + ', (int)' + num + ')';
  return [code, Arduino.ORDER_ATOMIC];
};

// 获取二维码字符串
Arduino.forBlock['sentry2_get_qrcode_value_str'] = function(block, generator) {
  const code = 'String(sentry.GetQrCodeValue())';
  return [code, Arduino.ORDER_ATOMIC];
};

// 获取自定义算法值
Arduino.forBlock['sentry2_get_custom_value'] = function(block, generator) {
  const vision_type = block.getFieldValue('VISION_TYPE');
  const num = block.getFieldValue('NUM');
  const obj = block.getFieldValue('OBJ_INFO');
  const code = 'sentry.GetValue(' + vision_type + ', ' + obj + ', (int)' + num + ')';
  return [code, Arduino.ORDER_ATOMIC];
};

// 判断颜色识别标签
Arduino.forBlock['sentry2_get_color_label'] = function(block, generator) {
  const num = block.getFieldValue('NUM');
  const obj = block.getFieldValue('COLOR_LABLE');
  const code = 'sentry.GetValue(Sentry2::kVisionColor, kLabel, (int)' + num + ') == ' + obj;
  return [code, Arduino.ORDER_RELATIONAL];
};

// 判断色块检测
Arduino.forBlock['sentry2_get_color_blob'] = function(block, generator) {
  const num = block.getFieldValue('NUM');
  const obj = block.getFieldValue('COLOR_LABLE');
  const code = 'sentry.GetValue(Sentry2::kVisionBlob, kLabel, (int)' + num + ') == ' + obj;
  return [code, Arduino.ORDER_RELATIONAL];
};

// 判断卡片识别标签
Arduino.forBlock['sentry2_get_card_label'] = function(block, generator) {
  const num = block.getFieldValue('NUM');
  const obj = block.getFieldValue('CARD_LABLE');
  const code = 'sentry.GetValue(Sentry2::kVisionCard, kLabel, (int)' + num + ') == ' + obj;
  return [code, Arduino.ORDER_RELATIONAL];
};

// 判断20类物体识别标签
Arduino.forBlock['sentry2_get_class20_label'] = function(block, generator) {
  const num = block.getFieldValue('NUM');
  const obj = block.getFieldValue('Class20_LABLE');
  const code = 'sentry.GetValue(Sentry2::kVision20Classes, kLabel, (int)' + num + ') == ' + obj;
  return [code, Arduino.ORDER_RELATIONAL];
};
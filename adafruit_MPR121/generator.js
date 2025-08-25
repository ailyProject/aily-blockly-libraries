// Adafruit MPR121电容触摸传感器驱动 - Generator

// 通用库管理函数，确保不重复添加库
function ensureLibrary(generator, libraryKey, libraryCode) {
  if (!generator.libraries_) {
    generator.libraries_ = {};
  }
  if (!generator.libraries_[libraryKey]) {
    generator.addLibrary(libraryKey, libraryCode);
  }
}

// 确保Wire库和MPR121库
function ensureMPR121Libraries(generator) {
  ensureLibrary(generator, 'wire', '#include <Wire.h>');
  ensureLibrary(generator, 'mpr121', '#include <Adafruit_MPR121.h>');
  ensureLibrary(generator, 'bv_macro', '#ifndef _BV\n#define _BV(bit) (1 << (bit))\n#endif');
}

// 基础初始化
Arduino.forBlock['mpr121_init'] = function(block, generator) {
  const i2cAddr = block.getFieldValue('I2C_ADDR');
  
  // 添加必要的库
  ensureMPR121Libraries(generator);
  ensureSerialBegin('Serial', generator);
  
  // 添加MPR121对象变量
  generator.addVariable('mpr121_cap', 'Adafruit_MPR121 cap;');
  
  // 确保Wire初始化
  const wireBeginKey = 'wire_begin_Wire';
  if (!generator.setupCodes_ || !generator.setupCodes_[wireBeginKey]) {
    generator.addSetup(wireBeginKey, 'Wire.begin();\n');
  }
  
  // 生成初始化代码
  let setupCode = '// 初始化MPR121电容触摸传感器\n';
  setupCode += 'if (!cap.begin(' + i2cAddr + ', &Wire)) {\n';
  setupCode += '  Serial.println("警告: MPR121传感器初始化失败，请检查接线!");\n';
  setupCode += '  while (1);\n';
  setupCode += '}\n';
  setupCode += 'Serial.println("MPR121传感器初始化成功!");\n';
  setupCode += 'cap.setAutoconfig(true);\n';
  
  return setupCode;
};

// 高级初始化
Arduino.forBlock['mpr121_init_advanced'] = function(block, generator) {
  const i2cAddr = block.getFieldValue('I2C_ADDR');
  const touchThreshold = block.getFieldValue('TOUCH_THRESHOLD');
  const releaseThreshold = block.getFieldValue('RELEASE_THRESHOLD');
  
  // 添加必要的库
  ensureMPR121Libraries(generator);
  ensureSerialBegin('Serial', generator);
  
  // 添加MPR121对象变量
  generator.addVariable('mpr121_cap', 'Adafruit_MPR121 cap;');
  
  // 确保Wire初始化
  const wireBeginKey = 'wire_begin_Wire';
  if (!generator.setupCodes_ || !generator.setupCodes_[wireBeginKey]) {
    generator.addSetup(wireBeginKey, 'Wire.begin();\n');
  }
  
  // 生成初始化代码
  let setupCode = '// 初始化MPR121电容触摸传感器(高级设置)\n';
  setupCode += 'if (!cap.begin(' + i2cAddr + ', &Wire)) {\n';
  setupCode += '  Serial.println("警告: MPR121传感器初始化失败，请检查接线!");\n';
  setupCode += '  while (1);\n';
  setupCode += '}\n';
  setupCode += 'Serial.println("MPR121传感器初始化成功!");\n';
  setupCode += 'cap.setThresholds(' + touchThreshold + ', ' + releaseThreshold + ');\n';
  
  return setupCode;
};

// 检测单个通道是否被触摸
Arduino.forBlock['mpr121_is_touched'] = function(block, generator) {
  const channel = block.getFieldValue('CHANNEL');
  
  ensureMPR121Libraries(generator);
  
  const code = '(cap.touched() & _BV(' + channel + '))';
  return [code, Arduino.ORDER_RELATIONAL];
};

// 获取所有触摸状态
Arduino.forBlock['mpr121_get_touched'] = function(block, generator) {
  ensureMPR121Libraries(generator);
  
  const code = 'cap.touched()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 获取滤波数据
Arduino.forBlock['mpr121_get_filtered_data'] = function(block, generator) {
  const channel = block.getFieldValue('CHANNEL');
  
  ensureMPR121Libraries(generator);
  
  const code = 'cap.filteredData(' + channel + ')';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 获取基线数据
Arduino.forBlock['mpr121_get_baseline_data'] = function(block, generator) {
  const channel = block.getFieldValue('CHANNEL');
  
  ensureMPR121Libraries(generator);
  
  const code = 'cap.baselineData(' + channel + ')';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 设置阈值
Arduino.forBlock['mpr121_set_thresholds'] = function(block, generator) {
  const touchThreshold = generator.valueToCode(block, 'TOUCH_THRESHOLD', Arduino.ORDER_ATOMIC) || '12';
  const releaseThreshold = generator.valueToCode(block, 'RELEASE_THRESHOLD', Arduino.ORDER_ATOMIC) || '6';
  
  ensureMPR121Libraries(generator);
  
  const code = 'cap.setThresholds(' + touchThreshold + ', ' + releaseThreshold + ');\n';
  return code;
};
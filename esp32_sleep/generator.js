// 定时唤醒设置
Arduino.forBlock['esp32_deep_sleep_timer'] = function(block, generator) {
  const seconds = generator.valueToCode(block, 'SECONDS', generator.ORDER_ATOMIC) || '60';
  
  // 添加必要的库
  generator.addLibrary('esp_sleep', '#include <esp_sleep.h>');
  
  // 生成代码：esp_sleep_enable_timer_wakeup(seconds * 1000000ULL)
  const code = 'esp_sleep_enable_timer_wakeup(' + seconds + ' * 1000000ULL);\n';
  return code;
};

// 外部引脚唤醒设置
Arduino.forBlock['esp32_deep_sleep_ext0'] = function(block, generator) {
  const pin = block.getFieldValue('PIN');
  const level = block.getFieldValue('LEVEL');
  
  // 添加必要的库
  generator.addLibrary('esp_sleep', '#include <esp_sleep.h>');
  
  // 生成代码：esp_sleep_enable_ext0_wakeup(GPIO_NUM_X, level)
  const code = 'esp_sleep_enable_ext0_wakeup(GPIO_NUM_' + pin + ', ' + level + ');\n';
  return code;
};

// 进入深度睡眠
Arduino.forBlock['esp32_deep_sleep_start'] = function(block, generator) {
  // 添加必要的库
  generator.addLibrary('esp_sleep', '#include <esp_sleep.h>');
  
  // 生成代码：esp_deep_sleep_start()
  return 'esp_deep_sleep_start();\n';
};

// 设置CPU频率
Arduino.forBlock['esp32_set_cpu_frequency'] = function(block, generator) {
  const frequency = block.getFieldValue('FREQUENCY');
  
  // 生成代码：setCpuFrequencyMhz(frequency)
  return 'setCpuFrequencyMhz(' + frequency + ');\n';
};

// 快速深度睡眠（一步完成）
Arduino.forBlock['esp32_deep_sleep_quick'] = function(block, generator) {
  const seconds = generator.valueToCode(block, 'SECONDS', generator.ORDER_ATOMIC) || '60';
  
  // 添加必要的库
  generator.addLibrary('esp_sleep', '#include <esp_sleep.h>');
  
  // 生成完整的深度睡眠函数
  let functionDef = '';
  functionDef += 'void deepSleepTimer(int seconds) {\n';
  functionDef += '  esp_sleep_enable_timer_wakeup(seconds * 1000000ULL);\n';
  functionDef += '  esp_deep_sleep_start();\n';
  functionDef += '}\n';
  
  // 注册辅助函数（自动去重）
  generator.addFunction('esp32_deep_sleep_timer_function', functionDef, true);
  
  // 生成调用代码
  return 'deepSleepTimer(' + seconds + ');\n';
};

// 浅度睡眠启动
Arduino.forBlock['esp32_light_sleep_start'] = function(block, generator) {
  // 添加必要的库
  generator.addLibrary('esp_sleep', '#include <esp_sleep.h>');
  
  // 生成代码：esp_light_sleep_start()
  return 'esp_light_sleep_start();\n';
};

// RTC变量声明
Arduino.forBlock['esp32_rtc_variable_int'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'rtcCounter';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  
  // 生成RTC变量声明：RTC_DATA_ATTR int varName = value;
  const code = 'RTC_DATA_ATTR int ' + varName + ' = ' + value + ';\n';
  generator.addVariable(varName, code);
  
  return ''; // 变量声明块不生成代码
};

// 设置RTC变量值
Arduino.forBlock['esp32_rtc_set_variable'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'rtcCounter';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  
  // 生成代码：varName = value;
  return varName + ' = ' + value + ';\n';
};

// 获取RTC变量值
Arduino.forBlock['esp32_rtc_get_variable'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'rtcCounter';
  
  // 生成代码：varName
  return [varName, generator.ORDER_ATOMIC];
};
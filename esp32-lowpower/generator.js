/**
 * ESP32低功耗库代码生成器（由米思齐库转换而来）
 * 依赖：ESP-IDF 自带头文件（esp_sleep.h / esp_system.h / driver/uart.h），无需额外 Arduino 库
 * 原库制作者：李北极 QQ:328828999
 */

// RTC整数变量
// 注意：aily 平台未实现 addVariable API，全局变量声明统一用 addObject
Arduino.forBlock['espsleep_esp32_rtc_int'] = function(block, generator) {
  var varName = block.getFieldValue('VAR_NAME');
  var initVal = generator.valueToCode(block, 'INIT_VAL', generator.ORDER_ATOMIC) || '0';
  generator.addObject('espsleep_var_' + varName, 'RTC_DATA_ATTR int ' + varName + ' = ' + initVal + ';');
  return '';
};

// 设置RTC变量
Arduino.forBlock['espsleep_esp32_set_rtc'] = function(block, generator) {
  var varName = block.getFieldValue('VAR_NAME');
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  // tag 与 rtc_int 一致自动去重：未使用 RTC整数变量 积木时自动补声明
  generator.addObject('espsleep_var_' + varName, 'RTC_DATA_ATTR int ' + varName + ' = 0;');
  return varName + ' = ' + value + ';\n';
};

// 获取RTC变量
Arduino.forBlock['espsleep_esp32_get_rtc'] = function(block, generator) {
  var varName = block.getFieldValue('VAR_NAME');
  // tag 与 rtc_int 一致自动去重：未使用 RTC整数变量 积木时自动补声明
  generator.addObject('espsleep_var_' + varName, 'RTC_DATA_ATTR int ' + varName + ' = 0;');
  return [varName, generator.ORDER_ATOMIC];
};

// 设置定时唤醒睡眠
Arduino.forBlock['espsleep_esp32_timer_wakeup'] = function(block, generator) {
  var sec = generator.valueToCode(block, 'SEC', generator.ORDER_ATOMIC) || '60';
  generator.addLibrary('include_esp_sleep', '#include <esp_sleep.h>');
  return 'esp_sleep_enable_timer_wakeup(' + sec + ' * 1000000ULL);\n';
};

// 设置外部引脚唤醒
// 兼容性：ESP32/S2/S3 使用 ext0（支持深度+浅睡眠）
//        ESP32-C3/C6 使用 esp_deep_sleep_enable_gpio_wakeup（仅深度睡眠有效）
//        注意：C3 仅 RTC GPIO0~5 可作为唤醒源，唤醒后重启运行 setup()
Arduino.forBlock['espsleep_esp32_gpio_wakeup'] = function(block, generator) {
  var pin = block.getFieldValue('PIN');
  var level = block.getFieldValue('LEVEL');  // 1=高电平唤醒，0=低电平唤醒
  generator.addLibrary('include_esp_sleep', '#include <esp_sleep.h>');

  // 唤醒电平与内部电阻匹配：高电平唤醒用下拉，低电平唤醒用上拉
  var pullMode = (level === '1') ? 'INPUT_PULLDOWN' : 'INPUT_PULLUP';
  // C3 深度睡眠唤醒电平常量
  var c3Level = (level === '1') ? 'ESP_GPIO_WAKEUP_GPIO_HIGH' : 'ESP_GPIO_WAKEUP_GPIO_LOW';

  var code = [
    'pinMode(' + pin + ', ' + pullMode + ');  // 配置引脚模式与内部电阻',
    'gpio_deep_sleep_hold_dis();  // 禁用 pad 保持，防止持续唤醒',
    '#if CONFIG_IDF_TARGET_ESP32 || CONFIG_IDF_TARGET_ESP32S2 || CONFIG_IDF_TARGET_ESP32S3',
    '    esp_sleep_enable_ext0_wakeup(GPIO_NUM_' + pin + ', ' + level + ');  // ext0: 深度+浅睡眠',
    '#else',
    '    esp_deep_sleep_enable_gpio_wakeup(1ULL << GPIO_NUM_' + pin + ', ' + c3Level + ');  // C3/C6: 仅深度睡眠',
    '#endif'
  ].join('\n') + '\n';
  return code;
};

// 获取唤醒原因（按 ESP-IDF esp_sleep_source_t 枚举）
Arduino.forBlock['espsleep_esp32_wakeup_cause'] = function(block, generator) {
  generator.addLibrary('include_esp_sleep', '#include <esp_sleep.h>');
  return ['esp_sleep_get_wakeup_cause()', generator.ORDER_ATOMIC];
};

// 设置触摸唤醒（仅 ESP32原版/S3 有触摸硬件）
Arduino.forBlock['espsleep_esp32_touch_wakeup'] = function(block, generator) {
  var channel = block.getFieldValue('CHANNEL');
  var callback = block.getFieldValue('CALLBACK') || 'NULL';
  var threshold = generator.valueToCode(block, 'THRESHOLD', generator.ORDER_ATOMIC) || '30000';
  generator.addLibrary('include_esp_sleep', '#include <esp_sleep.h>');

  // 自动生成回调函数空实现（避免链接错误）
  if (callback !== 'NULL') {
    generator.addFunction('touch_callback_' + callback,
      'void ' + callback + '() {\n    // 触摸唤醒回调函数（唤醒后不会调用，可在此处放唤醒后逻辑）\n}\n');
  }

  var code = [
    '#if CONFIG_IDF_TARGET_ESP32 || CONFIG_IDF_TARGET_ESP32S3',
    '    touchAttachInterrupt(' + channel + ', ' + callback + ', ' + threshold + ');  // 配置触摸通道与阈值',
    '    esp_sleep_enable_touchpad_wakeup();  // 启用触摸唤醒深度睡眠',
    '#else',
    '    #error "当前芯片无触摸传感器，不支持触摸唤醒"',
    '#endif'
  ].join('\n') + '\n';
  return code;
};

// 设置ext1多引脚组合唤醒（ESP32/S2/S3 支持，RTC GPIO 组合触发）
Arduino.forBlock['espsleep_esp32_ext1_wakeup'] = function(block, generator) {
  var pinMask = generator.valueToCode(block, 'PIN_MASK', generator.ORDER_ATOMIC) || '(1ULL << 0)';
  var mode = block.getFieldValue('MODE');
  generator.addLibrary('include_esp_sleep', '#include <esp_sleep.h>');

  // 触发模式常量映射
  var ext1Mode = (mode === 'ANY_HIGH')
    ? 'ESP_EXT1_WAKEUP_ANY_HIGH'
    : 'ESP_EXT1_WAKEUP_ALL_LOW';

  var code = [
    '#if CONFIG_IDF_TARGET_ESP32 || CONFIG_IDF_TARGET_ESP32S2 || CONFIG_IDF_TARGET_ESP32S3',
    '    gpio_deep_sleep_hold_dis();  // 禁用 pad 保持',
    '    esp_sleep_enable_ext1_wakeup(' + pinMask + ', ' + ext1Mode + ');  // ext1: 多引脚组合唤醒',
    '#else',
    '    #error "当前芯片不支持 ext1 多引脚唤醒，请使用外部引脚唤醒积木"',
    '#endif'
  ].join('\n') + '\n';
  return code;
};

// 设置UART唤醒（仅浅睡眠有效，深度睡眠不支持）
// API 说明：esp_sleep_enable_uart_wakeup() 只接受 uart_num 一个参数
//          阈值需通过 uart_set_wakeup_threshold() 单独设置
Arduino.forBlock['espsleep_esp32_uart_wakeup'] = function(block, generator) {
  var uartNum = block.getFieldValue('UART_NUM');
  var threshold = generator.valueToCode(block, 'THRESHOLD', generator.ORDER_ATOMIC) || '3';
  generator.addLibrary('include_esp_sleep', '#include <esp_sleep.h>');
  generator.addLibrary('include_driver_uart', '#include <driver/uart.h>');

  var code = [
    '// UART 唤醒仅在浅睡眠下有效，深度睡眠请使用 GPIO/定时器唤醒',
    'uart_set_wakeup_threshold((uart_port_t)' + uartNum + ', ' + threshold + ');  // 设置唤醒阈值字符数',
    'esp_sleep_enable_uart_wakeup(' + uartNum + ');  // 启用 UART 唤醒'
  ].join('\n') + '\n';
  return code;
};

// 禁用唤醒源（防止多次配置残留唤醒条件导致异常）
Arduino.forBlock['espsleep_esp32_disable_wakeup'] = function(block, generator) {
  var source = block.getFieldValue('SOURCE');
  generator.addLibrary('include_esp_sleep', '#include <esp_sleep.h>');

  // 唤醒源常量映射（ESP_SLEEP_WAKEUP_XXX）
  var wakeupConst = {
    'ALL': 'ESP_SLEEP_WAKEUP_ALL',
    'TIMER': 'ESP_SLEEP_WAKEUP_TIMER',
    'GPIO': 'ESP_SLEEP_WAKEUP_ALL',  // ext0/ext1/gpio 统一用 ALL 禁用
    'TOUCHPAD': 'ESP_SLEEP_WAKEUP_TOUCHPAD',
    'UART': 'ESP_SLEEP_WAKEUP_UART',
    'WIFI': 'ESP_SLEEP_WAKEUP_WIFI',
    'BT': 'ESP_SLEEP_WAKEUP_BT'
  };
  var constName = wakeupConst[source] || 'ESP_SLEEP_WAKEUP_ALL';

  return 'esp_sleep_disable_wakeup_source(' + constName + ');  // 禁用唤醒源：' + source + '\n';
};

// 进入深度睡眠
Arduino.forBlock['espsleep_esp32_deep_sleep'] = function(block, generator) {
  generator.addLibrary('include_esp_sleep', '#include <esp_sleep.h>');
  return 'esp_deep_sleep_start();\n';
};

// 进入浅度睡眠
Arduino.forBlock['espsleep_esp32_light_sleep'] = function(block, generator) {
  generator.addLibrary('include_esp_sleep', '#include <esp_sleep.h>');
  return 'esp_light_sleep_start();\n';
};

// 快速深度睡眠（合并定时唤醒+进入睡眠，使用便捷 API）
Arduino.forBlock['espsleep_esp32_quick_sleep'] = function(block, generator) {
  var sec = generator.valueToCode(block, 'SEC', generator.ORDER_ATOMIC) || '60';
  generator.addLibrary('include_esp_sleep', '#include <esp_sleep.h>');
  return 'esp_deep_sleep(' + sec + ' * 1000000ULL);  // 定时唤醒后重启运行 setup()\n';
};

// 设置CPU频率
Arduino.forBlock['espsleep_esp32_set_cpu_freq'] = function(block, generator) {
  var freq = block.getFieldValue('FREQ');
  generator.addLibrary('include_esp_system', '#include <esp_system.h>');
  return 'setCpuFrequencyMhz(' + freq + ');\n';
};

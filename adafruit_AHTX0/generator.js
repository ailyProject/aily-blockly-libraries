
// Adafruit AHTX0 温湿度传感器库的代码生成器

// I2C 引脚按板卡选：aily_iic 设过的自定义引脚 > 芯片自己的板卡配置 > 板卡 i2cPins > Wire 默认引脚
Arduino.ahtx0WireBegin = function (generator, devicePins) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  let pins = null;
  try {
    const board = window['boardConfig'] || {};
    const custom = window['customI2CPins'] && window['customI2CPins']['Wire'];
    const pick = list => {
      const sda = list && list.find(p => p[0] === 'SDA');
      const scl = list && list.find(p => p[0] === 'SCL');
      return sda && scl ? { sda: sda[1], scl: scl[1] } : null;
    };
    if (custom) pins = pick(custom);
    else if (devicePins && devicePins.sda != null && devicePins.scl != null) pins = { sda: devicePins.sda, scl: devicePins.scl };
    else pins = pick(board.i2cPins && board.i2cPins['Wire']);
    // 只有 ESP32 的 Wire.begin 能带引脚
    if (!(board.core && String(board.core).indexOf('esp32') > -1)) pins = null;
  } catch (e) {
    pins = null;
  }
  const code = pins ? 'Wire.begin(' + pins.sda + ', ' + pins.scl + ');' : 'Wire.begin();';
  let old = null;
  try {
    old = generator.codeDict.setups_begin['wire_Wire_begin'];
  } catch (e) {}
  generator.addSetupBegin('wire_Wire_begin', code, !!(pins && old && /\.begin\(\s*\)/.test(old)));
};

// 初始化AHT温湿度传感器
Arduino.forBlock['ahtx0_begin'] = function(block, generator) {
  // 添加必要的库
  generator.addLibrary('Adafruit_AHTX0', '#include <Adafruit_AHTX0.h>');
  generator.addVariable('aht_sensor', 'Adafruit_AHTX0 aht;');
  // 先按开发板的 I2C 引脚启动 Wire，aht.begin() 里再调 Wire.begin() 时不会改到默认引脚
  Arduino.ahtx0WireBegin(generator);
  
  // 在setup部分初始化传感器
  generator.addSetupBegin('aht_begin', 'if (!aht.begin()) {\n  Serial.println("Could not find AHT sensor!");\n  while (1) delay(10);\n}\n');
  
  return '';
};

// 读取AHT温湿度传感器数据
Arduino.forBlock['ahtx0_read'] = function(block, generator) {
  generator.addVariable('aht_sensors', 'sensors_event_t humidity, temp;');
  
  return 'aht.getEvent(&humidity, &temp);\n';
};

// 获取温度值
Arduino.forBlock['ahtx0_get_temperature'] = function(block, generator) {
  generator.addVariable('aht_sensors', 'sensors_event_t humidity, temp;');
  return ['temp.temperature', Arduino.ORDER_ATOMIC];
};

// 获取湿度值
Arduino.forBlock['ahtx0_get_humidity'] = function(block, generator) {
  generator.addVariable('aht_sensors', 'sensors_event_t humidity, temp;');
  return ['humidity.relative_humidity', Arduino.ORDER_ATOMIC];
};

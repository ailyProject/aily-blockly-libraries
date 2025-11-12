// SHT31 温湿度传感器 Generator
Arduino.forBlock['sht31_init'] = function (block, generator) {
    const address = block.getFieldValue('ADDRESS');
    const sdaPin = block.getFieldValue('SDA') || '4';
    const sclPin = block.getFieldValue('SCL') || '5';

    // 添加库文件
    generator.addLibrary('#include <Wire.h>', '#include <Wire.h>');
    generator.addLibrary('#include "Adafruit_SHT31.h"', '#include "Adafruit_SHT31.h"');

    // 添加全局变量
    generator.addObject('Adafruit_SHT31 sht31 = Adafruit_SHT31();', 'Adafruit_SHT31 sht31 = Adafruit_SHT31();');

    // 添加初始化代码到setup，包含I2C引脚配置
    const initCode = `Wire.begin(${sdaPin}, ${sclPin});
  if (!sht31.begin(${address})) {
    Serial.println("SHT31 sensor not found!");
  }`;
    generator.addSetupBegin('sht31_init', initCode);

    return '';
};

Arduino.forBlock['sht31_heater_control'] = function (block, generator) {
    const state = block.getFieldValue('STATE');

    // 确保已初始化
    generator.addLibrary('#include <Wire.h>', '#include <Wire.h>');
    generator.addLibrary('#include "Adafruit_SHT31.h"', '#include "Adafruit_SHT31.h"');
    generator.addObject('Adafruit_SHT31 sht31 = Adafruit_SHT31();', 'Adafruit_SHT31 sht31 = Adafruit_SHT31();');

    return `sht31.heater(${state});\n`;
};

Arduino.forBlock['sht31_is_heater_enabled'] = function (block, generator) {
    // 确保已初始化
    generator.addLibrary('#include <Wire.h>', '#include <Wire.h>');
    generator.addLibrary('#include "Adafruit_SHT31.h"', '#include "Adafruit_SHT31.h"');
    generator.addObject('Adafruit_SHT31 sht31 = Adafruit_SHT31();', 'Adafruit_SHT31 sht31 = Adafruit_SHT31();');

    return ['sht31.isHeaterEnabled()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sht31_reset'] = function (block, generator) {
    // 确保已初始化
    generator.addLibrary('#include <Wire.h>', '#include <Wire.h>');
    generator.addLibrary('#include "Adafruit_SHT31.h"', '#include "Adafruit_SHT31.h"');
    generator.addObject('Adafruit_SHT31 sht31 = Adafruit_SHT31();', 'Adafruit_SHT31 sht31 = Adafruit_SHT31();');

    return 'sht31.reset();\n';
};

Arduino.forBlock['sht31_simple_read'] = function (block, generator) {
    const type = block.getFieldValue('TYPE');

    // 确保已初始化
    generator.addLibrary('#include <Wire.h>', '#include <Wire.h>');
    generator.addLibrary('#include "Adafruit_SHT31.h"', '#include "Adafruit_SHT31.h"');
    generator.addObject('Adafruit_SHT31 sht31 = Adafruit_SHT31();', 'Adafruit_SHT31 sht31 = Adafruit_SHT31();');

    // 自动初始化（简化版本），使用默认引脚SDA=4, SCL=5
    const initCode = `Wire.begin(4, 5);
  if (!sht31.begin(0x44)) {
    Serial.println("SHT31 sensor not found!");
  }`;
    generator.addSetupBegin('sht31_init', initCode);

    if (type === 'temperature') {
        return ['sht31.readTemperature()', generator.ORDER_ATOMIC];
    } else {
        return ['sht31.readHumidity()', generator.ORDER_ATOMIC];
    }
};

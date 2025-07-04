// 在generator.js文件开头添加扩展定义
Blockly.Extensions.register('ags02ma_init_extension', function() {
  // 动态根据板卡类型显示不同的界面
  var boardConfig = window['boardConfig'] || {};
  var boardCore = (boardConfig.core || '').toLowerCase();
  var boardName = (boardConfig.name || '').toLowerCase();
  
  var isArduinoCore = boardCore.indexOf('arduino') > -1 || 
                     boardName.indexOf('arduino') > -1 || 
                     boardName.indexOf('uno') > -1 || 
                     boardName.indexOf('nano') > -1 || 
                     boardName.indexOf('mega') > -1 ||
                     boardCore.indexOf('avr') > -1;
  
  if (!isArduinoCore) {
    // 只有非Arduino板卡才显示Wire选择
    this.getInput('I2C_PINS').appendField('I2C').appendField(
      new Blockly.FieldDropdown([
        ["Wire1 (SDA:8, SCL:9)", "WIRE1"],
        ["Wire2 (SDA:4, SCL:5)", "WIRE2"]
      ]), 'WIRE_OPTION'
    );
  } else {
    // Arduino板卡显示固定文本
    this.getInput('I2C_PINS').appendField('(固定引脚 SDA:A4, SCL:A5)');
  }
});

// 导入AGS02MA库和初始化全局变量，只添加一次
Arduino.forBlock['ags02ma_init'] = function(block, generator) {
  // 获取开发板配置信息
  var boardConfig = window['boardConfig'] || {};
  var boardCore = (boardConfig.core || '').toLowerCase();
  var boardName = (boardConfig.name || '').toLowerCase();
  
  // 判断开发板类型
  var isArduinoCore = boardCore.indexOf('arduino') > -1 || 
                     boardName.indexOf('arduino') > -1 || 
                     boardName.indexOf('uno') > -1 || 
                     boardName.indexOf('nano') > -1 || 
                     boardName.indexOf('mega') > -1 ||
                     boardCore.indexOf('avr') > -1;
                     
  var isESP32Core = boardCore.indexOf('esp32') > -1 || 
                   boardName.indexOf('esp32') > -1 || 
                   boardName.indexOf('esp') > -1;
                   
  var isESP8266Core = boardCore.indexOf('esp8266') > -1 || 
                     boardName.indexOf('esp8266') > -1;
  
  // 只有非Arduino板卡才获取Wire选项
  var wireOption = 'WIRE1'; // 默认值
  if (!isArduinoCore) {
    wireOption = block.getFieldValue('WIRE_OPTION') || 'WIRE1';
  }
  
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('AGS02MA', '#include <AGS02MA.h>');
  
  // 创建AGS02MA对象，默认地址0x1A
  generator.addVariable('ags02ma', 'AGS02MA ags02ma(0x1A, &Wire);');
  
  // 调试信息
  console.log('AGS02MA Init: 开发板信息:', boardConfig);
  console.log('AGS02MA Init: 核心类型:', boardCore);
  console.log('AGS02MA Init: 板名:', boardName);
  console.log('AGS02MA Init: isArduinoCore:', isArduinoCore);
  console.log('AGS02MA Init: isESP32Core:', isESP32Core);
  console.log('AGS02MA Init: isESP8266Core:', isESP8266Core);
  console.log('AGS02MA Init: wireOption:', wireOption);
  
  // 初始化I2C总线和传感器
  var setupCode = '// 配置I2C引脚并初始化AGS02MA TVOC传感器\n';
  setupCode += 'Serial.println("AGS02MA TVOC传感器初始化...");\n';
  
  if (isArduinoCore) {
    // Arduino核心固定使用 SDA:A4, SCL:A5，不支持选择
    setupCode += 'Wire.begin();  // 初始化I2C (Arduino SDA:A4, SCL:A5)\n';
    setupCode += 'Serial.println("Arduino板卡使用固定引脚: SDA=A4, SCL=A5");\n';
  } else if (isESP32Core) {
    // ESP32核心，根据Wire选项初始化
    if (wireOption === 'WIRE2') {
      setupCode += 'Wire.begin(4, 5);  // 初始化I2C，Wire2 SDA:4, SCL:5 (ESP32)\n';
      setupCode += 'Serial.println("ESP32使用Wire2 (SDA:4, SCL:5)");\n';
    } else { // WIRE1 或默认
      setupCode += 'Wire.begin();  // 初始化I2C，Wire1 SDA:8, SCL:9 (ESP32)\n';
      setupCode += 'Serial.println("ESP32使用Wire1 (SDA:8, SCL:9)");\n';
    }
  } else if (isESP8266Core) {
    // ESP8266核心，根据Wire选项初始化
    if (wireOption === 'WIRE2') {
      setupCode += 'Wire.begin(0, 2);  // 初始化I2C，Wire2 SDA:0, SCL:2 (ESP8266)\n';
      setupCode += 'Serial.println("ESP8266使用Wire2 (SDA:0, SCL:2)");\n';
    } else { // WIRE1 或默认
      setupCode += 'Wire.begin(4, 5);  // 初始化I2C，Wire1 SDA:4, SCL:5 (ESP8266)\n';
      setupCode += 'Serial.println("ESP8266使用Wire1 (SDA:4, SCL:5)");\n';
    }
  } else {
    // 其他板卡，根据Wire选项初始化
    if (wireOption === 'WIRE2') {
      setupCode += 'Wire.begin(4, 5);  // 初始化I2C，Wire2 SDA:4, SCL:5 (其他板卡)\n';
      setupCode += 'Serial.println("其他板卡使用Wire2 (SDA:4, SCL:5)");\n';
    } else { // WIRE1 或默认
      setupCode += 'Wire.begin(8, 9);  // 初始化I2C，Wire1 SDA:8, SCL:9 (其他板卡)\n';
      setupCode += 'Serial.println("其他板卡使用Wire1 (SDA:8, SCL:9)");\n';
    }
  }
  
  // 添加AGS02MA初始化代码
  setupCode += `
// 初始化AGS02MA TVOC传感器
if (ags02ma.begin()) {
  Serial.println("AGS02MA传感器初始化成功!");
  ags02ma.setPPBMode(); // 默认设置为PPB模式
  Serial.println("传感器设置完成，开始测量!");
} else {
  Serial.println("警告: AGS02MA传感器初始化失败!");
  Serial.println("请检查:");
  Serial.println("1. 传感器地址是否为0x1A");
  Serial.println("2. I2C接线是否正确");
  Serial.println("3. 传感器供电是否正常");
}`;

  generator.addSetup('ags02ma_init', setupCode);
  return '';
};

// 读取TVOC浓度（PPB）- 简化版
Arduino.forBlock['ags02ma_read_tvoc_ppb'] = function(block, generator) {
  // 注意：需要先手动设置PPB模式
  return ['ags02ma.readPPB()', Arduino.ORDER_FUNCTION_CALL];
};

// 读取TVOC浓度（μg/m³）- 带换算的版本
Arduino.forBlock['ags02ma_read_tvoc_ugm3'] = function(block, generator) {
  // 添加换算辅助函数
  generator.addFunction('ags02ma_ugm3_convert', `
float ags02ma_read_ugm3_converted() {
  uint32_t raw_value = ags02ma.readUGM3();
  return raw_value * 3.48;  // 将PPB值转换为真正的μg/m³值
}`);
  
  return ['ags02ma_read_ugm3_converted()', Arduino.ORDER_FUNCTION_CALL];
};

// 重置传感器
Arduino.forBlock['ags02ma_reset'] = function(block, generator) {
  return 'ags02ma.reset();\n';
};
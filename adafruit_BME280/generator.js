
/**
 * BME280 环境传感器代码生成器
 * 用于读取温度、压力、湿度和海拔高度数据
 */

// BME280初始化
Arduino.forBlock['bme280_init'] = function(block, generator) {
  // 添加必要的库
  generator.addLibrary('include_wire', '#include <Wire.h>');
  generator.addLibrary('include_spi', '#include <SPI.h>');
  generator.addLibrary('include_adafruit_sensor', '#include <Adafruit_Sensor.h>');
  generator.addLibrary('include_adafruit_bme280', '#include <Adafruit_BME280.h>');
  
  // 创建BME280对象
  generator.addVariable('bme280_object', 'Adafruit_BME280 bme;');
  
  // 获取I2C地址参数（默认为0x77）
  var address = block.getFieldValue('ADDRESS') || 'BME280_ADDRESS';
  
  // 自动添加Serial初始化以打印错误信息
  generator.addSetupBegin('serial_begin', 'Serial.begin(9600);');
  
  // 在setup中添加初始化代码
  generator.addSetupBegin('bme280_begin', 'if (!bme.begin(' + address + ')) {\n  Serial.println("Could not find a valid BME280 sensor, check wiring!");\n  while (1);\n}\n');
  
  return '';
};

// 读取温度
Arduino.forBlock['bme280_read_temperature'] = function(block, generator) {
  var code = 'bme.readTemperature()';
  return [code, Arduino.ORDER_ATOMIC];
};

// 读取压力 (hPa)
Arduino.forBlock['bme280_read_pressure'] = function(block, generator) {
  var code = 'bme.readPressure() / 100.0F'; // 转换为百帕
  return [code, Arduino.ORDER_DIVISION];
};

// 读取湿度
Arduino.forBlock['bme280_read_humidity'] = function(block, generator) {
  var code = 'bme.readHumidity()';
  return [code, Arduino.ORDER_ATOMIC];
};

// 读取海拔高度
Arduino.forBlock['bme280_read_altitude'] = function(block, generator) {
  // 获取海平面压力参数
  var seaLevel = generator.valueToCode(block, 'SEALEVEL', Arduino.ORDER_ATOMIC) || '1013.25';
  
  var code = 'bme.readAltitude(' + seaLevel + ')';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 强制测量（在强制模式下）
Arduino.forBlock['bme280_take_forced_measurement'] = function(block, generator) {
  var code = 'bme.takeForcedMeasurement();\n';
  return code;
};

// 设置传感器模式
Arduino.forBlock['bme280_set_sampling'] = function(block, generator) {
  var mode = block.getFieldValue('MODE');
  var tempSampling = block.getFieldValue('TEMP_SAMPLING');
  var pressSampling = block.getFieldValue('PRESS_SAMPLING');
  var humSampling = block.getFieldValue('HUM_SAMPLING');
  var filter = block.getFieldValue('FILTER');
  var standby = block.getFieldValue('STANDBY');
  
  var code = 'bme.setSampling(' + mode + ', ' + tempSampling + ', ' + 
             pressSampling + ', ' + humSampling + ', ' + filter + ', ' + standby + ');\n';
  return code;
};

// 简化块：读取并打印所有BME280传感器数据
Arduino.forBlock['bme280_read_and_print_all'] = function(block, generator) {
  // 确保已经初始化了Serial
  generator.addSetupBegin('serial_begin', 'Serial.begin(9600);');
  
  // 读取并打印所有传感器数据的代码
  var code = 'Serial.print("Temperature: ");\n';
  code += 'Serial.print(bme.readTemperature());\n';
  code += 'Serial.println(" *C");\n\n';
  
  code += 'Serial.print("Humidity: ");\n';
  code += 'Serial.print(bme.readHumidity());\n';
  code += 'Serial.println(" %");\n\n';
  
  code += 'Serial.print("Pressure: ");\n';
  code += 'Serial.print(bme.readPressure() / 100.0F);\n';
  code += 'Serial.println(" hPa");\n\n';
  
  code += 'Serial.print("Approx. Altitude: ");\n';
  code += 'Serial.print(bme.readAltitude(1013.25));\n';
  code += 'Serial.println(" m");\n\n';
  
  code += 'Serial.println();\n';
  
  return code;
};

// 设置海平面压力进行高度校准
Arduino.forBlock['bme280_sea_level_for_altitude'] = function(block, generator) {
  var altitude = generator.valueToCode(block, 'ALTITUDE', Arduino.ORDER_ATOMIC);
  var pressure = generator.valueToCode(block, 'PRESSURE', Arduino.ORDER_ATOMIC) || 'bme.readPressure() / 100.0F';
  
  var code = 'bme.seaLevelForAltitude(' + altitude + ', ' + pressure + ')';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 获取传感器ID
Arduino.forBlock['bme280_sensor_id'] = function(block, generator) {
  var code = 'bme.sensorID()';
  return [code, Arduino.ORDER_ATOMIC];
};

// 设置温度补偿
Arduino.forBlock['bme280_temperature_compensation'] = function(block, generator) {
  var compensation = generator.valueToCode(block, 'COMPENSATION', Arduino.ORDER_ATOMIC) || '0';
  var code = 'bme.setTemperatureCompensation(' + compensation + ');\n';
  return code;
};

// 获取温度补偿值
Arduino.forBlock['bme280_get_temperature_compensation'] = function(block, generator) {
  var code = 'bme.getTemperatureCompensation()';
  return [code, Arduino.ORDER_ATOMIC];
};

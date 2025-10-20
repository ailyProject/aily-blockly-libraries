Arduino.forBlock['bmp280_init'] = function(block, generator) {
    var address = block.getFieldValue('ADDR');
    
    generator.addLibrary('BMP280_INCLUDE', '#include <Adafruit_BMP280.h>');
    generator.addObject('BMP280_OBJECT', 'Adafruit_BMP280 bmp;');
    generator.addSetupBegin('BMP280_SETUP', 'if (!bmp.begin(' + address + ')) {\n  Serial.println("Could not find a valid BMP280 sensor, check wiring!");\n  while (1);\n}\n');
    
    // 添加I2C初始化
    generator.addSetupBegin('WIRE_BEGIN', 'Wire.begin();');
    generator.addLibrary('WIRE_INCLUDE', '#include <Wire.h>');
    
    return '';
  };
  
  Arduino.forBlock['bmp280_read_temperature'] = function(block, generator) {
    return ['bmp.readTemperature()', Arduino.ORDER_FUNCTION_CALL];
  };
  
  Arduino.forBlock['bmp280_read_pressure'] = function(block, generator) {
    return ['(bmp.readPressure() / 100.0F)', Arduino.ORDER_FUNCTION_CALL];
  };
  
  Arduino.forBlock['bmp280_read_altitude'] = function(block, generator) {
    var seaLevelPressure = block.getFieldValue('SEAPRESSURE');
    return ['bmp.readAltitude(' + seaLevelPressure + 'F)', Arduino.ORDER_FUNCTION_CALL];
  };
  
  Arduino.forBlock['bmp280_set_sampling'] = function(block, generator) {
    var mode = block.getFieldValue('MODE');
    var temp_os = block.getFieldValue('TEMP_OS');
    var pres_os = block.getFieldValue('PRES_OS');
    var filter = block.getFieldValue('FILTER');
    var duration = block.getFieldValue('DURATION');

    var code = 'bmp.setSampling(Adafruit_BMP280::' + mode + ', ';
    code += 'Adafruit_BMP280::' + temp_os + ', ';
    code += 'Adafruit_BMP280::' + pres_os + ', ';
    code += 'Adafruit_BMP280::' + filter + ', ';
    code += 'Adafruit_BMP280::' + duration + ');\n';

    return code;
};
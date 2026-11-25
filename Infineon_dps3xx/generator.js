// DPS3xx 气压温度传感器 - 代码生成器

Arduino.forBlock['dps3xx_init'] = function(block, generator) {
  var address = block.getFieldValue('ADDR');
  var wire = block.getFieldValue('WIRE') || 'Wire';

  generator.addLibrary('DPS3XX_INCLUDE', '#include <Dps3xx.h>');
  generator.addLibrary('WIRE_INCLUDE', '#include <Wire.h>');
  generator.addObject('DPS3XX_OBJECT', 'Dps3xx dps3xxSensor;');
  generator.addSetupBegin('WIRE_BEGIN', wire + '.begin();');
  generator.addSetupBegin('DPS3XX_SETUP', 'dps3xxSensor.begin(' + wire + ', ' + address + ');');

  return '';
};

Arduino.forBlock['dps3xx_read_temperature'] = function(block, generator) {
  var osr = block.getFieldValue('OSR');

  generator.addLibrary('DPS3XX_INCLUDE', '#include <Dps3xx.h>');
  generator.addObject('DPS3XX_OBJECT', 'Dps3xx dps3xxSensor;');

  generator.addFunction('DPS3XX_READ_TEMP', 
    'float dps3xx_readTemperature(uint8_t osr) {\n' +
    '  float result;\n' +
    '  return dps3xxSensor.measureTempOnce(result, osr) == 0 ? result : NAN;\n' +
    '}');

  return ['dps3xx_readTemperature(' + osr + ')', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['dps3xx_read_pressure'] = function(block, generator) {
  var osr = block.getFieldValue('OSR');

  generator.addLibrary('DPS3XX_INCLUDE', '#include <Dps3xx.h>');
  generator.addObject('DPS3XX_OBJECT', 'Dps3xx dps3xxSensor;');

  generator.addFunction('DPS3XX_READ_PRESSURE',
    'float dps3xx_readPressure(uint8_t osr) {\n' +
    '  float result;\n' +
    '  return dps3xxSensor.measurePressureOnce(result, osr) == 0 ? result : NAN;\n' +
    '}');

  return ['dps3xx_readPressure(' + osr + ')', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['dps3xx_correct_temp'] = function(block, generator) {
  generator.addLibrary('DPS3XX_INCLUDE', '#include <Dps3xx.h>');
  generator.addObject('DPS3XX_OBJECT', 'Dps3xx dps3xxSensor;');

  return 'dps3xxSensor.correctTemp();\n';
};

Arduino.forBlock['dps3xx_get_product_id'] = function(block, generator) {
  generator.addLibrary('DPS3XX_INCLUDE', '#include <Dps3xx.h>');
  generator.addObject('DPS3XX_OBJECT', 'Dps3xx dps3xxSensor;');

  return ['dps3xxSensor.getProductId()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['dps3xx_get_revision_id'] = function(block, generator) {
  generator.addLibrary('DPS3XX_INCLUDE', '#include <Dps3xx.h>');
  generator.addObject('DPS3XX_OBJECT', 'Dps3xx dps3xxSensor;');

  return ['dps3xxSensor.getRevisionId()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mlx90614_begin'] = function(block, generator) {
  generator.addLibrary('MLX90614', '#include <Adafruit_MLX90614.h>');
  generator.addVariable('mlx90614', 'Adafruit_MLX90614 mlx;');
  
  generator.addSetupBegin('mlx_begin', 'mlx.begin();');
  return '';
};

Arduino.forBlock['mlx90614_read_object_temp'] = function(block, generator) {
  var unit = block.getFieldValue('UNIT');
  
  generator.addLibrary('MLX90614', '#include <Adafruit_MLX90614.h>');
  generator.addVariable('mlx90614', 'Adafruit_MLX90614 mlx;');
  
  var code = (unit === 'C') ? 'mlx.readObjectTempC()' : 'mlx.readObjectTempF()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mlx90614_read_ambient_temp'] = function(block, generator) {
  var unit = block.getFieldValue('UNIT');
  
  generator.addLibrary('MLX90614', '#include <Adafruit_MLX90614.h>');
  generator.addVariable('mlx90614', 'Adafruit_MLX90614 mlx;');
  
  var code = (unit === 'C') ? 'mlx.readAmbientTempC()' : 'mlx.readAmbientTempF()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mlx90614_read_emissivity'] = function(block, generator) {
  generator.addLibrary('MLX90614', '#include <Adafruit_MLX90614.h>');
  generator.addVariable('mlx90614', 'Adafruit_MLX90614 mlx;');
  
  var code = 'mlx.readEmissivity()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mlx90614_write_emissivity'] = function(block, generator) {
  var emissivity = generator.valueToCode(block, 'EMISSIVITY', Arduino.ORDER_ATOMIC) || '0.95';
  
  generator.addLibrary('MLX90614', '#include <Adafruit_MLX90614.h>');
  generator.addVariable('mlx90614', 'Adafruit_MLX90614 mlx;');
  
  var code = 'mlx.writeEmissivity(' + emissivity + ');\n';
  return code;
};
Arduino.forBlock['mlx90614_retry'] = function(block, generator) {
  generator.addLibrary('MLX90614', '#include <Adafruit_MLX90614.h>');
  generator.addVariable('mlx90614', 'Adafruit_MLX90614 mlx;');
  return 'mlx.retry();\n';
};

Arduino.forBlock['mlx90614_initialized'] = function(block, generator) {
  generator.addLibrary('MLX90614', '#include <Adafruit_MLX90614.h>');
  generator.addVariable('mlx90614', 'Adafruit_MLX90614 mlx;');
  return ['mlx.isInitialized()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mlx90614_last_ok'] = function(block, generator) {
  generator.addLibrary('MLX90614', '#include <Adafruit_MLX90614.h>');
  generator.addVariable('mlx90614', 'Adafruit_MLX90614 mlx;');
  return ['mlx.lastOperationSucceeded()', generator.ORDER_FUNCTION_CALL];
};

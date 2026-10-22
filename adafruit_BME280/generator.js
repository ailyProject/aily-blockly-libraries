
/**
 * BME280 环境传感器代码生成器
 * 用于读取温度、压力、湿度和海拔高度数据
 */

// Legacy values are field-specific: mode indices, sampling codes, filter
// multipliers and standby milliseconds must not be treated as enum casts.
var bme280LegacySamplingCodes = {
  '0': 'SAMPLING_NONE', '1': 'SAMPLING_X1', '2': 'SAMPLING_X2'
};
var bme280SamplingLegacyValues = {
  MODE: { '0': 'MODE_NORMAL', '1': 'MODE_SLEEP', '2': 'MODE_FORCED' },
  TEMP_SAMPLING: bme280LegacySamplingCodes,
  PRESS_SAMPLING: bme280LegacySamplingCodes,
  HUM_SAMPLING: bme280LegacySamplingCodes,
  FILTER: {
    '0': 'FILTER_OFF', '2': 'FILTER_X2', '4': 'FILTER_X4',
    '8': 'FILTER_X8', '16': 'FILTER_X16'
  },
  STANDBY: {
    '0.5': 'STANDBY_MS_0_5', '10': 'STANDBY_MS_10',
    '20': 'STANDBY_MS_20', '62.5': 'STANDBY_MS_62_5',
    '125': 'STANDBY_MS_125', '250': 'STANDBY_MS_250',
    '500': 'STANDBY_MS_500'
  }
};
var bme280SamplingEnumOptions = {
  MODE: ['MODE_NORMAL', 'MODE_SLEEP', 'MODE_FORCED'],
  TEMP_SAMPLING: ['SAMPLING_NONE', 'SAMPLING_X1', 'SAMPLING_X2', 'SAMPLING_X4', 'SAMPLING_X8', 'SAMPLING_X16'],
  PRESS_SAMPLING: ['SAMPLING_NONE', 'SAMPLING_X1', 'SAMPLING_X2', 'SAMPLING_X4', 'SAMPLING_X8', 'SAMPLING_X16'],
  HUM_SAMPLING: ['SAMPLING_NONE', 'SAMPLING_X1', 'SAMPLING_X2', 'SAMPLING_X4', 'SAMPLING_X8', 'SAMPLING_X16'],
  FILTER: ['FILTER_OFF', 'FILTER_X2', 'FILTER_X4', 'FILTER_X8', 'FILTER_X16'],
  STANDBY: ['STANDBY_MS_0_5', 'STANDBY_MS_10', 'STANDBY_MS_20', 'STANDBY_MS_62_5', 'STANDBY_MS_125', 'STANDBY_MS_250', 'STANDBY_MS_500', 'STANDBY_MS_1000']
};

function bme280MigrateSamplingValue(fieldName, value) {
  var legacy = bme280SamplingLegacyValues[fieldName];
  return Object.prototype.hasOwnProperty.call(legacy, value)
    ? 'Adafruit_BME280::' + legacy[value] : value;
}

function bme280SamplingEnumValue(fieldName, value) {
  var migrated = bme280MigrateSamplingValue(fieldName, value);
  var valid = bme280SamplingEnumOptions[fieldName].some(function(option) {
    return migrated === 'Adafruit_BME280::' + option;
  });
  if (!valid) throw new Error('Invalid BME280 sampling value for ' + fieldName + ': ' + value);
  return migrated;
}

if (Blockly.Extensions.isRegistered('bme280_sampling_legacy_values')) {
  Blockly.Extensions.unregister('bme280_sampling_legacy_values');
}
Blockly.Extensions.register('bme280_sampling_legacy_values', function() {
  var block = this;
  Object.keys(bme280SamplingLegacyValues).forEach(function(fieldName) {
    var field = block.getField(fieldName);
    if (!field || field._bme280SamplingMigrationAttached) return;
    field._bme280SamplingMigrationAttached = true;
    var originalSetValue = field.setValue;
    // Blockly rejects unknown dropdown values before user validators run.
    // Migrate before class validation to support both JSON and XML projects.
    field.setValue = function(value) {
      var args = Array.prototype.slice.call(arguments);
      args[0] = bme280MigrateSamplingValue(fieldName, value);
      return originalSetValue.apply(this, args);
    };
  });
});

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
  var mode = bme280SamplingEnumValue('MODE', block.getFieldValue('MODE'));
  var tempSampling = bme280SamplingEnumValue('TEMP_SAMPLING', block.getFieldValue('TEMP_SAMPLING'));
  var pressSampling = bme280SamplingEnumValue('PRESS_SAMPLING', block.getFieldValue('PRESS_SAMPLING'));
  var humSampling = bme280SamplingEnumValue('HUM_SAMPLING', block.getFieldValue('HUM_SAMPLING'));
  var filter = bme280SamplingEnumValue('FILTER', block.getFieldValue('FILTER'));
  var standby = bme280SamplingEnumValue('STANDBY', block.getFieldValue('STANDBY'));
  
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

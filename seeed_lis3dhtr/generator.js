
// LIS3DHTR加速度计库的generator.js

/**
 * 初始化LIS3DHTR加速度计（I2C模式）
 */
Arduino.forBlock['lis3dhtr_begin'] = function(block, generator) {
  generator.addLibrary('LIS3DHTR_H', '#include <LIS3DHTR.h>\n#include <Wire.h>');
  generator.addVariable('accel_sensor', 'LIS3DHTR<TwoWire> accel_sensor;');
  
  var address = block.getFieldValue('ADDRESS') || 'LIS3DHTR_DEFAULT_ADDRESS';
  
  // 在setup中添加初始化代码
  var code = 'accel_sensor.begin(Wire, ' + address + ');\n';
  
  return code;
};

/**
 * 设置输出数据速率
 */
Arduino.forBlock['lis3dhtr_set_datarate'] = function(block, generator) {
  var dataRate = block.getFieldValue('DATARATE');
  var code = 'accel_sensor.setOutputDataRate(' + dataRate + ');\n';
  return code;
};

/**
 * 设置高分辨率模式
 */
Arduino.forBlock['lis3dhtr_set_resolution'] = function(block, generator) {
  var enable = block.getFieldValue('ENABLE');
  var code = 'accel_sensor.setHighSolution(' + enable + ');\n';
  return code;
};

/**
 * 读取X轴加速度
 */
Arduino.forBlock['lis3dhtr_get_acceleration_x'] = function(block, generator) {
  var code = 'accel_sensor.getAccelerationX()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

/**
 * 读取Y轴加速度
 */
Arduino.forBlock['lis3dhtr_get_acceleration_y'] = function(block, generator) {
  var code = 'accel_sensor.getAccelerationY()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

/**
 * 读取Z轴加速度
 */
Arduino.forBlock['lis3dhtr_get_acceleration_z'] = function(block, generator) {
  var code = 'accel_sensor.getAccelerationZ()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

/**
 * 简化版：读取指定轴加速度
 */
Arduino.forBlock['lis3dhtr_get_acceleration'] = function(block, generator) {
  var axis = block.getFieldValue('AXIS');
  var code;
  
  switch(axis) {
    case 'X':
      code = 'accel_sensor.getAccelerationX()';
      break;
    case 'Y':
      code = 'accel_sensor.getAccelerationY()';
      break;
    case 'Z':
      code = 'accel_sensor.getAccelerationZ()';
      break;
    default:
      code = 'accel_sensor.getAccelerationX()';
  }
  
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

/**
 * 获取三轴加速度并存储到变量中
 */
Arduino.forBlock['lis3dhtr_get_acceleration_xyz'] = function(block, generator) {
  var varX = generator.valueToCode(block, 'X_VAR', Arduino.ORDER_ATOMIC) || 'x';
  var varY = generator.valueToCode(block, 'Y_VAR', Arduino.ORDER_ATOMIC) || 'y';
  var varZ = generator.valueToCode(block, 'Z_VAR', Arduino.ORDER_ATOMIC) || 'z';
  
  var code = 'accel_sensor.getAcceleration(&' + varX + ', &' + varY + ', &' + varZ + ');\n';
  return code;
};

/**
 * 开启温度传感器
 */
Arduino.forBlock['lis3dhtr_open_temp'] = function(block, generator) {
  var code = 'accel_sensor.openTemp();\n';
  return code;
};

/**
 * 关闭温度传感器
 */
Arduino.forBlock['lis3dhtr_close_temp'] = function(block, generator) {
  var code = 'accel_sensor.closeTemp();\n';
  return code;
};

/**
 * 获取温度数据
 */
Arduino.forBlock['lis3dhtr_get_temperature'] = function(block, generator) {
  var code = 'accel_sensor.getTemperature()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

/**
 * 简化版：获取温度数据（自动开启温度传感器）
 */
Arduino.forBlock['lis3dhtr_get_temperature_simple'] = function(block, generator) {
  generator.addSetupBegin('lis3dhtr_open_temp', 'accel_sensor.openTemp();\n');
  var code = 'accel_sensor.getTemperature()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

/**
 * 读取ADC1通道数据
 */
Arduino.forBlock['lis3dhtr_read_adc1'] = function(block, generator) {
  var code = 'accel_sensor.readbitADC1()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

/**
 * 读取ADC2通道数据
 */
Arduino.forBlock['lis3dhtr_read_adc2'] = function(block, generator) {
  var code = 'accel_sensor.readbitADC2()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

/**
 * 读取ADC3通道数据
 */
Arduino.forBlock['lis3dhtr_read_adc3'] = function(block, generator) {
  var code = 'accel_sensor.readbitADC3()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

/**
 * 简化版：读取指定ADC通道数据
 */
Arduino.forBlock['lis3dhtr_read_adc'] = function(block, generator) {
  var channel = block.getFieldValue('CHANNEL');
  var code;
  
  switch(channel) {
    case '1':
      code = 'accel_sensor.readbitADC1()';
      break;
    case '2':
      code = 'accel_sensor.readbitADC2()';
      break;
    case '3':
      code = 'accel_sensor.readbitADC3()';
      break;
    default:
      code = 'accel_sensor.readbitADC1()';
  }
  
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

/**
 * 检查传感器连接状态
 */
Arduino.forBlock['lis3dhtr_is_connection'] = function(block, generator) {
  var code = 'accel_sensor.isConnection()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

/**
 * 获取设备ID
 */
Arduino.forBlock['lis3dhtr_get_device_id'] = function(block, generator) {
  var code = 'accel_sensor.getDeviceID()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

/**
 * 设置传感器量程范围
 */
Arduino.forBlock['lis3dhtr_set_full_scale_range'] = function(block, generator) {
  var range = block.getFieldValue('RANGE');
  var code = 'accel_sensor.setFullScaleRange(' + range + ');\n';
  return code;
};

/**
 * 设置电源模式
 */
Arduino.forBlock['lis3dhtr_set_power_mode'] = function(block, generator) {
  var mode = block.getFieldValue('MODE');
  var code = 'accel_sensor.setPowerMode(' + mode + ');\n';
  return code;
};

/**
 * 一体化初始化和配置（简化版）
 */
Arduino.forBlock['lis3dhtr_init_simplified'] = function(block, generator) {
  generator.addLibrary('LIS3DHTR_H', '#include <LIS3DHTR.h>\n#include <Wire.h>');
  generator.addVariable('accel_sensor', 'LIS3DHTR<TwoWire> accel_sensor;');
  
  var address = block.getFieldValue('ADDRESS') || 'LIS3DHTR_DEFAULT_ADDRESS';
  var dataRate = block.getFieldValue('DATARATE') || 'LIS3DHTR_DATARATE_100HZ';
  var range = block.getFieldValue('RANGE') || 'LIS3DHTR_RANGE_4G';
  var highRes = block.getFieldValue('HIGHRES') || 'true';
  
  var code = 'accel_sensor.begin(Wire, ' + address + ');\n';
  code += 'accel_sensor.setOutputDataRate(' + dataRate + ');\n';
  code += 'accel_sensor.setFullScaleRange(' + range + ');\n';
  code += 'accel_sensor.setHighSolution(' + highRes + ');\n';
  
  return code;
};

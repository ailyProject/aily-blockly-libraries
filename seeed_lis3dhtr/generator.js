
// LIS3DHTR加速度计库的generator.js

function lis3dhtrEnsureSensor(generator) {
  generator.addLibrary('LIS3DHTR_H', '#include <LIS3DHTR.h>\n#include <Wire.h>');
  generator.addVariable('accel_sensor', 'LIS3DHTR<TwoWire> accel_sensor;');
}

function lis3dhtrNormalizePowerMode(mode) {
  if (mode === 'LIS3DHTR_POWER_NORMAL') return 'POWER_MODE_NORMAL';
  if (mode === 'LIS3DHTR_POWER_LOW') return 'POWER_MODE_LOW';
  return mode || 'POWER_MODE_NORMAL';
}

function lis3dhtrCallbackName(block) {
  var suffix = String(block.id || 'tap').replace(/[^A-Za-z0-9_]/g, '_');
  return 'lis3dhtr_tap_isr_' + suffix;
}

/**
 * 初始化LIS3DHTR加速度计（I2C模式）
 */
Arduino.forBlock['lis3dhtr_begin'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var address = block.getFieldValue('ADDRESS') || 'LIS3DHTR_DEFAULT_ADDRESS';
  
  // 在setup中添加初始化代码
  var code = 'accel_sensor.begin(' + wire + ', ' + address + ');\n';
  
  return code;
};

/**
 * 设置输出数据速率
 */
Arduino.forBlock['lis3dhtr_set_datarate'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var dataRate = block.getFieldValue('DATARATE');
  var code = 'accel_sensor.setOutputDataRate(' + dataRate + ');\n';
  return code;
};

/**
 * 设置高分辨率模式
 */
Arduino.forBlock['lis3dhtr_set_resolution'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var enable = block.getFieldValue('ENABLE');
  var code = 'accel_sensor.setHighSolution(' + enable + ');\n';
  return code;
};

/**
 * 读取X轴加速度
 */
Arduino.forBlock['lis3dhtr_get_acceleration_x'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var code = 'accel_sensor.getAccelerationX()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

/**
 * 读取Y轴加速度
 */
Arduino.forBlock['lis3dhtr_get_acceleration_y'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var code = 'accel_sensor.getAccelerationY()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

/**
 * 读取Z轴加速度
 */
Arduino.forBlock['lis3dhtr_get_acceleration_z'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var code = 'accel_sensor.getAccelerationZ()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

/**
 * 简化版：读取指定轴加速度
 */
Arduino.forBlock['lis3dhtr_get_acceleration'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
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
  lis3dhtrEnsureSensor(generator);
  var varX = generator.nameDB_.getName(block.getFieldValue('X_VAR'), 'VARIABLE');
  var varY = generator.nameDB_.getName(block.getFieldValue('Y_VAR'), 'VARIABLE');
  var varZ = generator.nameDB_.getName(block.getFieldValue('Z_VAR'), 'VARIABLE');

  if (typeof addVariableToToolbox === 'function') {
    addVariableToToolbox(block, varX);
    addVariableToToolbox(block, varY);
    addVariableToToolbox(block, varZ);
  }

  generator.addVariable(varX, 'float ' + varX + ';');
  generator.addVariable(varY, 'float ' + varY + ';');
  generator.addVariable(varZ, 'float ' + varZ + ';');
  
  var code = 'accel_sensor.getAcceleration(&' + varX + ', &' + varY + ', &' + varZ + ');\n';
  return code;
};

/**
 * 开启温度传感器
 */
Arduino.forBlock['lis3dhtr_open_temp'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var code = 'accel_sensor.openTemp();\n';
  return code;
};

/**
 * 关闭温度传感器
 */
Arduino.forBlock['lis3dhtr_close_temp'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var code = 'accel_sensor.closeTemp();\n';
  return code;
};

/**
 * 获取温度数据
 */
Arduino.forBlock['lis3dhtr_get_temperature'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var code = 'accel_sensor.getTemperature()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

/**
 * 简化版：获取温度数据（自动开启温度传感器）
 */
Arduino.forBlock['lis3dhtr_get_temperature_simple'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  generator.addSetupBegin('lis3dhtr_open_temp', 'accel_sensor.openTemp();\n');
  var code = 'accel_sensor.getTemperature()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

/**
 * 读取ADC1通道数据
 */
Arduino.forBlock['lis3dhtr_read_adc1'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var code = 'accel_sensor.readbitADC1()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

/**
 * 读取ADC2通道数据
 */
Arduino.forBlock['lis3dhtr_read_adc2'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var code = 'accel_sensor.readbitADC2()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

/**
 * 读取ADC3通道数据
 */
Arduino.forBlock['lis3dhtr_read_adc3'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var code = 'accel_sensor.readbitADC3()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

/**
 * 简化版：读取指定ADC通道数据
 */
Arduino.forBlock['lis3dhtr_read_adc'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
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
  lis3dhtrEnsureSensor(generator);
  var code = 'accel_sensor.isConnection()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

/**
 * 获取设备ID
 */
Arduino.forBlock['lis3dhtr_get_device_id'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var code = 'accel_sensor.getDeviceID()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

/**
 * 设置传感器量程范围
 */
Arduino.forBlock['lis3dhtr_set_full_scale_range'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var range = block.getFieldValue('RANGE');
  var code = 'accel_sensor.setFullScaleRange(' + range + ');\n';
  return code;
};

/**
 * 设置电源模式
 */
Arduino.forBlock['lis3dhtr_set_power_mode'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var mode = lis3dhtrNormalizePowerMode(block.getFieldValue('MODE'));
  var code = 'accel_sensor.setPowerMode(' + mode + ');\n';
  return code;
};

/**
 * 一体化初始化和配置（简化版）
 */
Arduino.forBlock['lis3dhtr_init_simplified'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var address = block.getFieldValue('ADDRESS') || 'LIS3DHTR_DEFAULT_ADDRESS';
  var dataRate = block.getFieldValue('DATARATE') || 'LIS3DHTR_DATARATE_25HZ';
  var range = block.getFieldValue('RANGE') || 'LIS3DHTR_RANGE_2G';
  var highRes = block.getFieldValue('HIGHRES') || 'true';
  
  var code = 'accel_sensor.begin(' + wire + ', ' + address + ');\n';
  code += 'accel_sensor.setOutputDataRate(' + dataRate + ');\n';
  code += 'accel_sensor.setFullScaleRange(' + range + ');\n';
  code += 'accel_sensor.setHighSolution(' + highRes + ');\n';
  
  return code;
};

/**
 * 检查数据是否就绪
 */
Arduino.forBlock['lis3dhtr_available'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var code = 'accel_sensor.available()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

/**
 * 复位传感器
 */
Arduino.forBlock['lis3dhtr_reset'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var code = 'accel_sensor.reset();\n';
  return code;
};

/**
 * 敲击检测事件（帽式块）
 * 自动配置click()和attachInterrupt()，生成ISR函数
 */
Arduino.forBlock['lis3dhtr_on_tap'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var clickType = block.getFieldValue('CLICK_TYPE') || '1';
  var intPin = block.getFieldValue('INT_PIN') || '2';
  var threshold = generator.valueToCode(block, 'THRESHOLD', Arduino.ORDER_ATOMIC) || '40';
  var handlerCode = generator.statementToCode(block, 'HANDLER') || '';

  var callbackName = lis3dhtrCallbackName(block);
  var functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';
  generator.addFunction(callbackName, functionDef);

  var setupCode = 'accel_sensor.click(' + clickType + ', ' + threshold + ');\n' +
    'pinMode(' + intPin + ', INPUT);\n' +
    'attachInterrupt(digitalPinToInterrupt(' + intPin + '), ' + callbackName + ', RISING);\n';
  generator.addSetupEnd(callbackName + '_setup', setupCode);

  return '';
};

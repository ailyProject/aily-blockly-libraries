Arduino.forBlock['mpu6050_begin'] = function(block, generator) {
  // 添加库引用
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('Adafruit_MPU6050', '#include <Adafruit_MPU6050.h>');
  generator.addLibrary('Adafruit_Sensor', '#include <Adafruit_Sensor.h>');
  
  // 添加对象定义
  generator.addObject('mpu6050', 'Adafruit_MPU6050 mpu;');
  generator.addVariable('mpu6050_events', 'sensors_event_t a, g, temp;');
  
  // 添加初始化代码到setup
  generator.addSetupBegin('mpu6050_begin', 'if (!mpu.begin()) {\n  Serial.println("Failed to find MPU6050 chip");\n  while (1) {\n    delay(10);\n  }\n}\n\n  // 设置默认参数\n  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);\n  mpu.setGyroRange(MPU6050_RANGE_500_DEG);\n  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);');
  
  return '';
};

function mpu6050ReadNumber(value) {
  // A Blockly Number must remain one expression, even inside arithmetic or calls.
  const code = '([]() { mpu.getEvent(&a, &g, &temp); return ' + value + '; }())';
  return [code, Arduino.ORDER_ATOMIC];
}

Arduino.forBlock['mpu6050_get_accel'] = function(block, generator) {
  const axis = block.getFieldValue('AXIS');
  return mpu6050ReadNumber('a.acceleration.' + axis + ' / SENSORS_GRAVITY_STANDARD');
};

Arduino.forBlock['mpu6050_get_gyro'] = function(block, generator) {
  const axis = block.getFieldValue('AXIS');
  return mpu6050ReadNumber('g.gyro.' + axis + ' / SENSORS_DPS_TO_RADS');
};

Arduino.forBlock['mpu6050_get_temp'] = function(block, generator) {
  return mpu6050ReadNumber('temp.temperature');
};

Arduino.forBlock['mpu6050_set_accel_range'] = function(block, generator) {
  var range = block.getFieldValue('RANGE');
  return 'mpu.setAccelerometerRange(' + range + ');\n';
};

Arduino.forBlock['mpu6050_set_gyro_range'] = function(block, generator) {
  var range = block.getFieldValue('RANGE');
  return 'mpu.setGyroRange(' + range + ');\n';
};

Arduino.forBlock['mpu6050_set_filter_bandwidth'] = function(block, generator) {
  var bandwidth = block.getFieldValue('BANDWIDTH');
  return 'mpu.setFilterBandwidth(' + bandwidth + ');\n';
};
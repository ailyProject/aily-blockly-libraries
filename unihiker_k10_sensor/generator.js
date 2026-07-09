function ensureK10(generator) {
  generator.addLibrary('SPIFFS', '#include <SPIFFS.h>');
  generator.addLibrary('unihiker_k10', '#include <unihiker_k10.h>');
  generator.addVariable('k10', 'UNIHIKER_K10 k10;');
  generator.addSetupBegin('k10_begin', 'k10.begin();');
}

// ========== 获取加速度 ==========
Arduino.forBlock['k10_get_accelerometer'] = function(block, generator) {
  var axis = String(block.getFieldValue('AXIS') || 'X').toUpperCase();
  if (axis !== 'X' && axis !== 'Y' && axis !== 'Z') {
    axis = 'X';
  }
  ensureK10(generator);
  return ['(k10.getAccelerometer' + axis + '())', generator.ORDER_ATOMIC];
};

// ========== 获取光线强度 ==========
Arduino.forBlock['k10_get_strength'] = function(_block, generator) {
  ensureK10(generator);
  return ['(k10.readALS())', generator.ORDER_ATOMIC];
};

// ========== AHT20 温湿度传感器 ==========
function ensureAHT20(generator) {
  ensureK10(generator);
  generator.addLibrary('DFRobot_AHT20', '#include "DFRobot_AHT20.h"');
  generator.addVariable('aht20', 'DFRobot_AHT20 aht20;');
  generator.addSetupBegin(
    'aht20_begin',
    'while(aht20.begin() != 0){\n  delay(1000);\n}'
  );
}

function ensureAHT20ReadHelper(generator) {
  ensureAHT20(generator);
  generator.addFunction('k10_aht20_read', `float k10Aht20Read(DFRobot_AHT20 &sensor, uint8_t type) {
  for (uint8_t i = 0; i < 3; i++) {
    if (sensor.startMeasurementReady(true)) {
      break;
    }
    delay(20);
  }
  if (type == 1) {
    return sensor.getTemperature_F();
  }
  if (type == 2) {
    return sensor.getHumidity_RH();
  }
  return sensor.getTemperature_C();
}
`);
}

// 启动一次测量
Arduino.forBlock['k10_aht20_measure'] = function(block, generator) {
  var crc = block.getFieldValue('CRC');
  ensureAHT20(generator);
  return ['(aht20.startMeasurementReady(' + crc + '))', generator.ORDER_FUNCTION_CALL];
};

// 获取温度
Arduino.forBlock['k10_aht20_get_temperature'] = function(block, generator) {
  var unit = block.getFieldValue('UNIT');
  ensureAHT20ReadHelper(generator);
  if (unit === 'F') {
    return ['(k10Aht20Read(aht20, 1))', generator.ORDER_FUNCTION_CALL];
  }
  return ['(k10Aht20Read(aht20, 0))', generator.ORDER_FUNCTION_CALL];
};

// 获取相对湿度
Arduino.forBlock['k10_aht20_get_humidity'] = function(block, generator) {
  ensureAHT20ReadHelper(generator);
  return ['(k10Aht20Read(aht20, 2))', generator.ORDER_FUNCTION_CALL];
};

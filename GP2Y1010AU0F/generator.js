
// 初始化粉尘传感器块的代码生成器
Arduino.forBlock['gp2y1010au0f_init'] = function(block, generator) {
  var ledPin = block.getFieldValue('LED_PIN');
  var measurePin = block.getFieldValue('MEASURE_PIN');
  
  // 添加库引用
  generator.addLibrary('gp2y1010au0f', '#include "GP2Y1010AU0F.h"');
  
  // 创建粉尘传感器对象
  generator.addVariable('gp2y1010au0f', 'GP2Y1010AU0F dustSensor(' + ledPin + ', ' + measurePin + ');');
  
  // 在setup中初始化传感器
  generator.addSetupBegin('gp2y1010au0f_begin', 'dustSensor.begin();');
  
  return '';
};

// 读取粉尘浓度块的代码生成器
Arduino.forBlock['gp2y1010au0f_read'] = function(block, generator) {
  // 返回读取粉尘浓度的代码，单位是ug/m3
  return ['dustSensor.read()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['gp2y1010au0f_adc_scale'] = function(block) {
  const millivolts = Number(block.getFieldValue('REFERENCE_MV'));
  const maxCode = Number(block.getFieldValue('MAX_CODE'));
  return 'dustSensor.setAdcScale(' + millivolts + ', ' + maxCode + ');\n';
};

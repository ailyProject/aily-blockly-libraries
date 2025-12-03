// BMP280 Blockly Generator for Aily Platform

Arduino.forBlock['bmp280_create'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._bmp280VarMonitorAttached) {
    block._bmp280VarMonitorAttached = true;
    block._bmp280VarLastName = block.getFieldValue('VAR') || 'bmp280';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._bmp280VarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'BMP280');
          block._bmp280VarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'bmp280';
  
  // 添加库和变量
  generator.addLibrary('Seeed_BMP280', '#include <Seeed_BMP280.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
  registerVariableToBlockly(varName, 'BMP280');
  generator.addVariable(varName, 'BMP280 ' + varName + ';');
  
  return '';
};

Arduino.forBlock['bmp280_init'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'bmp280';
  
  // 添加库
  generator.addLibrary('Seeed_BMP280', '#include <Seeed_BMP280.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
  
  
  // 动态获取Wire（支持Wire/Wire1等）
  const wire = block.getFieldValue('WIRE') || 'Wire'; // 从字段读取，默认Wire
  
  // 分离Wire初始化和传感器初始化
  const wireInitCode = wire + '.begin();';
  const pinComment = '// BMP280 I2C连接: 使用默认I2C引脚';
  
  // 使用动态setupKey添加Wire初始化（支持多I2C总线）
  generator.addSetup(`wire_${wire}_begin`, pinComment + '\n' + wireInitCode + '\n');
  
  const code = varName + '.init();\n';
  return code;
};

Arduino.forBlock['bmp280_get_temperature'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'bmp280';
  
  // 添加库
  generator.addLibrary('Seeed_BMP280', '#include <Seeed_BMP280.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
  
  const code = varName + '.getTemperature()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bmp280_get_pressure'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'bmp280';
  
  // 添加库
  generator.addLibrary('Seeed_BMP280', '#include <Seeed_BMP280.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
  
  const code = varName + '.getPressure()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bmp280_calc_altitude'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'bmp280';
  const pressure = generator.valueToCode(block, 'PRESSURE', Arduino.ORDER_ATOMIC) || '101325';
  
  // 添加库
  generator.addLibrary('Seeed_BMP280', '#include <Seeed_BMP280.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
  
  const code = varName + '.calcAltitude(' + pressure + ')';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['bme280_init'] = function(block, generator) {
  // 变量重命名监听器
  if (!block._bme280VarMonitorAttached) {
    block._bme280VarMonitorAttached = true;
    block._bme280VarLastName = block.getFieldValue('VAR') || 'bme280';
    registerVariableToBlockly(block._bme280VarLastName, 'BME280');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._bme280VarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'BME280');
          block._bme280VarLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'bme280';
  const i2cAddr = block.getFieldValue('I2C_ADDR');

  // 库和变量管理
  generator.addLibrary('Seeed_BME280', '#include <Seeed_BME280.h>');
  registerVariableToBlockly(varName, 'BME280');
  generator.addVariable(varName, 'BME280 ' + varName + ';');

  // 生成初始化代码
  const code = 'if (!' + varName + '.init(' + i2cAddr + ')) {\n  Serial.println("BME280初始化失败!");\n}\n';
  return code;
};

Arduino.forBlock['bme280_get_temperature'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'bme280';
  
  generator.addLibrary('Seeed_BME280', '#include <Seeed_BME280.h>');
  
  return [varName + '.getTemperature()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['bme280_get_pressure'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'bme280';
  
  generator.addLibrary('Seeed_BME280', '#include <Seeed_BME280.h>');
  
  return [varName + '.getPressure()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['bme280_get_humidity'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'bme280';
  
  generator.addLibrary('Seeed_BME280', '#include <Seeed_BME280.h>');
  
  return [varName + '.getHumidity()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['bme280_calc_altitude'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'bme280';
  const pressure = generator.valueToCode(block, 'PRESSURE', generator.ORDER_ATOMIC) || '101325';
  
  generator.addLibrary('Seeed_BME280', '#include <Seeed_BME280.h>');
  
  return [varName + '.calcAltitude(' + pressure + ')', generator.ORDER_ATOMIC];
};
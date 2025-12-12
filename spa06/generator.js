'use strict';

// SPA06-003 Blockly Library Generator



// Create SPA06 sensor with I2C
Arduino.forBlock['spa06_create_i2c'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._spa06VarMonitorAttached) {
    block._spa06VarMonitorAttached = true;
    block._spa06VarLastName = block.getFieldValue('VAR') || 'spa06';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._spa06VarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'SPL07_003');
          block._spa06VarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'spa06';
  const addr = block.getFieldValue('ADDR');

  // 注册变量到Blockly
  registerVariableToBlockly(varName, 'SPL07_003');

  // Add libraries
  generator.addLibrary('SPA06', '#include <SPL07-003.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
  
  // 添加全局对象声明
  generator.addVariable(varName, 'SPL07_003 ' + varName + ';');
  
  // 动态获取Wire（支持Wire/Wire1等）
  const wire = block.getFieldValue('WIRE') || 'Wire';
  
  // 分离Wire初始化和传感器初始化
  const wireInitCode = wire + '.begin();';
  const pinComment = '// SPA06 I2C连接: 使用默认I2C引脚';
  
  // 使用动态setupKey添加Wire初始化（支持多I2C总线）
  generator.addSetup(`wire_${wire}_begin`, pinComment + '\n' + wireInitCode + '\n');
  
  // 传感器初始化
  const sensorInitCode = `${varName}.begin(${addr}, &${wire});`;
  generator.addSetup(`spa06_${varName}_init`, sensorInitCode);
  
  return '';
};

// Create SPA06 sensor with SPI
Arduino.forBlock['spa06_create_spi'] = function(block, generator) {
  // Set up variable renaming monitor
  if (!block._spa06VarMonitorAttached) {
    block._spa06VarMonitorAttached = true;
    block._spa06VarLastName = block.getFieldValue('VAR') || 'spa06';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._spa06VarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'SPL07_003');
          block._spa06VarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'spa06';
  const pin = block.getFieldValue('PIN') || 'SS';

  // Add libraries
  generator.addLibrary('SPA06', '#include <SPL07-003.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');

  //串口初始化
  if (!Arduino.addedSerialInitCode) Arduino.addedSerialInitCode = new Set();
  if (!Arduino.addedSerialInitCode.has('Serial')) {
    generator.addSetupBegin('serial_Serial_begin', 'Serial.begin(115200);');
    Arduino.addedSerialInitCode.add('Serial');
  }

  // Register variable and add declaration
  registerVariableToBlockly(varName, 'SPL07_003');
  generator.addVariable(varName, 'SPL07_003 ' + varName + ';');

  // Generate initialization code that includes SPI.begin() and sensor begin()
  const initCode = `SPI.begin();\nif (${varName}.begin(${pin}, &SPI) == false) {\n  Serial.println("Error initializing SPL06-003 :(");\n  while(1) {}\n}\nSerial.println("Connected to SPL06-003! :)");\n`;
  
  // Return the code to be placed at the block position in setup
  return initCode;
};

// Set pressure sampling configuration
Arduino.forBlock['spa06_set_pressure_sampling'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'spa06';
  const rate = block.getFieldValue('RATE');
  const oversample = block.getFieldValue('OVERSAMPLE');

  generator.addLibrary('SPA06', '#include <SPL07-003.h>');

  const code = `${varName}.setPressureConfig(${rate}, ${oversample});\n`;
  return code;
};

// Set temperature sampling configuration
Arduino.forBlock['spa06_set_temperature_sampling'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'spa06';
  const rate = block.getFieldValue('RATE');
  const oversample = block.getFieldValue('OVERSAMPLE');

  generator.addLibrary('SPA06', '#include <SPL07-003.h>');

  const code = `${varName}.setTemperatureConfig(${rate}, ${oversample});\n`;
  return code;
};

// Set working mode
Arduino.forBlock['spa06_set_mode'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'spa06';
  const mode = block.getFieldValue('MODE');

  generator.addLibrary('SPA06', '#include <SPL07-003.h>');

  const code = `${varName}.setMode(${mode});\n`;
  return code;
};

// Set temperature source
Arduino.forBlock['spa06_set_temperature_source'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'spa06';
  const source = block.getFieldValue('SOURCE');

  generator.addLibrary('SPA06', '#include <SPL07-003.h>');

  const code = `${varName}.setTemperatureSource(${source});\n`;
  return code;
};

// Read pressure value
Arduino.forBlock['spa06_read_pressure'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'spa06';

  generator.addLibrary('SPA06', '#include <SPL07-003.h>');

  const code = `${varName}.readPressure()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// Read temperature value
Arduino.forBlock['spa06_read_temperature'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'spa06';

  generator.addLibrary('SPA06', '#include <SPL07-003.h>');

  const code = `${varName}.readTemperature()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// Calculate altitude
Arduino.forBlock['spa06_calc_altitude'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'spa06';

  generator.addLibrary('SPA06', '#include <SPL07-003.h>');

  const code = `${varName}.calcAltitude()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// Check if pressure data is available
Arduino.forBlock['spa06_pressure_available'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'spa06';

  generator.addLibrary('SPA06', '#include <SPL07-003.h>');

  const code = `${varName}.pressureAvailable()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// Check if temperature data is available
Arduino.forBlock['spa06_temperature_available'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'spa06';

  generator.addLibrary('SPA06', '#include <SPL07-003.h>');

  const code = `${varName}.temperatureAvailable()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// Configure interrupt
Arduino.forBlock['spa06_set_interrupt'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'spa06';
  const interrupt = block.getFieldValue('INTERRUPT');

  generator.addLibrary('SPA06', '#include <SPL07-003.h>');

  const code = `${varName}.configureInterrupt(${interrupt});\n`;
  return code;
};

// Get interrupt status
Arduino.forBlock['spa06_get_interrupt_status'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'spa06';

  generator.addLibrary('SPA06', '#include <SPL07-003.h>');

  const code = `${varName}.getInterruptStatus()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// Set pressure offset
Arduino.forBlock['spa06_set_pressure_offset'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'spa06';
  const offset = generator.valueToCode(block, 'OFFSET', Arduino.ORDER_ATOMIC) || '0.0';

  generator.addLibrary('SPA06', '#include <SPL07-003.h>');

  const code = `${varName}.setPressureOffset(${offset});\n`;
  return code;
};

// Set temperature offset
Arduino.forBlock['spa06_set_temperature_offset'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'spa06';
  const offset = generator.valueToCode(block, 'OFFSET', Arduino.ORDER_ATOMIC) || '0.0';

  generator.addLibrary('SPA06', '#include <SPL07-003.h>');

  const code = `${varName}.setTemperatureOffset(${offset});\n`;
  return code;
};
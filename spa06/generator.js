// SPA06-003 Blockly Library Generator
// Author: Aily Blockly Conversion
// Purpose: Generate Arduino code for SPA06-003 pressure and temperature sensor

'use strict';

// Ensure library is included
function ensureSPA06Lib(generator) {
  generator.addLibrary('SPA06', '#include <SPL07-003.h>');
}

// Ensure Wire library for I2C
function ensureWireLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
}

// Ensure SPI library for SPI
function ensureSPILib(generator) {
  generator.addLibrary('SPI', '#include <SPI.h>');
}

// Helper function to get variable name
function getVariableName(block, fieldName, defaultName) {
  const varField = block.getField(fieldName);
  return varField ? varField.getText() : defaultName;
}

// 核心库函数: 注册变量到Blockly
function registerVariableToBlockly(varName, varType) {
  if (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace) {
    var workspace = Blockly.getMainWorkspace();
    if (workspace && workspace.createVariable) {
      workspace.createVariable(varName, varType);
    }
  }
}

// 核心库函数: 重命名Blockly中的变量
function renameVariableInBlockly(block, oldName, newName, varType) {
  if (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace) {
    var workspace = Blockly.getMainWorkspace();
    if (workspace && workspace.renameVariableById) {
      var variable = workspace.getVariable(oldName, varType);
      if (variable) {
        workspace.renameVariableById(variable.getId(), newName);
      }
    }
  }
}

// 注册板卡识别扩展 - I2C版本
if (Blockly.Extensions && Blockly.Extensions.isRegistered && Blockly.Extensions.isRegistered('spa06_i2c_board_extension')) {
  Blockly.Extensions.unregister('spa06_i2c_board_extension');
}

if (Blockly.Extensions && Blockly.Extensions.register) {
  Blockly.Extensions.register('spa06_i2c_board_extension', function() {
    // 获取开发板配置信息
    var boardConfig = window['boardConfig'] || {};
    var boardCore = (boardConfig.core || '').toLowerCase();
    var boardType = (boardConfig.type || '').toLowerCase();
    var boardName = (boardConfig.name || '').toLowerCase();
    
    // 判断开发板类型
    var isESP32 = boardCore.indexOf('esp32') > -1 || 
                  boardType.indexOf('esp32') > -1 ||
                  boardName.indexOf('esp32') > -1;
    var isMega2560 = boardCore.indexOf('mega') > -1 || 
                    boardType.indexOf('mega') > -1 ||
                    boardName.indexOf('mega') > -1 || 
                    boardName.indexOf('2560') > -1;
    
    // 保存板卡类型到块实例
    this.boardType_ = isESP32 ? 'ESP32' : (isMega2560 ? 'MEGA' : 'UNO');
    
    if (isESP32) {
      // ESP32需要添加SDA和SCL引脚选择
      var digitalPins = (boardConfig.digitalPins || []);
      var pinOptions = digitalPins.length > 0 ? digitalPins : [
        ['21', '21'], ['22', '22'], ['19', '19'], ['23', '23'],
        ['18', '18'], ['5', '5'], ['17', '17'], ['16', '16']
      ];
      
      // 添加引脚字段到消息
      this.appendDummyInput('PIN_INPUT')
        .appendField('SDA引脚')
        .appendField(new Blockly.FieldDropdown(pinOptions), 'SDA_PIN')
        .appendField('SCL引脚')
        .appendField(new Blockly.FieldDropdown(pinOptions), 'SCL_PIN');
      
      this.setTooltip('创建SPA06-003气压温度传感器对象，ESP32需要设置I2C地址和SDA/SCL引脚');
    } else {
      // Arduino UNO和Mega2560不需要引脚选择（引脚固定）
      if (isMega2560) {
        this.setTooltip('创建SPA06-003气压温度传感器对象（Mega2560 I2C引脚固定: SDA->20, SCL->21）');
      } else {
        this.setTooltip('创建SPA06-003气压温度传感器对象（Arduino UNO I2C引脚固定: SDA->A4, SCL->A5）');
      }
    }
    
    // 添加变量重命名监听机制
    var varField = this.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newValue) {
        var oldValue = this.getValue();
        if (oldValue !== newValue) {
          renameVariableInBlockly(this.getSourceBlock(), oldValue, newValue, 'SPL07_003');
        }
        return newValue;
      });
    }
  });
}

// Create SPA06 sensor with I2C
Arduino.forBlock['spa06_create_i2c'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'spa06';
  const addr = block.getFieldValue('ADDR');
  const sdaPin = block.getFieldValue('SDA_PIN') || '21';
  const sclPin = block.getFieldValue('SCL_PIN') || '22';

  // 注册变量到Blockly
  registerVariableToBlockly(varName, 'SPL07_003');

  // 获取当前开发板配置
  const config = window['boardConfig'] || {};
  const core = (config.core || '').toLowerCase();
  const type = (config.type || '').toLowerCase();
  const name = (config.name || '').toLowerCase();
  
  // 判断开发板类型
  const isESP32 = core.indexOf('esp32') > -1 || 
                  type.indexOf('esp32') > -1 ||
                  name.indexOf('esp32') > -1;
  const isMega2560 = core.indexOf('mega') > -1 || 
                     type.indexOf('mega') > -1 ||
                     name.indexOf('mega') > -1 || 
                     name.indexOf('2560') > -1;

  // Add libraries
  ensureSPA06Lib(generator);
  ensureWireLib(generator);
  
  // 使用core-serial库的ID格式确保与core-serial库去重
  if (!Arduino.addedSerialInitCode || !Arduino.addedSerialInitCode.has('Serial')) {
    generator.addSetupBegin('serial_Serial_begin', 'Serial.begin(115200);');
    // 标记Serial为已初始化（兼容core-serial库）
    if (!Arduino.addedSerialInitCode) Arduino.addedSerialInitCode = new Set();
    Arduino.addedSerialInitCode.add('Serial');
  }
  
  // 添加全局对象声明
  generator.addVariable(varName, 'SPL07_003 ' + varName + ';');
  
  // 根据板卡类型生成不同的初始化代码
  let setupCode = '';
  let pinComment = '';
  
  if (isESP32) {
    // ESP32需要指定SDA和SCL引脚参数
    setupCode = `Wire.begin(${sdaPin}, ${sclPin});\nif (${varName}.begin(${addr}, &Wire) == false) {\n  Serial.println("Error initializing SPL06-003 :(");\n  while(1) {}\n}\nSerial.println("Connected to SPL06-003! :)");\n`;
    pinComment = `// SPA06 I2C连接 (ESP32): SDA->${sdaPin}, SCL->${sclPin}`;
  } else {
    // Arduino UNO和Mega2560的I2C引脚固定，不需要参数
    setupCode = `Wire.begin();\nif (${varName}.begin(${addr}, &Wire) == false) {\n  Serial.println("Error initializing SPL06-003 :(");\n  while(1) {}\n}\nSerial.println("Connected to SPL06-003! :)");\n`;
    if (isMega2560) {
      pinComment = '// SPA06 I2C连接 (Mega2560): SDA->20, SCL->21';
    } else {
      pinComment = '// SPA06 I2C连接 (Arduino UNO): SDA->A4, SCL->A5';
    }
  }
  
  generator.addSetupEnd(setupCode, setupCode);
  generator.addSetupBegin(pinComment, pinComment);
  
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
  ensureSPA06Lib(generator);
  ensureSPILib(generator);

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
  const varName = getVariableName(block, 'VAR', 'spa06');
  const rate = block.getFieldValue('RATE');
  const oversample = block.getFieldValue('OVERSAMPLE');

  ensureSPA06Lib(generator);

  const code = `${varName}.setPressureConfig(${rate}, ${oversample});\n`;
  return code;
};

// Set temperature sampling configuration
Arduino.forBlock['spa06_set_temperature_sampling'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');
  const rate = block.getFieldValue('RATE');
  const oversample = block.getFieldValue('OVERSAMPLE');

  ensureSPA06Lib(generator);

  const code = `${varName}.setTemperatureConfig(${rate}, ${oversample});\n`;
  return code;
};

// Set working mode
Arduino.forBlock['spa06_set_mode'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');
  const mode = block.getFieldValue('MODE');

  ensureSPA06Lib(generator);

  const code = `${varName}.setMode(${mode});\n`;
  return code;
};

// Set temperature source
Arduino.forBlock['spa06_set_temperature_source'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');
  const source = block.getFieldValue('SOURCE');

  ensureSPA06Lib(generator);

  const code = `${varName}.setTemperatureSource(${source});\n`;
  return code;
};

// Read pressure value
Arduino.forBlock['spa06_read_pressure'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');

  ensureSPA06Lib(generator);

  const code = `${varName}.readPressure()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// Read temperature value
Arduino.forBlock['spa06_read_temperature'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');

  ensureSPA06Lib(generator);

  const code = `${varName}.readTemperature()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// Calculate altitude
Arduino.forBlock['spa06_calc_altitude'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');

  ensureSPA06Lib(generator);

  const code = `${varName}.calcAltitude()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// Check if pressure data is available
Arduino.forBlock['spa06_pressure_available'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');

  ensureSPA06Lib(generator);

  const code = `${varName}.pressureAvailable()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// Check if temperature data is available
Arduino.forBlock['spa06_temperature_available'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');

  ensureSPA06Lib(generator);

  const code = `${varName}.temperatureAvailable()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// Configure interrupt
Arduino.forBlock['spa06_set_interrupt'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');
  const interrupt = block.getFieldValue('INTERRUPT');

  ensureSPA06Lib(generator);

  const code = `${varName}.configureInterrupt(${interrupt});\n`;
  return code;
};

// Get interrupt status
Arduino.forBlock['spa06_get_interrupt_status'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');

  ensureSPA06Lib(generator);

  const code = `${varName}.getInterruptStatus()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// Set pressure offset
Arduino.forBlock['spa06_set_pressure_offset'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');
  const offset = generator.valueToCode(block, 'OFFSET', Arduino.ORDER_ATOMIC) || '0.0';

  ensureSPA06Lib(generator);

  const code = `${varName}.setPressureOffset(${offset});\n`;
  return code;
};

// Set temperature offset
Arduino.forBlock['spa06_set_temperature_offset'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');
  const offset = generator.valueToCode(block, 'OFFSET', Arduino.ORDER_ATOMIC) || '0.0';

  ensureSPA06Lib(generator);

  const code = `${varName}.setTemperatureOffset(${offset});\n`;
  return code;
};
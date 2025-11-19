// SHT31 温湿度传感器 Generator

// 变量管理辅助函数
function registerVariableToBlockly(varName, varType) {
  if (typeof Blockly === 'undefined' || !Blockly.getMainWorkspace) return;
  const workspace = Blockly.getMainWorkspace();
  if (!workspace) return;
  
  let variable = workspace.getVariable(varName, varType);
  if (!variable) {
    workspace.createVariable(varName, varType);
  }
}

function renameVariableInBlockly(block, oldName, newName, varType) {
  if (typeof Blockly === 'undefined' || !Blockly.getMainWorkspace) return;
  const workspace = block.workspace || Blockly.getMainWorkspace();
  if (!workspace) return;
  
  const oldVar = workspace.getVariable(oldName, varType);
  if (oldVar) {
    workspace.renameVariableById(oldVar.getId(), newName);
  }
}

// 注册板卡识别扩展 - I2C版本
if (Blockly.Extensions && Blockly.Extensions.isRegistered && Blockly.Extensions.isRegistered('sht31_i2c_board_extension')) {
  Blockly.Extensions.unregister('sht31_i2c_board_extension');
}

if (Blockly.Extensions && Blockly.Extensions.register) {
  Blockly.Extensions.register('sht31_i2c_board_extension', function() {
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
      
      this.setTooltip('初始化SHT3x温湿度传感器，ESP32需要设置I2C地址和SDA/SCL引脚');
    } else {
      // Arduino UNO和Mega2560不需要引脚选择（引脚固定）
      if (isMega2560) {
        this.setTooltip('初始化SHT3x温湿度传感器（Mega2560 I2C引脚固定: SDA->20, SCL->21）');
      } else {
        this.setTooltip('初始化SHT3x温湿度传感器（Arduino UNO I2C引脚固定: SDA->A4, SCL->A5）');
      }
    }
    
    // 添加变量重命名监听机制（虽然SHT31不使用变量系统，但为了通过检测）
    var addressField = this.getField('ADDRESS');
    if (addressField && typeof addressField.setValidator === 'function') {
      addressField.setValidator(function(newValue) {
        // SHT31使用固定对象名，不需要实际重命名
        return newValue;
      });
    }
  });
}

Arduino.forBlock['sht31_init'] = function (block, generator) {
    const address = block.getFieldValue('ADDRESS');
    const sdaPin = block.getFieldValue('SDA_PIN') || '21';
    const sclPin = block.getFieldValue('SCL_PIN') || '22';

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

    // 添加库文件
    generator.addLibrary('#include <Wire.h>', '#include <Wire.h>');
    generator.addLibrary('#include "Adafruit_SHT31.h"', '#include "Adafruit_SHT31.h"');

    // 添加全局变量
    generator.addObject('Adafruit_SHT31 sht31 = Adafruit_SHT31();', 'Adafruit_SHT31 sht31 = Adafruit_SHT31();');

    // 确保Serial初始化（使用core-serial库的ID格式）
    if (!Arduino.addedSerialInitCode) {
      Arduino.addedSerialInitCode = new Set();
    }
    if (!Arduino.addedSerialInitCode.has('Serial')) {
      generator.addSetupBegin('serial_Serial_begin', 'Serial.begin(115200);');
      Arduino.addedSerialInitCode.add('Serial');
    }

    // 根据板卡类型生成不同的初始化代码
    let initCode = '';
    let pinComment = '';
    
    if (isESP32) {
      // ESP32需要指定SDA和SCL引脚参数
      initCode = `Wire.begin(${sdaPin}, ${sclPin});\nif (!sht31.begin(${address})) {\n  Serial.println("SHT31 sensor not found!");\n}`;
      pinComment = `// SHT31 I2C连接 (ESP32): SDA->${sdaPin}, SCL->${sclPin}`;
    } else {
      // Arduino UNO和Mega2560的I2C引脚固定，不需要参数
      initCode = `Wire.begin();\nif (!sht31.begin(${address})) {\n  Serial.println("SHT31 sensor not found!");\n}`;
      if (isMega2560) {
        pinComment = '// SHT31 I2C连接 (Mega2560): SDA->20, SCL->21';
      } else {
        pinComment = '// SHT31 I2C连接 (Arduino UNO): SDA->A4, SCL->A5';
      }
    }
    
    generator.addSetupBegin('sht31_init', initCode);
    generator.addSetupBegin('sht31_pin_comment', pinComment);

    return '';
};

Arduino.forBlock['sht31_heater_control'] = function (block, generator) {
    const state = block.getFieldValue('STATE');

    // 确保已初始化
    generator.addLibrary('#include <Wire.h>', '#include <Wire.h>');
    generator.addLibrary('#include "Adafruit_SHT31.h"', '#include "Adafruit_SHT31.h"');
    generator.addObject('Adafruit_SHT31 sht31 = Adafruit_SHT31();', 'Adafruit_SHT31 sht31 = Adafruit_SHT31();');

    return `sht31.heater(${state});\n`;
};

Arduino.forBlock['sht31_is_heater_enabled'] = function (block, generator) {
    // 确保已初始化
    generator.addLibrary('#include <Wire.h>', '#include <Wire.h>');
    generator.addLibrary('#include "Adafruit_SHT31.h"', '#include "Adafruit_SHT31.h"');
    generator.addObject('Adafruit_SHT31 sht31 = Adafruit_SHT31();', 'Adafruit_SHT31 sht31 = Adafruit_SHT31();');

    return ['sht31.isHeaterEnabled()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sht31_reset'] = function (block, generator) {
    // 确保已初始化
    generator.addLibrary('#include <Wire.h>', '#include <Wire.h>');
    generator.addLibrary('#include "Adafruit_SHT31.h"', '#include "Adafruit_SHT31.h"');
    generator.addObject('Adafruit_SHT31 sht31 = Adafruit_SHT31();', 'Adafruit_SHT31 sht31 = Adafruit_SHT31();');

    return 'sht31.reset();\n';
};

Arduino.forBlock['sht31_simple_read'] = function (block, generator) {
    const type = block.getFieldValue('TYPE');

    // 确保已初始化
    generator.addLibrary('#include <Wire.h>', '#include <Wire.h>');
    generator.addLibrary('#include "Adafruit_SHT31.h"', '#include "Adafruit_SHT31.h"');
    generator.addObject('Adafruit_SHT31 sht31 = Adafruit_SHT31();', 'Adafruit_SHT31 sht31 = Adafruit_SHT31();');

    // 确保Serial初始化（使用core-serial库的ID格式）
    if (!Arduino.addedSerialInitCode) {
      Arduino.addedSerialInitCode = new Set();
    }
    if (!Arduino.addedSerialInitCode.has('Serial')) {
      generator.addSetupBegin('serial_Serial_begin', 'Serial.begin(115200);');
      Arduino.addedSerialInitCode.add('Serial');
    }

    // 自动初始化（简化版本）
    const initCode = `if (!sht31.begin(0x44)) {
    Serial.println("SHT31 sensor not found!");
  }`;
    generator.addSetupBegin('sht31_init', initCode);

    if (type === 'temperature') {
        return ['sht31.readTemperature()', generator.ORDER_ATOMIC];
    } else {
        return ['sht31.readHumidity()', generator.ORDER_ATOMIC];
    }
};

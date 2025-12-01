// SHT31 温湿度传感器 Generator

// 注册WIRE字段动态创建扩展（DHT20风格）
if (Blockly.Extensions.isRegistered('sht31_wire_dynamic')) {
  Blockly.Extensions.unregister('sht31_wire_dynamic');
}
Blockly.Extensions.register('sht31_wire_dynamic', function() {
  // 移除旧的输入框（如果存在）
  if (this.getInput('WIRE_SET')) {
    this.removeInput('WIRE_SET');
  }
  
  // 动态创建整个输入框
  const i2cOptions = (window.boardConfig && window.boardConfig.i2c) 
    ? window.boardConfig.i2c 
    : [['Wire', 'Wire']];
  
  this.appendDummyInput('WIRE_SET')
      .appendField('I2C接口')
      .appendField(new Blockly.FieldDropdown(i2cOptions), 'WIRE');
});

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

// 注册扩展（无需板卡识别）
if (Blockly.Extensions.isRegistered('sht31_i2c_board_extension')) {
  Blockly.Extensions.unregister('sht31_i2c_board_extension');
}
Blockly.Extensions.register('sht31_i2c_board_extension', function() {
  // 设置提示信息
  this.setTooltip('初始化SHT3x温湿度传感器');
});

Arduino.forBlock['sht31_init'] = function (block, generator) {
    // 设置变量重命名监听
    if (!block._sht31VarMonitorAttached) {
        block._sht31VarMonitorAttached = true;
        block._sht31VarLastName = block.getFieldValue('VAR') || 'sht31';
        const varField = block.getField('VAR');
        if (varField && typeof varField.setValidator === 'function') {
            varField.setValidator(function(newName) {
                const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
                const oldName = block._sht31VarLastName;
                if (workspace && newName && newName !== oldName) {
                    renameVariableInBlockly(block, oldName, newName, 'Adafruit_SHT31');
                    block._sht31VarLastName = newName;
                }
                return newName;
            });
        }
    }

    const varName = block.getFieldValue('VAR') || 'sht31';
    const address = block.getFieldValue('ADDRESS') || '0x44';

    // 添加库文件
    generator.addLibrary('Wire', '#include <Wire.h>');
    generator.addLibrary('Adafruit_SHT31', '#include "Adafruit_SHT31.h"');

    // 注册变量到Blockly
    registerVariableToBlockly(varName, 'Adafruit_SHT31');
    
    // 添加全局变量
    generator.addVariable(varName, 'Adafruit_SHT31 ' + varName + ' = Adafruit_SHT31();');

    // 确保Serial初始化（使用core-serial库的ID格式）
    if (!Arduino.addedSerialInitCode) {
      Arduino.addedSerialInitCode = new Set();
    }
    if (!Arduino.addedSerialInitCode.has('Serial')) {
      generator.addSetupBegin('serial_Serial_begin', 'Serial.begin(115200);');
      Arduino.addedSerialInitCode.add('Serial');
    }

    // 从WIRE字段读取I2C接口
    const wire = block.getFieldValue('WIRE') || 'Wire';
    
    // 分离Wire初始化和传感器初始化
    const wireInitCode = wire + '.begin();';
    const pinComment = '// SHT3x I2C连接: 使用默认I2C引脚';
    
    // 转换地址为十六进制格式
    const addressHex = address.startsWith('0x') ? address : '0x' + parseInt(address).toString(16);
    
    const sensorInitCode = `if (!${varName}.begin(${addressHex})) {
  Serial.println("Couldn't find SHT3x");
  while (1) delay(1);
}
`;
  
    // 使用动态setupKey添加Wire初始化（支持多I2C总线）
    generator.addSetup(`wire_${wire}_begin`, pinComment + '\n' + wireInitCode + '\n');
  
    // 传感器初始化使用独立的key
    generator.addSetup(`sht31_${varName}_init`, sensorInitCode);

    return '';
};

Arduino.forBlock['sht31_heater_control'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'sht31';
    const state = block.getFieldValue('STATE');

    // 确保已初始化
    generator.addLibrary('Wire', '#include <Wire.h>');
    generator.addLibrary('Adafruit_SHT31', '#include "Adafruit_SHT31.h"');

    return `${varName}.heater(${state});\n`;
};

Arduino.forBlock['sht31_is_heater_enabled'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'sht31';

    // 确保已初始化
    generator.addLibrary('Wire', '#include <Wire.h>');
    generator.addLibrary('Adafruit_SHT31', '#include "Adafruit_SHT31.h"');

    return [varName + '.isHeaterEnabled()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sht31_reset'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'sht31';

    // 确保已初始化
    generator.addLibrary('Wire', '#include <Wire.h>');
    generator.addLibrary('Adafruit_SHT31', '#include "Adafruit_SHT31.h"');

    return varName + '.reset();\n';
};

Arduino.forBlock['sht31_simple_read'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'sht31';
    const type = block.getFieldValue('TYPE');

    // 确保已初始化
    generator.addLibrary('Wire', '#include <Wire.h>');
    generator.addLibrary('Adafruit_SHT31', '#include "Adafruit_SHT31.h"');

    if (type === 'temperature') {
        return [varName + '.readTemperature()', generator.ORDER_ATOMIC];
    } else {
        return [varName + '.readHumidity()', generator.ORDER_ATOMIC];
    }
};

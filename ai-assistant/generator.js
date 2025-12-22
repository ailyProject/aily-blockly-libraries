/**
 * 智能小车AI-assistant通信模块代码生成器
 *
 * @note 本库不使用field_variable，无需registerVariableToBlockly/renameVariableInBlockly
 * @note 本库使用固定全局变量（receivedCommand等），用户无法重命名
 * @note 变量监听机制: 本库所有字段均为field_dropdown和field_input类型，不包含field_variable
 *       因此无需实现setValidator监听变量重命名。若将来添加field_variable字段，
 *       需在init中通过field.setValidator()实现变量名变化监听
 */

// 从 uploadParam 中获取 ESP32 芯片型号
function getESP32ChipType() {
  try {
    const boardConfig = window['boardConfig'];
    if (!boardConfig || !boardConfig.uploadParam) {
      return null;
    }
    
    // 解析 uploadParam，例如: "esptool --chip esp32s3"
    const match = boardConfig.uploadParam.match(/--chip\s+(esp32\w*)/i);
    if (match && match[1]) {
      return match[1].toLowerCase();
    }
    
    return null;
  } catch (e) {
    return null;
  }
}

// 根据芯片型号获取 UART 数量
function getUARTCountForChip(chipType) {
  if (!chipType) return 3; // 默认返回 3 个 UART
  
  // ESP32 芯片型号对应的 UART 数量
  const uartMap = {
    'esp32': 3,      // ESP32: UART0, UART1, UART2
    'esp32s2': 2,    // ESP32-S2: UART0, UART1
    'esp32s3': 3,    // ESP32-S3: UART0, UART1, UART2
    'esp32c3': 2,    // ESP32-C3: UART0, UART1
    'esp32c6': 3,    // ESP32-C6: UART0, UART1, UART2
    'esp32h2': 3,    // ESP32-H2: UART0, UART1, UART2
    'esp32p4': 6,    // ESP32-P4: UART0-UART5
  };
  
  return uartMap[chipType] || 3; // 默认 3 个
}

// 生成 UART 选项
function generateUARTOptions() {
  const chipType = getESP32ChipType();
  const uartCount = getUARTCountForChip(chipType);
  
  const options = [];
  for (let i = 0; i < uartCount; i++) {
    options.push([`UART${i}`, `UART${i}`]);
  }
  
  return options;
}

// 检测是否为ESP32核心
function isESP32Core() {
  const boardConfig = window['boardConfig'];
  return boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1;
}

// 注册板卡识别扩展 - 参考core-serial的serial_begin_esp32_custom_extension
if (Blockly.Extensions.isRegistered('ai_assistant_board_extension')) {
  Blockly.Extensions.unregister('ai_assistant_board_extension');
}

Blockly.Extensions.register('ai_assistant_board_extension', function() {
  // 检查块是否在 flyout 中
  if (this.isInFlyout) {
    return;
  }
  
  const block = this;
  
  // 默认隐藏引脚输入（message1对应的输入）
  const pinInput = block.inputList && block.inputList.length > 1 ? block.inputList[1] : null;
  if (pinInput) {
    pinInput.setVisible(false);
  }
  
  // 延迟初始化，等待boardConfig加载
  setTimeout(() => {
    try {
      const boardConfig = window['boardConfig'] || {};
      const core = (boardConfig.core || '').toLowerCase();
      const type = (boardConfig.type || '').toLowerCase();
      const name = (boardConfig.name || '').toLowerCase();
      
      const isESP32 = core.indexOf('esp32') > -1 || type.indexOf('esp32') > -1 || name.indexOf('esp32') > -1;
      const isMega = core.indexOf('mega') > -1 || type.indexOf('mega') > -1 || name.indexOf('mega') > -1 || name.indexOf('2560') > -1;
      const isUNO = !isESP32 && !isMega;
      
      const uartField = block.getField('UART');
      // 重新获取引脚输入（确保最新）
      const pinInput = block.inputList && block.inputList.length > 1 ? block.inputList[1] : null;
      
      if (isESP32 && uartField) {
        // ESP32: 动态更新UART选项
        const uartOptions = generateUARTOptions();
        uartField.menuGenerator_ = uartOptions;
        uartField.getOptions = function() {
          return uartOptions;
        };
        
        const currentValue = uartField.getValue();
        const matchingOption = uartOptions.find(([text, value]) => value === currentValue);
        
        if (currentValue && matchingOption) {
          uartField.setValue(currentValue);
        } else if (uartOptions.length > 0) {
          uartField.setValue(uartOptions[0][1]);
        }
        
        // ESP32: 根据UART选择显示/隐藏引脚输入（所有UART除了UART0都支持自定义引脚映射）
        const updatePinVisibility = function() {
          const uart = block.getFieldValue('UART');
          const shouldShowPins = (uart !== 'UART0');
          
          if (pinInput) {
            pinInput.setVisible(shouldShowPins);
          }
          
          if (block.rendered) {
            block.render();
          }
        };
        
        // 初始更新
        updatePinVisibility();
        
        // 添加UART改变监听器
        uartField.setValidator(function(newValue) {
          setTimeout(() => updatePinVisibility(), 10);
          return newValue;
        });
        
      } else if (isMega) {
        // Mega: 硬件串口引脚固定，隐藏引脚输入
        if (pinInput) {
          pinInput.setVisible(false);
        }
        
        // 更新UART选项
        if (uartField) {
          const uartOptions = [
            ['Serial (RX:0/TX:1)', 'UART0'],
            ['Serial1 (RX:19/TX:18)', 'UART1'],
            ['Serial2 (RX:17/TX:16)', 'UART2'],
            ['Serial3 (RX:15/TX:14)', 'UART3']
          ];
          
          uartField.menuGenerator_ = uartOptions;
          uartField.getOptions = function() {
            return uartOptions;
          };
          
          const currentValue = uartField.getValue();
          const matchingOption = uartOptions.find(([text, value]) => value === currentValue);
          if (!matchingOption && uartOptions.length > 0) {
            uartField.setValue(uartOptions[0][1]);
          }
        }
        
        if (block.rendered) {
          block.render();
        }
        
      } else if (isUNO) {
        // UNO: 可选择硬件串口或软串口
        if (uartField) {
          const uartOptions = [
            ['Serial (硬件串口)', 'UART0'],
            ['软串口', 'SOFTWARE']
          ];
          
          uartField.menuGenerator_ = uartOptions;
          uartField.getOptions = function() {
            return uartOptions;
          };
          
          const currentValue = uartField.getValue();
          const matchingOption = uartOptions.find(([text, value]) => value === currentValue);
          if (!matchingOption) {
            uartField.setValue('UART0'); // 默认硬件串口
          }
        }
        
        // UNO: 根据串口类型显示/隐藏引脚输入
        const updatePinVisibility = function() {
          const uart = block.getFieldValue('UART');
          const shouldShowPins = (uart === 'SOFTWARE');
          
          if (pinInput) {
            pinInput.setVisible(shouldShowPins);
          }
          
          if (block.rendered) {
            block.render();
          }
        };
        
        // 初始更新
        updatePinVisibility();
        
        // 添加UART改变监听器
        uartField.setValidator(function(newValue) {
          setTimeout(() => updatePinVisibility(), 10);
          return newValue;
        });
      }
    } catch (e) {
      console.error('初始化板卡扩展失败:', e);
    }
  }, 50);
});


Arduino.forBlock['ai_assistant_config'] = function(block, generator) {
  // 获取当前开发板配置
  const config = window['boardConfig'] || {};
  const core = (config.core || '').toLowerCase();
  const type = (config.type || '').toLowerCase();
  const name = (config.name || '').toLowerCase();
  
  // 判断开发板类型
  const esp32 = core.indexOf('esp32') > -1 || 
               type.indexOf('esp32') > -1 ||
               name.indexOf('esp32') > -1;
  const mega2560 = core.indexOf('mega') > -1 || 
                 type.indexOf('mega') > -1 ||
                 name.indexOf('mega') > -1 || 
                 name.indexOf('2560') > -1;
  const arduinoUno = !esp32 && !mega2560;
  
  // 获取块字段值
  const serialOption = block.getFieldValue('UART') || 'UART0';
  const baudRate = block.getFieldValue('SPEED') || '9600';
  const rxPin = block.getFieldValue('RX') || '17';
  const txPin = block.getFieldValue('TX') || '18';
  
  console.log('AI-Assistant配置 - UART:', serialOption, 'Baudrate:', baudRate, 'RX:', rxPin, 'TX:', txPin);
  
  // 保存串口配置，供其他块使用
  Arduino.aiAssistantConfig = {
    serialOption: serialOption,
    baudRate: baudRate,
    rxPin: rxPin,
    txPin: txPin
  };
  
  // 初始化变量
  console.log('尝试添加变量 receivedCommand');
  try {
    generator.addVariable('receivedCommand', 'String receivedCommand = "";');
    generator.addVariable('cmdCount', 'int cmdCount = 0;  // 命令计数器');
    generator.addVariable('lastCmdTime', 'unsigned long lastCmdTime = 0;  // 上次接收命令的时间');
    console.log('变量添加成功');
  } catch(e) {
    console.error('添加变量失败:', e);
  }
  
  // 初始化串口跟踪集合（与 lib-core-serial 兼容）
  if (!Arduino.addedSerialInitCode) {
    Arduino.addedSerialInitCode = new Set();
  }
  if (!Arduino.initializedSerialPorts) {
    Arduino.initializedSerialPorts = new Set();
  }
  
  // 根据不同板卡类型生成不同的串口配置
  let serialName = 'Serial';
  let initCode = '';
  
  if (esp32) {
    console.log('ESP32 初始化串口');
    
    if (serialOption === 'UART0') {
      serialName = 'Serial';
      initCode = `  Serial.begin(${baudRate});  // UART0 (USB串口)`;
    } else {
      // 对于所有非UART0的串口，都支持自定义引脚
      const uartNum = serialOption.replace('UART', '');
      serialName = `Serial${uartNum}`;
      initCode = `  ${serialName}.begin(${baudRate}, SERIAL_8N1, ${rxPin}, ${txPin});  // ${serialOption} (RX:GPIO${rxPin}, TX:GPIO${txPin})`;
    }
    
    // 初始化用户选择的串口
    generator.addSetupBegin('ai_assistant_serial_begin', initCode);
    Arduino.addedSerialInitCode.add(serialName);
    Arduino.initializedSerialPorts.add(serialName);
    
    // 如果不是UART0，需要初始化Serial用于调试输出
    if (serialOption !== 'UART0') {
      generator.addSetupBegin('ai_assistant_debug_serial', '  Serial.begin(9600);  // 用于调试输出');
      Arduino.addedSerialInitCode.add('Serial');
      Arduino.initializedSerialPorts.add('Serial');
    }
  } else if (mega2560) {
    // Mega2560使用硬件串口（引脚固定）
    switch (serialOption) {
      case 'UART0':
        serialName = 'Serial';
        initCode = `  Serial.begin(${baudRate});  // UART0 (RX:0/TX:1)`;
        break;
      case 'UART1':
        serialName = 'Serial1';
        initCode = `  Serial1.begin(${baudRate});  // UART1 (RX:19/TX:18)`;
        break;
      case 'UART2':
        serialName = 'Serial2';
        initCode = `  Serial2.begin(${baudRate});  // UART2 (RX:17/TX:16)`;
        break;
      case 'UART3':
        serialName = 'Serial3';
        initCode = `  Serial3.begin(${baudRate});  // UART3 (RX:15/TX:14)`;
        break;
      default:
        serialName = 'Serial';
        initCode = `  Serial.begin(${baudRate});  // 默认串口`;
        break;
    }
    
    generator.addSetupBegin('ai_assistant_serial_begin', initCode);
    Arduino.addedSerialInitCode.add(serialName);
    Arduino.initializedSerialPorts.add(serialName);
    
  } else if (arduinoUno) {
    // Arduino UNO可选择硬件串口或软串口
    if (serialOption === 'SOFTWARE') {
      // 软串口模式
      serialName = 'aiSerial';
      
      // 添加SoftwareSerial库
      generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
      
      // 创建软串口对象
      generator.addVariable('aiSerial', `SoftwareSerial aiSerial(${rxPin}, ${txPin});  // RX, TX`);
      
      // 初始化软串口
      initCode = `  aiSerial.begin(${baudRate});  // 软串口 (RX:${rxPin}/TX:${txPin})`;
      generator.addSetupBegin('ai_assistant_serial_begin', initCode);
      
      // 标记为已初始化
      Arduino.addedSerialInitCode.add('aiSerial');
      Arduino.initializedSerialPorts.add('aiSerial');
      
    } else if (serialOption === 'UART0') {
      // 硬件串口模式
      serialName = 'Serial';
      initCode = `  Serial.begin(${baudRate});  // 硬件串口 (RX:0/TX:1)`;
      generator.addSetupBegin('ai_assistant_serial_begin', initCode);
      
      Arduino.addedSerialInitCode.add('Serial');
      Arduino.initializedSerialPorts.add('Serial');
    } else {
      // 默认使用硬件串口
      serialName = 'Serial';
      initCode = `  Serial.begin(${baudRate});  // 硬件串口`;
      generator.addSetupBegin('ai_assistant_serial_begin', initCode);
      
      Arduino.addedSerialInitCode.add('Serial');
      Arduino.initializedSerialPorts.add('Serial');
    }
  }
  
  // 生成接收命令代码
  let debugOutput = '';
  if (esp32 && serialOption !== 'UART0') {
    // 如果不是使用Serial接收，则通过Serial打印调试信息
    debugOutput = `
        Serial.print("收到命令: ");
        Serial.println(receivedCommand);`;
  }
  
  generator.addLoop('ai_assistant_receive_command', `// 从${serialName}获取命令
  if (${serialName}.available()) {
      String cmd = "";
      unsigned long startTime = millis();
      // 最多等待100ms来读取全部数据
      while (millis() - startTime < 100) {
          if (${serialName}.available()) {
              char c = ${serialName}.read();
            if (c == 10 || c == 13) {
                break;
            }
            cmd += c;
            delay(2);
          }
      }
      // 清空串口缓冲区的残留换行符（避免重复触发）
      delay(10);
      while (${serialName}.available()) {
          char c = ${serialName}.peek();
          if (c == 10 || c == 13) {
              ${serialName}.read();
          } else {
              break;
          }
      }
      if (cmd.length() > 0) {
          receivedCommand = cmd;${debugOutput}
      }
  }
  `);
  
  return '';
};

Arduino.forBlock['serial_command_handler'] = function (block, generator) {
  let actionType = block.getFieldValue('ACTION') || "MOVE_FORWARD";
  
  let code = "false";
  
  switch(actionType) {
    case "MOVE_FORWARD":
      code = "(receivedCommand.indexOf(\"MOVE F\") >= 0)";
      break;
      
    case "MOVE_BACKWARD":
      code = "(receivedCommand.indexOf(\"MOVE B\") >= 0)";
      break;
      
    case "TURN_LEFT":
      code = "(receivedCommand.indexOf(\"MOVE L\") >= 0)";
      break;
      
    case "TURN_RIGHT":
      code = "(receivedCommand.indexOf(\"MOVE R\") >= 0)";
      break;
      
    case "STOP":
      code = "(receivedCommand.indexOf(\"MOVE S\") >= 0)";
      break;
      
    case "LED_ON":
      code = "(receivedCommand.indexOf(\"LED\") == 0 && receivedCommand.indexOf(\"ON\") > 0)";
      break;
      
    case "LED_OFF":
      code = "(receivedCommand.indexOf(\"LED\") == 0 && receivedCommand.indexOf(\"OFF\") > 0)";
      break;
      
    case "LED_BLINK":
      code = "(receivedCommand.indexOf(\"LED\") == 0 && receivedCommand.indexOf(\"BLINK\") > 0)";
      break;
      
    case "SERVO_ROTATE":
      code = "(receivedCommand.indexOf(\"SERVO\") >= 0)";
      break;
      
    case "FAN_SPEED":
      code = "(receivedCommand.indexOf(\"FAN_SPEED\") >= 0)";
      break;
      
    case "FAN_ON":
      code = "(receivedCommand.indexOf(\"FAN_ON\") >= 0)";
      break;
      
    case "FAN_OFF":
      code = "(receivedCommand.indexOf(\"FAN_OFF\") >= 0)";
      break;
      
    case "RGB_ON":
      code = "(receivedCommand.indexOf(\"RGB\") == 0 && receivedCommand.indexOf(\"ON\") >= 0)";
      break;
      
    case "RGB_OFF":
      code = "(receivedCommand.indexOf(\"RGB\") == 0 && receivedCommand.indexOf(\"OFF\") >= 0)";
      break;
      
    case "RGB_BRIGHTNESS":
      code = "(receivedCommand.indexOf(\"RGB\") == 0 && receivedCommand.indexOf(\"LIGHT\") >= 0)";
      break;
      
    case "RGB_GRADIENT":
      code = "(receivedCommand.indexOf(\"RGB\") == 0 && receivedCommand.indexOf(\"GRADIENT\") >= 0)";
      break;
      
    case "ARM_GRAB":
      code = "(receivedCommand.indexOf(\"ARM\") == 0 && receivedCommand.indexOf(\"GRAB\") >= 0)";
      break;
      
    case "ARM_RELEASE":
      code = "(receivedCommand.indexOf(\"ARM\") == 0 && receivedCommand.indexOf(\"RELEASE\") >= 0)";
      break;
      
    case "ARM_DOWN":
      code = "(receivedCommand.indexOf(\"ARM\") == 0 && receivedCommand.indexOf(\"DOWN\") >= 0)";
      break;
      
    case "RELAY_ON":
      code = "(receivedCommand.indexOf(\"RELAY\") == 0 && receivedCommand.indexOf(\"ON\") >= 0)";
      break;
      
    case "RELAY_OFF":
      code = "(receivedCommand.indexOf(\"RELAY\") == 0 && receivedCommand.indexOf(\"OFF\") >= 0)";
      break;
      
    default:
      code = "false";
  }
  
  // 不再在判断时清空，只返回判断条件
  return [code, Arduino.ORDER_RELATIONAL];
};

Arduino.forBlock['serial_custom_command'] = function (block, generator) {
  console.log('serial_custom_command 代码生成器被调用');
  
  // 获取用户输入的自定义命令
  let customCmd = block.getFieldValue('CUSTOM_CMD') || "";
  console.log('自定义命令:', customCmd);
  
  // 转义引号，防止代码注入
  customCmd = customCmd.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  
  // 生成条件判断代码（支持部分匹配）
  let code = `(receivedCommand.indexOf("${customCmd}") >= 0)`;
  
  console.log('生成的代码:', code);
  
  // 不再在判断时清空，只返回判断条件
  return [code, Arduino.ORDER_RELATIONAL];
};

Arduino.forBlock['serial_clear_command'] = function (block, generator) {
  // 清空receivedCommand变量
  return 'receivedCommand = "";\n';
};

/**
 * 智能小车AI-assistant通信模块代码生成器
 */

// 注册板卡识别扩展
if (Blockly.Extensions.isRegistered('ai_assistant_board_extension')) {
  Blockly.Extensions.unregister('ai_assistant_board_extension');
}

Blockly.Extensions.register('ai_assistant_board_extension', function() {
  // 获取开发板配置信息
  var boardConfig = window['boardConfig'] || {};
  var boardCore = (boardConfig.core || '').toLowerCase();
  var boardType = (boardConfig.type || '').toLowerCase();
  var boardName = (boardConfig.name || '').toLowerCase();
  
  // 判断开发板类型（使用标准的 core 和 type 字段）
  var isESP32 = boardCore.indexOf('esp32') > -1 || 
                boardType.indexOf('esp32') > -1 ||
                boardName.indexOf('esp32') > -1;
  var isMega2560 = boardCore.indexOf('mega') > -1 || 
                  boardType.indexOf('mega') > -1 ||
                  boardName.indexOf('mega') > -1 || 
                  boardName.indexOf('2560') > -1;
  var isArduinoUno = (boardCore === 'arduino:avr' && boardType.indexOf('uno') > -1) ||
                    boardName.indexOf('uno') > -1 ||
                    (!isESP32 && !isMega2560); // 如果不是ESP32和Mega，默认为Arduino UNO
  
  // 打印板卡识别信息（调试用）
  // console.log('AI-Assistant: 板卡配置：', boardConfig);
  // console.log('AI-Assistant: 板卡核心：', boardCore);
  // console.log('AI-Assistant: 板卡类型：', boardType);
  // console.log('AI-Assistant: 板卡名称：', boardName);
  // console.log('AI-Assistant: isESP32:', isESP32);
  // console.log('AI-Assistant: isMega2560:', isMega2560);
  // console.log('AI-Assistant: isArduinoUno:', isArduinoUno);
  
  // 获取输入字段的引用
  var dummyInput = this.getInput('SERIAL_OPTION');
  
  // 如果找不到输入字段，则直接返回
  if (!dummyInput) {
    return;
  }
  
  if (isESP32) {
    // 对于 ESP32，只能选择三组串口
    dummyInput.appendField('选择串口：');
    dummyInput.appendField(new Blockly.FieldDropdown([
      ['Serial0 (RX:GPIO43/TX:GPIO44)', 'UART0'],
      ['Serial1 (RX:GPIO17/TX:GPIO18)', 'UART1'],
      ['Serial2 (RX:GPIO15/TX:GPIO16)', 'UART2']
    ]), 'SERIAL_OPTION');
    
    // 添加一个不可见字段存储RX/TX引脚，便于生成器使用
    // ESP32在SERIAL1选项下用GPIO17/18（默认值）
    this.appendDummyInput('RX_PIN_INPUT')
      .appendField(new Blockly.FieldLabelSerializable('17'), 'RX_PIN')
      .setVisible(false);
    this.appendDummyInput('TX_PIN_INPUT')
      .appendField(new Blockly.FieldLabelSerializable('18'), 'TX_PIN')
      .setVisible(false);
    
  } else if (isMega2560) {
    // 对于 Mega2560，可以选择四组硬件串口
    dummyInput.appendField('选择串口：');
    dummyInput.appendField(new Blockly.FieldDropdown([
      ['Serial (RX:0/TX:1)', 'UART0'],
      ['Serial1 (RX:19/TX:18)', 'UART1'],
      ['Serial2 (RX:17/TX:16)', 'UART2'],
      ['Serial3 (RX:15/TX:14)', 'UART3']
    ]), 'SERIAL_OPTION');
    
  } else {
    // 对于 Arduino UNO，可以选择硬件串口或软件串口
    // 添加串口类型字段（硬件/软件）
    dummyInput.appendField('串口类型：');
    dummyInput.appendField(new Blockly.FieldDropdown([
      ['硬件串口(RX:0/TX:1)', 'HARDWARE'],
      ['软件串口', 'SOFTWARE']
    ]), 'SERIAL_TYPE');
    
    // 添加软串口引脚选择字段
    var softwareSerial = this.appendDummyInput('SOFTWARE_SERIAL')
      .appendField('软串口引脚：');
    
    var rxOptions = [];
    var txOptions = [];
    
    // 从板卡配置中获取数字引脚列表
    var digitalPins = boardConfig.digitalPins || [];
    
    if (digitalPins.length > 0) {
      // 使用板卡配置的引脚列表（排除0和1，因为是硬件串口）
      for (var i = 0; i < digitalPins.length; i++) {
        var pinValue = digitalPins[i][1];
        var pinLabel = digitalPins[i][0];
        // 排除引脚0和1
        if (pinValue !== '0' && pinValue !== '1' && pinValue !== 0 && pinValue !== 1) {
          rxOptions.push([pinLabel, pinValue.toString()]);
          txOptions.push([pinLabel, pinValue.toString()]);
        }
      }
    } else {
      // 备用方案：如果没有配置，使用默认引脚列表
      for (var i = 2; i <= 13; i++) {
        rxOptions.push([i.toString(), i.toString()]);
        txOptions.push([i.toString(), i.toString()]);
      }
      var analogPins = ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'];
      for (var i = 0; i < analogPins.length; i++) {
        rxOptions.push([analogPins[i], analogPins[i]]);
        txOptions.push([analogPins[i], analogPins[i]]);
      }
    }
    
    softwareSerial.appendField('RX');
    softwareSerial.appendField(new Blockly.FieldDropdown(rxOptions), 'RX_PIN');
    softwareSerial.appendField('TX');
    softwareSerial.appendField(new Blockly.FieldDropdown(txOptions), 'TX_PIN');
    
    // 初始时隐藏软串口引脚选择
    softwareSerial.setVisible(false);
    
    // 添加默认值到RX和TX引脚字段
    this.setFieldValue('2', 'RX_PIN');
    this.setFieldValue('3', 'TX_PIN');
    
    // 添加事件监听器，当串口类型改变时显示/隐藏软串口引脚选择
    var serialType = this.getField('SERIAL_TYPE');
    if (serialType) {
      serialType.setValidator(function(newValue) {
        console.log('串口类型改变为:', newValue);
        var softwareSerial = this.sourceBlock_.getInput('SOFTWARE_SERIAL');
        if (softwareSerial) {
          softwareSerial.setVisible(newValue === 'SOFTWARE');
          
          // 使用正确的方式触发块重新渲染
          try {
            if (this.sourceBlock_ && this.sourceBlock_.workspace) {
              this.sourceBlock_.workspace.render();
            }
          } catch (e) {
            console.log('渲染块时出错:', e);
          }
        }
        // 返回新值，这样Blockly就会接受这个改变
        return newValue;
      });
    }
  }
  
});


Arduino.forBlock['ai_assistant_config'] = function(block, generator) {
  // 添加调试信息
  console.log('=== AI-Assistant 调试信息 ===');
  console.log('generator对象:', generator);
  console.log('generator对象方法:', Object.keys(generator));
  console.log('generator.addVariable是否存在:', typeof generator.addVariable === 'function');
  console.log('generator.addSetupBegin是否存在:', typeof generator.addSetupBegin === 'function');
  console.log('generator.addLoop是否存在:', typeof generator.addLoop === 'function');
  console.log('generator.setGlobalVar是否存在:', typeof generator.setGlobalVar === 'function');
  
  // 获取当前开发板配置
  const config = window['boardConfig'] || {};
  console.log('boardConfig:', config);
  const core = (config.core || '').toLowerCase();
  const type = (config.type || '').toLowerCase();
  const name = (config.name || '').toLowerCase();
  
  // 判断开发板类型（使用标准的 core 和 type 字段）
  const esp32 = core.indexOf('esp32') > -1 || 
               type.indexOf('esp32') > -1 ||
               name.indexOf('esp32') > -1;
  const mega2560 = core.indexOf('mega') > -1 || 
                 type.indexOf('mega') > -1 ||
                 name.indexOf('mega') > -1 || 
                 name.indexOf('2560') > -1;
  const arduinoUno = (core === 'arduino:avr' && type.indexOf('uno') > -1) ||
                 name.indexOf('uno') > -1 ||
                 (!esp32 && !mega2560); // 如果不是ESP32和Mega，默认为Arduino UNO
  
  // 打印调试信息
  console.log('AI-Assistant 代码生成\n板卡类型:', esp32 ? 'ESP32' : (mega2560 ? 'MEGA2560' : 'Arduino UNO'));
  
  let boardTypeCode = '"UNKNOWN"';
  if (esp32) {
    boardTypeCode = '"ESP32"';
  } else if (mega2560) {
    boardTypeCode = '"MEGA2560"';
  } else {
    boardTypeCode = '"ARDUINO_UNO"';
  }
  
  // 根据板卡类型生成不同的代码
  // ESP32和Mega2560默认使用硬件串口，只有Arduino UNO可选择硬件或软件串口
  let serialType = 'HARDWARE'; // 默认为硬件串口
  
  if (arduinoUno) {
    // Arduino UNO可以选择串口类型
    serialType = block.getFieldValue('SERIAL_TYPE') || 'HARDWARE';
  }
  
  let serialOption = block.getFieldValue('SERIAL_OPTION') || 'UART0';
  
  // 保存串口配置，供其他块使用
  Arduino.aiAssistantConfig = {serialType: serialType, serialOption: serialOption};
  console.log('串口配置:', serialType, serialOption);
  
  // 如果是软串口，获取RX和TX引脚
  let rxPin = '2';
  let txPin = '3';
  if (serialType === 'SOFTWARE') {
    // 默认引脚，如果块有定义则使用块定义的引脚
    if (esp32) {
      rxPin = block.getFieldValue('RX_PIN') || '16'; // ESP32默认软串口引脚
      txPin = block.getFieldValue('TX_PIN') || '17';
    } else if (mega2560) {
      rxPin = block.getFieldValue('RX_PIN') || '10'; // Mega2560默认软串口引脚
      txPin = block.getFieldValue('TX_PIN') || '11';
    } else {
      rxPin = block.getFieldValue('RX_PIN') || '0'; // UNO默认软串口引脚
      txPin = block.getFieldValue('TX_PIN') || '1';
    }
  }
  
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
  
  // 根据不同板卡类型和串口类型生成不同的串口配置
  if (esp32) {
    console.log('ESP32 初始化串口');
    
    if (serialType === 'HARDWARE') {
      // ESP32 硬件串口选项
      let serialName = 'Serial';
      let txRxPins = '';
      let serialOutput = '';
      
      console.log('ESP32 串口选项:', serialOption);
      
      switch (serialOption) {
        case 'UART0':
          serialName = 'Serial';
          txRxPins = '  Serial.begin(9600);  // UART0 (TX:GPIO43, RX:GPIO44)';
          break;
        case 'UART1':
          serialName = 'Serial1';
          txRxPins = '  Serial1.begin(9600, SERIAL_8N1, 18, 17);  // UART1 (TX:GPIO17, RX:GPIO18)';
          break;
        case 'UART2':
          serialName = 'Serial2';
          txRxPins = '  Serial2.begin(9600, SERIAL_8N1, 15, 16);  // UART2 (TX:GPIO16, RX:GPIO15)';
          break;
        default:
          serialName = 'Serial';
          txRxPins = '  Serial.begin(9600);  // 使用默认串口 (TX:GPIO43, RX:GPIO44)';
          console.log('警告: 无法识别的ESP32串口选项:', serialOption);
          break;
      }
      
      // 只初始化用户选择的串口
      generator.addSetupBegin('esp32_serial_begin', txRxPins);
      // 标记该串口为已初始化（与 lib-core-serial 兼容）
      Arduino.addedSerialInitCode.add(serialName);
      Arduino.initializedSerialPorts.add(serialName);
      
      // 如果不是UART0，需要初始化Serial用于调试输出
      if (serialOption !== 'UART0') {
        generator.addSetupBegin('esp32_debug_serial', '  Serial.begin(9600);  // 用于调试输出');
        Arduino.addedSerialInitCode.add('Serial');
        Arduino.initializedSerialPorts.add('Serial');
      }
      
      // 生成接收命令代码
      let debugOutput = '';
      if (serialOption !== 'UART0') {
        // 如果不是使用Serial接收，则通过Serial打印调试信息
        debugOutput = `
              Serial.print("收到命令: ");
              Serial.println(receivedCommand);`;
      }
      
      generator.addLoop('receive_command', `// 从ESP32的${serialName}获取命令
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
    } else { // 软串口模式
      // ESP32使用软串口
      generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
      generator.addObject('mySerial', 'SoftwareSerial mySerial(' + rxPin + ', ' + txPin + ');');
      
      generator.addSetupBegin('myserial_begin', '  mySerial.begin(9600);  // ESP32软串口');
      // 标记mySerial为已初始化
      Arduino.addedSerialInitCode.add('mySerial');
      Arduino.initializedSerialPorts.add('mySerial');
      
      // 使用软串口
      generator.addLoop('receive_command', `// 从软串口获取命令
      if (mySerial.available()) {
          String cmd = "";
          unsigned long startTime = millis();
          // 最多等待100ms来读取全部数据
          while (millis() - startTime < 100) {
              if (mySerial.available()) {
                  char c = mySerial.read();
                  if (c == 10 || c == 13) {
                      break;
                  }
                  cmd += c;
                  delay(2);
              }
          }
          // 清空串口缓冲区的残留换行符（避免重复触发）
          delay(10);
          while (mySerial.available()) {
              char c = mySerial.peek();
              if (c == 10 || c == 13) {
                  mySerial.read();
              } else {
                  break;
              }
          }
          if (cmd.length() > 0) {
              receivedCommand = cmd;
              // 不打印调试信息，因为Serial未初始化
          }
      }
      `);
    }
  } else if (mega2560) {
    console.log('Mega2560 初始化串口');
    
    if (serialType === 'HARDWARE') {
      // Mega2560 硬件串口选项
      let serialName = 'Serial';
      let serialInit = '';
      
      console.log('Mega2560 串口选项:', serialOption);
      
      switch (serialOption) {
        case 'UART0':
          serialName = 'Serial';
          serialInit = '  Serial.begin(9600);  // UART0 (RX:D0, TX:D1)';
          break;
        case 'UART1':
          serialName = 'Serial1';
          serialInit = '  Serial1.begin(9600);  // UART1 (RX:D19, TX:D18)';
          break;
        case 'UART2':
          serialName = 'Serial2';
          serialInit = '  Serial2.begin(9600);  // UART2 (RX:D17, TX:D16)';
          break;
        case 'UART3':
          serialName = 'Serial3';
          serialInit = '  Serial3.begin(9600);  // UART3 (RX:D15, TX:D14)';
          break;
        default:
          serialName = 'Serial';
          serialInit = '  Serial.begin(9600);  // 使用默认串口 (RX:D0, TX:D1)';
          console.log('警告: 无法识别的Mega2560串口选项:', serialOption);
          break;
      }
      
      // 只初始化用户选择的串口
      generator.addSetupBegin('mega_serial_begin', serialInit);
      // 标记该串口为已初始化（与 lib-core-serial 兼容）
      Arduino.addedSerialInitCode.add(serialName);
      Arduino.initializedSerialPorts.add(serialName);
      
      // 如果不是UART0，需要初始化Serial用于调试输出
      if (serialOption !== 'UART0') {
        generator.addSetupBegin('mega_debug_serial', '  Serial.begin(9600);  // 用于调试输出');
        Arduino.addedSerialInitCode.add('Serial');
        Arduino.initializedSerialPorts.add('Serial');
      }
      
      // 生成接收命令代码
      let debugOutput = '';
      if (serialOption !== 'UART0') {
        // 如果不是使用Serial接收，则通过Serial打印调试信息
        debugOutput = `
              Serial.print("收到命令: ");
              Serial.println(receivedCommand);`;
      }
      
      generator.addLoop('receive_command', `// 从Mega2560的${serialName}获取命令
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
    } else { // 软串口模式
      // Mega2560使用软串口
      generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
      generator.addObject('mySerial', 'SoftwareSerial mySerial(' + rxPin + ', ' + txPin + ');');
      
      generator.addSetupBegin('myserial_begin', '  mySerial.begin(9600);  // Mega2560软串口');
      // 标记mySerial为已初始化
      Arduino.addedSerialInitCode.add('mySerial');
      Arduino.initializedSerialPorts.add('mySerial');
      
      // 使用软串口
      generator.addLoop('receive_command', `// 从软串口获取命令
      if (mySerial.available()) {
          String cmd = "";
          unsigned long startTime = millis();
          // 最多等待100ms来读取全部数据
          while (millis() - startTime < 100) {
              if (mySerial.available()) {
                  char c = mySerial.read();
                  if (c == 10 || c == 13) {
                      break;
                  }
                  cmd += c;
                  delay(2);
              }
          }
          // 清空串口缓冲区的残留换行符（避免重复触发）
          delay(10);
          while (mySerial.available()) {
              char c = mySerial.peek();
              if (c == 10 || c == 13) {
                  mySerial.read();
              } else {
                  break;
              }
          }
          if (cmd.length() > 0) {
              receivedCommand = cmd;
              // 不打印调试信息，因为Serial未初始化
          }
      }
      `);
    }
  } else { // Arduino UNO
    
    if (serialType === 'HARDWARE') {
      // Arduino UNO只有一个硬件串口（UART0），用于接收命令
      generator.addSetupBegin('serial_begin', '  Serial.begin(9600);  // Arduino UNO硬件串口');
      // 标记Serial为已初始化（与 lib-core-serial 兼容）
      Arduino.addedSerialInitCode.add('Serial');
      Arduino.initializedSerialPorts.add('Serial');
      
      // 生成接收命令代码
      generator.addLoop('receive_command', `// 从Arduino UNO硬件串口获取命令
      if (Serial.available()) {
          String cmd = "";
          unsigned long startTime = millis();
          // 最多等待100ms来读取全部数据
          while (millis() - startTime < 100) {
              if (Serial.available()) {
                  char c = Serial.read();
                  if (c == 10 || c == 13) {
                      break;
                  }
                  cmd += c;
                  delay(2);
              }
          }
          // 清空串口缓冲区的残留换行符（避免重复触发）
          delay(10);
          while (Serial.available()) {
              char c = Serial.peek();
              if (c == 10 || c == 13) {
                  Serial.read();
              } else {
                  break;
              }
          }
          if (cmd.length() > 0) {
              receivedCommand = cmd;
              // 不打印日志，因为此时Serial用于数据通信
              // 如需要调试，建议使用LED闪烁或其他方式指示
          }
      }
      `);
    } else { // 软串口模式
      // Arduino UNO使用软串口接收命令
      generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
      generator.addObject('mySerial', 'SoftwareSerial mySerial(' + rxPin + ', ' + txPin + ');');
      
      // 只初始化软串口（9600波特率，SoftwareSerial在Arduino UNO上115200不稳定）
      generator.addSetupBegin('myserial_begin', '  mySerial.begin(9600);  // Arduino UNO软串口');
      // 标记mySerial为已初始化
      Arduino.addedSerialInitCode.add('mySerial');
      Arduino.initializedSerialPorts.add('mySerial');
      
      // 使用软串口
      generator.addLoop('receive_command', `// 从软串口获取命令
      if (mySerial.available()) {
          String cmd = "";
          unsigned long startTime = millis();
          // 最多等待100ms来读取全部数据
          while (millis() - startTime < 100) {
              if (mySerial.available()) {
                  char c = mySerial.read();
                  if (c == 10 || c == 13) {
                      break;
                  }
                  cmd += c;
                  delay(2);
              }
          }
          // 清空串口缓冲区的残留换行符（避免重复触发）
          delay(10);  // 等待所有数据到达
          while (mySerial.available()) {
              char c = mySerial.peek();  // 先看一眼，不读取
              if (c == 10 || c == 13) {
                  mySerial.read();  // 如果是换行符，读取并丢弃
              } else {
                  break;  // 如果不是换行符，停止（可能是下一条命令）
              }
          }
          if (cmd.length() > 0) {
              // 去重：如果与上次命令相同且时间间隔小于200ms，忽略
              unsigned long currentTime = millis();
              if (cmd != receivedCommand || (currentTime - lastCmdTime) > 200) {
                  receivedCommand = cmd;
                  lastCmdTime = currentTime;
                  cmdCount++;
                  Serial.print("[");
                  Serial.print(cmdCount);
                  Serial.print("] 软串口收到命令: ");
                  Serial.print(receivedCommand);
                  Serial.print(" (长度:");
                  Serial.print(cmd.length());
                  Serial.println(")");
              } else {
                  Serial.println("  -> 忽略重复命令");
              }
          }
      }
      `);
    }
  }
  
  return '';
};

Arduino.forBlock['ai_assistant_receive'] = function (block, generator) {
  // 获取开发板配置信息
  var configData = window['boardConfig'] || {};
  var coreType = (configData.core || '').toLowerCase();
  var typeInfo = (configData.type || '').toLowerCase();
  var nameType = (configData.name || '').toLowerCase();
  
  // 判断开发板类型（使用标准的 core 和 type 字段）
  var esp32 = coreType.indexOf('esp32') > -1 || 
             typeInfo.indexOf('esp32') > -1 ||
             nameType.indexOf('esp32') > -1;
  var mega2560 = coreType.indexOf('mega') > -1 || 
                typeInfo.indexOf('mega') > -1 ||
                nameType.indexOf('mega') > -1 || 
                nameType.indexOf('2560') > -1;
  
  // 获取上一个配置块中的串口配置
  var serialConfig = Arduino.aiAssistantConfig || {};
  var serialType = serialConfig.serialType || 'HARDWARE';
  var serialOption = serialConfig.serialOption || (esp32 ? 'UART2' : (mega2560 ? 'UART1' : 'UART0'));
  
  // 此块现在仅作为提示，实际接收代码已在ai_assistant_config中处理
  var comment = '// 接收指令已由配置块自动处理，无需额外操作\n';
  
  // 根据实际配置显示正确的串口信息
  if (esp32) {
    if (serialType === 'HARDWARE') {
      comment += '// ESP32使用' + (serialOption === 'UART0' ? 'Serial' : 
                                    serialOption === 'UART1' ? 'Serial1' : 'Serial2') + '硬件串口接收命令';
    } else {
      comment += '// ESP32使用软串口(SoftwareSerial)接收命令';
    }
  } else if (mega2560) {
    if (serialType === 'HARDWARE') {
      comment += '// Mega2560使用' + (serialOption === 'UART0' ? 'Serial' : 
                                      serialOption === 'UART1' ? 'Serial1' : 
                                      serialOption === 'UART2' ? 'Serial2' : 'Serial3') + '硬件串口接收命令';
    } else {
      comment += '// Mega2560使用软串口(SoftwareSerial)接收命令';
    }
  } else {
    if (serialType === 'HARDWARE') {
      comment += '// Arduino UNO使用Serial硬件串口接收命令';
    } else {
      comment += '// Arduino UNO使用软串口(SoftwareSerial)接收命令';
    }
  }
  
  generator.addStatement('assistant_receive_comment', comment);
  
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

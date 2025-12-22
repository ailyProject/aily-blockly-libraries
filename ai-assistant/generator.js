/**
 * 智能小车AI-assistant通信模块代码生成器
 *
 * @note 本库不使用field_variable，无需registerVariableToBlockly/renameVariableInBlockly
 * @note 本库使用固定全局变量（receivedCommand等），用户无法重命名
 * @note 变量监听机制: 本库所有字段均为field_dropdown和field_input类型，不包含field_variable
 *       因此无需实现setValidator监听变量重命名。若将来添加field_variable字段，
 *       需在init中通过field.setValidator()实现变量名变化监听
 */


Arduino.forBlock['ai_assistant_config'] = function(block, generator) {
  // 获取串口和波特率配置
  const serialName = block.getFieldValue('SERIAL') || 'Serial';
  const baudRate = block.getFieldValue('SPEED') || '9600';
  
  // 保存串口配置，供其他块使用
  Arduino.aiAssistantConfig = {
    serialName: serialName,
    baudRate: baudRate
  };
  
  // 初始化变量
  generator.addVariable('receivedCommand', 'String receivedCommand = "";');
  generator.addVariable('cmdCount', 'int cmdCount = 0;');
  generator.addVariable('lastCmdTime', 'unsigned long lastCmdTime = 0;');
  
  // 使用 core-serial 的 ensureSerialBegin 函数确保串口已初始化
  if (typeof ensureSerialBegin === 'function') {
    ensureSerialBegin(serialName, generator, baudRate);
  } else {
    // 如果 ensureSerialBegin 不可用，直接添加初始化代码
    generator.addSetupBegin(`ai_assistant_serial_${serialName}`, `${serialName}.begin(${baudRate});`);
  }
  
  // 生成接收命令代码
  generator.addLoop('ai_assistant_receive_command', `// 从${serialName}获取AI-assistant命令
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
    // 清空串口缓冲区的残留换行符
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
      receivedCommand = cmd;
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

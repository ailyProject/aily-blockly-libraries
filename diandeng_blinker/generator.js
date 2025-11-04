// 检查并移除已存在的扩展注册
if (Blockly.Extensions.isRegistered('blinker_init_wifi_extension')) {
  Blockly.Extensions.unregister('blinker_init_wifi_extension');
}

// // 确保Serial已初始化，兼容core-serial的去重机制
// function ensureSerialBegin(serialPort, speed, generator) {
//   // 初始化Arduino的Serial相关全局变量，兼容core-serial
//   if (!Arduino.addedSerialInitCode) {
//     Arduino.addedSerialInitCode = new Set();
//   }
  
//   // 检查这个串口是否已经添加过初始化代码（无论是用户设置的还是默认的）
//   if (!Arduino.addedSerialInitCode.has(serialPort)) {
//     // 只有在没有添加过任何初始化代码时才添加初始化
//     generator.addSetupBegin(`serial_${serialPort}_begin`, `${serialPort}.begin(${speed});`);
//     // 标记为已添加初始化代码
//     Arduino.addedSerialInitCode.add(serialPort);
//   }
// }

Blockly.Extensions.register('blinker_init_wifi_extension', function () {
  // 直接在扩展中添加updateShape_函数
  this.updateShape_ = function (configType) {
    // 先移除已存在的输入
    if (this.getInput('AUTH')) {
      this.removeInput('AUTH');
    }
    if (this.getInput('SSID')) {
      this.removeInput('SSID');
    }
    if (this.getInput('PSWD')) {
      this.removeInput('PSWD');
    }

    // 如果是手动配网，添加密钥和WiFi配置字段
    if (configType !== 'EspTouchV2') {
      // 添加密钥输入，使用input_value类型
      this.appendValueInput('AUTH')
        .setCheck('String')
        .appendField("密钥");

      // 添加WiFi配置输入
      this.appendValueInput('SSID')
        .setCheck('String')
        .appendField("WiFi名称");

      this.appendValueInput('PSWD')
        .setCheck('String')
        .appendField("WiFi密码");
      
      // 延迟创建默认块，避免重复创建
      setTimeout(() => {
        this.createDefaultBlocks_();
      }, 100);
    }
  };

  // 创建默认字符串块的方法
  this.createDefaultBlocks_ = function() {
    // 检查workspace是否存在且已渲染
    if (!this.workspace || !this.workspace.rendered) {
      return;
    }

    // 为AUTH输入添加默认的字符串块
    const authInput = this.getInput('AUTH');
    if (authInput && !authInput.connection.targetConnection) {
      try {
        var authBlock = this.workspace.newBlock('text');
        authBlock.setFieldValue('Your Device Secret Key', 'TEXT');
        authBlock.initSvg();
        authBlock.render();
        authInput.connection.connect(authBlock.outputConnection);
      } catch (e) {
        console.warn('Failed to create AUTH default block:', e);
      }
    }

    // 为SSID输入添加默认的字符串块
    const ssidInput = this.getInput('SSID');
    if (ssidInput && !ssidInput.connection.targetConnection) {
      try {
        var ssidBlock = this.workspace.newBlock('text');
        ssidBlock.setFieldValue('Your WiFi SSID', 'TEXT');
        ssidBlock.initSvg();
        ssidBlock.render();
        ssidInput.connection.connect(ssidBlock.outputConnection);
      } catch (e) {
        console.warn('Failed to create SSID default block:', e);
      }
    }

    // 为PSWD输入添加默认的字符串块
    const pswdInput = this.getInput('PSWD');
    if (pswdInput && !pswdInput.connection.targetConnection) {
      try {
        var pswdBlock = this.workspace.newBlock('text');
        pswdBlock.setFieldValue('Your WiFi Password', 'TEXT');
        pswdBlock.initSvg();
        pswdBlock.render();
        pswdInput.connection.connect(pswdBlock.outputConnection);
      } catch (e) {
        console.warn('Failed to create PSWD default block:', e);
      }
    }
  };

  // 监听MODE字段的变化
  this.getField('MODE').setValidator(function (option) {
    this.getSourceBlock().updateShape_(option);
    return option;
  });

  this.updateShape_(this.getFieldValue('MODE'));
});

Arduino.forBlock['blinker_init_wifi'] = function (block, generator) {
  // 获取用户选择的配网选项
  let configOption = block.getFieldValue('MODE');

  // 添加共通的库和宏定义
  generator.addMacro('#define BLINKER_WIDGET', '#define BLINKER_WIDGET');
  generator.addMacro('#define BLINKER_WIFI', '#define BLINKER_WIFI');
  generator.addLibrary('#include <Blinker.h>', '#include <Blinker.h>');
  generator.addLoopEnd('Blinker.run()', 'Blinker.run();');

  let code = '';

  if (configOption === "EspTouchV2") {
    // EspTouchV2配网方式
    generator.addMacro('#define BLINKER_ESPTOUCH_V2', '#define BLINKER_ESPTOUCH_V2');
    code = 'Blinker.begin();\n';
  } else {
    // 手动配网方式 - 使用valueToCode获取输入值
    let auth = generator.valueToCode(block, 'AUTH', generator.ORDER_ATOMIC) || '"Your Device Secret Key"';
    let ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '';
    let pswd = generator.valueToCode(block, 'PSWD', generator.ORDER_ATOMIC) || '';

    // 检测是否为ESP32核心（参考boardConfig检测方式）
    const boardConfig = window['boardConfig'];
    const isESP32 = boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1;

    // 检查SSID和PSWD输入是否连接了块
    const ssidInput = block.getInput('SSID');
    const pswdInput = block.getInput('PSWD');
    const hasSSIDBlock = ssidInput && ssidInput.connection && ssidInput.connection.targetConnection;
    const hasPSWDBlock = pswdInput && pswdInput.connection && pswdInput.connection.targetConnection;
    
    if (isESP32 && !hasSSIDBlock && !hasPSWDBlock) {
      // ESP32且没有连接SSID和密码块，使用单参数
      code = 'Blinker.begin(' + auth + ');\n';
    } else {
      // 其他情况使用完整的三个参数
      if (ssid === '') ssid = '"Your WiFi SSID"';
      if (pswd === '') pswd = '"Your WiFi Password"';
      code = 'Blinker.begin(' + auth + ', ' + ssid + ', ' + pswd + ');\n';
    }
  }

  return code;
};

Arduino.forBlock['blinker_init_ble'] = function (block, generator) {
  generator.addMacro('#define BLINKER_WIDGET', '#define BLINKER_WIDGET');
  generator.addMacro('#define BLINKER_BLE', '#define BLINKER_BLE');
  generator.addLibrary('#include <Blinker.h>', '#include <Blinker.h>');

  var code = 'Blinker.begin();\n';

  generator.addLoopBegin('Blinker.run()', 'Blinker.run();');
  return code;
};

Arduino.forBlock['blinker_reset'] = function (block, generator) {
  return 'Blinker.reset();\n';
};

Arduino.forBlock['blinker_debug_init'] = function (block, generator) {
  // 获取用户选择的串口和速率
  let serial = block.getFieldValue('SERIAL');
  let speed = block.getFieldValue('SPEED');
  let debugAll = block.getFieldValue('DEBUG_ALL');

  // 确保Serial已初始化（兼容core-serial的去重机制）
  ensureSerialBegin(serial, generator, speed);

  let code = 'BLINKER_DEBUG.stream(' + serial + ');\n';

  if (debugAll === 'true') {
    code += 'BLINKER_DEBUG.debugAll();\n';
  }

  return code;
};

Arduino.forBlock['blinker_button'] = function (block, generator) {
  // 获取按键名称
  let key = block.getFieldValue('KEY');
  // 获取内部语句块
  let statements = generator.statementToCode(block, 'NAME');

  // 创建按钮对象变量名
  let varName = 'Blinker_' + key.replace(/-/g, '_');

  // 添加按钮组件对象
  generator.addVariable(varName, 'BlinkerButton ' + varName + '("' + key + '");');

  // 注册到变量数据库，供blinker_widget_print使用
  if (!generator.variableDB_) {
    generator.variableDB_ = {};
  }
  generator.variableDB_[varName] = 'BlinkerButton';

  // 添加按钮回调函数
  let functionName = 'button_' + key.replace(/-/g, '_') + '_callback';
  let functionCode = 'void ' + functionName + '(const String & state) {\n' +
    statements +
    '}\n';

  generator.addFunction(functionName, functionCode);

  // 在setup中添加callback绑定
  generator.addSetupEnd('button_' + key, varName + '.attach(' + functionName + ');');

  return '';
};

Arduino.forBlock['blinker_button_state'] = function (block, generator) {
  // 获取要检查的状态
  let state = block.getFieldValue('STATE');

  let code = 'state == "' + state + '"';
  return [code, Arduino.ORDER_EQUALITY];
};

Arduino.forBlock['blinker_slider'] = function (block, generator) {
  // 获取滑块名称
  let key = block.getFieldValue('KEY');
  // 获取内部语句块
  let statements = generator.statementToCode(block, 'NAME');

  // 创建滑块对象变量名
  let varName = 'Blinker_' + key.replace(/-/g, '_');

  // 添加滑块组件对象
  generator.addVariable(varName, 'BlinkerSlider ' + varName + '("' + key + '");');

  // 注册到变量数据库，供blinker_widget_print使用
  if (!generator.variableDB_) {
    generator.variableDB_ = {};
  }
  generator.variableDB_[varName] = 'BlinkerSlider';

  // 添加滑块回调函数
  let functionName = 'slider_' + key.replace(/-/g, '_') + '_callback';
  let functionCode = 'void ' + functionName + '(int32_t value) {\n' +
    statements +
    '}\n';

  generator.addFunction(functionName, functionCode);

  // 在setup中添加callback绑定
  generator.addSetupEnd('slider_' + key, varName + '.attach(' + functionName + ');');

  return '';
};

Arduino.forBlock['blinker_slider_value'] = function (block, generator) {
  let code = 'value';
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['blinker_colorpicker'] = function (block, generator) {
  // 获取调色器名称
  let key = block.getFieldValue('KEY');
  // 获取内部语句块
  let statements = generator.statementToCode(block, 'NAME');

  // 创建RGB对象变量名
  let varName = 'Blinker_' + key.replace(/-/g, '_');

  // 添加RGB组件对象
  generator.addVariable(varName, 'BlinkerRGB ' + varName + '("' + key + '");');

  // 注册到变量数据库，供blinker_widget_print使用
  if (!generator.variableDB_) {
    generator.variableDB_ = {};
  }
  generator.variableDB_[varName] = 'BlinkerRGB';

  // 添加RGB回调函数
  let functionName = 'rgb_' + key.replace(/-/g, '_') + '_callback';
  let functionCode = 'void ' + functionName + '(uint8_t r_value, uint8_t g_value, uint8_t b_value, uint8_t bright_value) {\n' +
    statements +
    '}\n';

  generator.addFunction(functionName, functionCode);

  // 在setup中添加callback绑定
  generator.addSetupEnd('rgb_' + key, varName + '.attach(' + functionName + ');');

  return '';
};

Arduino.forBlock['blinker_colorpicker_value'] = function (block, generator) {
  // 获取要获取的颜色分量
  let colorComponent = block.getFieldValue('KEY');

  let code = colorComponent.toLowerCase();
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['blinker_joystick'] = function (block, generator) {
  // 获取摇杆名称
  let key = block.getFieldValue('KEY');
  // 获取内部语句块
  let statements = generator.statementToCode(block, 'NAME');

  // 创建摇杆对象变量名
  let varName = 'Blinker_' + key.replace(/-/g, '_');

  // 添加摇杆组件对象
  generator.addVariable(varName, 'BlinkerJoystick ' + varName + '("' + key + '");');

  // 注册到变量数据库，供blinker_widget_print使用
  if (!generator.variableDB_) {
    generator.variableDB_ = {};
  }
  generator.variableDB_[varName] = 'BlinkerJoystick';

  // 添加摇杆回调函数
  let functionName = 'joystick_' + key.replace(/-/g, '_') + '_callback';
  let functionCode = 'void ' + functionName + '(uint8_t xAxis, uint8_t yAxis) {\n' +
    statements +
    '}\n';

  generator.addFunction(functionName, functionCode);

  // 在setup中添加callback绑定
  generator.addSetupEnd('joystick_' + key, varName + '.attach(' + functionName + ');');

  return '';
};

Arduino.forBlock['blinker_joystick_value'] = function (block, generator) {
  // 获取要获取的坐标轴
  let axis = block.getFieldValue('KEY');

  let code = axis.toLowerCase() + 'Axis';
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['blinker_chart'] = function (block, generator) {
  // 获取图表名称
  let key = block.getFieldValue('KEY');
  // 获取内部语句块
  let statements = generator.statementToCode(block, 'NAME');
  // 创建图表对象变量名
  let varName = 'Blinker_' + key.replace(/-/g, '_');
  // 添加图表组件对象
  generator.addVariable(varName, 'BlinkerChart ' + varName + '("' +
    key + '");');

  // 注册到变量数据库，供blinker_widget_print使用
  if (!generator.variableDB_) {
    generator.variableDB_ = {};
  }
  generator.variableDB_[varName] = 'BlinkerChart';

  // 添加图表回调函数
  let functionName = 'chart_' + key.replace(/-/g, '_') + '_callback';
  let functionCode = 'void ' + functionName + '() {\n' +
    statements +  // 将用户的代码插入到函数中
    '}\n';

  generator.addFunction(functionName, functionCode);
  generator.addSetupEnd('chart_' + key, varName + '.attach(' + functionName + ');');

  return '';
};

Arduino.forBlock['blinker_data_upload'] = function (block, generator) {
  // 获取图表名称和数据键名
  let chartKey = block.getFieldValue('CHART');
  let dataKey = block.getFieldValue('KEY');
  let value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '0';
  
  chartKey = 'Blinker_' + chartKey.replace(/-/g, '_');

  return chartKey + '.upload(\"' + dataKey + '\", ' + value + ');\n';
};

Arduino.forBlock['blinker_heartbeat'] = function (block, generator) {
  // 获取内部语句块
  let statements = generator.statementToCode(block, 'NAME');
  
  let functionName = 'heartbeat_callback';
  let functionCode = 'void ' + functionName + '() {\n' +
    statements +  // 将用户的代码插入到函数中
    '}\n';

  generator.addFunction(functionName, functionCode);
  generator.addSetupEnd('heartbeat', 'Blinker.attachHeartbeat(' + functionName + ');');

  return '';
};

Arduino.forBlock['blinker_data_handler'] = function (block, generator) {
  // 获取内部语句块
  let statements = generator.statementToCode(block, 'NAME');
  
  let functionName = 'data_callback';
  let functionCode = 'void ' + functionName + '(const String & data) {\n' +
    statements +  // 将用户的代码插入到函数中
    '}\n';

  generator.addFunction(functionName, functionCode);
  generator.addSetupEnd('data_handler', 'Blinker.attachData(' + functionName + ');');
  return '';
};

Arduino.forBlock['blinker_print'] = function (block, generator) {
  // 检查block是否有KEY输入，以区分两种不同的blinker_print块
  if (block.inputList.some(input => input.name === 'KEY')) {
    // KEY-VALUE版本
    let key = generator.valueToCode(block, 'KEY', Arduino.ORDER_ATOMIC) || '""';
    let value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '0';
    return 'Blinker.print(' + key + ', ' + value + ');\n';
  } else {
    // 纯TEXT版本
    let text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
    return 'Blinker.print(' + text + ');\n';
  }
};

Arduino.forBlock['blinker_log'] = function (block, generator) {
  // 获取日志内容
  let text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';

  let code = 'BLINKER_LOG(' + text + ');\n';
  return code;
};

Arduino.forBlock['blinker_log_args'] = function (block, generator) {
  // 获取日志内容和参数
  let text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  let args = generator.valueToCode(block, 'ARGS', Arduino.ORDER_ATOMIC) || '""';

  let code = 'BLINKER_LOG(' + text + ', ' + args + ');\n';
  return code;
};  

Arduino.forBlock['blinker_vibrate'] = function (block, generator) {
  return 'Blinker.vibrate();\n';
};

Arduino.forBlock['blinker_widget_print'] = function (block, generator) {
  // 获取组件名称
  let widget = block.getFieldValue('WIDGET');
  // 创建组件变量名
  let varName = 'Blinker_' + widget.replace(/-/g, '_');

  // 检查变量名是否已经存在
  if (!generator.variableDB_) {
    generator.variableDB_ = {};
  }

  // 判断varName未注册或类型为BlinkerNumber时，创建默认组件
  if (!generator.variableDB_[varName] || generator.variableDB_[varName] === 'BlinkerNumber') {
    let componentType = 'BlinkerNumber';
    generator.addVariable(varName, componentType + ' ' + varName + '("' + widget + '");');
    generator.variableDB_[varName] = componentType;
    // console.log(`Widget "${widget}" is not registered, using default BlinkerNumber component.`);
  } else {
    // 如果已经注册过，直接使用已存在的变量名
    // console.log(`Using existing component variable: ${varName}`);
  }

  // 收集所有连接的对象块返回的代码
  let objectValues = [];
  
  // 遍历所有输入连接（兼容新旧mutator）
  for (let i = 0; i < block.inputList.length; i++) {
    const input = block.inputList[i];
    if (input.type === Blockly.INPUT_VALUE && input.name && input.name.startsWith('INPUT')) {
      const value = generator.valueToCode(block, input.name, Arduino.ORDER_ATOMIC);
      if (value && value !== '""') {
        objectValues.push(value);
      }
    }
  }
  
  // 生成链式调用代码
  let code = '';
  if (objectValues.length > 0) {
    // 创建对齐的缩进
    let indent = ' '.repeat(varName.length);
    // 生成链式调用格式：组件名.方法1().方法2().print();
    code = varName + objectValues.join('\n' + indent) + '\n' + indent + '.print();\n';
  } else {
    // 如果没有连接对象，使用默认的 print() 方法
    code = varName + '.print();\n';
  }
  
  return code;
};

// Arduino.forBlock['blinker_object_print'] = function (block, generator) {
//   // 获取组件名称
//   let widget = block.getFieldValue('WIDGET');
  
//   // 收集所有输入的JSON对象
//   let jsonParts = [];
  
//   // 遍历所有输入
//   for (let i = 0; i < block.inputList.length; i++) {
//     const input = block.inputList[i];
//     if (input.type === Blockly.INPUT_VALUE && input.name.startsWith('INPUT')) {
//       const value = generator.valueToCode(block, input.name, Arduino.ORDER_ATOMIC);
//       if (value && value !== '""') {
//         jsonParts.push(value);
//       }
//     }
//   }
  
//   // 构造完整的JSON字符串
//   let jsonString = '"{"';
//   if (jsonParts.length > 0) {
//     jsonString += ' + ' + jsonParts.join(' + "," + ') + ' + "}"';
//   } else {
//     jsonString += ' + "}"';
//   }
  
//   let code = 'Blinker.printObject("' + widget + '", ' + jsonString + ');\n';
//   return code;
// };

Arduino.forBlock['blinker_state'] = function (block, generator) {
  // 获取状态值
  let state = generator.valueToCode(block, 'STATE', Arduino.ORDER_ATOMIC) || '""';
  
  let code = '.state(' + state + ')';
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['blinker_icon'] = function (block, generator) {
  // 获取图标值
  let icon = generator.valueToCode(block, 'ICON', Arduino.ORDER_ATOMIC) || '""';
  
  let code = '.icon(' + icon + ')';
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['blinker_color'] = function (block, generator) {
  // 获取颜色值
  let color = generator.valueToCode(block, 'COLOR', Arduino.ORDER_ATOMIC) || '""';
  
  let code = '.color(' + color + ')';
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['blinker_text'] = function (block, generator) {
  // 获取文本值
  let text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  
  let code = '.text(' + text + ')';
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['blinker_value'] = function (block, generator) {
  // 获取数值
  let value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '""';
  
  let code = '.value(' + value + ')';
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['blinker_delay'] = function (block, generator) {
  // 获取延迟时间
  // 获取延迟时间，确保输入类型为数字
  let delayTime = generator.valueToCode(block, 'DELAY', Arduino.ORDER_ATOMIC) || '0';
  // 返回Blinker.delay(time)语句代码
  return 'Blinker.delay(' + delayTime + ');\n';
}


// DFRobotDFPlayerMini库的generator函数

// 初始化DFPlayer模块
Arduino.forBlock['dfplayer_begin'] = function(block, generator) {
  // 监听VAR输入值的变化，自动重命名Blockly变量
  if (!block._dfplayerVarMonitorAttached) {
    block._dfplayerVarMonitorAttached = true;
    block._dfplayerVarLastName = block.getFieldValue('VAR') || 'dfplayer';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._dfplayerVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'DFPlayer');
          block._dfplayerVarLastName = newName;
        }
        return newName;
      });
    }
  }

  var varName = block.getFieldValue('VAR') || 'dfplayer';
  var serial_pin_rx = generator.valueToCode(block, 'RX', Arduino.ORDER_ATOMIC);
  var serial_pin_tx = generator.valueToCode(block, 'TX', Arduino.ORDER_ATOMIC);
  
  // 注册Blockly变量，类型为DFPlayer
  registerVariableToBlockly(varName, 'DFPlayer');
  
  generator.addLibrary('dfplayer', '#include <DFRobotDFPlayerMini.h>');
  generator.addLibrary('softwareserial', '#include <SoftwareSerial.h>');
  generator.addVariable('dfplayer_' + varName, 'DFRobotDFPlayerMini ' + varName + ';');
  generator.addVariable('dfplayer_serial_' + varName, 'SoftwareSerial ' + varName + 'Serial(' + serial_pin_rx + ', ' + serial_pin_tx + ');');
  
  var code = varName + 'Serial.begin(9600);\n';
  code += 'if (!' + varName + '.begin(' + varName + 'Serial)) {\n';
  code += '  Serial.println(F("Unable to begin:"));\n';
  code += '  Serial.println(F("1.Please recheck the connection!"));\n';
  code += '  Serial.println(F("2.Please insert the SD card!"));\n';
  code += '}\n';
  code += varName + '.volume(10);\n';
  
  generator.addSetupBegin('dfplayer_begin_' + varName, code);
  
  return '';
};

// 播放指定编号的文件
Arduino.forBlock['dfplayer_play'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  var file_number = generator.valueToCode(block, 'FILE', Arduino.ORDER_ATOMIC);
  
  var code = varName + '.play(' + file_number + ');\n';
  return code;
};

// 暂停播放
Arduino.forBlock['dfplayer_pause'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  
  var code = varName + '.pause();\n';
  return code;
};

// 继续播放
Arduino.forBlock['dfplayer_start'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  
  var code = varName + '.start();\n';
  return code;
};

// 停止播放
Arduino.forBlock['dfplayer_stop'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  
  var code = varName + '.stop();\n';
  return code;
};

// 播放下一首
Arduino.forBlock['dfplayer_next'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  
  var code = varName + '.next();\n';
  return code;
};

// 播放上一首
Arduino.forBlock['dfplayer_previous'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  
  var code = varName + '.previous();\n';
  return code;
};

// 设置音量
Arduino.forBlock['dfplayer_volume'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  var volume = generator.valueToCode(block, 'VOLUME', Arduino.ORDER_ATOMIC);
  
  var code = varName + '.volume(' + volume + ');\n';
  return code;
};

// 增大音量
Arduino.forBlock['dfplayer_volume_up'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  
  var code = varName + '.volumeUp();\n';
  return code;
};

// 减小音量
Arduino.forBlock['dfplayer_volume_down'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  
  var code = varName + '.volumeDown();\n';
  return code;
};

// 设置均衡器
Arduino.forBlock['dfplayer_eq'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  var eq_type = block.getFieldValue('EQ');
  
  var code = varName + '.EQ(' + eq_type + ');\n';
  return code;
};

// 设置输出设备
Arduino.forBlock['dfplayer_output_device'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  var device = block.getFieldValue('DEVICE');
  
  var code = varName + '.outputDevice(' + device + ');\n';
  return code;
};

// 循环播放特定文件
Arduino.forBlock['dfplayer_loop'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  var file_number = generator.valueToCode(block, 'FILE', Arduino.ORDER_ATOMIC);
  
  var code = varName + '.loop(' + file_number + ');\n';
  return code;
};

// 播放指定文件夹中的文件
Arduino.forBlock['dfplayer_play_folder'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  var folder_number = generator.valueToCode(block, 'FOLDER', Arduino.ORDER_ATOMIC);
  var file_number = generator.valueToCode(block, 'FILE', Arduino.ORDER_ATOMIC);
  
  var code = varName + '.playFolder(' + folder_number + ', ' + file_number + ');\n';
  return code;
};

// 开启全部循环
Arduino.forBlock['dfplayer_enable_loop_all'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  
  var code = varName + '.enableLoopAll();\n';
  return code;
};

// 关闭全部循环
Arduino.forBlock['dfplayer_disable_loop_all'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  
  var code = varName + '.disableLoopAll();\n';
  return code;
};

// 播放MP3文件夹中的文件
Arduino.forBlock['dfplayer_play_mp3_folder'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  var file_number = generator.valueToCode(block, 'FILE', Arduino.ORDER_ATOMIC);
  
  var code = varName + '.playMp3Folder(' + file_number + ');\n';
  return code;
};

// 播放广告
Arduino.forBlock['dfplayer_advertise'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  var file_number = generator.valueToCode(block, 'FILE', Arduino.ORDER_ATOMIC);
  
  var code = varName + '.advertise(' + file_number + ');\n';
  return code;
};

// 停止广告
Arduino.forBlock['dfplayer_stop_advertise'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  
  var code = varName + '.stopAdvertise();\n';
  return code;
};

// 播放大文件夹中的文件
Arduino.forBlock['dfplayer_play_large_folder'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  var folder_number = generator.valueToCode(block, 'FOLDER', Arduino.ORDER_ATOMIC);
  var file_number = generator.valueToCode(block, 'FILE', Arduino.ORDER_ATOMIC);
  
  var code = varName + '.playLargeFolder(' + folder_number + ', ' + file_number + ');\n';
  return code;
};

// 循环播放文件夹
Arduino.forBlock['dfplayer_loop_folder'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  var folder_number = generator.valueToCode(block, 'FOLDER', Arduino.ORDER_ATOMIC);
  
  var code = varName + '.loopFolder(' + folder_number + ');\n';
  return code;
};

// 随机播放所有文件
Arduino.forBlock['dfplayer_random_all'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  
  var code = varName + '.randomAll();\n';
  return code;
};

// 开启循环
Arduino.forBlock['dfplayer_enable_loop'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  
  var code = varName + '.enableLoop();\n';
  return code;
};

// 关闭循环
Arduino.forBlock['dfplayer_disable_loop'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  
  var code = varName + '.disableLoop();\n';
  return code;
};

// 读取状态
Arduino.forBlock['dfplayer_read_state'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  
  var code = varName + '.readState()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 读取音量
Arduino.forBlock['dfplayer_read_volume'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  
  var code = varName + '.readVolume()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 读取均衡器
Arduino.forBlock['dfplayer_read_eq'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  
  var code = varName + '.readEQ()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 读取文件数量
Arduino.forBlock['dfplayer_read_file_counts'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  
  var code = varName + '.readFileCounts()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 读取当前文件编号
Arduino.forBlock['dfplayer_read_current_file_number'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  
  var code = varName + '.readCurrentFileNumber()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 读取文件夹中的文件数量
Arduino.forBlock['dfplayer_read_file_counts_in_folder'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  var folder_number = generator.valueToCode(block, 'FOLDER', Arduino.ORDER_ATOMIC);
  
  var code = varName + '.readFileCountsInFolder(' + folder_number + ')';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 检查是否有可用消息
Arduino.forBlock['dfplayer_available'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  
  var code = varName + '.available()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 读取消息类型
Arduino.forBlock['dfplayer_read_type'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  
  var code = varName + '.readType()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 读取消息参数
Arduino.forBlock['dfplayer_read'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dfplayer';
  
  var code = varName + '.read()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 简化播放音乐块(组合初始化和播放功能)
Arduino.forBlock['dfplayer_simple_play'] = function(block, generator) {
  var rx_pin = generator.valueToCode(block, 'RX', Arduino.ORDER_ATOMIC);
  var tx_pin = generator.valueToCode(block, 'TX', Arduino.ORDER_ATOMIC);
  var file_number = generator.valueToCode(block, 'FILE', Arduino.ORDER_ATOMIC);
  
  generator.addLibrary('dfplayer', '#include <DFRobotDFPlayerMini.h>');
  generator.addLibrary('softwareserial', '#include <SoftwareSerial.h>');
  generator.addVariable('dfplayer_simple', 'DFRobotDFPlayerMini myDFPlayer;');
  generator.addVariable('dfplayer_simple_serial', 'SoftwareSerial myDFPlayerSerial(' + rx_pin + ', ' + tx_pin + ');');
  
  var setup_code = 'myDFPlayerSerial.begin(9600);\n';
  setup_code += 'if (!myDFPlayer.begin(myDFPlayerSerial)) {\n';
  setup_code += '  Serial.println(F("Unable to begin DFPlayer"));\n';
  setup_code += '}\n';
  setup_code += 'myDFPlayer.volume(15);\n';
  
  generator.addSetupBegin('dfplayer_simple_setup', setup_code);
  
  var code = 'myDFPlayer.play(' + file_number + ');\n';
  return code;
};

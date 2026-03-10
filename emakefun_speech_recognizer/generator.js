/**
 * Emakefun Speech Recognizer Library Generator
 * 语音识别模块代码生成器
 */

// 核心库函数（由Blockly运行时提供）
// registerVariableToBlockly(varName, varType) - 注册变量到Blockly系统
// renameVariableInBlockly(block, oldName, newName, varType) - 重命名变量

// 初始化语音识别模块
Arduino.forBlock['speech_recognizer_setup'] = function(block, generator) {
  // 变量重命名监听器
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'speechRecognizer';
    registerVariableToBlockly(block._varLastName, 'SpeechRecognizer');
    
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._varLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'SpeechRecognizer');
          block._varLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'speechRecognizer';
  const i2cAddress = block.getFieldValue('I2C_ADDRESS') || '0x30';

  // 添加库和变量
  generator.addLibrary('SpeechRecognizer', '#include <speech_recognizer.h>');
  generator.addVariable('SpeechRecognizer_' + varName, 'emakefun::SpeechRecognizer ' + varName + '(Wire, ' + i2cAddress + ');');

  // 确保Wire已初始化
  generator.addSetupBegin('Wire.begin()', 'Wire.begin();');

  // 初始化代码
  const code = 'if (' + varName + '.Initialize() != emakefun::SpeechRecognizer::kOK) {\n  Serial.println(F("Speech recognizer initialization failed!"));\n  while(1);\n}\n';
  
  return code;
};

// 设置识别模式
Arduino.forBlock['speech_recognizer_set_mode'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'speechRecognizer';
  const mode = block.getFieldValue('MODE');

  return varName + '.SetRecognitionMode(emakefun::SpeechRecognizer::' + mode + ');\n';
};

// 设置超时时间
Arduino.forBlock['speech_recognizer_set_timeout'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'speechRecognizer';
  const timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '5000';

  return varName + '.SetTimeout(' + timeout + ');\n';
};

// 添加关键词
Arduino.forBlock['speech_recognizer_add_keyword'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'speechRecognizer';
  const keyword = generator.valueToCode(block, 'KEYWORD', generator.ORDER_ATOMIC) || '"keyword"';
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';

  return varName + '.AddKeyword(' + index + ', ' + keyword + ');\n';
};

// 执行语音识别
Arduino.forBlock['speech_recognizer_recognize'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'speechRecognizer';

  // 自动添加到loop开始
  generator.addLoopBegin(varName + '_recognize', 'int16_t ' + varName + '_result = ' + varName + '.Recognize();');

  return [varName + '_result', generator.ORDER_ATOMIC];
};

// 获取当前事件
Arduino.forBlock['speech_recognizer_get_event'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'speechRecognizer';

  return [varName + '.GetEvent()', generator.ORDER_ATOMIC];
};

// 事件处理器
Arduino.forBlock['speech_recognizer_event_handler'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'speechRecognizer';
  const event = block.getFieldValue('EVENT');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';

  // 生成事件检查代码
  const eventCheckCode = 'if (' + varName + '.GetEvent() == emakefun::SpeechRecognizer::' + event + ') {\n' + handlerCode + '}\n';

  // 添加到loop中
  generator.addLoopBegin(varName + '_event_' + event, eventCheckCode);

  return '';
};

// 检查识别结果
Arduino.forBlock['speech_recognizer_check_result'] = function(block, generator) {
  const result = generator.valueToCode(block, 'RESULT', generator.ORDER_ATOMIC) || '-1';
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';

  return ['(' + result + ' == ' + index + ')', generator.ORDER_EQUALITY];
};
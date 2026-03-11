/**
 * Emakefun TTS20 语音合成模块代码生成器
 * 支持I2C通信，支持文本播放、内置提示音播放、播放控制
 */

// 初始化TTS20语音合成模块
Arduino.forBlock['emakefun_tts20_init'] = function(block, generator) {
  // 变量重命名监听器
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'tts20';
    registerVariableToBlockly(block._varLastName, 'EmakefunTts20');

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
          renameVariableInBlockly(block, oldName, newName, 'EmakefunTts20');
          block._varLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'tts20';
  const i2cAddress = block.getFieldValue('I2C_ADDRESS') || '0x40';
  const wire = block.getFieldValue('WIRE') || 'Wire';

  // 添加库引用
  generator.addLibrary('EmakefunTts20', '#include <tts20.h>');

  // 添加对象声明
  generator.addObject(varName, 'em::Tts20 ' + varName + '(' + i2cAddress + ', ' + wire + ');');

  // 确保Wire已初始化
  generator.addSetupBegin(wire + '.begin()', wire + '.begin();');

  // 生成初始化代码
  return varName + '.Init();\n';
};

// 播放文本
Arduino.forBlock['emakefun_tts20_play'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tts20';
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';

  return varName + '.Play(' + text + ');\n';
};

// 播放内置提示音
Arduino.forBlock['emakefun_tts20_play_sound'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tts20';
  const sound = block.getFieldValue('SOUND') || 'ring_1';

  return varName + '.Play(F("' + sound + '"));\n';
};

// 检查是否正在播放
Arduino.forBlock['emakefun_tts20_is_busy'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tts20';

  return [varName + '.IsBusy()', generator.ORDER_ATOMIC];
};

// 等待播放完成
Arduino.forBlock['emakefun_tts20_wait_finish'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tts20';

  return 'while (' + varName + '.IsBusy());\n';
};

// 停止播放
Arduino.forBlock['emakefun_tts20_stop'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tts20';

  return varName + '.Stop();\n';
};

// 暂停播放
Arduino.forBlock['emakefun_tts20_pause'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tts20';

  return varName + '.Pause();\n';
};

// 恢复播放
Arduino.forBlock['emakefun_tts20_resume'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tts20';

  return varName + '.Resume();\n';
};

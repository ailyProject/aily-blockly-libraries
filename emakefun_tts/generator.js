/**
 * Emakefun TTS 语音合成模块代码生成器
 * 支持I2C通信，支持文本播放、缓存播放、播放控制
 */

// 初始化语音合成模块
Arduino.forBlock['emakefun_tts_init'] = function(block, generator) {
  // 变量重命名监听器
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'tts';
    registerVariableToBlockly(block._varLastName, 'EmakefunTts');

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
          renameVariableInBlockly(block, oldName, newName, 'EmakefunTts');
          block._varLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'tts';
  const i2cAddress = block.getFieldValue('I2C_ADDRESS') || '0x40';
  const wire = block.getFieldValue('WIRE') || 'Wire';

  // 添加库引用
  generator.addLibrary('EmakefunTts', '#include <tts.h>');

  // 添加对象声明
  generator.addObject(varName, 'emakefun::Tts ' + varName + '(' + i2cAddress + ', ' + wire + ');');

  // 确保Wire已初始化
  generator.addSetupBegin(wire + '.begin()', wire + '.begin();');

  // 生成初始化代码
  var code = varName + '.Initialize();\n';

  return code;
};

// 播放文本
Arduino.forBlock['emakefun_tts_play'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tts';
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';

  return varName + '.Play(' + text + ');\n';
};

// 上传文本到缓存块
Arduino.forBlock['emakefun_tts_push_cache'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tts';
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  const cacheIndex = generator.valueToCode(block, 'CACHE_INDEX', generator.ORDER_ATOMIC) || '0';

  return varName + '.PushTextToCache(' + text + ', ' + cacheIndex + ');\n';
};

// 从缓存播放
Arduino.forBlock['emakefun_tts_play_cache'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tts';
  const count = generator.valueToCode(block, 'COUNT', generator.ORDER_ATOMIC) || '1';

  return varName + '.PlayFromCache(emakefun::Tts::kUtf8, ' + count + ');\n';
};

// 停止播放
Arduino.forBlock['emakefun_tts_stop'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tts';

  return varName + '.Stop();\n';
};

// 暂停播放
Arduino.forBlock['emakefun_tts_pause'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tts';

  return varName + '.Pause();\n';
};

// 恢复播放
Arduino.forBlock['emakefun_tts_resume'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tts';

  return varName + '.Resume();\n';
};

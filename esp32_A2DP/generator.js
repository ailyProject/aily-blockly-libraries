// ESP32 A2DP Bluetooth Audio Blockly库生成器
// 基于ESP32-A2DP库的Blockly实现
// 支持蓝牙音频接收器(Sink)和发送器(Source)

'use strict';

// ==================== 蓝牙音频接收器 (Sink) ====================

// 创建蓝牙音频接收器
Arduino.forBlock['a2dp_sink_create'] = function(block, generator) {
  // 1. 设置变量重命名监听
  if (!block._a2dpSinkVarMonitorAttached) {
    block._a2dpSinkVarMonitorAttached = true;
    block._a2dpSinkVarLastName = block.getFieldValue('VAR') || 'a2dp_sink';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._a2dpSinkVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'BluetoothA2DPSink');
          block._a2dpSinkVarLastName = newName;
        }
        return newName;
      });
    }
  }

  // 2. 参数提取
  const varName = block.getFieldValue('VAR') || 'a2dp_sink';
  const outputType = block.getFieldValue('OUTPUT_TYPE');

  // 3. 添加库
  generator.addLibrary('AudioTools', '#include "AudioTools.h"');
  generator.addLibrary('BluetoothA2DPSink', '#include "BluetoothA2DPSink.h"');

  // 4. 注册变量
  registerVariableToBlockly(varName, 'BluetoothA2DPSink');

  // 5. 根据输出类型生成不同的声明和初始化代码
  if (outputType === 'I2S') {
    // I2S外部DAC
    const i2sVarName = varName + '_i2s';
    generator.addVariable(i2sVarName, 'I2SStream ' + i2sVarName + ';');
    generator.addVariable(varName, 'BluetoothA2DPSink ' + varName + '(' + i2sVarName + ');');
  } else {
    // 内置DAC
    const dacVarName = varName + '_dac';
    generator.addVariable(dacVarName, 'AnalogAudioStream ' + dacVarName + ';');
    generator.addVariable(varName, 'BluetoothA2DPSink ' + varName + '(' + dacVarName + ');');
  }

  return '';
};

// 启动蓝牙音频接收器
Arduino.forBlock['a2dp_sink_start'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'a2dp_sink';
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '"MyMusic"';

  return varName + '.start(' + name + ');\n';
};

// 设置音量
Arduino.forBlock['a2dp_sink_set_volume'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'a2dp_sink';
  const volume = generator.valueToCode(block, 'VOLUME', generator.ORDER_ATOMIC) || '50';

  return varName + '.set_volume(' + volume + ');\n';
};

// 获取音量
Arduino.forBlock['a2dp_sink_get_volume'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'a2dp_sink';

  return [varName + '.get_volume()', generator.ORDER_FUNCTION_CALL];
};

// 播放
Arduino.forBlock['a2dp_sink_play'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'a2dp_sink';

  return varName + '.play();\n';
};

// 暂停
Arduino.forBlock['a2dp_sink_pause'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'a2dp_sink';

  return varName + '.pause();\n';
};

// 停止
Arduino.forBlock['a2dp_sink_stop'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'a2dp_sink';

  return varName + '.stop();\n';
};

// 下一曲
Arduino.forBlock['a2dp_sink_next'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'a2dp_sink';

  return varName + '.next();\n';
};

// 上一曲
Arduino.forBlock['a2dp_sink_previous'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'a2dp_sink';

  return varName + '.previous();\n';
};

// 元数据回调
Arduino.forBlock['a2dp_sink_on_metadata'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'a2dp_sink';
  const idVar = block.getFieldValue('ID_VAR') || 'metadata_id';
  const textVar = block.getFieldValue('TEXT_VAR') || 'metadata_text';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  const callbackName = 'a2dp_metadata_callback_' + varName;

  // 生成回调函数
  const functionDef = `void ${callbackName}(uint8_t ${idVar}, const uint8_t *${textVar}) {
${handlerCode}
}`;

  generator.addFunction(callbackName, functionDef);

  // 在setup中设置回调和元数据标志
  const setupCode = varName + '.set_avrc_metadata_attribute_mask(ESP_AVRC_MD_ATTR_TITLE | ESP_AVRC_MD_ATTR_ARTIST | ESP_AVRC_MD_ATTR_ALBUM | ESP_AVRC_MD_ATTR_PLAYING_TIME);\n' +
    varName + '.set_avrc_metadata_callback(' + callbackName + ');\n';
  
  generator.addSetupEnd(callbackName, setupCode);

  return '';
};

// 连接状态回调
Arduino.forBlock['a2dp_sink_on_connection_state'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'a2dp_sink';
  const stateVar = block.getFieldValue('STATE_VAR') || 'conn_state';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  const callbackName = 'a2dp_conn_state_callback_' + varName;

  // 生成回调函数
  const functionDef = `void ${callbackName}(esp_a2d_connection_state_t ${stateVar}, void *ptr) {
${handlerCode}
}`;

  generator.addFunction(callbackName, functionDef);

  // 在setup中设置回调
  const setupCode = varName + '.set_on_connection_state_changed(' + callbackName + ');\n';
  generator.addSetupEnd(callbackName, setupCode);

  return '';
};

// 音频状态回调
Arduino.forBlock['a2dp_sink_on_audio_state'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'a2dp_sink';
  const stateVar = block.getFieldValue('STATE_VAR') || 'audio_state';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  const callbackName = 'a2dp_audio_state_callback_' + varName;

  // 生成回调函数
  const functionDef = `void ${callbackName}(esp_a2d_audio_state_t ${stateVar}, void *ptr) {
${handlerCode}
}`;

  generator.addFunction(callbackName, functionDef);

  // 在setup中设置回调
  const setupCode = varName + '.set_on_audio_state_changed(' + callbackName + ');\n';
  generator.addSetupEnd(callbackName, setupCode);

  return '';
};

// 获取音频状态
Arduino.forBlock['a2dp_sink_get_audio_state'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'a2dp_sink';

  return [varName + '.get_audio_state()', generator.ORDER_FUNCTION_CALL];
};

// ==================== 蓝牙音频发送器 (Source) ====================

// 创建蓝牙音频发送器
Arduino.forBlock['a2dp_source_create'] = function(block, generator) {
  // 1. 设置变量重命名监听
  if (!block._a2dpSourceVarMonitorAttached) {
    block._a2dpSourceVarMonitorAttached = true;
    block._a2dpSourceVarLastName = block.getFieldValue('VAR') || 'a2dp_source';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._a2dpSourceVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'BluetoothA2DPSource');
          block._a2dpSourceVarLastName = newName;
        }
        return newName;
      });
    }
  }

  // 2. 参数提取
  const varName = block.getFieldValue('VAR') || 'a2dp_source';

  // 3. 添加库
  generator.addLibrary('BluetoothA2DPSource', '#include "BluetoothA2DPSource.h"');

  // 4. 注册变量和声明
  registerVariableToBlockly(varName, 'BluetoothA2DPSource');
  generator.addVariable(varName, 'BluetoothA2DPSource ' + varName + ';');

  return '';
};

// 启动蓝牙音频发送器
Arduino.forBlock['a2dp_source_start'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'a2dp_source';
  const targetName = generator.valueToCode(block, 'TARGET_NAME', generator.ORDER_ATOMIC) || '"TargetDevice"';

  return varName + '.start(' + targetName + ');\n';
};

// 设置发送器音量
Arduino.forBlock['a2dp_source_set_volume'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'a2dp_source';
  const volume = generator.valueToCode(block, 'VOLUME', generator.ORDER_ATOMIC) || '50';

  return varName + '.set_volume(' + volume + ');\n';
};

// 音频数据回调
Arduino.forBlock['a2dp_source_on_data_callback'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'a2dp_source';
  const frameVar = block.getFieldValue('FRAME_VAR') || 'frame';
  const countVar = block.getFieldValue('COUNT_VAR') || 'frame_count';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  const callbackName = 'a2dp_get_data_frames_' + varName;

  // 生成回调函数 - 返回提供的帧数
  const functionDef = `int32_t ${callbackName}(Frame *${frameVar}, int32_t ${countVar}) {
${handlerCode}  return ${countVar};
}`;

  generator.addFunction(callbackName, functionDef);

  // 在setup中设置回调
  const setupCode = varName + '.set_data_callback_in_frames(' + callbackName + ');\n';
  generator.addSetupEnd(callbackName, setupCode);

  return '';
};

// 设置自动重连
Arduino.forBlock['a2dp_source_set_auto_reconnect'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'a2dp_source';
  const enable = block.getFieldValue('ENABLE') === 'TRUE';

  return varName + '.set_auto_reconnect(' + (enable ? 'true' : 'false') + ');\n';
};

// ==================== 常量块 ====================

// 音频状态 - 正在播放
Arduino.forBlock['a2dp_audio_state_started'] = function(block, generator) {
  return ['ESP_A2D_AUDIO_STATE_STARTED', generator.ORDER_ATOMIC];
};

// 音频状态 - 已停止
Arduino.forBlock['a2dp_audio_state_stopped'] = function(block, generator) {
  return ['ESP_A2D_AUDIO_STATE_STOPPED', generator.ORDER_ATOMIC];
};

// 音频状态 - 远程暂停
Arduino.forBlock['a2dp_audio_state_remote_suspend'] = function(block, generator) {
  return ['ESP_A2D_AUDIO_STATE_REMOTE_SUSPEND', generator.ORDER_ATOMIC];
};

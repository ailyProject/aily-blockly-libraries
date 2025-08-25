'use strict';

// ES8388 Blockly库生成器
// 基于Arduino ES8388音频编解码器库转换

Arduino.forBlock['es8388_create'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._es8388VarMonitorAttached) {
    block._es8388VarMonitorAttached = true;
    block._es8388VarLastName = block.getFieldValue('VAR') || 'es8388';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._es8388VarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'ES8388');
          block._es8388VarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'es8388';
  const sda = generator.valueToCode(block, 'SDA', generator.ORDER_ATOMIC) || '21';
  const scl = generator.valueToCode(block, 'SCL', generator.ORDER_ATOMIC) || '22';
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '400000';

  // 添加库引用
  generator.addLibrary('Arduino', '#include <Arduino.h>');
  generator.addLibrary('ES8388', '#include "ES8388.h"');

  // 注册变量到Blockly系统
  registerVariableToBlockly(varName, 'ES8388');
  
  // 添加变量声明（generator会自动去重）
  generator.addVariable(varName, 'ES8388 ' + varName + '(' + sda + ', ' + scl + ', ' + speed + ');');

  return '';
};

Arduino.forBlock['es8388_begin'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'es8388';

  const sampleRate = generator.valueToCode(block, 'SAMPLE_RATE', generator.ORDER_ATOMIC) || '44100';
  const mckPin = generator.valueToCode(block, 'MCK_PIN', generator.ORDER_ATOMIC) || '39';
  const bckPin = generator.valueToCode(block, 'BCK_PIN', generator.ORDER_ATOMIC) || '41';
  const wsPin = generator.valueToCode(block, 'WS_PIN', generator.ORDER_ATOMIC) || '42';
  const dataOutPin = generator.valueToCode(block, 'DATA_OUT_PIN', generator.ORDER_ATOMIC) || '38';
  const dataInPin = generator.valueToCode(block, 'DATA_IN_PIN', generator.ORDER_ATOMIC) || '40';

  let code = 'if (!' + varName + '.begin(' + sampleRate + ', ' + mckPin + ', ' + bckPin + ', ' + wsPin + ', ' + dataOutPin + ', ' + dataInPin + ', I2S_NUM_0)) {\n' +
             '  Serial.println("Audio initialization failed!");\n' +
             '  return;\n' +
             '}\n';

  // 添加到setup部分
  generator.addSetup('es8388_delay_' + varName, '  delay(1000);\n', 0);
  generator.addSetup('es8388_begin_' + varName, code, 1);

  return '';
};

Arduino.forBlock['es8388_set_input_gain'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'es8388';
  const gain = generator.valueToCode(block, 'GAIN', generator.ORDER_ATOMIC) || '8';

  return varName + '.setInputGain(' + gain + ');\n';
};

Arduino.forBlock['es8388_set_output_volume'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'es8388';
  const volume = generator.valueToCode(block, 'VOLUME', generator.ORDER_ATOMIC) || '20';

  return varName + '.setOutputVolume(' + volume + ');\n';
};

Arduino.forBlock['es8388_dac_mute'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'es8388';
  const mute = block.getFieldValue('MUTE') === 'TRUE';

  return varName + '.DACmute(' + (mute ? 'true' : 'false') + ');\n';
};

Arduino.forBlock['es8388_start_recording'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'es8388';
  const duration = generator.valueToCode(block, 'DURATION', generator.ORDER_ATOMIC) || '5.0';

  return varName + '.startRecording(' + duration + ');\n';
};

Arduino.forBlock['es8388_stop_recording'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'es8388';

  return varName + '.stopRecording();\n';
};

Arduino.forBlock['es8388_start_playback'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'es8388';

  return varName + '.startPlayback();\n';
};

Arduino.forBlock['es8388_stop_playback'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'es8388';

  return varName + '.stopPlayback();\n';
};

Arduino.forBlock['es8388_record_and_play'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'es8388';
  const duration = generator.valueToCode(block, 'DURATION', generator.ORDER_ATOMIC) || '5.0';

  // 不加空格，直接生成在setup里
  return varName + '.recordAndPlay(' + duration + ');\n';
};

Arduino.forBlock['es8388_enable_passthrough'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'es8388';

  return varName + '.enablePassthrough();\n';
};

Arduino.forBlock['es8388_disable_passthrough'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'es8388';

  return varName + '.disablePassthrough();\n';
};

Arduino.forBlock['es8388_process_audio'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'es8388';

  return varName + '.processAudio();\n';
};

Arduino.forBlock['es8388_is_recording'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'es8388';

  return [varName + '.isRecording()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['es8388_is_playing'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'es8388';

  return [varName + '.isPlaying()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['es8388_get_recorded_samples'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'es8388';

  return [varName + '.getRecordedSamples()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['es8388_get_recorded_duration'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'es8388';

  return [varName + '.getRecordedDuration()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['es8388_set_input_select'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'es8388';
  const input = block.getFieldValue('INPUT');

  return varName + '.inputSelect(' + input + ');\n';
};

Arduino.forBlock['es8388_set_output_select'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'es8388';
  const output = block.getFieldValue('OUTPUT');

  return varName + '.outputSelect(' + output + ');\n';
};

Arduino.forBlock['es8388_set_alc_mode'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'es8388';
  const alcMode = block.getFieldValue('ALC_MODE');

  return varName + '.setALCmode(' + alcMode + ');\n';
};

Arduino.forBlock['es8388_analog_bypass'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'es8388';
  const bypass = block.getFieldValue('BYPASS') === 'TRUE';

  return varName + '.analogBypass(' + (bypass ? 'true' : 'false') + ');\n';
};

Arduino.forBlock['es8388_scan_i2c'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'es8388';

  return varName + '.scanI2C();\n';
};
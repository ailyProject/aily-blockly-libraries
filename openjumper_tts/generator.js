/**
 * OpenJumper TTS语音合成模块 Generator
 * 支持文本转语音、数字播报、内置音效
 * 
 * @note 本库不使用field_variable，无需registerVariableToBlockly/renameVariableInBlockly
 * @note 本库不输出调试信息到Serial，无需Serial.begin
 * @note 变量监听机制: 本库所有字段均为field_dropdown和input_value类型，不包含field_variable
 *       因此无需实现setValidator监听变量重命名。若将来添加field_variable字段，
 *       需在init中通过field.setValidator()实现变量名变化监听
 */

// TTS初始化块
Arduino.forBlock['openjumper_tts_init'] = function(block, generator) {
  const rxPin = block.getFieldValue('RX_PIN');
  const txPin = block.getFieldValue('TX_PIN');
  
  // 添加TTS库引用（串口库由OpenJumperTTS.h内部根据平台自动引用）
  generator.addLibrary('OpenJumperTTS', '#include <OpenJumperTTS.h>');
  
  // 创建全局TTS对象
  generator.addObject('TTS_Object', 'OpenJumperTTS TTS(' + rxPin + ', ' + txPin + ');');
  
  // 在setup开始处初始化TTS模块（波特率115200）
  generator.addSetupBegin('TTS_Init', '  TTS.begin(115200);');
  
  return '';
};

// 播放铃声块
Arduino.forBlock['openjumper_tts_play_invoice'] = function(block, generator) {
  var ringtoneNumber = block.getFieldValue('VOICE_TYPE');
  var vnum = generator.valueToCode(block, "VOICE_NUM", Arduino.ORDER_ATOMIC) || '5';

  var code = '';
  if (ringtoneNumber === 'VOICE_Ringtones') {
    code = 'TTS.PlayPromptSound(VOICE_Ringtones,' + vnum + ');\n';
  } else if (ringtoneNumber === 'VOICE_PromptSound') {
    code = 'TTS.PlayPromptSound(VOICE_PromptSound,' + vnum + ');\n';
  } else if (ringtoneNumber === 'VOICE_WarningSound') {
    code = 'TTS.PlayPromptSound(VOICE_WarningSound,' + vnum + ');\n';
  }
  
  return code;
};

// 播放控制块
Arduino.forBlock['openjumper_tts_play_control'] = function(block, generator) {
  var controlAction = block.getFieldValue('CONTROL_ACTION');
  
  // 注意：PLAY_STOP、PLAY_PAUSE、PLAY_CONTINUE 常量应该在 OpenJumperTTS.h 中定义
  var code = 'TTS.playcontrol(' + controlAction + ');\n';
  return code;
};

// 播放数字值块
Arduino.forBlock['openjumper_tts_play_number'] = function(block, generator) {
  var number = generator.valueToCode(block, 'NUMBER', Arduino.ORDER_ATOMIC) || '0';
  
  var code = 'TTS.PlayNumber(' + number + ');\n';
  return code;
};

// 播放文本块
Arduino.forBlock['openjumper_tts_play_text'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  
  return `TTS.PlayText(${text});\n`;
};

// 设置语音参数
Arduino.forBlock['openjumper_tts_setcfg'] = function(block, generator) {
  var voicetp = block.getFieldValue('SP_TYPE');
  var cfgval = generator.valueToCode(block, "CFGV", Arduino.ORDER_ATOMIC) || '5';

  var code = '';
  if (voicetp === 'setspeechSpeed') {
    code = 'TTS.setspeechSpeed(' + cfgval + ');\n';
  } else if (voicetp === 'setIntonation') {
    code = 'TTS.setIntonation(' + cfgval + ');\n';
  } else if (voicetp === 'setVolume') {
    code = 'TTS.setVolume(' + cfgval + ');\n';
  }
  
  return code;
};

// 恢复默认值块
Arduino.forBlock['openjumper_tts_restore_defaults'] = function(block, generator) {
  var code = 'TTS.RestoreDefaultValues();\n';
  return code;
};

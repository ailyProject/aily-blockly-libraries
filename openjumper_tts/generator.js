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
  const boardConfig = generator.getBoardConfig ? generator.getBoardConfig() : null;
  
  // 添加TTS库引用
  generator.addLibrary('OpenJumperTTS', '#include <OpenJumperTTS.h>');
  
  // 根据板卡类型智能选择串口库
  if (boardConfig && boardConfig.platform) {
    const platform = boardConfig.platform.toLowerCase();
    
    // ESP32系列：优先使用硬件串口，兼容软串口
    if (platform.includes('esp32')) {
      generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
    } 
    // AVR系列（Arduino UNO/Nano等）：使用标准软串口
    else if (platform.includes('avr')) {
      generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
    }
    // STM32系列：使用HardwareSerial
    else if (platform.includes('stm32')) {
      generator.addLibrary('HardwareSerial', '#include <HardwareSerial.h>');
    }
    // 其他板卡：默认使用软串口
    else {
      generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
    }
  } else {
    // 无板卡配置时默认使用软串口（最大兼容性）
    generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
  }
  
  // 创建全局TTS对象（包含使用说明注释）
  const ttsComment = '/*TTS文本播报格式说明:\n' +
                     '[n1]: 数字播报模式\n' +
                     '[n2]: 数值播报模式\n' +
                     '[n3]: 电话号码播报模式\n' +
                     '[w0]: 停顿符*/';
  generator.addObject('TTS_Object', ttsComment + '\nOpenJumperTTS TTS(' + rxPin + ', ' + txPin + ');');
  
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
  
  // 定义控制常量（如果在库中未定义）
  generator.addMacro('PLAY_CONTROLS', '#define PLAY_STOP 0\n#define PLAY_PAUSE 1\n#define PLAY_CONTINUE 2');
  
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

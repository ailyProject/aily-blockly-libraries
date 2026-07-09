function ensureK10(generator) {
  generator.addLibrary('SPIFFS', '#include <SPIFFS.h>');
  generator.addLibrary('unihiker_k10', '#include <unihiker_k10.h>');
  generator.addVariable('k10', 'UNIHIKER_K10 k10;');
  generator.addSetupBegin('k10_begin', 'k10.begin();');
}

function ensureASR(generator) {
  ensureK10(generator);
  generator.addLibrary('asr', '#include <asr.h>');
  generator.addVariable('asr', 'ASR asr;');
}

function ensureASRStarted(generator) {
  ensureASR(generator);
  generator.addSetupBegin('asr_init', 'asr.asrInit(CONTINUOUS, CN_MODE, 6000);');
  generator.addSetupBegin('asr_wait', 'while(asr._asrState == 0){delay(100);}');
}

function ensureTTS(generator) {
  ensureASRStarted(generator);
  generator.addSetupBegin('asr_tts_init', 'asr.setAsrSpeed(3);');
  generator.addFunction('k10_asr_speak_safe', `void k10AsrSpeakSafe(ASR &asrObj, String text) {
  static uint32_t lastSpeakTime = 0;
  uint32_t now = millis();
  if (lastSpeakTime != 0 && (uint32_t)(now - lastSpeakTime) < 1500) {
    return;
  }
  if (now < 1000) {
    delay(1000 - now);
  }
  lastSpeakTime = millis();
  asrObj.speak(text);
}
`);
}

// ========== 初始化语音识别 ==========
Arduino.forBlock['k10_asr_init'] = function(block, generator) {
  ensureASRStarted(generator);
  return '';
};

// ========== 添加语音命令 ==========
Arduino.forBlock['k10_asr_add_command'] = function(block, generator) {
  var id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '0';
  var keyword = generator.valueToCode(block, 'KEYWORD', generator.ORDER_ATOMIC) || '""';
  ensureASRStarted(generator);
  return 'asr.addASRCommand(' + id + ', ' + keyword + ');\n';
};

// ========== 语音是否唤醒 ==========
Arduino.forBlock['k10_asr_is_wakeup'] = function(block, generator) {
  ensureASRStarted(generator);
  return ['asr.isWakeUp()', generator.ORDER_ATOMIC];
};

// ========== 识别到命令 ==========
Arduino.forBlock['k10_asr_is_detected'] = function(block, generator) {
  var id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '0';
  ensureASRStarted(generator);
  return ['asr.isDetectCmdID(' + id + ')', generator.ORDER_ATOMIC];
};

// ========== 语音合成播报 ==========
Arduino.forBlock['k10_asr_speak'] = function(block, generator) {
  var text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  ensureTTS(generator);
  return 'k10AsrSpeakSafe(asr, ' + text + ');\n';
};

// ========== 设置播报速度 ==========
Arduino.forBlock['k10_asr_set_speed'] = function(block, generator) {
  var speed = block.getFieldValue('SPEED');
  ensureASRStarted(generator);
  return 'asr.setAsrSpeed(' + speed + ');\n';
};

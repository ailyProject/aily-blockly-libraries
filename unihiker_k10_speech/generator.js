(function registerK10SpeechGenerator() {
if (typeof Blockly !== 'undefined' && Blockly.Extensions) {
  const legacyIntervalExtension = 'k10_asr_speak_legacy_interval';
  if (Blockly.Extensions.isRegistered && Blockly.Extensions.isRegistered(legacyIntervalExtension)) {
    Blockly.Extensions.unregister(legacyIntervalExtension);
  }
  Blockly.Extensions.register(legacyIntervalExtension, function() {
    // Versions <= 0.3.0 saved INTERVAL as a value input. Keep an invisible
    // connection so those projects can be restored, while the visible block
    // uses the inline field_number added in 0.3.1.
    if (!this.getInput('INTERVAL')) {
      this.appendValueInput('INTERVAL').setCheck('Number');
    }
    this.getInput('INTERVAL').setVisible(false);
  });
}

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

const k10AsrConfigByGenerator = new WeakMap();

function ensureASRStarted(generator, mode, language, wakeupTime) {
  ensureASR(generator);
  var config = k10AsrConfigByGenerator.get(generator);
  if (mode || language || wakeupTime) {
    config = {
      mode: mode || 'CONTINUOUS',
      language: language || 'CN_MODE',
      wakeupTime: wakeupTime || '6000'
    };
    k10AsrConfigByGenerator.set(generator, config);
  } else if (!config) {
    config = {
      mode: 'CONTINUOUS',
      language: 'CN_MODE',
      wakeupTime: '6000'
    };
    k10AsrConfigByGenerator.set(generator, config);
  }
  generator.addSetupBegin(
    'asr_init',
    'asr.asrInit(' + config.mode + ', ' + config.language + ', ' + config.wakeupTime + ');'
  );
  generator.addFunction('k10_asr_wait_ready', `bool k10AsrWaitReady(ASR &asrObj, uint32_t timeoutMs) {
  uint32_t start = millis();
  while (asrObj._asrState == 0 && (uint32_t)(millis() - start) < timeoutMs) {
    delay(100);
  }
  if (asrObj._asrState == 0) {
    Serial.println("[K10-ASR] init timeout; check the K10 speech Model option and upload again");
    return false;
  }
  Serial.println("[K10-ASR] ready");
  return true;
}
`);
  generator.addVariable('k10_asr_ready', 'bool k10_asr_ready = false;');
  generator.addSetupBegin('asr_wait', 'k10_asr_ready = k10AsrWaitReady(asr, 15000);');
}

function ensureTTS(generator) {
  ensureASRStarted(generator);
  generator.addSetupBegin('asr_tts_init', 'if (k10_asr_ready) { asr.setAsrSpeed(3); }');
  generator.addFunction('k10_asr_speak_safe', `void k10AsrSpeakSafe(ASR &asrObj, String text, float intervalSeconds, uint32_t &lastSpeakTime) {
  static uint32_t lastGlobalSpeakTime = 0;
  uint32_t now = millis();
  if (asrObj._asrState == 0) {
    return;
  }
  if (intervalSeconds < 0) {
    intervalSeconds = 0;
  }
  if (intervalSeconds > 4294967.0f) {
    intervalSeconds = 4294967.0f;
  }
  uint32_t intervalMs = (uint32_t)(intervalSeconds * 1000.0f);
  if (lastSpeakTime != 0 && (uint32_t)(now - lastSpeakTime) < intervalMs) {
    return;
  }
  if (lastGlobalSpeakTime != 0 && (uint32_t)(now - lastGlobalSpeakTime) < 1000) {
    return;
  }
  if (now < 1000) {
    delay(1000 - now);
  }
  lastSpeakTime = millis();
  lastGlobalSpeakTime = lastSpeakTime;
  asrObj.speak(text);
}

void k10AsrSpeakSafe(ASR &asrObj, float value, float intervalSeconds, uint32_t &lastSpeakTime) {
  k10AsrSpeakSafe(asrObj, String(value), intervalSeconds, lastSpeakTime);
}
`);
}

function getSpeakStateName(block) {
  var id = String(block.id || 'default').replace(/[^a-zA-Z0-9_]/g, '_');
  return 'k10_asr_last_speak_' + id;
}

// ========== 初始化语音识别 ==========
Arduino.forBlock['k10_asr_init'] = function(block, generator) {
  var mode = block.getFieldValue('MODE') || 'CONTINUOUS';
  var language = block.getFieldValue('LANGUAGE') || 'CN_MODE';
  var wakeupTime = generator.valueToCode(block, 'WAKEUP_TIME', generator.ORDER_ATOMIC) || '6000';
  ensureASRStarted(generator, mode, language, wakeupTime);
  return '';
};

// ========== 添加语音命令 ==========
Arduino.forBlock['k10_asr_add_command'] = function(block, generator) {
  var id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '0';
  var keyword = generator.valueToCode(block, 'KEYWORD', generator.ORDER_ATOMIC) || '""';
  ensureASRStarted(generator);
  return 'if (k10_asr_ready) { asr.addASRCommand(' + id + ', ' + keyword + '); }\n';
};

// ========== 语音是否唤醒 ==========
Arduino.forBlock['k10_asr_is_wakeup'] = function(block, generator) {
  ensureASRStarted(generator);
  return ['(k10_asr_ready && asr.isWakeUp())', generator.ORDER_ATOMIC];
};

// ========== 识别到命令 ==========
Arduino.forBlock['k10_asr_is_detected'] = function(block, generator) {
  var id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '0';
  ensureASRStarted(generator);
  return ['(k10_asr_ready && asr.isDetectCmdID(' + id + '))', generator.ORDER_ATOMIC];
};

// ========== 语音合成播报 ==========
Arduino.forBlock['k10_asr_speak'] = function(block, generator) {
  var text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  var intervalField = block.getFieldValue('INTERVAL');
  var interval = intervalField === null || intervalField === undefined || intervalField === ''
    ? '1'
    : intervalField;
  var stateName = getSpeakStateName(block);
  ensureTTS(generator);
  generator.addVariable(stateName, 'uint32_t ' + stateName + ' = 0;');
  return 'k10AsrSpeakSafe(asr, ' + text + ', ' + interval + ', ' + stateName + ');\n';
};

// ========== 设置播报速度 ==========
Arduino.forBlock['k10_asr_set_speed'] = function(block, generator) {
  var speed = block.getFieldValue('SPEED');
  ensureASRStarted(generator);
  return 'if (k10_asr_ready) { asr.setAsrSpeed(' + speed + '); }\n';
};
})();

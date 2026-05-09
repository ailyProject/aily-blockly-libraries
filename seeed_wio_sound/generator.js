// Wio Terminal 麦克风 - 读取原始模拟值（0~1023）
Arduino.forBlock['wio_mic_read'] = function(block, generator) {
  generator.addSetupBegin('wio_mic_init', 'pinMode(WIO_MIC, INPUT);\n', false);
  return ['analogRead(WIO_MIC)', generator.ORDER_ATOMIC];
};

// Wio Terminal 麦克风 - 检测声音是否超过阈值
Arduino.forBlock['wio_mic_is_loud'] = function(block, generator) {
  const threshold = generator.valueToCode(block, 'THRESHOLD', generator.ORDER_ATOMIC) || '512';
  generator.addSetupBegin('wio_mic_init', 'pinMode(WIO_MIC, INPUT);\n', false);
  return ['analogRead(WIO_MIC) > ' + threshold, generator.ORDER_RELATIONAL];
};

// Wio Terminal 蜂鸣器 - analogWrite 开启（占空比方式）
Arduino.forBlock['wio_buzzer_on'] = function(block, generator) {
  const duty = generator.valueToCode(block, 'DUTY', generator.ORDER_ATOMIC) || '128';
  generator.addSetupBegin('wio_buzzer_init', 'pinMode(WIO_BUZZER, OUTPUT);\n', false);
  return 'analogWrite(WIO_BUZZER, ' + duty + ');\n';
};

// Wio Terminal 蜂鸣器 - analogWrite 关闭
Arduino.forBlock['wio_buzzer_off'] = function(block, generator) {
  generator.addSetupBegin('wio_buzzer_init', 'pinMode(WIO_BUZZER, OUTPUT);\n', false);
  return 'analogWrite(WIO_BUZZER, 0);\n';
};

// Wio Terminal 蜂鸣器 - tone 持续播放指定频率
Arduino.forBlock['wio_buzzer_tone'] = function(block, generator) {
  const freq = generator.valueToCode(block, 'FREQUENCY', generator.ORDER_ATOMIC) || '440';
  generator.addSetupBegin('wio_buzzer_init', 'pinMode(WIO_BUZZER, OUTPUT);\n', false);
  return 'tone(WIO_BUZZER, ' + freq + ');\n';
};

// Wio Terminal 蜂鸣器 - tone 播放指定频率并持续指定毫秒
Arduino.forBlock['wio_buzzer_tone_duration'] = function(block, generator) {
  const freq = generator.valueToCode(block, 'FREQUENCY', generator.ORDER_ATOMIC) || '440';
  const duration = generator.valueToCode(block, 'DURATION', generator.ORDER_ATOMIC) || '500';
  generator.addSetupBegin('wio_buzzer_init', 'pinMode(WIO_BUZZER, OUTPUT);\n', false);
  return 'tone(WIO_BUZZER, ' + freq + ', ' + duration + ');\ndelay(' + duration + ');\n';
};

// Wio Terminal 蜂鸣器 - 停止 tone 输出
Arduino.forBlock['wio_buzzer_no_tone'] = function(block, generator) {
  generator.addSetupBegin('wio_buzzer_init', 'pinMode(WIO_BUZZER, OUTPUT);\n', false);
  return 'noTone(WIO_BUZZER);\n';
};

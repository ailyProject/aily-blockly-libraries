// 语音识别初始化块
Arduino.forBlock['openjumper_asr_init'] = function(block, generator) {
  var rxPin = block.getFieldValue('RX_PIN');
  var txPin = block.getFieldValue('TX_PIN');
  
  generator.addLibrary('OpenJumperASR', '#include <OJASR.h>');
  
  generator.addVariable('ASR', 'OJASR asr(' + rxPin + ', ' + txPin + ');');
  
  generator.addSetup('ASR_begin', 'asr.begin(115200);\n');
  
  return '';
};

// 语音识别数据解析
Arduino.forBlock['openjumper_asr_data'] = function(block, generator) {
  var code = 'asr.asrRun();\n';
  return code;
};

// 语音识别到的数据
Arduino.forBlock['openjumper_asr_rincmd'] = function(block, generator) {
  console.log("openjumper asr_rincmd");
  var asrcmd = block.getFieldValue('ASR_CMD');
  console.log(asrcmd);
  var code = 'asr.asrDate == ' + asrcmd;
  return [code, generator.ORDER_ATOMIC];
};

// 语音识别状态
Arduino.forBlock['openjumper_asr_state'] = function(block, generator) {  
  return ["asr.WakeUpStatus", generator.ORDER_ATOMIC];
};

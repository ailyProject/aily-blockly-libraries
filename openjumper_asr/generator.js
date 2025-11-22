/**
 * OpenJumper ASR语音识别模块 Generator
 * 支持离线语音识别，118条预设指令
 * 
 * @note 本库不使用field_variable，无需registerVariableToBlockly/renameVariableInBlockly
 * @note 本库不输出调试信息到Serial，无需Serial.begin
 * @note 变量监听机制: 本库所有字段均为field_dropdown类型，不包含field_variable
 *       因此无需实现setValidator监听变量重命名。若将来添加field_variable字段，
 *       需在init中通过field.setValidator()实现变量名变化监听
 */

// 语音识别初始化块
Arduino.forBlock['openjumper_asr_init'] = function(block, generator) {
  const rxPin = block.getFieldValue('RX_PIN');
  const txPin = block.getFieldValue('TX_PIN');
  const boardConfig = generator.getBoardConfig ? generator.getBoardConfig() : null;
  
  // 添加OJASR库引用
  generator.addLibrary('OpenJumperASR', '#include <OJASR.h>');
  
  // 根据板卡类型智能选择软串口库
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
  
  // 创建全局ASR对象（避免重复创建）
  generator.addObject('ASR_Object', 'OJASR asr(' + rxPin + ', ' + txPin + ');');
  
  // 在setup开始处初始化ASR模块（波特率115200）
  generator.addSetupBegin('ASR_Init', '  asr.begin(115200);');
  
  return '';
};

// 语音识别数据解析块
Arduino.forBlock['openjumper_asr_data'] = function(block, generator) {
  // 解析ASR模块返回的数据，更新识别状态
  const code = '  asr.asrRun();';
  return code + '\n';
};

// 识别到语音指令判断块
Arduino.forBlock['openjumper_asr_rincmd'] = function(block, generator) {
  const asrcmd = block.getFieldValue('ASR_CMD');
  // 比较当前识别数据是否匹配指定指令
  const code = 'asr.asrDate == ' + asrcmd;
  return [code, generator.ORDER_RELATIONAL];
};

// 语音识别唤醒状态查询块
Arduino.forBlock['openjumper_asr_state'] = function(block, generator) {
  // 返回唤醒状态（true=已唤醒，false=待机）
  return ["asr.WakeUpStatus", generator.ORDER_MEMBER];
};

'use strict';

// SU-03T语音识别模块代码生成器

// 初始化语音识别模块
Arduino.forBlock['su03t_init'] = function(block, generator) {
  const mode = block.getFieldValue('MODE');
  const rxPin = generator.valueToCode(block, 'RX_PIN', generator.ORDER_ATOMIC) || '2';
  const txPin = generator.valueToCode(block, 'TX_PIN', generator.ORDER_ATOMIC) || '3';

  // 添加必要的库和变量定义
  if (mode === 'software') {
    generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
    generator.addVariable('su03t_serial', 'SoftwareSerial su03tSerial(' + rxPin + ',' + txPin + ');');
    generator.addVariable('su03t_result', 'volatile int su03tResult = 0;');
    
    // 添加串口初始化到setup
    generator.addSetup('su03t_serial_begin', 'su03tSerial.begin(9600);');
    generator.addSetup('su03t_result_init', 'su03tResult = 0;');
    
  } else { // hardware
    generator.addLibrary('HardwareSerial', '#include <HardwareSerial.h>');
    generator.addVariable('su03t_result', 'volatile int su03tResult = 0;');
    
    // 添加硬串口初始化到setup
    generator.addSetup('su03t_serial2_begin', 'Serial2.begin(9600, SERIAL_8N1, ' + rxPin + ', ' + txPin + ');');
    generator.addSetup('su03t_result_init', 'su03tResult = 0;');
  }

  // 添加串口通信相关的常量定义
  generator.addFunction('su03t_definitions', `
// SU-03T串口通信消息头
const unsigned char su03t_send_head[] = {0xaa, 0x55};

// SU-03T串口通信消息尾
const unsigned char su03t_send_foot[] = {0x55, 0xaa};

// SU-03T串口发送消息最大长度
#define SU03T_UART_SEND_MAX      32
#define SU03T_UART_MSG_HEAD_LEN  2
#define SU03T_UART_MSG_FOOT_LEN  2

// SU-03T串口发送消息号
#define SU03T_MSG_SPEAK_INTEGER      1
#define SU03T_MSG_SPEAK_DECIMAL      2
#define SU03T_MSG_SPEAK_TEXT1        3
#define SU03T_MSG_SPEAK_TEXT2        4
#define SU03T_MSG_SPEAK_TEXT3        5
#define SU03T_MSG_SPEAK_TEXT4        6
#define SU03T_MSG_SPEAK_TEXT5        7
#define SU03T_MSG_SPEAK_TEXT6        8
#define SU03T_MSG_SPEAK_TEXT7        9
#define SU03T_MSG_SPEAK_TEXT8        10
#define SU03T_MSG_SPEAK_TEXT9        11
#define SU03T_MSG_SPEAK_TEXT10       12
#define SU03T_MSG_SPEAK_TEXT11       13
#define SU03T_MSG_SPEAK_TEXT12       14
#define SU03T_MSG_SPEAK_TEXT13       15
#define SU03T_MSG_SPEAK_TEXT14       16
#define SU03T_MSG_SPEAK_TEXT15       17
#define SU03T_MSG_SPEAK_TEXT16       18
#define SU03T_MSG_SPEAK_TEXT17       19
#define SU03T_MSG_SPEAK_TEXT18       20
#define SU03T_MSG_SPEAK_TEXT19       21
#define SU03T_MSG_SPEAK_TEXT20       22
#define SU03T_MSG_SPEAK_TEXT21       23
#define SU03T_MSG_SPEAK_TEXT22       24
#define SU03T_MSG_SPEAK_TEXT23       25
#define SU03T_MSG_SPEAK_TEXT24       26
#define SU03T_MSG_SPEAK_TEXT25       27
#define SU03T_MSG_SPEAK_TEXT26       28
#define SU03T_MSG_SPEAK_TEXT27       29
#define SU03T_MSG_SPEAK_TEXT28       30
#define SU03T_MSG_SPEAK_TEXT29       31
#define SU03T_MSG_SPEAK_TEXT30       32
#define SU03T_MSG_SPEAK_TEXT31       33
#define SU03T_MSG_SPEAK_TEXT32       34
#define SU03T_MSG_SPEAK_TEXT33       35
#define SU03T_MSG_SPEAK_TEXT34       36

// SU-03T串口消息参数类型
typedef union {
  double d_double;
  int d_int;
  unsigned char d_ucs[8];
  char d_char;
  unsigned char d_uchar;
  unsigned long d_long;
  short d_short;
  float d_float;
} su03t_uart_param_t;

// SU-03T串口发送函数实现
void su03t_uart_send_impl(unsigned char* buff, int len) {
  for(int i = 0; i < len; i++) {
    ${mode === 'software' ? 'su03tSerial' : 'Serial2'}.write(buff[i]);
  }
}

// SU-03T十六位整数转32位整数
void su03t_int16_to_int32(su03t_uart_param_t* param) {
  if (sizeof(int) >= 4) return;
  unsigned long value = param->d_long;
  unsigned long sign = (value >> 15) & 1;
  unsigned long v = value;
  if (sign) v = 0xFFFF0000 | value;
  su03t_uart_param_t p;
  p.d_long = v;
  param->d_ucs[0] = p.d_ucs[0];
  param->d_ucs[1] = p.d_ucs[1];
  param->d_ucs[2] = p.d_ucs[2];
  param->d_ucs[3] = p.d_ucs[3];
}

// SU-03T浮点数转双精度
void su03t_float_to_double(su03t_uart_param_t* param) {
  if (sizeof(int) >= 4) return;
  unsigned long value = param->d_long;
  unsigned long sign = value >> 31;
  unsigned long M = value & 0x007FFFFF;
  unsigned long e = ((value >> 23) & 0xFF) - 127 + 1023;
  su03t_uart_param_t p0, p1;
  p1.d_long = ((sign & 1) << 31) | ((e & 0x7FF) << 20) | (M >> 3);
  param->d_ucs[0] = p0.d_ucs[0];
  param->d_ucs[1] = p0.d_ucs[1];
  param->d_ucs[2] = p0.d_ucs[2];
  param->d_ucs[3] = p0.d_ucs[3];
  param->d_ucs[4] = p1.d_ucs[0];
  param->d_ucs[5] = p1.d_ucs[1];
  param->d_ucs[6] = p1.d_ucs[2];
  param->d_ucs[7] = p1.d_ucs[3];
}
`);

  return '';
};

// 刷新语音识别结果
Arduino.forBlock['su03t_refresh'] = function(block, generator) {
  const mode = block.getFieldValue('MODE');
  
  const code = `
if (${mode === 'software' ? 'su03tSerial' : 'Serial2'}.available() > 0) {
  su03tResult = ${mode === 'software' ? 'su03tSerial' : 'Serial2'}.read();
  Serial.println(su03tResult, HEX);
}
`;
  return code;
};

// 清除语音识别结果
Arduino.forBlock['su03t_clear_result'] = function(block, generator) {
  return 'su03tResult = 0;\n';
};

// 检查是否识别到指定指令
Arduino.forBlock['su03t_recognized'] = function(block, generator) {
  const command = generator.valueToCode(block, 'COMMAND', generator.ORDER_ATOMIC) || '0';
  const code = 'su03tResult == ' + command;
  return [code, generator.ORDER_ATOMIC];
};

// 获取预定义指令值
Arduino.forBlock['su03t_command'] = function(block, generator) {
  const command = block.getFieldValue('COMMAND');
  return [command, generator.ORDER_ATOMIC];
};

// 播报整数
Arduino.forBlock['su03t_speak_integer'] = function(block, generator) {
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  
  generator.addFunction('su03t_speak_integer', `
void su03t_speak_integer(int integer) {
  su03t_uart_param_t param;
  int i = 0;
  unsigned char buff[SU03T_UART_SEND_MAX] = {0};
  
  for (i = 0; i < SU03T_UART_MSG_HEAD_LEN; i++) {
    buff[i + 0] = su03t_send_head[i];
  }
  buff[2] = SU03T_MSG_SPEAK_INTEGER;
  param.d_int = integer;
  su03t_int16_to_int32(&param);
  buff[3] = param.d_ucs[0];
  buff[4] = param.d_ucs[1];
  buff[5] = 0;
  buff[6] = 0;
  
  for (i = 0; i < SU03T_UART_MSG_FOOT_LEN; i++) {
    buff[i + 7] = su03t_send_foot[i];
  }
  su03t_uart_send_impl(buff, 9);
}
`);
  
  return 'su03t_speak_integer(' + value + ');\n';
};

// 播报小数
Arduino.forBlock['su03t_speak_decimal'] = function(block, generator) {
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  
  generator.addFunction('su03t_speak_decimal', `
void su03t_speak_decimal(float decimal) {
  su03t_uart_param_t param;
  int i = 0;
  unsigned char buff[SU03T_UART_SEND_MAX] = {0};
  
  for (i = 0; i < SU03T_UART_MSG_HEAD_LEN; i++) {
    buff[i + 0] = su03t_send_head[i];
  }
  buff[2] = SU03T_MSG_SPEAK_DECIMAL;
  param.d_double = decimal;
  su03t_float_to_double(&param);
  buff[3] = param.d_ucs[0];
  buff[4] = param.d_ucs[1];
  buff[5] = param.d_ucs[2];
  buff[6] = param.d_ucs[3];
  buff[7] = param.d_ucs[4];
  buff[8] = param.d_ucs[5];
  buff[9] = param.d_ucs[6];
  buff[10] = param.d_ucs[7];
  
  for (i = 0; i < SU03T_UART_MSG_FOOT_LEN; i++) {
    buff[i + 11] = su03t_send_foot[i];
  }
  su03t_uart_send_impl(buff, 13);
}
`);
  
  return 'su03t_speak_decimal(' + value + ');\n';
};

// 播报预定义文本
Arduino.forBlock['su03t_speak_text'] = function(block, generator) {
  const textId = block.getFieldValue('TEXT');
  
  generator.addFunction('su03t_speak_text_' + textId, `
void su03t_speak_text_${textId}() {
  su03t_uart_param_t param;
  int i = 0;
  unsigned char buff[SU03T_UART_SEND_MAX] = {0};
  
  for (i = 0; i < SU03T_UART_MSG_HEAD_LEN; i++) {
    buff[i + 0] = su03t_send_head[i];
  }
  buff[2] = SU03T_MSG_SPEAK_TEXT${textId};
  
  for (i = 0; i < SU03T_UART_MSG_FOOT_LEN; i++) {
    buff[i + 3] = su03t_send_foot[i];
  }
  su03t_uart_send_impl(buff, 5);
}
`);
  
  return 'su03t_speak_text_' + textId + '();\n';
};
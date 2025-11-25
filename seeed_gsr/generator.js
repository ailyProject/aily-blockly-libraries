'use strict';

// 确保Serial初始化
function ensureSerialBegin(serialPort, generator) {
  const setupCode = serialPort + '.begin(9600);';
  generator.addSetupBegin(setupCode, setupCode);
}

Arduino.forBlock['grove_gsr_read_raw'] = function(block, generator) {
  const pin = block.getFieldValue('PIN') || 'A0';
  
  return ['analogRead(' + pin + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['grove_gsr_read_average'] = function(block, generator) {
  const pin = block.getFieldValue('PIN') || 'A0';
  const samples = generator.valueToCode(block, 'SAMPLES', generator.ORDER_ATOMIC) || '10';

  // 生成平均值计算代码
  const varName = 'gsr_avg_' + pin.replace('A', '');
  let functionDef = '';
  functionDef += 'int ' + varName + '(int samples) {\n';
  functionDef += '  long sum = 0;\n';
  functionDef += '  for(int i = 0; i < samples; i++) {\n';
  functionDef += '    sum += analogRead(' + pin + ');\n';
  functionDef += '    delay(5);\n';
  functionDef += '  }\n';
  functionDef += '  return sum / samples;\n';
  functionDef += '}\n';

  // 注册辅助函数
  generator.addFunction(varName, functionDef);
  
  return [varName + '(' + samples + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['grove_gsr_print_value'] = function(block, generator) {
  const pin = block.getFieldValue('PIN') || 'A0';
  
  // 确保Serial初始化
  ensureSerialBegin('Serial', generator);

  // 生成代码
  let code = 'Serial.print("GSR Value ' + pin + ': ");\n';
  code += 'Serial.println(analogRead(' + pin + '));\n';
  
  return code;
};
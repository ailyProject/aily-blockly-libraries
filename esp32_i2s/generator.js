// I2S对象创建 - 使用field_input
Arduino.forBlock['esp32_i2s_create'] = function(block, generator) {
  // 变量重命名监听
  if (!block._i2sVarMonitorAttached) {
    block._i2sVarMonitorAttached = true;
    block._i2sVarLastName = block.getFieldValue('VAR') || 'i2s';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._i2sVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'I2SClass');
          block._i2sVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'i2s';

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  registerVariableToBlockly(varName, 'I2SClass');
  generator.addVariable('I2SClass_' + varName, 'I2SClass ' + varName + ';');

  return '';
};

// 设置标准模式引脚 - 关联I2S对象
Arduino.forBlock['esp32_i2s_set_pins_std'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'i2s';
  const bclk = block.getFieldValue('BCLK');
  const ws = block.getFieldValue('WS');
  const dout = block.getFieldValue('DOUT');
  const din = block.getFieldValue('DIN');
  const mclk = block.getFieldValue('MCLK');

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');

  return `${varName}.setPins(${bclk}, ${ws}, ${dout}, ${din}, ${mclk});\n`;
};

// 设置PDM TX引脚
Arduino.forBlock['esp32_i2s_set_pins_pdm_tx'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'i2s';
  const clk = block.getFieldValue('CLK');
  const dout0 = block.getFieldValue('DOUT0');
  const dout1 = block.getFieldValue('DOUT1');

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');

  return `${varName}.setPinsPdmTx(${clk}, ${dout0}, ${dout1});\n`;
};

// 设置PDM RX引脚
Arduino.forBlock['esp32_i2s_set_pins_pdm_rx'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'i2s';
  const clk = block.getFieldValue('CLK');
  const din0 = block.getFieldValue('DIN0');
  const din1 = block.getFieldValue('DIN1');
  const din2 = block.getFieldValue('DIN2');
  const din3 = block.getFieldValue('DIN3');

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');

  return `${varName}.setPinsPdmRx(${clk}, ${din0}, ${din1}, ${din2}, ${din3});\n`;
};

// 初始化I2S - 修复错误检查逻辑，添加slot_mask支持
Arduino.forBlock['esp32_i2s_begin'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'i2s';
  const mode = block.getFieldValue('MODE');
  const rate = block.getFieldValue('RATE');
  const bits = block.getFieldValue('BITS');
  const slot = block.getFieldValue('SLOT');
  const slotMask = block.getFieldValue('SLOT_MASK');

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');

  let beginParams = `${mode}, ${rate}, ${bits}, ${slot}`;
  if (slotMask && slotMask !== '-1') {
    beginParams += `, ${slotMask}`;
  }

  let code = `if (!${varName}.begin(${beginParams})) {\n`;
  code += `  Serial.println("I2S初始化失败!");\n`;
  code += `  while(1);\n`;
  code += `}\n`;

  return code;
};

// 配置TX通道
Arduino.forBlock['esp32_i2s_configure_tx'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'i2s';
  const rate = block.getFieldValue('RATE');
  const bits = block.getFieldValue('BITS');
  const slot = block.getFieldValue('SLOT');
  const slotMask = block.getFieldValue('SLOT_MASK');

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');

  let configParams = `${rate}, ${bits}, ${slot}`;
  if (slotMask && slotMask !== '-1') {
    configParams += `, ${slotMask}`;
  }

  let code = `if (!${varName}.configureTX(${configParams})) {\n`;
  code += `  Serial.println("I2S TX配置失败!");\n`;
  code += `}\n`;

  return code;
};

// 配置RX通道
Arduino.forBlock['esp32_i2s_configure_rx'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'i2s';
  const rate = block.getFieldValue('RATE');
  const bits = block.getFieldValue('BITS');
  const slot = block.getFieldValue('SLOT');
  const transform = block.getFieldValue('TRANSFORM');

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');

  let code = `if (!${varName}.configureRX(${rate}, ${bits}, ${slot}, ${transform})) {\n`;
  code += `  Serial.println("I2S RX配置失败!");\n`;
  code += `}\n`;

  return code;
};

// 写入单字节
Arduino.forBlock['esp32_i2s_write_byte'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'i2s';
  const byteValue = generator.valueToCode(block, 'BYTE', generator.ORDER_ATOMIC) || '0';

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');

  return `${varName}.write(${byteValue});\n`;
};

// 写入采样值（16位立体声）
Arduino.forBlock['esp32_i2s_write_sample'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'i2s';
  const sample = generator.valueToCode(block, 'SAMPLE', generator.ORDER_ATOMIC) || '0';

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');

  // 按照Simple_tone示例的方式写入16位立体声数据
  let code = '';
  code += `${varName}.write((int16_t)(${sample}) & 0xFF);\n`;
  code += `${varName}.write(((int16_t)(${sample}) >> 8) & 0xFF);\n`;
  code += `${varName}.write((int16_t)(${sample}) & 0xFF);\n`;
  code += `${varName}.write(((int16_t)(${sample}) >> 8) & 0xFF);\n`;

  return code;
};

// 写入缓冲区
Arduino.forBlock['esp32_i2s_write_buffer'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'i2s';
  const buffer = generator.valueToCode(block, 'BUFFER', generator.ORDER_ATOMIC) || 'buffer';
  const size = generator.valueToCode(block, 'SIZE', generator.ORDER_ATOMIC) || '0';

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');

  return [`${varName}.write((const uint8_t*)${buffer}, ${size})`, generator.ORDER_ATOMIC];
};

// 读取字节
Arduino.forBlock['esp32_i2s_read_bytes'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'i2s';
  const buffer = generator.valueToCode(block, 'BUFFER', generator.ORDER_ATOMIC) || 'buffer';
  const size = generator.valueToCode(block, 'SIZE', generator.ORDER_ATOMIC) || '0';

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');

  return `${varName}.readBytes(${buffer}, ${size});\n`;
};

// 录制WAV - 修复size参数处理
Arduino.forBlock['esp32_i2s_record_wav'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'i2s';
  const seconds = generator.valueToCode(block, 'SECONDS', generator.ORDER_ATOMIC) || '5';
  const sizeVar = block.getFieldValue('SIZE_VAR') || 'wav_size';

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  generator.addVariable('size_t_' + sizeVar, 'size_t ' + sizeVar + ' = 0;');

  return [`${varName}.recordWAV(${seconds}, &${sizeVar})`, generator.ORDER_ATOMIC];
};

// 播放WAV - 添加长度参数
Arduino.forBlock['esp32_i2s_play_wav'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'i2s';
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || 'NULL';
  const length = generator.valueToCode(block, 'LENGTH', generator.ORDER_ATOMIC) || '0';

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');

  return `${varName}.playWAV(${data}, ${length});\n`;
};

// 结束I2S
Arduino.forBlock['esp32_i2s_end'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'i2s';

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');

  return `${varName}.end();\n`;
};

// 获取最后错误
Arduino.forBlock['esp32_i2s_get_last_error'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'i2s';

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');

  return [`${varName}.lastError()`, generator.ORDER_ATOMIC];
};

// 可读字节数
Arduino.forBlock['esp32_i2s_available'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'i2s';

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');

  return [`${varName}.available()`, generator.ORDER_ATOMIC];
};

// 发送采样率
Arduino.forBlock['esp32_i2s_tx_sample_rate'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'i2s';

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');

  return [`${varName}.txSampleRate()`, generator.ORDER_ATOMIC];
};

// 接收采样率
Arduino.forBlock['esp32_i2s_rx_sample_rate'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'i2s';

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');

  return [`${varName}.rxSampleRate()`, generator.ORDER_ATOMIC];
};

// 设置信号反转
Arduino.forBlock['esp32_i2s_set_inverted'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'i2s';
  const bclkInv = block.getFieldValue('BCLK_INV') === 'TRUE';
  const wsInv = block.getFieldValue('WS_INV') === 'TRUE';
  const mclkInv = block.getFieldValue('MCLK_INV') === 'TRUE';

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');

  return `${varName}.setInverted(${bclkInv}, ${wsInv}, ${mclkInv});\n`;
};

// 生成音调
Arduino.forBlock['esp32_i2s_generate_tone'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'i2s';
  const frequency = generator.valueToCode(block, 'FREQUENCY', generator.ORDER_ATOMIC) || '440';
  const duration = generator.valueToCode(block, 'DURATION', generator.ORDER_ATOMIC) || '1000';
  const amplitude = generator.valueToCode(block, 'AMPLITUDE', generator.ORDER_ATOMIC) || '500';

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');

  // 生成方波音调的辅助函数
  const funcDef = `void i2s_generate_tone(I2SClass& i2s, int frequency, int duration_ms, int amplitude) {
  uint32_t sampleRate = i2s.txSampleRate();
  if (sampleRate == 0) sampleRate = 44100;
  unsigned int halfWavelength = sampleRate / frequency / 2;
  unsigned int totalSamples = (sampleRate * duration_ms) / 1000;
  int32_t sample = amplitude;
  
  for (unsigned int count = 0; count < totalSamples; count++) {
    if (count % halfWavelength == 0) {
      sample = -sample;
    }
    // 16位立体声输出
    i2s.write(sample & 0xFF);
    i2s.write((sample >> 8) & 0xFF);
    i2s.write(sample & 0xFF);
    i2s.write((sample >> 8) & 0xFF);
  }
}
`;

  generator.addFunction('esp32_i2s_generate_tone', funcDef);

  return `i2s_generate_tone(${varName}, ${frequency}, ${duration}, ${amplitude});\n`;
};

// 释放WAV缓冲区
Arduino.forBlock['esp32_i2s_free_wav_buffer'] = function(block, generator) {
  const buffer = generator.valueToCode(block, 'BUFFER', generator.ORDER_ATOMIC) || 'NULL';

  let code = `if (${buffer} != NULL) {\n`;
  code += `  free(${buffer});\n`;
  code += `  ${buffer} = NULL;\n`;
  code += `}\n`;

  return code;
};

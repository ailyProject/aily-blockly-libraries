// 定义u8g2_begin块的动态输入扩展
if (Blockly.Extensions.isRegistered('u8g2_begin_dynamic_inputs')) {
  Blockly.Extensions.unregister('u8g2_begin_dynamic_inputs');
}
Blockly.Extensions.register('u8g2_begin_dynamic_inputs', function () {
  // 参考 wire_begin_with_settings_mutator，动态增删输入
  this.updateShape_ = function (protocolValue) {
    // 统一移除所有可能存在的输入
    if (this.getInput('I2C_PINS')) this.removeInput('I2C_PINS');
    if (this.getInput('SW_I2C_PINS')) this.removeInput('SW_I2C_PINS');
    if (this.getInput('3W_SPI_PINS')) this.removeInput('3W_SPI_PINS');
    if (this.getInput('3W_SW_SPI_PINS')) this.removeInput('3W_SW_SPI_PINS');
    if (this.getInput('4W_SPI_PINS')) this.removeInput('4W_SPI_PINS');
    if (this.getInput('4W_SW_SPI_PINS')) this.removeInput('4W_SW_SPI_PINS');
    switch (protocolValue) {
      case '_HW_I2C':
        this.appendDummyInput('I2C_PINS')
          .appendField('引脚RST')
          .appendField(new Blockly.FieldTextInput('U8X8_PIN_NONE'), 'RESET_PIN');
        break;
      case '_SW_I2C':
        this.appendDummyInput('SW_I2C_PINS')
          .appendField('引脚SCL')
          .appendField(new Blockly.FieldTextInput('13'), 'CLOCK_PIN')
          .appendField('SDA')
          .appendField(new Blockly.FieldTextInput('11'), 'DATA_PIN')
          .appendField('RST')
          .appendField(new Blockly.FieldTextInput('8'), 'RESET_PIN');
        break;
      case '_3W_HW_SPI':
        this.appendDummyInput('3W_SPI_PINS')
          .appendField('引脚CS')
          .appendField(new Blockly.FieldTextInput('10'), 'CS_PIN')
          .appendField('RST')
          .appendField(new Blockly.FieldTextInput('8'), 'RESET_PIN');
        break;
      case '_3W_SW_SPI':
        this.appendDummyInput('3W_SW_SPI_PINS')
          .appendField('引脚CLK')
          .appendField(new Blockly.FieldTextInput('13'), 'CLOCK_PIN')
          .appendField('DATA')
          .appendField(new Blockly.FieldTextInput('11'), 'DATA_PIN')
          .appendField('CS')
          .appendField(new Blockly.FieldTextInput('10'), 'CS_PIN')
          .appendField('RST')
          .appendField(new Blockly.FieldTextInput('8'), 'RESET_PIN');
        break;
      case '_4W_HW_SPI':
        this.appendDummyInput('4W_SPI_PINS')
          .appendField('引脚CS')
          .appendField(new Blockly.FieldTextInput('10'), 'CS_PIN')
          .appendField('DC')
          .appendField(new Blockly.FieldTextInput('9'), 'DC_PIN')
          .appendField('RST')
          .appendField(new Blockly.FieldTextInput('8'), 'RESET_PIN');
        break;
      case '_4W_SW_SPI':
        this.appendDummyInput('4W_SW_SPI_PINS')
          .appendField('引脚CLK')
          .appendField(new Blockly.FieldTextInput('13'), 'CLOCK_PIN')
          .appendField('DATA')
          .appendField(new Blockly.FieldTextInput('11'), 'DATA_PIN')
          .appendField('CS')
          .appendField(new Blockly.FieldTextInput('10'), 'CS_PIN')
          .appendField('DC')
          .appendField(new Blockly.FieldTextInput('9'), 'DC_PIN')
          .appendField('RST')
          .appendField(new Blockly.FieldTextInput('8'), 'RESET_PIN');
        break;
      default:
        break;
    }
  };
  // 为PROTOCOL字段添加验证器，切换时动态更新输入
  this.getField('PROTOCOL').setValidator(option => {
    this.updateShape_(option);
    return option;
  });
  // 初始化时根据当前协议值设置输入
  this.updateShape_(this.getFieldValue('PROTOCOL'));
});

Arduino.forBlock['u8g2_begin'] = function (block, generator) {
  var type = block.getFieldValue('TYPE');
  var resolution = block.getFieldValue('RESOLUTION');
  var protocol = block.getFieldValue('PROTOCOL');

  // 构建基础的构造函数名称
  var code = 'U8G2_' + type + '_' + resolution + protocol + ' u8g2(';

  // 根据不同的协议类型添加对应的引脚参数
  switch (protocol) {
    case '_HW_I2C':
      // 硬件I2C只需要重置引脚
      var resetPin = block.getFieldValue('RESET_PIN');
      code += 'U8G2_R0, ' + resetPin;
      break;

    case '_SW_I2C':
      // 软件I2C需要时钟、数据和重置引脚
      var clockPin = block.getFieldValue('CLOCK_PIN');
      var dataPin = block.getFieldValue('DATA_PIN');
      var resetPin = block.getFieldValue('RESET_PIN');
      code += 'U8G2_R0, ' + clockPin + ', ' + dataPin + ', ' + resetPin;
      break;

    case '_3W_HW_SPI':
      // 3线硬件SPI需要片选和重置引脚
      var csPin = block.getFieldValue('CS_PIN');
      var resetPin = block.getFieldValue('RESET_PIN');
      code += 'U8G2_R0, ' + csPin + ', ' + resetPin;
      break;

    case '_3W_SW_SPI':
      // 3线软件SPI需要时钟、数据、片选和重置引脚
      var clockPin = block.getFieldValue('CLOCK_PIN');
      var dataPin = block.getFieldValue('DATA_PIN');
      var csPin = block.getFieldValue('CS_PIN');
      var resetPin = block.getFieldValue('RESET_PIN');
      code += 'U8G2_R0, ' + clockPin + ', ' + dataPin + ', ' + csPin + ', ' + resetPin;
      break;

    case '_4W_HW_SPI':
      // 4线硬件SPI需要DC、片选和重置引脚
      var dcPin = block.getFieldValue('DC_PIN');
      var csPin = block.getFieldValue('CS_PIN');
      var resetPin = block.getFieldValue('RESET_PIN');
      code += 'U8G2_R0, ' + dcPin + ', ' + csPin + ', ' + resetPin;
      break;

    case '_4W_SW_SPI':
      // 4线软件SPI需要时钟、数据、片选、DC和重置引脚
      var clockPin = block.getFieldValue('CLOCK_PIN');
      var dataPin = block.getFieldValue('DATA_PIN');
      var csPin = block.getFieldValue('CS_PIN');
      var dcPin = block.getFieldValue('DC_PIN');
      var resetPin = block.getFieldValue('RESET_PIN');
      code += 'U8G2_R0, ' + clockPin + ', ' + dataPin + ', ' + csPin + ', ' + dcPin + ', ' + resetPin;
      break;

    default:
      // 默认情况，只添加旋转参数
      code += 'U8G2_R0';
      break;
  }

  code += ');';

  generator.addLibrary('u8g2', '#include <U8g2lib.h>');
  generator.addObject('u8g2', code);
  return 'u8g2.begin();\n';
};

// 清屏操作（立即生效）
Arduino.forBlock['u8g2_clear'] = function (block, generator) {
  return `u8g2.clear();\n`;
};

// 清空缓冲区（需要配合sendBuffer使用）
Arduino.forBlock['u8g2_clear_buffer'] = function (block, generator) {
  return `u8g2.clearBuffer();\n`;
};

// 发送缓冲区到显示器
Arduino.forBlock['u8g2_send_buffer'] = function (block, generator) {
  return `u8g2.sendBuffer();\n`;
};

// 绘制像素点
Arduino.forBlock['u8g2_draw_pixel'] = function (block, generator) {
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC);
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC);
  return `u8g2.drawPixel(${x}, ${y});\nu8g2.sendBuffer();\n`;
};

// 绘制直线
Arduino.forBlock['u8g2_draw_line'] = function (block, generator) {
  const x1 = generator.valueToCode(block, 'X1', Arduino.ORDER_ATOMIC);
  const y1 = generator.valueToCode(block, 'Y1', Arduino.ORDER_ATOMIC);
  const x2 = generator.valueToCode(block, 'X2', Arduino.ORDER_ATOMIC);
  const y2 = generator.valueToCode(block, 'Y2', Arduino.ORDER_ATOMIC);

  return `u8g2.drawLine(${x1}, ${y1}, ${x2}, ${y2});\nu8g2.sendBuffer();\n`;
};

// 绘制矩形
Arduino.forBlock['u8g2_draw_rectangle'] = function (block, generator) {
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC);
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC);
  const width = generator.valueToCode(block, 'WIDTH', Arduino.ORDER_ATOMIC);
  const height = generator.valueToCode(block, 'HEIGHT', Arduino.ORDER_ATOMIC);
  const fill = block.getFieldValue('FILL') === 'TRUE';

  if (fill) {
    return `u8g2.drawBox(${x}, ${y}, ${width}, ${height});\nu8g2.sendBuffer();\n`;
  } else {
    return `u8g2.drawFrame(${x}, ${y}, ${width}, ${height});\nu8g2.sendBuffer();\n`;
  }
};

// 绘制圆形
Arduino.forBlock['u8g2_draw_circle'] = function (block, generator) {
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC);
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC);
  const radius = generator.valueToCode(block, 'RADIUS', Arduino.ORDER_ATOMIC);
  const fill = block.getFieldValue('FILL') === 'TRUE';

  if (fill) {
    return `u8g2.drawDisc(${x}, ${y}, ${radius});\nu8g2.sendBuffer();\n`;
  } else {
    return `u8g2.drawCircle(${x}, ${y}, ${radius});\nu8g2.sendBuffer();\n`;
  }
};

// 绘制文本
Arduino.forBlock['u8g2_draw_str'] = function (block, generator) {
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC);
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC);
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC);
  let fontSetting = 'u8g2_font_ncenB08_tr'; // 默认字体设置
  let drawCode= 'drawStr';
  const isChinese = /[\u4e00-\u9fa5]/.test(text); // 检测是否为中文
  if (isChinese) {
    // 如果是中文，使用特定的字体
    fontSetting = 'u8g2_font_wqy12_t_chinese2';
    drawCode = 'drawUTF8';
  }
  generator.addSetupEnd('u8g2_enableUTF8Print', 'u8g2.enableUTF8Print();');
  return `u8g2.setFont(${fontSetting});\nu8g2.${drawCode}(${x}, ${y}, ${text});\nu8g2.sendBuffer();\n`;
};

// 设置字体
Arduino.forBlock['u8g2_set_font'] = function (block, generator) {
  const font = block.getFieldValue('FONT');
  return `u8g2.setFont(${font});\n`;
};

// 将二维数组位图数据转换为XBM格式
function convertBitmapToXBM(bitmapArray) {
  if (!Array.isArray(bitmapArray) || bitmapArray.length === 0) {
    return null;
  }

  const height = bitmapArray.length;
  const width = bitmapArray[0].length;

  // 确保所有行的长度一致
  for (let i = 0; i < height; i++) {
    if (!Array.isArray(bitmapArray[i]) || bitmapArray[i].length !== width) {
      console.error(`Row ${i} has inconsistent width`);
      return null;
    }
  }

  // XBM格式按字节存储，每字节8位，按行从左到右，LSB在前（最低位在最左边）
  const bytesPerRow = Math.ceil(width / 8);
  const xbmBytes = [];

  for (let y = 0; y < height; y++) {
    for (let byteIndex = 0; byteIndex < bytesPerRow; byteIndex++) {
      let byteValue = 0;

      // 处理当前字节的8个位
      for (let bit = 0; bit < 8; bit++) {
        const x = byteIndex * 8 + bit;
        if (x < width && bitmapArray[y][x] === 1) {
          // XBM格式中，最低位对应最左边的像素
          // bit 0 对应字节中最左边的像素，bit 7 对应最右边的像素
          // 使用LSB格式：最低位(bit 0)对应最左边的像素
          byteValue |= (1 << bit);
        }
      }

      xbmBytes.push(`0x${byteValue.toString(16).padStart(2, '0').toUpperCase()}`);
    }
  }

  // 格式化为XBM数组字符串
  const xbmData = xbmBytes.join(', ');

  return {
    xbmData,
    width,
    height,
    formattedXbmData: formatXBMData(xbmBytes, bytesPerRow)
  };
}

// 格式化XBM数据为多行显示
function formatXBMData(xbmBytes, bytesPerRow) {
  const lines = [];
  for (let i = 0; i < xbmBytes.length; i += bytesPerRow) {
    const rowBytes = xbmBytes.slice(i, i + bytesPerRow);
    lines.push('  ' + rowBytes.join(', '));
  }
  return lines.join(',\n');
}

// 通用位图处理函数
function processBitmapBlock(block, generator, blockType) {
  // 获取bitmap字段
  const bitmapData = block.getFieldValue('CUSTOM_BITMAP');
  console.log(`[${blockType}] Original bitmap data:`, bitmapData);

  // 转换为XBM格式
  const xbmResult = convertBitmapToXBM(bitmapData);
  console.log(`[${blockType}] Converted XBM result:`, xbmResult);

  if (!xbmResult) {
    console.error(`[${blockType}] Failed to convert bitmap to XBM format`);
    return ['', Arduino.ORDER_ATOMIC];
  }

  const { formattedXbmData, width, height } = xbmResult;

  // 生成一个唯一的变量名
  const bitmapVarName = `${blockType}_${block.id.replace(/[^a-zA-Z0-9]/g, '')}`;

  console.log(`[${blockType}] Generated bitmap variable name:`, bitmapVarName);

  // 添加bitmap数据到程序的全局变量部分
  const bitmapDeclaration = `// XBM format bitmap data (${width}x${height})
static const unsigned char ${bitmapVarName}_data[] PROGMEM = {
${formattedXbmData}
};
const int ${bitmapVarName}_width = ${width};
const int ${bitmapVarName}_height = ${height};`;

  generator.addVariable(bitmapVarName, bitmapDeclaration);

  // 返回变量名，用于在drawXBM中引用
  return [`${bitmapVarName}_data`, Arduino.ORDER_ATOMIC];
}

// 位图数据块 (128x64 全屏)
Arduino.forBlock['u8g2_bitmap'] = function (block, generator) {
  return processBitmapBlock(block, generator, 'bitmap');
};

// 小图标 16x16
Arduino.forBlock['u8g2_icon_16x16'] = function (block, generator) {
  return processBitmapBlock(block, generator, 'icon16');
};

// 中图标 32x32
Arduino.forBlock['u8g2_icon_32x32'] = function (block, generator) {
  return processBitmapBlock(block, generator, 'icon32');
};

// 大图标 64x64
Arduino.forBlock['u8g2_icon_64x64'] = function (block, generator) {
  return processBitmapBlock(block, generator, 'icon64');
};

// 绘制位图 - 更新以使用正确的变量名
Arduino.forBlock['u8g2_draw_bitmap'] = function (block, generator) {
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC);
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC);
  const bitmapCode = generator.valueToCode(block, 'BITMAP', Arduino.ORDER_ATOMIC);

  if (!bitmapCode) {
    return '// No bitmap data\n';
  }

  // 从bitmap代码中提取变量名前缀
  const bitmapVarPrefix = bitmapCode.replace('_data', '');

  return `u8g2.drawXBMP(${x}, ${y}, ${bitmapVarPrefix}_width, ${bitmapVarPrefix}_height, ${bitmapCode});\nu8g2.sendBuffer();\n`;
};

// 设置屏幕翻转
Arduino.forBlock['u8g2_set_flip_mode'] = function (block, generator) {
  const mode = block.getFieldValue('MODE');
  return `u8g2.setFlipMode(${mode});\n`;
};

// 设置电源管理
Arduino.forBlock['u8g2_set_power_save'] = function (block, generator) {
  const mode = block.getFieldValue('MODE');
  return `u8g2.setPowerSave(${mode});\n`;
};

// 设置对比度/亮度
Arduino.forBlock['u8g2_set_contrast'] = function (block, generator) {
  const value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '128';
  return `u8g2.setContrast(${value});\n`;
};

// 设置I2C总线速度
Arduino.forBlock['u8g2_set_bus_clock'] = function (block, generator) {
  const speed = block.getFieldValue('SPEED');
  return `u8g2.setBusClock(${speed});\n`;
};

// 设置字体
Arduino.forBlock['u8g2_set_font'] = function (block, generator) {
  const font = block.getFieldValue('FONT');
  return `u8g2.setFont(${font});\n`;
};

// 设置绘图颜色
Arduino.forBlock['u8g2_set_draw_color'] = function (block, generator) {
  const color = block.getFieldValue('COLOR');
  return `u8g2.setDrawColor(${color});\n`;
};

// 设置字体模式
Arduino.forBlock['u8g2_set_font_mode'] = function (block, generator) {
  const mode = block.getFieldValue('MODE');
  return `u8g2.setFontMode(${mode});\n`;
};

// 清空缓冲区（已有，保持不变）
// Arduino.forBlock['u8g2_clear_buffer'] 已在第160行定义

// 发送缓冲区（已有，保持不变）
// Arduino.forBlock['u8g2_send_buffer'] 已在第165行定义
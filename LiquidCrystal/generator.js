// LCD 显示器库生成器

// 添加标志变量，跟踪LCD是否已初始化
Arduino.lcdInitialized = false;

// 自动初始化LCD的辅助函数
Arduino.ensureLcdInitialized = function (generator) {
  
  if (!Arduino.lcdInitialized) {
    // 设置默认值
    const defaultCols = 16;
    const defaultRows = 2;
    const defaultRsPin = 12;
    const defaultEPin = 11;
    const defaultD4Pin = 5;
    const defaultD5Pin = 4;
    const defaultD6Pin = 3;
    const defaultD7Pin = 2;
    const defaultLightPin = 6;

    // 添加库引用
    generator.addLibrary('LiquidCrystal', '#include <LiquidCrystal.h>');

    // 创建LCD对象
    generator.addVariable('LCD_COLS', `#define LCD_COLS ${defaultCols}`);
    generator.addVariable('LCD_ROWS', `#define LCD_ROWS ${defaultRows}`);
    generator.addVariable('LCD_BACKLIGHT_PIN', `#define LCD_BACKLIGHT_PIN ${defaultLightPin}`);
    generator.addObject('lcd', `LiquidCrystal lcd(${defaultRsPin}, ${defaultEPin}, ${defaultD4Pin}, ${defaultD5Pin}, ${defaultD6Pin}, ${defaultD7Pin});`);

    // 在setup中初始化LCD和背光引脚
    generator.addSetupBegin('lcd_begin', `lcd.begin(LCD_COLS, LCD_ROWS);`);
    generator.addSetupBegin('lcd_backlight_pin', `pinMode(LCD_BACKLIGHT_PIN, OUTPUT);`);
    generator.addSetupBegin('lcd_backlight_on', `digitalWrite(LCD_BACKLIGHT_PIN, HIGH);`);

    return true;
  }
  return false;
};

// LCD 初始化块
Arduino.forBlock['lcd_init'] = function (block, generator) {
  const cols = generator.valueToCode(block, 'COLS', Arduino.ORDER_ATOMIC) || '16';
  const rows = generator.valueToCode(block, 'ROWS', Arduino.ORDER_ATOMIC) || '2';
  const rs_pin = generator.valueToCode(block, 'RS_PIN', Arduino.ORDER_ATOMIC) || '12';
  const e_pin = generator.valueToCode(block, 'E_PIN', Arduino.ORDER_ATOMIC) || '11';
  const d4_pin = generator.valueToCode(block, 'D4_PIN', Arduino.ORDER_ATOMIC) || '5';
  const d5_pin = generator.valueToCode(block, 'D5_PIN', Arduino.ORDER_ATOMIC) || '4';
  const d6_pin = generator.valueToCode(block, 'D6_PIN', Arduino.ORDER_ATOMIC) || '3';
  const d7_pin = generator.valueToCode(block, 'D7_PIN', Arduino.ORDER_ATOMIC) || '2';
  const light_pin = generator.valueToCode(block, 'LIGHT_PIN', Arduino.ORDER_ATOMIC) || '6';

  // 添加库引用
  generator.addLibrary('LiquidCrystal', '#include <LiquidCrystal.h>');

  // 创建LCD对象
  generator.addVariable('LCD_COLS', `#define LCD_COLS ${cols}`);
  generator.addVariable('LCD_ROWS', `#define LCD_ROWS ${rows}`);
  generator.addVariable('LCD_BACKLIGHT_PIN', `#define LCD_BACKLIGHT_PIN ${light_pin}`);
  generator.addObject('lcd', `LiquidCrystal lcd(${rs_pin}, ${e_pin}, ${d4_pin}, ${d5_pin}, ${d6_pin}, ${d7_pin});`);

  // 在setup中初始化LCD和背光引脚
  generator.addSetupBegin('lcd_begin', `lcd.begin(LCD_COLS, LCD_ROWS);`);
  generator.addSetupBegin('lcd_backlight_pin', `pinMode(LCD_BACKLIGHT_PIN, OUTPUT);`);
  generator.addSetupBegin('lcd_backlight_on', `digitalWrite(LCD_BACKLIGHT_PIN, HIGH);`);

  // 标记为已初始化
  Arduino.lcdInitialized = true;

  return '';
};

// 清空LCD显示
Arduino.forBlock['lcd_clear'] = function (block, generator) {
  // 确保LCD已初始化
  Arduino.ensureLcdInitialized(generator);
  return 'lcd.clear();\n';
};

// 设置LCD光标位置
Arduino.forBlock['lcd_set_cursor'] = function (block, generator) {
  // 确保LCD已初始化
  Arduino.ensureLcdInitialized(generator);
  const col = generator.valueToCode(block, 'COL', Arduino.ORDER_ATOMIC) || '0';
  const row = generator.valueToCode(block, 'ROW', Arduino.ORDER_ATOMIC) || '0';

  return `lcd.setCursor(${col}, ${row});\n`;
};

// LCD输出文本
Arduino.forBlock['lcd_print'] = function (block, generator) {
  // 确保LCD已初始化
  Arduino.ensureLcdInitialized(generator);
  
  // 获取连接到TEXT输入的块
  var textBlock = block.getInputTargetBlock('TEXT');

  // 判断连接的块是否为自定义字符块
  if (textBlock && textBlock.type === 'lcd_custom_char') {
    // 这是一个自定义字符，需要使用write而不是print
    var charIndex = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC);
    return `lcd.write(${charIndex});\n`;
  } else {
    // 正常的文本打印
    const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
    return `lcd.print(${text});\n`;
  }
};

// LCD在指定位置输出文本
Arduino.forBlock['lcd_print_position'] = function (block, generator) {
  // 确保LCD已初始化
  Arduino.ensureLcdInitialized(generator);
  const col = generator.valueToCode(block, 'COL', Arduino.ORDER_ATOMIC) || '0';
  const row = generator.valueToCode(block, 'ROW', Arduino.ORDER_ATOMIC) || '0';
  
  // 首先设置光标位置
  var code = `lcd.setCursor(${col}, ${row});\n`;
  
  // 获取连接到TEXT输入的块
  var textBlock = block.getInputTargetBlock('TEXT');
  
  // 判断连接的块是否为自定义字符块
  if (textBlock && textBlock.type === 'lcd_custom_char') {
    // 这是一个自定义字符，需要使用write而不是print
    var charIndex = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC);
    code += `lcd.write(${charIndex});\n`;
  } else {
    // 正常的文本打印
    const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
    code += `lcd.print(${text});\n`;
  }
  
  return code;
};

// 打开LCD背光
Arduino.forBlock['lcd_backlight_on'] = function (block, generator) {
  // 确保LCD已初始化
  Arduino.ensureLcdInitialized(generator);
  return 'digitalWrite(LCD_BACKLIGHT_PIN, LOW);\n';
};

// 关闭LCD背光
Arduino.forBlock['lcd_backlight_off'] = function (block, generator) {
  // 确保LCD已初始化
  Arduino.ensureLcdInitialized(generator);
  return 'digitalWrite(LCD_BACKLIGHT_PIN, HIGH);\n';
};

// 自定义字符
Arduino.forBlock['lcd_custom_char'] = function (block, generator) {
  // 获取字符位图数据和存储位置
  var bitmapData = block.getFieldValue('CUSTOM_CHAR');
  var charIndex = block.getFieldValue('CHAR_INDEX');

  try {
    // 将字符位图数据转换为二进制格式的LCD字符数组
    var customCharData = [];

    for (var row = 0; row < 8; row++) {
      var binaryString = '0b';

      // 对于二维数组格式
      if (Array.isArray(bitmapData) && Array.isArray(bitmapData[0])) {
        for (var col = 0; col < 5; col++) {
          binaryString += bitmapData[row][col];
        }
      }
      // 对于一维数组格式（保留兼容性）
      else if (typeof bitmapData === 'string') {
        for (var col = 0; col < 5; col++) {
          var bit = bitmapData[row * 5 + col] === '1' ? 1 : 0;
          binaryString += bit;
        }
      }

      customCharData.push(binaryString);
    }

    // 生成创建和显示自定义字符的代码
    var charName = 'custom_char_' + charIndex;
    var charArrayName = charName + '_data';

    generator.addVariable(charArrayName, 'byte ' + charArrayName + '[8] = {\n  ' +
      customCharData.join(',\n  ') + '\n};');
    generator.addSetupBegin(charName, 'lcd.createChar(' + charIndex + ', ' + charArrayName + ');');

    return [charIndex, generator.ORDER_ATOMIC];
  } catch (e) {
    console.error('Error processing bitmap data:', e);
    return ['0', generator.ORDER_ATOMIC]; // 返回默认值
  }
};
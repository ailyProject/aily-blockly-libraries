// ESP32 旋转编码器库

Arduino.forBlock['rotary_encoder_init'] = function(block, generator) {
  const clk_pin = block.getFieldValue('CLK_PIN');
  const dt_pin = block.getFieldValue('DT_PIN');
  const sw_pin = block.getFieldValue('SW_PIN');
  
  // 添加库引用
  generator.addLibrary('ESP32Encoder', '#include <ESP32Encoder.h>');
  
  // 添加宏定义
  generator.addMacro('CLK_PIN', `#define CLK_PIN ${clk_pin}  // GPIO${clk_pin}`);
  generator.addMacro('DT_PIN', `#define DT_PIN  ${dt_pin}  // GPIO${dt_pin}`);
  generator.addMacro('SW_PIN', `#define SW_PIN  ${sw_pin}  // GPIO${sw_pin}`);
  
  // 添加变量定义
  generator.addVariable('encoder', 'ESP32Encoder encoder;');
  generator.addVariable('rawCount', 'int32_t rawCount = 0;');
  generator.addVariable('lastRawCount', 'int32_t lastRawCount = 0;');
  generator.addVariable('lastPos', 'float lastPos = 0;');
  generator.addVariable('currentPos', 'float currentPos = 0;');
  generator.addVariable('displayPos', 'int displayPos = 0;      // 用于显示的整数值');
  generator.addVariable('increment', 'float increment = 0.5;     // 增量步长，设置更小以提高精度');
  generator.addVariable('upperLimit', 'float upperLimit = 5.0;   // 上限');
  generator.addVariable('lowerLimit', 'float lowerLimit = 0.0;   // 下限');
  generator.addVariable('positionChanged', 'bool positionChanged = false;');
  generator.addVariable('direction', 'int direction = 0;        // 0:无变化, 1:向右, -1:向左');
  generator.addVariable('isAboveLimit', 'bool isAboveLimit = false;');
  generator.addVariable('isBelowLimit', 'bool isBelowLimit = false;');

  // 按键状态变量
  generator.addVariable('buttonPressed', 'bool buttonPressed = false;');
  generator.addVariable('buttonPressedEvent', 'bool buttonPressedEvent = false;');
  generator.addVariable('lastButtonState', 'bool lastButtonState = HIGH;');
  generator.addVariable('lastDebounceTime', 'unsigned long lastDebounceTime = 0;');
  generator.addVariable('debounceDelay', 'const unsigned long debounceDelay = 50;');
  
  // 添加初始化代码
  generator.addSetupBegin('encoder_setup', `encoder.attachHalfQuad(CLK_PIN, DT_PIN);
  pinMode(SW_PIN, INPUT_PULLUP);

  // 设置编码器起始值
  encoder.clearCount();
  
  // 初始化位置
  currentPos = lowerLimit;
  displayPos = lowerLimit;
  rawCount = 0;
  lastRawCount = 0;`);

  // 添加循环检测代码
  generator.addLoopBegin('encoder_check', `
  // 检测编码器状态变化
  // 完全重新设计计数逻辑
  rawCount = encoder.getCount();
  
  // 只有在原始计数发生变化时才处理
  if (rawCount != lastRawCount) {
    // 计算新位置，使用浮点数以保留精度
    lastPos = currentPos;
    currentPos += (rawCount - lastRawCount) * increment;
    lastRawCount = rawCount;
    
    // 判断旋转方向
    if (currentPos > lastPos) {
      direction = 1;  // 向右旋转
    } else if (currentPos < lastPos) {
      direction = -1; // 向左旋转
    }
    
    // 限制位置在上下限之间
    if (currentPos > upperLimit) {
      currentPos = upperLimit;
      isAboveLimit = true;
    } else {
      isAboveLimit = false;
    }
    
    if (currentPos < lowerLimit) {
      currentPos = lowerLimit;
      isBelowLimit = true;
    } else {
      isBelowLimit = false;
    }
    
    // 更新显示位置（四舍五入到整数）
    displayPos = round(currentPos);
    
    positionChanged = true;
  } else {
    positionChanged = false;
  }

  // 检测按键状态
  bool reading = digitalRead(SW_PIN);
  buttonPressedEvent = false;
  if (reading != lastButtonState) {
    lastDebounceTime = millis();
    lastButtonState = reading;
  }
  if (millis() - lastDebounceTime >= debounceDelay) {
    bool pressed = reading == LOW;
    buttonPressedEvent = pressed && !buttonPressed;
    buttonPressed = pressed;
  }`);


  
  return '';
};

Arduino.forBlock['rotary_encoder_read'] = function(block, generator) {
  // 返回编码器值（使用整数显示位置）
  return ['displayPos', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['rotary_encoder_value_changed'] = function(block, generator) {
  // 生成用于检测编码器值变化的代码
  return ['positionChanged', Arduino.ORDER_ATOMIC];
};

// 1. 获取旋转编码器状态并执行操作
Arduino.forBlock['rotary_encoder_state_change'] = function(block, generator) {
  const state = block.getFieldValue('STATE');
  const branch = generator.statementToCode(block, 'DO');
  
  let code = '';
  switch (state) {
    case 'PRESSED':
      code = `if (buttonPressedEvent) {
${branch}  }
`;
      break;
    case 'CHANGED':
      code = `if (positionChanged) {
${branch}  }
`;
      break;
    case 'LEFT':
      code = `if (direction == -1 && positionChanged) {
${branch}  }
`;
      break;
    case 'RIGHT':
      code = `if (direction == 1 && positionChanged) {
${branch}  }
`;
      break;
    case 'ABOVE_LIMIT':
      code = `if (isAboveLimit) {
${branch}  }
`;
      break;
    case 'BELOW_LIMIT':
      code = `if (isBelowLimit) {
${branch}  }
`;
      break;
  }
  
  return code;
};

// 2. 获取旋转编码器属性
Arduino.forBlock['rotary_encoder_get_property'] = function(block, generator) {
  const property = block.getFieldValue('PROPERTY');
  
  let code = '';
  switch (property) {
    case 'BUTTON_HELD':
      code = '(buttonPressed ? 1 : 0)';
      break;
    case 'POSITION':
      code = 'displayPos';  // 使用整数显示位置
      break;
    case 'DIRECTION':
      code = 'direction';
      break;
    case 'INCREMENT':
      code = 'increment';
      break;
    case 'UPPER_LIMIT':
      code = 'upperLimit';
      break;
    case 'LOWER_LIMIT':
      code = 'lowerLimit';
      break;
  }
  
  return [code, Arduino.ORDER_ATOMIC];
};

// 3. 设置旋转编码器属性
Arduino.forBlock['rotary_encoder_set_property'] = function(block, generator) {
  const property = block.getFieldValue('PROPERTY');
  const value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ASSIGNMENT);
  
  let code = '';
  switch (property) {
    case 'POSITION':
      code = `currentPos = ${value};
  displayPos = round(currentPos);
  lastRawCount = 0;
  encoder.clearCount();
`;
      break;
    case 'INCREMENT':
      code = `if (${value} > 0) {
    increment = ${value};
  }
`;
      break;
    case 'UPPER_LIMIT':
      code = `upperLimit = ${value};
`;
      break;
    case 'LOWER_LIMIT':
      code = `lowerLimit = ${value};
`;
      break;
  }
  
  return code;
};

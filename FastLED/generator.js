Arduino.forBlock["fastled_init"] = function (block, generator) {
  const type = block.getFieldValue("TYPE");
  const dataPin = block.getFieldValue("DATA_PIN");
  const numLeds = block.getFieldValue("NUM_LEDS");
  const strip = `leds_${dataPin}`; // 根据引脚号命名变量

  generator.addLibrary("#include <FastLED.h>", "#include <FastLED.h>");
  generator.addVariable(
    `#define NUM_LEDS_${dataPin} ${numLeds}`,
    `#define NUM_LEDS_${dataPin} ${numLeds}`,
  );
  generator.addVariable(
    `#define DATA_PIN_${dataPin} ${dataPin}`,
    `#define DATA_PIN_${dataPin} ${dataPin}`,
  );

  generator.addVariable(
    `CRGB ${strip}[NUM_LEDS_${dataPin}]`,
    `CRGB ${strip}[NUM_LEDS_${dataPin}];`,
  );

  let code = "";

  // 根据不同类型LED选择不同的初始化方法
  if (type === "WS2801") {
    code = `FastLED.addLeds<WS2801, DATA_PIN_${dataPin}, RGB>(${strip}, NUM_LEDS_${dataPin});`;
  } else if (type === "APA102") {
    code = `FastLED.addLeds<APA102, DATA_PIN_${dataPin}, BGR>(${strip}, NUM_LEDS_${dataPin});`;
  } else if (type === "LPD8806") {
    code = `FastLED.addLeds<LPD8806, DATA_PIN_${dataPin}, RGB>(${strip}, NUM_LEDS_${dataPin});`;
  } else if (type === "NEOPIXEL") {
    code = `FastLED.addLeds<NEOPIXEL, DATA_PIN_${dataPin}>(${strip}, NUM_LEDS_${dataPin});`;
  } else if (type === "WS2812") {
    code = `FastLED.addLeds<WS2812, DATA_PIN_${dataPin}, GRB>(${strip}, NUM_LEDS_${dataPin});`;
  } else if (type === "WS2812B") {
    code = `FastLED.addLeds<WS2812B, DATA_PIN_${dataPin}, GRB>(${strip}, NUM_LEDS_${dataPin});`;
  } else if (type === "WS2811") {
    code = `FastLED.addLeds<WS2811, DATA_PIN_${dataPin}, RGB>(${strip}, NUM_LEDS_${dataPin});`;
  } else {
    code = `FastLED.addLeds<${type}, DATA_PIN_${dataPin}, RGB>(${strip}, NUM_LEDS_${dataPin});`;
  }

  // generator.addSetupBegin(`FastLED.init_${strip}`, code + '\n');
  return code + "\n";
};

// 辅助函数：检测后续块中是否有fastled_refresh块
function hasFastLEDRefreshBlock(block) {
  let nextBlock = block.getNextBlock();
  while (nextBlock) {
    if (nextBlock.type === "fastled_refresh") {
      return true;
    }
    nextBlock = nextBlock.getNextBlock();
  }
  return false;
}

Arduino.forBlock["fastled_set_pixel"] = function (block, generator) {
  // 使用引脚特定的变量名
  const dataPin = block.getFieldValue("DATA_PIN");
  const pixel = generator.valueToCode(block, "PIXEL", generator.ORDER_ATOMIC);
  const color = generator.valueToCode(block, "COLOR", generator.ORDER_ATOMIC);

  return `leds_${dataPin}[${pixel}] = ${color};\n`;
};

Arduino.forBlock["fastled_set_range"] = function (block, generator) {
  const dataPin = block.getFieldValue("DATA_PIN");
  const startIndex =
    generator.valueToCode(block, "START", generator.ORDER_ATOMIC) || "0";
  const endIndex =
    generator.valueToCode(block, "END", generator.ORDER_ATOMIC) || startIndex;
  const color =
    generator.valueToCode(block, "COLOR", generator.ORDER_ATOMIC) ||
    "CRGB::Black";
  const loopVar = `_led_idx_${dataPin}`;
  return (
    `for (int ${loopVar} = (int)(${startIndex}); ${loopVar} <= (int)(${endIndex}); ${loopVar}++) {\n` +
    `  if (${loopVar} >= 0 && ${loopVar} < NUM_LEDS_${dataPin}) {\n` +
    `    leds_${dataPin}[${loopVar}] = ${color};\n` +
    `  }\n` +
    `}\n`
  );
};

Arduino.forBlock["fastled_show"] = function (block, generator) {
  return "FastLED.show();\n";
};

Arduino.forBlock["fastled_draw_bar"] = function (block, generator) {
  const dataPin = block.getFieldValue("DATA_PIN");
  const startIndex =
    generator.valueToCode(block, "START", generator.ORDER_ATOMIC) || "0";
  const endIndex =
    generator.valueToCode(block, "END", generator.ORDER_ATOMIC) || startIndex;
  const level =
    generator.valueToCode(block, "LEVEL", generator.ORDER_ATOMIC) || "0";
  const fgColor =
    generator.valueToCode(block, "FOREGROUND", generator.ORDER_ATOMIC) ||
    "CRGB::White";
  const bgColor =
    generator.valueToCode(block, "BACKGROUND", generator.ORDER_ATOMIC) ||
    "CRGB::Black";
  const safeId = (block.id || "bar")
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .replace(/_+/g, "_");
  const loopVar = `_led_bar_${dataPin}_${safeId}`;
  const bandSize = `_band_size_${dataPin}_${safeId}`;
  const active = `_active_${dataPin}_${safeId}`;
  return (
    `int ${bandSize} = (int)(${endIndex}) - (int)(${startIndex}) + 1;\n` +
    `if (${bandSize} < 0) { ${bandSize} = 0; }\n` +
    `int ${active} = constrain((int)(${level}), 0, ${bandSize});\n` +
    `for (int ${loopVar} = 0; ${loopVar} < ${bandSize}; ${loopVar}++) {\n` +
    `  int __idx = (int)(${startIndex}) + ${loopVar};\n` +
    `  if (__idx >= 0 && __idx < NUM_LEDS_${dataPin}) {\n` +
    `    leds_${dataPin}[__idx] = (${loopVar} < ${active}) ? ${fgColor} : ${bgColor};\n` +
    `  }\n` +
    `}\n`
  );
};

Arduino.forBlock["fastled_refresh"] = function (block, generator) {
  return "FastLED.show();\n";
};

Arduino.forBlock["fastled_clear"] = function (block, generator) {
  // 使用引脚特定的变量名
  const dataPin = block.getFieldValue("DATA_PIN");
  return `fill_solid(leds_${dataPin}, NUM_LEDS_${dataPin}, CRGB::Black);\n`;
};

Arduino.forBlock["fastled_brightness"] = function (block, generator) {
  const brightness = generator.valueToCode(
    block,
    "BRIGHTNESS",
    generator.ORDER_ATOMIC,
  );
  let code = `FastLED.setBrightness(${brightness});\n`;
  if (!hasFastLEDRefreshBlock(block)) {
    code += "FastLED.show();\n";
  }
  return code;
};

Arduino.forBlock["fastled_rgb"] = function (block, generator) {
  const red = generator.valueToCode(block, "RED", generator.ORDER_ATOMIC);
  const green = generator.valueToCode(block, "GREEN", generator.ORDER_ATOMIC);
  const blue = generator.valueToCode(block, "BLUE", generator.ORDER_ATOMIC);

  return [`CRGB(${red}, ${green}, ${blue})`, generator.ORDER_ATOMIC];
};

Arduino.forBlock["fastled_preset_color"] = function (block, generator) {
  const color = block.getFieldValue("COLOR");

  // 解析十六进制颜色
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // RGB 转 HSV 算法
  // 这里实现RGB到HSV的转换，注意FastLED使用的HSV范围是0-255
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    v = max;

  const d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // 无色调
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  // 将HSV值调整到FastLED使用的范围
  const hsvH = Math.round(h * 255);
  const hsvS = Math.round(s * 255);
  const hsvV = Math.round(v);

  return [`CHSV(${hsvH}, ${hsvS}, ${hsvV})`, generator.ORDER_ATOMIC];
};

Arduino.forBlock["fastled_fill_solid"] = function (block, generator) {
  // 使用引脚特定的变量名
  const dataPin = block.getFieldValue("DATA_PIN");
  const color = generator.valueToCode(block, "COLOR", generator.ORDER_ATOMIC);

  let code = `fill_solid(leds_${dataPin}, NUM_LEDS_${dataPin}, ${color});\n`;
  if (!hasFastLEDRefreshBlock(block)) {
    code += "FastLED.show();\n";
  }
  return code;
};

Arduino.forBlock["fastled_hsv"] = function (block, generator) {
  const hue = generator.valueToCode(block, "HUE", generator.ORDER_ATOMIC);
  const saturation = generator.valueToCode(
    block,
    "SATURATION",
    generator.ORDER_ATOMIC,
  );
  const value = generator.valueToCode(block, "VALUE", generator.ORDER_ATOMIC);

  return [`CHSV(${hue}, ${saturation}, ${value})`, generator.ORDER_ATOMIC];
};

Arduino.forBlock["fastled_rainbow"] = function (block, generator) {
  // 使用引脚特定的变量名
  const dataPin = block.getFieldValue("DATA_PIN");
  const initialHue = generator.valueToCode(
    block,
    "INITIAL_HUE",
    generator.ORDER_ATOMIC,
  );
  const deltaHue = generator.valueToCode(
    block,
    "DELTA_HUE",
    generator.ORDER_ATOMIC,
  );

  let code = `fill_rainbow(leds_${dataPin}, NUM_LEDS_${dataPin}, ${initialHue}, ${deltaHue});\n`;
  if (!hasFastLEDRefreshBlock(block)) {
    code += "FastLED.show();\n";
  }
  return code;
};

Arduino.forBlock["fastled_fire_effect"] = function (block, generator) {
  // 使用引脚特定的变量名
  const dataPin = block.getFieldValue("DATA_PIN");
  const heat = generator.valueToCode(block, "HEAT", generator.ORDER_ATOMIC);
  const cooling = generator.valueToCode(
    block,
    "COOLING",
    generator.ORDER_ATOMIC,
  );
  // 添加反向参数
  const reverseDirection = false;

  // 添加火焰效果所需变量，为每个引脚创建独立的热量数组
  generator.addVariable(
    `byte heat_${dataPin}[NUM_LEDS_${dataPin}]`,
    `byte heat_${dataPin}[NUM_LEDS_${dataPin}];`,
  );
  // 添加方向控制变量
  generator.addVariable(
    `bool reverseDirection_${dataPin}`,
    `bool reverseDirection_${dataPin} = ${reverseDirection};`,
  );

  // 添加Fire2012函数，修改为支持不同引脚的火焰效果
  const fireFunc = `
// 基于FastLED Fire2012示例的一维火焰动画
// 模拟火焰效果的工作原理:
// 1) 所有单元冷却一点，失去热量到空气中
// 2) 每个单元的热量向上漂移并稍微扩散
// 3) 有时在底部随机添加新的"火花"
// 4) 每个单元的热量渲染为LED颜色，使用黑体辐射近似
void Fire2012_${dataPin}(CRGB* leds, byte heat_value, byte cooling_value) {
  // 冷却系数 - 空气冷却的程度
  int cooling = cooling_value;

  // 火花系数 - 火焰上升速度/强度
  int sparking = heat_value;

  // 步骤 1: 每个LED的热量值冷却
  for(int i = 0; i < NUM_LEDS_${dataPin}; i++) {
    heat_${dataPin}[i] = qsub8(heat_${dataPin}[i], random8(0, ((cooling * 10) / NUM_LEDS_${dataPin}) + 2));
  }

  // 步骤 2: 热量从下向上扩散
  for(int k = NUM_LEDS_${dataPin} - 1; k >= 2; k--) {
    heat_${dataPin}[k] = (heat_${dataPin}[k - 1] + heat_${dataPin}[k - 2] + heat_${dataPin}[k - 2]) / 3;
  }

  // 步骤 3: 底部随机产生新的热量
  if(random8() < sparking) {
    int y = random8(7);
    heat_${dataPin}[y] = qadd8(heat_${dataPin}[y], random8(160, 255));
  }

  // 步骤 4: 将热量映射到LED颜色
  for(int j = 0; j < NUM_LEDS_${dataPin}; j++) {
    CRGB color = HeatColor(heat_${dataPin}[j]);

    // 根据方向设置像素
    int pixelNumber;
    if(reverseDirection_${dataPin}) {
      pixelNumber = (NUM_LEDS_${dataPin} - 1) - j;
    } else {
      pixelNumber = j;
    }
    leds[pixelNumber] = color;
  }
}`;

  generator.addFunction(`Fire2012_${dataPin}`, fireFunc);

  let code = `Fire2012_${dataPin}(leds_${dataPin}, ${heat}, ${cooling});\n`;
  if (!hasFastLEDRefreshBlock(block)) {
    code += "FastLED.show();\n";
  }
  return code;
};

Arduino.forBlock["fastled_meteor"] = function (block, generator) {
  // 使用引脚特定的变量名
  const dataPin = block.getFieldValue("DATA_PIN");
  const color = generator.valueToCode(block, "COLOR", generator.ORDER_ATOMIC);
  const size = generator.valueToCode(block, "SIZE", generator.ORDER_ATOMIC);
  const decay = generator.valueToCode(block, "DECAY", generator.ORDER_ATOMIC);
  const speed = generator.valueToCode(block, "SPEED", generator.ORDER_ATOMIC);

  // 为每个引脚添加独立的流星位置变量
  generator.addVariable(
    `int meteorPosition_${dataPin} = 0`,
    `int meteorPosition_${dataPin} = 0;`,
  );

  // 添加流星效果函数，支持不同引脚
  const meteorFunc = `
void meteorEffect_${dataPin}(CRGB* leds, CRGB color, int meteorSize, byte decay, int speed) {
  // 淡化所有LED
  for(int i = 0; i < NUM_LEDS_${dataPin}; i++) {
    if(random8() < decay) {
      leds[i].fadeToBlackBy(decay);
    }
  }

  // 绘制流星
  for(int i = 0; i < meteorSize; i++) {
    if((meteorPosition_${dataPin} - i < NUM_LEDS_${dataPin}) && (meteorPosition_${dataPin} - i >= 0)) {
      leds[meteorPosition_${dataPin} - i] = color;
      leds[meteorPosition_${dataPin} - i].fadeToBlackBy(i * (255 / meteorSize));
    }
  }

  // 移动流星位置
  meteorPosition_${dataPin} = (meteorPosition_${dataPin} + speed) % (NUM_LEDS_${dataPin} + meteorSize);
}`;

  generator.addFunction(`meteorEffect_${dataPin}`, meteorFunc);

  let code = `meteorEffect_${dataPin}(leds_${dataPin}, ${color}, ${size}, ${decay}, ${speed});\n`;
  if (!hasFastLEDRefreshBlock(block)) {
    code += "FastLED.show();\n";
  }
  return code;
};

Arduino.forBlock["fastled_palette_cycle"] = function (block, generator) {
  // 使用引脚特定的变量名
  const dataPin = block.getFieldValue("DATA_PIN");
  const palette = block.getFieldValue("PALETTE");
  const speed = generator.valueToCode(block, "SPEED", generator.ORDER_ATOMIC);

  // 为每个引脚添加独立的调色板索引变量
  generator.addVariable(
    `uint8_t paletteIndex_${dataPin} = 0`,
    `uint8_t paletteIndex_${dataPin} = 0;`,
  );

  // 添加调色板循环函数
  const paletteFunc = `
void cyclePalette_${dataPin}(CRGB* leds, CRGBPalette16 palette, uint8_t speed, uint8_t& index) {
  for(int i = 0; i < NUM_LEDS_${dataPin}; i++) {
    leds[i] = ColorFromPalette(palette, index + (i * 255 / NUM_LEDS_${dataPin}));
  }
  index += speed;
}`;

  generator.addFunction(`cyclePalette_${dataPin}`, paletteFunc);

  let code = `cyclePalette_${dataPin}(leds_${dataPin}, ${palette}, ${speed}, paletteIndex_${dataPin});\n`;
  if (!hasFastLEDRefreshBlock(block)) {
    code += "FastLED.show();\n";
  }
  return code;
};

Arduino.forBlock["fastled_breathing"] = function (block, generator) {
  // 使用引脚特定的变量名
  const dataPin = block.getFieldValue("DATA_PIN");
  const color = generator.valueToCode(block, "COLOR", generator.ORDER_ATOMIC);
  const speed = generator.valueToCode(block, "SPEED", generator.ORDER_ATOMIC);

  // 为每个引脚添加独立的呼吸灯变量
  generator.addVariable(
    `uint8_t breathBrightness_${dataPin} = 128`,
    `uint8_t breathBrightness_${dataPin} = 128;`,
  );
  generator.addVariable(
    `int8_t breathDirection_${dataPin} = 1`,
    `int8_t breathDirection_${dataPin} = 1;`,
  );

  // 添加呼吸灯效果函数
  const breathFunc = `
void breathingEffect_${dataPin}(CRGB* leds, CRGB color, uint8_t speed, uint8_t& brightness, int8_t& direction) {
  // 填充所有LED为基本颜色
  for(int i = 0; i < NUM_LEDS_${dataPin}; i++) {
    leds[i] = color;
  }

  // 调整亮度
  FastLED.setBrightness(brightness);

  // 更新亮度值和方向
  brightness += direction * speed;

  // 检查边界并改变方向
  if(brightness >= 250 || brightness <= 5) {
    direction = -direction;
  }
}`;

  generator.addFunction(`breathingEffect_${dataPin}`, breathFunc);

  let code = `breathingEffect_${dataPin}(leds_${dataPin}, ${color}, ${speed}, breathBrightness_${dataPin}, breathDirection_${dataPin});\n`;
  if (!hasFastLEDRefreshBlock(block)) {
    code += "FastLED.show();\n";
  }
  return code;
};

Arduino.forBlock["fastled_twinkle"] = function (block, generator) {
  const dataPin = block.getFieldValue("DATA_PIN");
  const count = generator.valueToCode(block, "COUNT", generator.ORDER_ATOMIC);
  const background = generator.valueToCode(
    block,
    "BACKGROUND",
    generator.ORDER_ATOMIC,
  );
  const color = generator.valueToCode(block, "COLOR", generator.ORDER_ATOMIC);

  // 添加闪烁效果函数，使用引脚特定的变量
  const twinkleFunc = `
void twinkleEffect_${dataPin}(CRGB* leds, uint8_t count, CRGB bgColor, CRGB twinkleColor) {
  // 设置背景颜色
  for(int i = 0; i < NUM_LEDS_${dataPin}; i++) {
    leds[i] = bgColor;
  }

  // 随机点亮一些LED
  for(int i = 0; i < count; i++) {
    int pos = random16(NUM_LEDS_${dataPin});
    leds[pos] = twinkleColor;
  }
}`;

  generator.addFunction(`twinkleEffect_${dataPin}`, twinkleFunc);

  let code = `twinkleEffect_${dataPin}(leds_${dataPin}, ${count}, ${background}, ${color});\n`;
  if (!hasFastLEDRefreshBlock(block)) {
    code += "FastLED.show();\n";
  }
  return code;
};

# FastLED

RGB灯带驱动库，支持WS2812B/WS2811/NEOPIXEL等多种RGB灯带控制

## 库信息
- **库名**: @aily-project/lib-fastled
- **版本**: 1.0.1
- **兼容**: Arduino全系列平台，支持3.3V/5V

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `fastled_init` | 语句块 | DATA_PIN(field_dropdown), TYPE(field_dropdown), NUM_LEDS(field_number) | `"fields":{"DATA_PIN":"6","TYPE":"WS2812B","NUM_LEDS":"30"}` | `FastLED.addLeds<WS2812B, 6, GRB>(leds_6, 30);` |
| `fastled_set_pixel` | 语句块 | DATA_PIN(field_dropdown), PIXEL(input_value), COLOR(input_value) | `"fields":{"DATA_PIN":"6"},"inputs":{"PIXEL":{"block":{...}},"COLOR":{"block":{...}}}` | `leds_6[pixel] = color; FastLED.show();` |
| `fastled_set_range` | 语句块 | DATA_PIN(field_dropdown), START(input_value), END(input_value), COLOR(input_value) | `"fields":{"DATA_PIN":"6"},"inputs":{"START":{"block":{...}},"END":{"block":{...}},"COLOR":{"block":{...}}}` | `for(int i=start;i<=end;i++){ leds_6[i]=color; }` |
| `fastled_draw_bar` | 语句块 | DATA_PIN(field_dropdown), START(input_value), END(input_value), LEVEL(input_value), FOREGROUND(input_value), BACKGROUND(input_value) | `{"fields":{"DATA_PIN":"6"},"inputs":{"START":...}}` | `int active = constrain(level, 0, len); for(...) leds = active ? fg : bg;` |
| `fastled_refresh` | 语句块 | - | `{}` | `FastLED.show();` |
| `fastled_show` | 语句块 | 无 | `{}` | `FastLED.show();` |
| `fastled_clear` | 语句块 | DATA_PIN(field_dropdown) | `"fields":{"DATA_PIN":"6"}` | `FastLED.clear(); FastLED.show();` |
| `fastled_brightness` | 语句块 | BRIGHTNESS(input_value) | `"inputs":{"BRIGHTNESS":{"block":{...}}}` | `FastLED.setBrightness(brightness);` |
| `fastled_rgb` | 值块 | RED(input_value), GREEN(input_value), BLUE(input_value) | `"inputs":{"RED":{"block":{...}},"GREEN":{"block":{...}},"BLUE":{"block":{...}}}` | `CRGB(red, green, blue)` |
| `fastled_preset_color` | 值块 | COLOR(field_colour_hsv_sliders) | `"fields":{"COLOR":"#ffffff"}` | `CRGB::White` |
| `fastled_fill_solid` | 语句块 | DATA_PIN(field_dropdown), COLOR(input_value) | `"fields":{"DATA_PIN":"6"},"inputs":{"COLOR":{"block":{...}}}` | `fill_solid(leds_6, NUM_LEDS_6, color);` |
| `fastled_hsv` | 值块 | HUE(input_value), SATURATION(input_value), VALUE(input_value) | `"inputs":{"HUE":{"block":{...}},"SATURATION":{"block":{...}},"VALUE":{"block":{...}}}` | `CHSV(hue, saturation, value)` |
| `fastled_rainbow` | 语句块 | DATA_PIN(field_dropdown), INITIAL_HUE(input_value), DELTA_HUE(input_value) | `"fields":{"DATA_PIN":"6"},"inputs":{"INITIAL_HUE":{"block":{...}},"DELTA_HUE":{"block":{...}}}` | `fill_rainbow(leds_6, NUM_LEDS_6, hue, delta);` |
| `fastled_fire_effect` | 语句块 | DATA_PIN(field_dropdown), HEAT(input_value), COOLING(input_value) | `"fields":{"DATA_PIN":"6"},"inputs":{"HEAT":{"block":{...}},"COOLING":{"block":{...}}}` | `fire_effect(leds_6, heat, cooling);` |
| `fastled_meteor` | 语句块 | DATA_PIN(field_dropdown), COLOR(input_value), SIZE(input_value), DECAY(input_value), SPEED(input_value) | `"fields":{"DATA_PIN":"6"},"inputs":{"COLOR":{"block":{...}},"SIZE":{"block":{...}},"DECAY":{"block":{...}},"SPEED":{"block":{...}}}` | `meteor_rain(leds_6, color, size, decay, speed);` |
| `fastled_palette_cycle` | 语句块 | DATA_PIN(field_dropdown), PALETTE(field_dropdown), SPEED(input_value) | `"fields":{"DATA_PIN":"6","PALETTE":"RainbowColors_p"},"inputs":{"SPEED":{"block":{...}}}` | `palette_cycle(leds_6, RainbowColors_p, speed);` |
| `fastled_breathing` | 语句块 | DATA_PIN(field_dropdown), COLOR(input_value), SPEED(input_value) | `"fields":{"DATA_PIN":"6"},"inputs":{"COLOR":{"block":{...}},"SPEED":{"block":{...}}}` | `breathing_light(leds_6, color, speed);` |
| `fastled_twinkle` | 语句块 | DATA_PIN(field_dropdown), COUNT(input_value), BACKGROUND(input_value), COLOR(input_value) | `"fields":{"DATA_PIN":"6"},"inputs":{"COUNT":{"block":{...}},"BACKGROUND":{"block":{...}},"COLOR":{"block":{...}}}` | `twinkle_random(leds_6, count, bg, color);` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown | 字符串 | `"DATA_PIN": "6"` |
| field_number | 数值字符串 | `"NUM_LEDS": "30"` |
| field_colour_hsv_sliders | 颜色字符串 | `"COLOR": "#ffffff"` |
| input_value | 块连接 | `"inputs": {"PIXEL": {"block": {...}}}` |

## 连接规则

- **语句块**: fastled_init等有previousStatement/nextStatement，通过`next`字段连接
- **值块**: fastled_rgb、fastled_hsv、fastled_preset_color有output，连接到`inputs`中
- **特殊规则**: 
  - 每个引脚对应独立的LED数组变量(leds_引脚号)
  - fastled_init必须在使用LED前调用，会自动创建对应变量
  - 颜色块返回CRGB或CHSV类型，用于颜色设置
  - 特效块自动调用FastLED.show()更新显示

## 使用示例

### RGB灯带初始化
```json
{
  "type": "fastled_init",
  "id": "led_setup",
  "fields": {
    "DATA_PIN": "6",
    "TYPE": "WS2812B", 
    "NUM_LEDS": "30"
  }
}
```

### 设置单个LED颜色
```json
{
  "type": "fastled_set_pixel",
  "id": "set_led",
  "fields": {"DATA_PIN": "6"},
  "inputs": {
    "PIXEL": {"block": {"type": "math_number", "fields": {"NUM": "0"}}},
    "COLOR": {
      "block": {
        "type": "fastled_rgb",
        "inputs": {
          "RED": {"block": {"type": "math_number", "fields": {"NUM": "255"}}},
          "GREEN": {"block": {"type": "math_number", "fields": {"NUM": "0"}}},
          "BLUE": {"block": {"type": "math_number", "fields": {"NUM": "0"}}}
        }
      }
    }
  }
}
```

### 彩虹效果
```json
{
  "type": "fastled_rainbow",
  "id": "rainbow_effect",
  "fields": {"DATA_PIN": "6"},
  "inputs": {
    "INITIAL_HUE": {"block": {"type": "math_number", "fields": {"NUM": "0"}}},
    "DELTA_HUE": {"block": {"type": "math_number", "fields": {"NUM": "7"}}}
  }
}
```

## 重要规则

1. **必须遵守**: 使用LED前必须先调用fastled_init初始化对应引脚的LED灯带
2. **连接限制**: fastled_init是语句块必须在setup中调用，颜色块是值块用于颜色表达式
3. **引脚管理**: 每个引脚支持独立的LED灯带，变量名自动生成为leds_引脚号
4. **颜色格式**: 支持RGB(0-255)和HSV(H:0-255, S:0-255, V:0-255)两种颜色模式
5. **常见错误**: ❌ 未初始化直接使用LED，❌ 颜色值超出0-255范围，❌ LED序号超出初始化数量

## 支持的字段选项
- **TYPE(LED类型)**: "WS2812B", "WS2812", "WS2811", "NEOPIXEL", "WS2801", "LPD8806", "APA102"
- **DATA_PIN(数据引脚)**: 动态生成，支持所有数字引脚
- **PALETTE(调色板)**: "RainbowColors_p", "LavaColors_p", "CloudColors_p", "OceanColors_p", "ForestColors_p", "PartyColors_p", "HeatColors_p"
- **NUM_LEDS(LED数量)**: 1-1000（建议根据电源能力合理选择）

## 技术规格
- **支持LED类型**: WS2812B/WS2812/WS2811(常用), NEOPIXEL(兼容), WS2801/APA102(时钟信号), LPD8806(高速)
- **最大LED数量**: 理论1000个，实际受内存和电源限制
- **颜色深度**: 24位RGB，每通道0-255
- **更新频率**: 取决于LED数量，30个LED约30kHz
- **功耗计算**: 每个LED最大60mA(全白)，需考虑电源容量

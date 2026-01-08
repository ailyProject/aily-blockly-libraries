# TFT_eSPI 图形库

Arduino TFT显示屏图形库，支持多种显示控制器的绘图和文本功能。

## 库信息
- **库名**: @aily-project/lib-tft-espi
- **版本**: 2.5.43
- **兼容**: ESP32、ESP8266、RP2040、STM32等32位处理器

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `tftespi_setup` | 语句块 | VAR(field_input), MODEL(dropdown), FREQUENCY(dropdown), WIDTH/HEIGHT/MISO/MOSI/SCLK/CS/DC/RST/BL(input), BL_LEVEL(dropdown) | `"VAR":"tft","MODEL":"ILI9341_DRIVER","FREQUENCY":"40000000","BL_LEVEL":"HIGH"` | `TFT_eSPI tft = TFT_eSPI(); tft.init();` |
| `tftespi_fill_screen` | 语句块 | VAR(field_variable:TFT_eSPI), COLOR(input) | `"VAR":{"id":"var_id"}` | `tft.fillScreen(color);` |
| `tftespi_draw_pixel` | 语句块 | VAR(field_variable:TFT_eSPI), X/Y/COLOR(input) | - | `tft.drawPixel(x,y,color);` |
| `tftespi_draw_line` | 语句块 | VAR(field_variable:TFT_eSPI), X1/Y1/X2/Y2/COLOR(input) | - | `tft.drawLine(x1,y1,x2,y2,color);` |
| `tftespi_draw_rect` | 语句块 | VAR(field_variable:TFT_eSPI), X/Y/W/H/COLOR(input) | - | `tft.drawRect(x,y,w,h,color);` |
| `tftespi_fill_rect` | 语句块 | VAR(field_variable:TFT_eSPI), X/Y/W/H/COLOR(input) | - | `tft.fillRect(x,y,w,h,color);` |
| `tftespi_draw_circle` | 语句块 | VAR(field_variable:TFT_eSPI), X/Y/RADIUS/COLOR(input) | - | `tft.drawCircle(x,y,r,color);` |
| `tftespi_fill_circle` | 语句块 | VAR(field_variable:TFT_eSPI), X/Y/RADIUS/COLOR(input) | - | `tft.fillCircle(x,y,r,color);` |
| `tftespi_draw_triangle` | 语句块 | VAR(field_variable:TFT_eSPI), X1/Y1/X2/Y2/X3/Y3/COLOR(input) | - | `tft.drawTriangle(...);` |
| `tftespi_fill_triangle` | 语句块 | VAR(field_variable:TFT_eSPI), X1/Y1/X2/Y2/X3/Y3/COLOR(input) | - | `tft.fillTriangle(...);` |
| `tftespi_draw_string` | 语句块 | VAR(field_variable:TFT_eSPI), X/Y/TEXT(input) | - | `tft.drawString(text,x,y);` |
| `tftespi_set_text_color` | 语句块 | VAR(field_variable:TFT_eSPI), COLOR(input) | - | `tft.setTextColor(color);` |
| `tftespi_set_text_size` | 语句块 | VAR(field_variable:TFT_eSPI), SIZE(dropdown) | `"SIZE":"1"` | `tft.setTextSize(1);` |
| `tftespi_set_text_font` | 语句块 | VAR(field_variable:TFT_eSPI), FONT(dropdown) | `"FONT":"1"` | `tft.setTextFont(1);` |
| `tftespi_color` | 值块 | COLOR(dropdown) | `"COLOR":"TFT_WHITE"` | `TFT_WHITE` |
| `tftespi_color_rgb565` | 值块 | VAR(field_variable:TFT_eSPI), COLOR(field_colour_hsv_sliders) | `"COLOR":"#ffffff"` | `tft.color565(r,g,b)` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "tft"` |
| field_dropdown | 字符串 | `"MODEL": "ILI9341_DRIVER"` |
| field_variable | 对象 | `"VAR": {"id": "var_id"}` |
| field_colour_hsv_sliders | 字符串 | `"COLOR": "#ffffff"` |
| input_value | 块连接 | `"inputs": {"X": {"block": {...}}}` |

### 字段选项

**MODEL**: `ILI9341_DRIVER`, `ILI9341_2_DRIVER`, `ST7735_DRIVER`, `ILI9163_DRIVER`, `S6D02A1_DRIVER`, `RPI_ILI9486_DRIVER`, `HX8357D_DRIVER`, `ILI9481_DRIVER`, `ILI9486_DRIVER`, `ILI9488_DRIVER`, `ST7789_DRIVER`, `ST7789_2_DRIVER`, `R61581_DRIVER`, `RM68140_DRIVER`, `ST7796_DRIVER`, `SSD1351_DRIVER`, `SSD1963_480_DRIVER`, `SSD1963_800_DRIVER`, `SSD1963_800ALT_DRIVER`, `ILI9225_DRIVER`, `GC9A01_DRIVER`, `GC9D01_DRIVER`

**FREQUENCY**: `10000000`(10MHz), `20000000`(20MHz), `27000000`(27MHz), `40000000`(40MHz), `55000000`(55MHz), `80000000`(80MHz)

**BL_LEVEL**: `HIGH`(高电平点亮), `LOW`(低电平点亮)

**SIZE**: `1`-`7`

**FONT**: `1`(GLCD), `2`(Font2), `4`(Font4), `6`(Font6), `7`(Font7), `8`(Font8)

**COLOR**: `TFT_BLACK`, `TFT_WHITE`, `TFT_RED`, `TFT_GREEN`, `TFT_BLUE`, `TFT_YELLOW`, `TFT_CYAN`, `TFT_MAGENTA`, `TFT_ORANGE`, `TFT_LIGHTGREY`, `TFT_DARKGREY`

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **变量类型**: tftespi_setup使用field_input创建TFT_eSPI类型变量，其他块使用field_variable(variableTypes:TFT_eSPI)引用
- **颜色输入**: 可连接tftespi_color或tftespi_color_rgb565值块
- **shadow块**: toolbox中的input使用shadow定义默认值

## 使用示例

### 初始化屏幕(完整配置)
```json
{
  "type": "tftespi_setup",
  "id": "setup1",
  "fields": {
    "VAR": "tft",
    "MODEL": "ST7789_DRIVER",
    "FREQUENCY": "40000000",
    "BL_LEVEL": "HIGH"
  },
  "inputs": {
    "WIDTH": {"shadow": {"type": "math_number", "fields": {"NUM": 240}}},
    "HEIGHT": {"shadow": {"type": "math_number", "fields": {"NUM": 320}}},
    "MISO": {"shadow": {"type": "math_number", "fields": {"NUM": -1}}},
    "MOSI": {"shadow": {"type": "math_number", "fields": {"NUM": 23}}},
    "SCLK": {"shadow": {"type": "math_number", "fields": {"NUM": 18}}},
    "CS": {"shadow": {"type": "math_number", "fields": {"NUM": 5}}},
    "DC": {"shadow": {"type": "math_number", "fields": {"NUM": 16}}},
    "RST": {"shadow": {"type": "math_number", "fields": {"NUM": 17}}},
    "BL": {"shadow": {"type": "math_number", "fields": {"NUM": 4}}}
  }
}
```
生成: `TFT_eSPI tft = TFT_eSPI(); tft.init();` (同时设置编译宏)

### 填充屏幕颜色
```json
{
  "type": "tftespi_fill_screen",
  "id": "fill1",
  "fields": {"VAR": {"id": "tft_var_id"}},
  "inputs": {
    "COLOR": {"shadow": {"type": "tftespi_color", "fields": {"COLOR": "TFT_BLACK"}}}
  }
}
```
生成: `tft.fillScreen(TFT_BLACK);`

### 绘制填充圆
```json
{
  "type": "tftespi_fill_circle",
  "id": "circle1",
  "fields": {"VAR": {"id": "tft_var_id"}},
  "inputs": {
    "X": {"shadow": {"type": "math_number", "fields": {"NUM": 160}}},
    "Y": {"shadow": {"type": "math_number", "fields": {"NUM": 120}}},
    "RADIUS": {"shadow": {"type": "math_number", "fields": {"NUM": 50}}},
    "COLOR": {"shadow": {"type": "tftespi_color", "fields": {"COLOR": "TFT_RED"}}}
  }
}
```
生成: `tft.fillCircle(160, 120, 50, TFT_RED);`

### 自定义颜色(颜色选择器)
```json
{
  "type": "tftespi_color_rgb565",
  "id": "rgb1",
  "fields": {
    "VAR": {"id": "tft_var_id"},
    "COLOR": "#ff8000"
  }
}
```
生成: `tft.color565(255, 128, 0)`

### 显示文字
```json
{
  "type": "tftespi_draw_string",
  "id": "str1",
  "fields": {"VAR": {"id": "tft_var_id"}},
  "inputs": {
    "X": {"shadow": {"type": "math_number", "fields": {"NUM": 10}}},
    "Y": {"shadow": {"type": "math_number", "fields": {"NUM": 10}}},
    "TEXT": {"shadow": {"type": "text", "fields": {"TEXT": "Hello"}}}
  }
}
```
生成: `tft.drawString("Hello", 10, 10);`

### 完整程序示例
```json
{
  "type": "tftespi_setup",
  "id": "s1",
  "fields": {"VAR": "tft", "MODEL": "ST7789_DRIVER", "FREQUENCY": "40000000", "BL_LEVEL": "HIGH"},
  "inputs": {
    "WIDTH": {"shadow": {"type": "math_number", "fields": {"NUM": 240}}},
    "HEIGHT": {"shadow": {"type": "math_number", "fields": {"NUM": 320}}},
    "MISO": {"shadow": {"type": "math_number", "fields": {"NUM": -1}}},
    "MOSI": {"shadow": {"type": "math_number", "fields": {"NUM": -1}}},
    "SCLK": {"shadow": {"type": "math_number", "fields": {"NUM": -1}}},
    "CS": {"shadow": {"type": "math_number", "fields": {"NUM": -1}}},
    "DC": {"shadow": {"type": "math_number", "fields": {"NUM": -1}}},
    "RST": {"shadow": {"type": "math_number", "fields": {"NUM": -1}}},
    "BL": {"shadow": {"type": "math_number", "fields": {"NUM": -1}}}
  },
  "next": {
    "block": {
      "type": "tftespi_fill_screen",
      "id": "s2",
      "fields": {"VAR": {"id": "tft_var_id"}},
      "inputs": {"COLOR": {"shadow": {"type": "tftespi_color", "fields": {"COLOR": "TFT_BLACK"}}}},
      "next": {
        "block": {
          "type": "tftespi_set_text_color",
          "id": "s3",
          "fields": {"VAR": {"id": "tft_var_id"}},
          "inputs": {"COLOR": {"shadow": {"type": "tftespi_color", "fields": {"COLOR": "TFT_WHITE"}}}},
          "next": {
            "block": {
              "type": "tftespi_draw_string",
              "id": "s4",
              "fields": {"VAR": {"id": "tft_var_id"}},
              "inputs": {
                "X": {"shadow": {"type": "math_number", "fields": {"NUM": 10}}},
                "Y": {"shadow": {"type": "math_number", "fields": {"NUM": 10}}},
                "TEXT": {"shadow": {"type": "text", "fields": {"TEXT": "Hello TFT!"}}}
              }
            }
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **初始化顺序**: 必须先使用tftespi_setup创建TFT对象才能调用其他绘图块
2. **变量类型**: VAR字段使用variableTypes限定为TFT_eSPI类型，确保类型安全
3. **引脚配置**: setup块中的引脚值-1表示使用默认引脚(由编译宏定义)
4. **编译宏**: setup块会自动添加TFT驱动相关的编译宏(MODEL、WIDTH、HEIGHT等)
5. **颜色格式**: tftespi_color返回预定义常量，tftespi_color_rgb565使用颜色选择器转换为RGB565
6. **必须唯一**: 所有块ID和变量ID必须唯一

## 支持的显示控制器

ILI9341, ILI9341_2, ST7735, ILI9163, S6D02A1, RPI_ILI9486, HX8357D, ILI9481, ILI9486, ILI9488, ST7789, ST7789_2, R61581, RM68140, ST7796, SSD1351, SSD1963_480, SSD1963_800, SSD1963_800ALT, ILI9225, GC9A01, GC9D01

---
*自包含文档，无需外部规范*

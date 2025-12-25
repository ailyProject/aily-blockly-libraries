# TFT_eSPI

TFT_eSPI - Arduino库，支持多种TFT显示屏的图形和字体库

## 库信息
- **库名**: @aily-project/lib-tft-espi
- **版本**: 2.5.43
- **兼容**: 支持ESP32、ESP8266、RP2040、STM32等32位处理器

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `tftespi_setup` | 语句块 | VAR(field_input) | `{"VAR":"tft"}` | `TFT_eSPI tft;\ntft.init();` |
| `tftespi_fill_screen` | 语句块 | VAR(field_variable), COLOR(input_value) | `{"VAR":{"id":"var_id"},"inputs":{"COLOR":{"block":{...}}}}` | `tft.fillScreen(color);` |
| `tftespi_draw_pixel` | 语句块 | VAR(field_variable), X(input_value), Y(input_value), COLOR(input_value) | `{"VAR":{"id":"var_id"},"inputs":{"X":{"block":{...},"Y":{"block":{...},"COLOR":{"block":{...}}}}` | `tft.drawPixel(x, y, color);` |
| `tftespi_draw_line` | 语句块 | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), COLOR(input_value) | - | `tft.drawLine(x1, y1, x2, y2, color);` |
| `tftespi_draw_rect` | 语句块 | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value) | - | `tft.drawRect(x, y, w, h, color);` |
| `tftespi_fill_rect` | 语句块 | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value) | - | `tft.fillRect(x, y, w, h, color);` |
| `tftespi_draw_circle` | 语句块 | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_value) | - | `tft.drawCircle(x, y, radius, color);` |
| `tftespi_fill_circle` | 语句块 | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_value) | - | `tft.fillCircle(x, y, radius, color);` |
| `tftespi_draw_triangle` | 语句块 | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), X3(input_value), Y3(input_value), COLOR(input_value) | - | `tft.drawTriangle(x1, y1, x2, y2, x3, y3, color);` |
| `tftespi_fill_triangle` | 语句块 | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), X3(input_value), Y3(input_value), COLOR(input_value) | - | `tft.fillTriangle(x1, y1, x2, y2, x3, y3, color);` |
| `tftespi_draw_string` | 语句块 | VAR(field_variable), X(input_value), Y(input_value), TEXT(input_value) | - | `tft.drawString(text, x, y);` |
| `tftespi_set_text_color` | 语句块 | VAR(field_variable), COLOR(input_value) | - | `tft.setTextColor(color);` |
| `tftespi_set_text_size` | 语句块 | VAR(field_variable), SIZE(input_value) | - | `tft.setTextSize(size);` |
| `tftespi_set_text_font` | 语句块 | VAR(field_variable), FONT(field_dropdown) | `{"VAR":{"id":"var_id"},"FONT":"1"}` | `tft.setTextFont(font);` |
| `tftespi_color` | 值块 | COLOR(field_dropdown) | `{"COLOR":"TFT_WHITE"}` | `TFT_WHITE` |
| `tftespi_color_rgb565` | 值块 | RED(input_value), GREEN(input_value), BLUE(input_value) | - | `tft.color565(r, g, b)` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "value"` |
| field_dropdown | 字符串 | `"FONT": "1"` |
| field_variable | 对象 | `"VAR": {"id": "var_id"}` |
| input_value | 块连接 | `"inputs": {"X": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **变量字段**: tftespi_setup使用field_input创建变量，其他块使用field_variable引用已创建的变量
- **颜色块**: tftespi_color和tftespi_color_rgb565是值块，需要连接到COLOR输入

## 使用示例

### 初始化和基本绘图
```json
{
  "type": "tftespi_setup",
  "id": "setup_id",
  "fields": {"VAR": "tft"},
  "next": {
    "block": {
      "type": "tftespi_fill_screen",
      "inputs": {
        "VAR": {"block": {"type": "variables_get", "fields": {"VAR": "tft"}}},
        "COLOR": {"block": {"type": "tftespi_color", "fields": {"COLOR": "TFT_BLACK"}}}
      },
      "next": {
        "block": {
          "type": "tftespi_draw_circle",
          "inputs": {
            "VAR": {"block": {"type": "variables_get", "fields": {"VAR": "tft"}}},
            "X": {"block": {"type": "math_number", "fields": {"NUM": "160"}}},
            "Y": {"block": {"type": "math_number", "fields": {"NUM": "120"}}},
            "RADIUS": {"block": {"type": "math_number", "fields": {"NUM": "50"}}},
            "COLOR": {"block": {"type": "tftespi_color", "fields": {"COLOR": "TFT_RED"}}}
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: 必须先创建TFT对象才能使用其他块
2. **连接限制**: 颜色输入需要连接tftespi_color或tftespi_color_rgb565块
3. **常见错误**: ❌ 在创建TFT对象前使用其他块会导致变量未定义错误

## 支持的显示控制器

TFT_eSPI支持多种显示控制器：
- ILI9341、ILI9342
- ST7735、ST7789、ST7796
- ILI9481、ILI9486、ILI9488
- HX8357B、HX8357C、HX8357D
- GC9A01
- SSD1351
- RM68120、RM68140
- 等更多控制器

**注意**: 使用TFT_eSPI库前，需要在User_Setup.h中配置正确的显示屏驱动和引脚定义。

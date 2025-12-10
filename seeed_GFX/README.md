# Seeed GFX

## 库信息
- **库名**: `@aily-project/lib-seeed-gfx`
- **兼容**: Arduino / ESP32 / ESP8266

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi 格式示例 | 生成代码（简要） |
|---|---:|---|---|---|
| `seeed_gfx_init` | 语句块 | `MODEL` (field_dropdown) | `"fields":{"MODEL":"501"}` | 注入宏 `BOARD_SCREEN_COMBO`、头文件，返回 `tft.init();`（并尝试同步 IDE 宏） |
| `seeed_gfx_fill_screen` | 语句块 | `COLOR` (input_value) | `"inputs":{"COLOR":{...}}` | `tft.fillScreen(color);` |
| `seeed_gfx_set_rotation` | 语句块 | `ROTATION` (field_angle) | `"fields":{"ROTATION":"90"}` | `tft.setRotation(angle);` |
| `seeed_gfx_draw_pixel` | 语句块 | `X`,`Y`,`COLOR` (input_value) | `"inputs":{"X":{...}}` | `tft.drawPixel(x,y,color);` |
| `seeed_gfx_draw_line` | 语句块 | `X1`,`Y1`,`X2`,`Y2`,`COLOR` | - | `tft.drawLine(x1,y1,x2,y2,color);` |
| `seeed_gfx_draw_rect` | 语句块 | `X`,`Y`,`WIDTH`,`HEIGHT`,`COLOR` | - | `tft.drawRect(x,y,w,h,color);` |
| `seeed_gfx_fill_rect` | 语句块 | `X`,`Y`,`WIDTH`,`HEIGHT`,`COLOR` | - | `tft.fillRect(x,y,w,h,color);` |
| `seeed_gfx_draw_round_rect` | 语句块 | `X`,`Y`,`WIDTH`,`HEIGHT`,`RADIUS`,`COLOR` | - | `tft.drawRoundRect(...)` |
| `seeed_gfx_fill_round_rect` | 语句块 | `X`,`Y`,`WIDTH`,`HEIGHT`,`RADIUS`,`COLOR` | - | `tft.fillRoundRect(...)` |
| `seeed_gfx_draw_circle` | 语句块 | `X`,`Y`,`RADIUS`,`COLOR` | - | `tft.drawCircle(x,y,r,color);` |
| `seeed_gfx_fill_circle` | 语句块 | `X`,`Y`,`RADIUS`,`COLOR` | - | `tft.fillCircle(x,y,r,color);` |
| `seeed_gfx_set_text_color` | 语句块 | `COLOR`,`BGCOLOR` | - | `tft.setTextColor(color,bg);` |
| `seeed_gfx_set_text_size` | 语句块 | `SIZE` (dropdown) | `"fields":{"SIZE":"2"}` | `tft.setTextSize(size);` |
| `seeed_gfx_set_cursor` | 语句块 | `X`,`Y` | - | `tft.setCursor(x,y);` |
| `seeed_gfx_print` | 语句块 | `TEXT` (input_value) | - | `tft.print(text);` |
| `seeed_gfx_draw_string` | 语句块 | `TEXT`,`X`,`Y`,`FONT` | `"fields":{"FONT":"2"}` | `tft.drawString(text,x,y,font);` |
| `seeed_gfx_rgb565` | 值块 | `COLOR` (field_colour_hsv_sliders) | `"fields":{"COLOR":"#rrggbb"}` | 生成 `tft.color565(r,g,b)` 表达式（Number） |

## 字段类型映射

| 类型 | .abi 格式 | 示例 |
|---|---|---|
| field_input | 字符串 | `"VAR":"tft"` |
| field_dropdown | 字符串 | `"MODEL":"Seeed_XIAO_Round_Display_501"` |
| field_angle / field_dropdown(数值) | 字符串/数字 | `"ROTATION":"90"` |
| field_colour_hsv_sliders | 字符串（#rrggbb） | `"COLOR":"#ff0000"` |
| input_value | 嵌套块 | `"inputs":{"X":{"block":{...}}}` |

## 连接规则（简要）

- 语句块通过 `previousStatement`/`nextStatement` 链接（使用 JSON 的 `next` 字段表示）。
- 值块（有 output）用于表达式输入，通过 `inputs` 嵌套块连接。
- 若块包含变量选择（field_variable），.abi 中应使用对象格式 `"VAR": {"id":"var_id"}` 或直接使用 `"VAR":"tft"` 视生成器期望而定。

## 使用示例（.abi/JSON 片段）

创建并初始化 TFT：

```json
{ "type": "seeed_gfx_init", "fields": { "MODEL": "Seeed_XIAO_Round_Display_501" } }
```

绘制圆形：

```json
{
  "type": "seeed_gfx_draw_circle",
  "inputs": {
    "X": { "block": { "type": "math_number", "fields": { "NUM": "120" } } },
    "Y": { "block": { "type": "math_number", "fields": { "NUM": "160" } } },
    "RADIUS": { "block": { "type": "math_number", "fields": { "NUM": "50" } } },
    "COLOR": { "block": { "type": "seeed_gfx_rgb565", "fields": { "COLOR": "#ff0000" } } }
  }
}
```

## 重要规则

1. 创建对象后必须先调用 `seeed_gfx_init` 初始化再使用绘图块。
2. `seeed_gfx_rgb565` 返回表达式依赖 `TFT_eSPI` 的 `color565` 方法，生成器环境需包含 `TFT_eSPI`。
3. 若要在 IDE 层面同步宏，请确保 `window.projectService` 可用并支持 `addMacro` / `removeMacro`。

## 支持的屏幕型号及对应MODEL
- Seeed_Wio_Terminal: 500
- Seeed_XIAO_Round_Display: 501
- Seeed_XIAO_EPaper_7inch5: 502
- Seeed_XIAO_EPaper_5inch83: 503
- Seeed_XIAO_EPaper_2inch9: 504
- Seeed_XIAO_EPaper_1inch54: 505
- Seeed_XIAO_EPaper_4inch26: 506
- Seeed_XIAO_EPaper_4inch2: 507
- Seeed_XIAO_EPaper_2inch13: 508
- Seeed_XIAO_EPaper_7inch3_colorful: 509
- Seeed_XIAO_EPaper_13inch3_colorful: 510
- Seeed_XIAO_EPaper_10inch3: 511
- Seeed_XIAO_EPaper_2inch9_BWRY: 512
- Seeed_XIAO_EPaper_2inch13_BWRY: 513
- Seeed_reTerminal_E1001: 520
- Seeed_reTerminal_E1002: 521
- Seeed_reTerminal_E1003: 522
- Seeed_reTerminal_E1004: 523
- Seeed_XIAO_ILI9341: 666

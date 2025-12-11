# Seeed GFX

Seeed GFX TFT / EPaper 显示相关的 Blockly 库说明

## 库信息
- **库名**: `@aily-project/lib-seeed-gfx`
- **兼容**: Arduino / ESP32 / ESP8266

## 块定义（摘要表格）
| 块类型 | 连接 | 字段/输入 | .abi 格式 | 生成代码 |
|---|---:|---|---|---|
| `seeed_gfx_init` | 语句块 | `VAR`(field_input), `MODEL`(field_dropdown) | `"fields":{"VAR":"tft","MODEL":"501"}` | 注入宏 `BOARD_SCREEN_COMBO=<MODEL>`，`tft.init();` |
| `seeed_gfx_fill_screen` | 语句块 | `VAR`(field_variable), `COLOR`(input_value/seeed_gfx_color) | `"fields":{"VAR":{"id":"..."}},"inputs":{"COLOR":{...}}` | `gfx.fillScreen(color);` |
| `seeed_gfx_set_rotation` | 语句块 | `VAR`(field_variable), `ROTATION`(field_angle) | `"fields":{"ROTATION":"90"}` | `gfx.setRotation(angle);` |
| `seeed_gfx_draw_pixel` | 语句块 | `VAR`,`X`,`Y`,`COLOR`(input_value) | - | `gfx.drawPixel(x,y,color);` |
| `seeed_gfx_draw_line` | 语句块 | `VAR`,`X1`,`Y1`,`X2`,`Y2`,`COLOR` | - | `gfx.drawLine(x1,y1,x2,y2,color);` |
| `seeed_gfx_draw_rect` | 语句块 | `VAR`,`X`,`Y`,`WIDTH`,`HEIGHT`,`COLOR` | - | `gfx.drawRect(x,y,w,h,color);` |
| `seeed_gfx_fill_rect` | 语句块 | `VAR`,`X`,`Y`,`WIDTH`,`HEIGHT`,`COLOR` | - | `gfx.fillRect(x,y,w,h,color);` |
| `seeed_gfx_draw_round_rect` | 语句块 | `VAR`,`X`,`Y`,`WIDTH`,`HEIGHT`,`RADIUS`,`COLOR` | - | `gfx.drawRoundRect(...)` |
| `seeed_gfx_fill_round_rect` | 语句块 | `VAR`,`X`,`Y`,`WIDTH`,`HEIGHT`,`RADIUS`,`COLOR` | - | `gfx.fillRoundRect(...)` |
| `seeed_gfx_draw_circle` | 语句块 | `VAR`,`X`,`Y`,`RADIUS`,`COLOR` | - | `gfx.drawCircle(x,y,r,color);` |
| `seeed_gfx_fill_circle` | 语句块 | `VAR`,`X`,`Y`,`RADIUS`,`COLOR` | - | `gfx.fillCircle(x,y,r,color);` |
| `seeed_gfx_set_text_color` | 语句块 | `VAR`,`COLOR`,`BGCOLOR` | - | `gfx.setTextColor(color,bg);` |
| `seeed_gfx_set_text_size` | 语句块 | `VAR`,`SIZE`(field_dropdown) | `"fields":{"SIZE":"2"}` | `gfx.setTextSize(size);` |
| `seeed_gfx_set_cursor` | 语句块 | `VAR`,`X`,`Y` | - | `gfx.setCursor(x,y);` |
| `seeed_gfx_print` | 语句块 | `VAR`,`TEXT`(input_value) | - | `gfx.print(text);` |
| `seeed_gfx_draw_string` | 语句块 | `VAR`,`TEXT`,`X`,`Y`,`FONT`(field_dropdown) | `"fields":{"FONT":"2"}` | `gfx.drawString(text,x,y,font);` |
| `seeed_gfx_epaper_begin` | 语句块 | `VAR`(field_input),`MODEL`(field_dropdown) | `"fields":{"MODEL":"502"}` | 注入 `BOARD_SCREEN_COMBO=<MODEL>`，若 MODEL==502 额外注入 `USE_XIAO_EPAPER_DISPLAY_BOARD_EE04`，声明 `EPaper <VAR>;` 返回 `epaper.begin();` |
| `seeed_gfx_epaper_update/sleep/wake` | 语句块 | `VAR`(field_variable) | - | `epaper.update()/sleep()/wake()` |
| `seeed_gfx_color` | 值块 | `COLOR`(field_dropdown) | `"fields":{"COLOR":"TFT_RED"}` | 返回颜色宏数值（Number） |
| `seeed_gfx_rgb565` | 值块 | `VAR`,`COLOR`(field_input hex `#rrggbb`) | `"fields":{"COLOR":"#rrggbb"}` | 生成 `tft.color565(r,g,b)` 表达式（Number） |

## 字段类型映射
| 类型 | .abi 格式 | 说明 |
|---|---|---|
| `field_input` | 字符串 | 直接写入字段值，如 `"VAR":"tft"` |
| `field_variable` | 对象或字符串 | 推荐 `{"id":"var_id"}` 以保证唯一性，或按 generator 要求使用变量名字符串 |
| `field_dropdown` | 字符串 | 下拉 value 在 `block.json` 中定义（MODEL / COLOR / FONT / SIZE 等） |
| `field_angle` | 数字/字符串 | 角度值，如 `"ROTATION":"90"` |
| `input_value` | 嵌套 block 对象 | `"inputs":{"X":{"block":{...}}}` |

## 连接规则与生成器行为（关键）
- 语句块使用 `previousStatement`/`nextStatement`，在 `.abi` 中通过 `next` 字段表示链式连接。
- 值块有 `output`，作为表达式嵌入 `inputs`，无 `next` 字段。

## 使用示例
### 初始化并打印
```json
{ "type": "seeed_gfx_init", "fields": { "VAR": "tft", "MODEL": "501" } }
```

### 绘制红色圆（使用 rgb565）
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
1. 必须先执行 `seeed_gfx_init` 或 `seeed_gfx_epaper_begin` 再使用绘图/墨水屏块。
2. `seeed_gfx_rgb565` 生成器依赖 `TFT_eSPI::color565`，生成环境需包含 `TFT_eSPI`。
3. 块 ID 与变量 ID 必须唯一，避免在 `.abi` 中冲突。

## 支持的屏幕型号
- TFT: `Seeed_Wio_Terminal` (500), `Seeed_XIAO_Round_Display` (501), `Seeed_XIAO_ILI9341` (666)
- EPaper: `Seeed_XIAO_EPaper_7inch5` (502), `Seeed_reTerminal_E1001` (520), `Seeed_reTerminal_E1002` (521), `Seeed_reTerminal_E1003` (522), `Seeed_reTerminal_E1004` (523)


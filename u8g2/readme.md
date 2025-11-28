# u8g2

单色显示屏驱动库（基于 U8g2 / U8x8），支持常见 OLED/LCD 驱动芯片。

## 库信息
- **库名**: @aily-project/lib-u8g2
- **昵称**: 单色显示屏
- **作者**: 奈何col
- **描述**: 基于u8g2的单色显示屏驱动库，可驱动多种OLED、LCD单色显示屏，支持SSD1306、SSD1309、SH1106、SH1107、ST7920等常用驱动芯片。
- **版本**: 1.0.0
- **兼容**: Arduino 平台（参见 `package.json` 中的 `compatibility`）

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `u8g2_begin` | 语句块 | TYPE(field_dropdown), RESOLUTION(field_dropdown), PROTOCOL(field_dropdown) + 动态引脚输入（根据 `PROTOCOL`） | `"fields":{"TYPE":"SSD1306","RESOLUTION":"128X64_NONAME_F","PROTOCOL":"_HW_I2C","RESET_PIN":"U8X8_PIN_NONE"}` | 声明 `U8G2_*` 对象并在 `setup()` 调用 `u8g2.begin();`（generator 会 `addLibrary('#include <U8g2lib.h>')` 并 `addObject('u8g2', 'U8G2_... u8g2(...);')`） |
| `u8g2_clear` | 语句块 | 无 | `{ "type": "u8g2_clear" }` | `u8g2.clear();` |
| `u8g2_clear_buffer` | 语句块 | 无 | `{ "type": "u8g2_clear_buffer" }` | `u8g2.clearBuffer();` |
| `u8g2_send_buffer` | 语句块 | 无 | `{ "type": "u8g2_send_buffer" }` | `u8g2.sendBuffer();` |
| `u8g2_draw_pixel` | 语句块 | X(input_value Number), Y(input_value Number) | `"inputs":{"X":{"block":{"type":"math_number","fields":{"NUM":"10"}}},"Y":{...}}` | `u8g2.drawPixel(x, y); u8g2.sendBuffer();` |
| `u8g2_draw_line` | 语句块 | X1/Y1/X2/Y2 (input_value Number) | — | `u8g2.drawLine(x1,y1,x2,y2); u8g2.sendBuffer();` |
| `u8g2_draw_rectangle` | 语句块 | X/Y/WIDTH/HEIGHT (input_value Number), FILL(field_checkbox) | — | `u8g2.drawBox(...)`（填充）或 `u8g2.drawFrame(...)`（空心），随后 `u8g2.sendBuffer();` |
| `u8g2_draw_circle` | 语句块 | X/Y/RADIUS (input_value Number), FILL(field_checkbox) | — | `u8g2.drawDisc(...)` 或 `u8g2.drawCircle(...)`，随后 `u8g2.sendBuffer();` |
| `u8g2_draw_str` | 语句块 | X/Y (input_value Number), TEXT (input_value String/Number) | — | 会 `u8g2.setFont(...)`，根据内容选择 `drawStr` 或 `drawUTF8` 并 `u8g2.sendBuffer();`（generator 会在需要时调用 `u8g2.enableUTF8Print()`） |
| `u8g2_bitmap` / `u8g2_icon_*` | 值块 (Bitmap 输出) | CUSTOM_BITMAP(field_bitmap_u8g2) | `"fields":{"CUSTOM_BITMAP": <bitmap-array>}` | 将 bitmap 转换为 XBM，生成静态数组变量并返回变量名供 `u8g2_draw_bitmap` 使用 |
| `u8g2_draw_bitmap` | 语句块 | X/Y (input_value Number), BITMAP(input_value Bitmap) | — | `u8g2.drawXBMP(x,y,width,height, var_data); u8g2.sendBuffer();` |
| `u8g2_set_font` | 语句块 | FONT(field_dropdown) | `"fields":{"FONT":"u8g2_font_ncenB10_tr"}` | `u8g2.setFont(...);` |
| `u8g2_set_draw_color` | 语句块 | COLOR(field_dropdown) | `"fields":{"COLOR":"1"}` | `u8g2.setDrawColor(...);` |
| `u8g2_set_contrast` | 语句块 | VALUE(input_value Number) | `"inputs":{"VALUE":...}` | `u8g2.setContrast(value);` |
| `u8g2_set_bus_clock` | 语句块 | SPEED(field_dropdown) | `"fields":{"SPEED":"400000"}` | `u8g2.setBusClock(speed);` |
| `u8g2_set_flip_mode` | 语句块 | MODE(field_dropdown) | `"fields":{"MODE":"1"}` | `u8g2.setFlipMode(mode);` |
| `u8g2_set_power_save` | 语句块 | MODE(field_dropdown) | `"fields":{"MODE":"1"}` | `u8g2.setPowerSave(mode);` |

> 说明：`u8x8_*` 系列为基于 U8x8 的轻量 API，行为与 `u8g2_*` 类似（参考 `u8x8_begin`、`u8x8_draw_str`）。

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown | 字符串 | `"TYPE": "SSD1306"` |
| field_number / input_value(Number) | 数值或数字块 | `"inputs":{"X":{"block":{"type":"math_number","fields":{"NUM":"10"}}}}` |
| field_checkbox | 布尔字符串 | `"fields":{"FILL": "TRUE"}` |
| field_bitmap_u8g2 | 二维位图数组 | `"fields":{"CUSTOM_BITMAP": [[0,1,0...], ...]}` |

## 连接规则

- **语句块**: 初始化与绘制类（绝大多数 `u8g2_*` 和 `u8x8_*`）为语句块，使用 `previousStatement`/`nextStatement` 通过 `next` 字段连接。
- **值块**: 位图生成块（`u8g2_bitmap` / `u8g2_icon_*`）输出 `Bitmap` 类型，可作为 `BITMAP` 输入使用。
- **动态输入**: `u8g2_begin`/`u8x8_begin` 的 `PROTOCOL` 字段会动态添加所需引脚输入（如 I2C 的 RESET_PIN、软件 SPI 的 CLOCK/DATA/CS/DC 等），在 .abi 中应填写实际出现的字段（例如 `"RESET_PIN":"8"` 或 `"CLOCK_PIN":"13","DATA_PIN":"11"`）。

## 使用示例

### I2C 初始化（U8G2，硬件 I2C）
```json
{
  "type": "u8g2_begin",
  "id": "u8g2_init",
  "fields": {
    "TYPE": "SSD1306",
    "RESOLUTION": "128X64_NONAME_F",
    "PROTOCOL": "_HW_I2C",
    "RESET_PIN": "U8X8_PIN_NONE"
  }
}
```

生成代码片段（示意）:
```c
// 在全局
U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, U8X8_PIN_NONE);

// 在 setup()
u8g2.begin();
```

### 文本显示示例（简化）
```json
{
  "type": "u8g2_draw_str",
  "fields": {},
  "inputs": {
    "X": {"block": {"type":"math_number","fields":{"NUM":"10"}}},
    "Y": {"block": {"type":"math_number","fields":{"NUM":"20"}}},
    "TEXT": {"block": {"type":"text","fields":{"TEXT":"Hello"}}}
  }
}
```

生成代码（示意）:
```c
u8g2.setFont(u8g2_font_ncenB10_tr);
u8g2.drawStr(10, 20, "Hello");
u8g2.sendBuffer();
```

### 位图显示（使用库内位图块）
```json
{
  "type": "u8g2_draw_bitmap",
  "inputs": {
    "X": {"block": {"type":"math_number","fields":{"NUM":"0"}}},
    "Y": {"block": {"type":"math_number","fields":{"NUM":"0"}}},
    "BITMAP": {"block": {"type":"u8g2_bitmap","fields":{"CUSTOM_BITMAP": [[0,1,0,...],[...]]}}}
  }
}
```

生成代码（示意）:
```c
// 已在生成时声明 XBM 数据数组，例如 bitmap123_data
u8g2.drawXBMP(0, 0, bitmap123_width, bitmap123_height, bitmap123_data);
u8g2.sendBuffer();
```

## 重要规则

1. **必须初始化**: 在使用任何绘制函数前必须先调用 `u8g2_begin`/`u8x8_begin`，generator 会在 `setup()` 中加入 `begin()`。
2. **缓冲区模式**: 使用 `u8g2_clear_buffer()` / `u8g2_send_buffer()` 可以实现批量绘制以减少闪烁；直接绘制块（如 `u8g2_draw_str`）会在绘制后自动 `sendBuffer()`。
3. **动态引脚字段**: 在 .abi 示例中必须包含由 `PROTOCOL` 触发的实际引脚字段（例如 `CLOCK_PIN` / `DATA_PIN` / `CS_PIN` 等），而不是仅提交 `PROTOCOL`。
4. **位图格式**: `field_bitmap_u8g2` 接受二维数组（0/1），generator 将自动转换为 XBM 并声明常量数组供绘制使用。

## 支持的选项（节选）
- **TYPE(驱动芯片)**: "SSD1306", "SSD1309", "SH1106", "SH1107", "ST7920"
- **RESOLUTION**: "128X64_NONAME_F", "128X32_NONAME_F", "128X128_NONAME_F"（U8g2 构造器变体）
- **PROTOCOL**: `_HW_I2C`, `_SW_I2C`, `_3W_HW_SPI`, `_3W_SW_SPI`, `_4W_HW_SPI`, `_4W_SW_SPI`
- **FONT**: 常见的 `u8g2` 字体常量（示例在下拉列表中）

---

说明：本 README 基于 `block.json` 与 `generator.js`（位于同目录）生成，已尽量以 `.abi` 示例和生成器行为对齐。若后续更新 `block.json` 或 `generator.js`，请同步更新此 README。

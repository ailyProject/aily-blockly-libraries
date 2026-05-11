# Seeed LVGL

Seeed_GFX 与 Seeed_Arduino_LvGL 的 Blockly 库，面向 Seeed/XIAO 等开发板上的 TFT 绘图、触摸、Sprite、E-Paper 和 LVGL 7 图形界面。

## 库信息
- **库名**: @aily-project/lib-seeed-lvgl
- **版本**: 1.0.0
- **作者**: ailyProject
- **源库**: Seeed_GFX 2.0.3, Seeed_Arduino_LvGL 6.1.1 / LVGL 7.0.2
- **兼容**: ESP32 系列优先，源码保留 Seeed_GFX 支持的多平台实现

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|---|---|---|---|---|
| `seeed_gfx_setup` | 语句 | VAR, MODEL, pins, size | `seeed_gfx_setup("tft", ST7789_DRIVER, ...)` | `TFT_eSPI tft; tft.init();` |
| `seeed_gfx_fill_screen` | 语句 | VAR, COLOR | `seeed_gfx_fill_screen($tft, seeed_gfx_color(TFT_BLACK))` | `tft.fillScreen(...)` |
| `seeed_gfx_draw_*` | 语句 | 坐标, 尺寸, 颜色 | `seeed_gfx_draw_rect($tft, 0,0,80,40,color)` | `drawRect/drawCircle/...` |
| `seeed_gfx_set_text_style` | 语句 | 字色, 背景, 大小, 字体 | `seeed_gfx_set_text_style($tft, fg, bg, 2, 2)` | `setTextColor/setTextSize` |
| `seeed_gfx_read_touch` | 语句 | X/Y/状态变量, 阈值 | `seeed_gfx_read_touch($tft,"x","y","pressed",600)` | `tft.getTouch(...)` |
| `seeed_gfx_sprite_create` | 语句 | VAR, TFT, W, H, DEPTH | `seeed_gfx_sprite_create("sprite", $tft, 80, 80, 16)` | `TFT_eSprite` |
| `seeed_gfx_epaper_setup` | 语句 | VAR, WAKE | `seeed_gfx_epaper_setup("epaper", 0)` | `EPaper epaper;` |
| `seeed_lvgl_init` | 语句 | TFT, W, H, ROTATION, buffer, tick | `seeed_lvgl_init($tft,320,240,3,10,5)` | `lv_init` + display driver |
| `seeed_lvgl_touch_input_create` | 语句 | VAR, TFT, THRESHOLD | `seeed_lvgl_touch_input_create("indev", $tft, 600)` | `lv_indev_drv_register` |
| `seeed_lvgl_screen_create/load` | 语句/值 | screen var | `seeed_lvgl_screen_create("screen")` | `lv_obj_create/lv_scr_load` |
| `seeed_lvgl_obj_*` | 语句 | 位置、尺寸、对齐、显示、删除 | `seeed_lvgl_obj_align($label, CENTER, 0, 0)` | `lv_obj_*` |
| `seeed_lvgl_label/button/slider/bar/switch/...` | 语句/值 | 父对象、文本、数值 | `seeed_lvgl_label_create(global,"label",$screen)` | `lv_label_create` 等 |
| `seeed_lvgl_style_*` | 语句 | 部件、状态、属性、值 | `seeed_lvgl_style_color($obj, MAIN, DEFAULT, bg_color, color)` | `lv_obj_set_style_local_*` |

## 字段类型映射
- `field_input`: 新对象名，如 `tft`, `screen`, `label`, `sprite`。
- `field_variable`: 已创建对象，如 TFT_eSPI、TFT_eSprite、EPaper、lv_obj_t。
- `input_value`: 数字、文本、颜色值或表达式；toolbox 已提供默认影子块。
- `field_dropdown`: 驱动型号、旋转方向、动画、状态、样式属性等枚举。

## 连接规则
- 初始化/创建块放在 `arduino_setup()` 中；GFX 初始化应先于 LVGL 初始化。
- GFX 绘图块直接操作 `TFT_eSPI` 对象；LVGL 控件块操作 `lv_obj_t` 对象。
- `seeed_lvgl_init` 会自动注册 flush 回调，并在 loop 中加入 `lv_tick_inc/lv_task_handler/delay`。
- E-Paper 需要 `seeed_gfx_epaper_setup` 启用 `EPAPER_ENABLE`，刷新需显式调用 update。

## 使用示例
```text
arduino_setup()
    seeed_gfx_setup("tft", ST7789_DRIVER, 27000000, 240, 240, -1, -1, -1, -1, -1, -1, -1, HIGH, TFT_RGB, 0)
    seeed_lvgl_init($tft, 240, 240, 0, 10, 5)
    seeed_lvgl_screen_create("screen")
    seeed_lvgl_label_create(global, "label", $screen)
    seeed_lvgl_label_set_text($label, text("Hello LVGL"))
    seeed_lvgl_obj_align($label, LV_ALIGN_CENTER, 0, 0)
```

## 重要规则
- 本库的 LVGL API 按源码中的 LVGL 7.0.2 生成，不与新版 LVGL 8/9 API 混用。
- 如果使用触摸，需在 GFX 初始化中配置正确的触摸相关引脚/驱动宏。
- `src.7z` 应包含 `src/Seeed_GFX` 与 `src/Seeed_LvGL` 两个源码库目录。

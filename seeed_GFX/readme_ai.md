# Seeed GFX

Seeed 显示库封装层，支持 Seeed XIAO Round Display、Wio Terminal、reTerminal E 系列等设备。当前 TFT 路径底层实际仍然生成 `TFT_eSPI` 对象，因此与 LVGL 联动时驱动类型仍然是 `TFT_eSPI`。

## Library Info
- **Name**: @aily-project/lib-seeed-gfx
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_gfx_create_tft` | Statement | VAR(field_input) | `seeed_gfx_create_tft("tft")` | `TFT_eSPI tft = TFT_eSPI();` |
| `seeed_gfx_init` | Statement | VAR(field_input), MODEL(dropdown), FREQUENCY(dropdown) | `seeed_gfx_init("tft", 501, 20000000)` | `#define BOARD_SCREEN_COMBO ...; TFT_eSPI tft = TFT_eSPI(); tft.init();` |
| `seeed_gfx_fill_screen` | Statement | VAR(field_variable), COLOR(input_value) | `seeed_gfx_fill_screen($tft, seeed_gfx_color(TFT_BLACK))` | `tft.fillScreen(...);` |
| `seeed_gfx_set_rotation` | Statement | VAR(field_variable), ROTATION(dropdown) | `seeed_gfx_set_rotation($tft, 3)` | `tft.setRotation(...);` |
| `seeed_gfx_draw_pixel` | Statement | VAR(field_variable), X(input_value), Y(input_value), COLOR(input_value) | `seeed_gfx_draw_pixel($tft, math_number(10), math_number(10), seeed_gfx_color(TFT_WHITE))` | `tft.drawPixel(...);` |
| `seeed_gfx_draw_line` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), COLOR(input_value) | `seeed_gfx_draw_line($tft, math_number(0), math_number(0), math_number(50), math_number(50), seeed_gfx_color(TFT_RED))` | `tft.drawLine(...);` |
| `seeed_gfx_draw_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value), COLOR(input_value) | `seeed_gfx_draw_rect($tft, math_number(20), math_number(20), math_number(80), math_number(40), seeed_gfx_color(TFT_GREEN))` | `tft.drawRect(...);` |
| `seeed_gfx_fill_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value), COLOR(input_value) | `seeed_gfx_fill_rect($tft, math_number(20), math_number(20), math_number(80), math_number(40), seeed_gfx_color(TFT_BLUE))` | `tft.fillRect(...);` |
| `seeed_gfx_fill_rect_v_gradient` | Statement | VAR(field_variable), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value), COLOR1(input_value), COLOR2(input_value) | `seeed_gfx_fill_rect_v_gradient($tft, math_number(20), math_number(20), math_number(80), math_number(40), seeed_gfx_color(TFT_RED), seeed_gfx_color(TFT_BLUE))` | `tft.fillRectVGradient(...);` |
| `seeed_gfx_fill_rect_h_gradient` | Statement | VAR(field_variable), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value), COLOR1(input_value), COLOR2(input_value) | `seeed_gfx_fill_rect_h_gradient($tft, math_number(20), math_number(20), math_number(80), math_number(40), seeed_gfx_color(TFT_GREEN), seeed_gfx_color(TFT_YELLOW))` | `tft.fillRectHGradient(...);` |
| `seeed_gfx_draw_round_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value), RADIUS(input_value), COLOR(input_value) | `seeed_gfx_draw_round_rect($tft, math_number(10), math_number(10), math_number(100), math_number(50), math_number(8), seeed_gfx_color(TFT_ORANGE))` | `tft.drawRoundRect(...);` |
| `seeed_gfx_fill_round_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value), RADIUS(input_value), COLOR(input_value) | `seeed_gfx_fill_round_rect($tft, math_number(10), math_number(10), math_number(100), math_number(50), math_number(8), seeed_gfx_color(TFT_CYAN))` | `tft.fillRoundRect(...);` |
| `seeed_gfx_draw_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_value) | `seeed_gfx_draw_circle($tft, math_number(60), math_number(60), math_number(20), seeed_gfx_color(TFT_YELLOW))` | `tft.drawCircle(...);` |
| `seeed_gfx_fill_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_value) | `seeed_gfx_fill_circle($tft, math_number(60), math_number(60), math_number(20), seeed_gfx_color(TFT_MAGENTA))` | `tft.fillCircle(...);` |
| `seeed_gfx_draw_triangle` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), X3(input_value), Y3(input_value), COLOR(input_value) | `seeed_gfx_draw_triangle($tft, math_number(160), math_number(70), math_number(110), math_number(170), math_number(210), math_number(170), seeed_gfx_color(TFT_RED))` | `tft.drawTriangle(...);` |
| `seeed_gfx_fill_triangle` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), X3(input_value), Y3(input_value), COLOR(input_value) | `seeed_gfx_fill_triangle($tft, math_number(160), math_number(70), math_number(110), math_number(170), math_number(210), math_number(170), seeed_gfx_color(TFT_CYAN))` | `tft.fillTriangle(...);` |
| `seeed_gfx_draw_ellipse` | Statement | VAR(field_variable), X(input_value), Y(input_value), RX(input_value), RY(input_value), COLOR(input_value) | `seeed_gfx_draw_ellipse($tft, math_number(120), math_number(80), math_number(50), math_number(30), seeed_gfx_color(TFT_WHITE))` | `tft.drawEllipse(...);` |
| `seeed_gfx_fill_ellipse` | Statement | VAR(field_variable), X(input_value), Y(input_value), RX(input_value), RY(input_value), COLOR(input_value) | `seeed_gfx_fill_ellipse($tft, math_number(120), math_number(80), math_number(40), math_number(24), seeed_gfx_color(TFT_ORANGE))` | `tft.fillEllipse(...);` |
| `seeed_gfx_set_text_color` | Statement | VAR(field_variable), COLOR(input_value), BGCOLOR(input_value) | `seeed_gfx_set_text_color($tft, seeed_gfx_color(TFT_WHITE), seeed_gfx_color(TFT_BLACK))` | `tft.setTextColor(...);` |
| `seeed_gfx_set_text_size` | Statement | VAR(field_variable), SIZE(dropdown) | `seeed_gfx_set_text_size($tft, 2)` | `tft.setTextSize(...);` |
| `seeed_gfx_set_cursor` | Statement | VAR(field_variable), X(input_value), Y(input_value) | `seeed_gfx_set_cursor($tft, math_number(0), math_number(0))` | `tft.setCursor(...);` |
| `seeed_gfx_print` | Statement | VAR(field_variable), TEXT(input_value) | `seeed_gfx_print($tft, text("hello"))` | `tft.print(...);` |
| `seeed_gfx_draw_string` | Statement | VAR(field_variable), TEXT(input_value), X(input_value), Y(input_value), FONT(dropdown) | `seeed_gfx_draw_string($tft, text("hello"), math_number(10), math_number(10), 2)` | `tft.drawString(...);` |
| `seeed_gfx_create_sprite` | Statement | WIDTH(input_value), HEIGHT(input_value), VAR(field_input) | `seeed_gfx_create_sprite(math_number(80), math_number(40), "sprite")` | `TFT_eSprite sprite(&tft); sprite.createSprite(...);` |
| `seeed_gfx_epaper_begin` | Statement | VAR(field_input), MODEL(dropdown) | `seeed_gfx_epaper_begin("epaper", 502)` | `#define BOARD_SCREEN_COMBO ...; EPaper epaper; epaper.begin();` |
| `seeed_gfx_epaper_update` | Statement | VAR(field_variable) | `seeed_gfx_epaper_update($epaper)` | `epaper.update();` |
| `seeed_gfx_epaper_sleep` | Statement | VAR(field_variable) | `seeed_gfx_epaper_sleep($epaper)` | `epaper.sleep();` |
| `seeed_gfx_color` | Value | COLOR(dropdown) | `seeed_gfx_color(TFT_WHITE)` | `TFT_WHITE` |
| `seeed_gfx_epaper_wake` | Statement | VAR(field_variable) | `seeed_gfx_epaper_wake($epaper)` | `epaper.wake();` |
| `seeed_gfx_rgb565` | Value | VAR(field_variable), COLOR(field_colour_hsv_sliders) | `seeed_gfx_rgb565($tft, #00FF88)` | `tft.color565(r, g, b)` |
| `seeed_gfx_get_width` | Value | VAR(field_variable) | `seeed_gfx_get_width($tft)` | `tft.width()` |
| `seeed_gfx_get_height` | Value | VAR(field_variable) | `seeed_gfx_get_height($tft)` | `tft.height()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODEL | 500, 501, 666 | 500=Wio Terminal(320x240) / 501=XIAO Round Display(240x240) / 666=Seeed XIAO ILI9341 |
| FREQUENCY | 10000000, 20000000, 27000000, 40000000, 55000000, 80000000 | TFT 通信频率，单位 Hz，默认 27MHz |
| ROTATION | 0, 1, 2, 3, 4, 5, 6, 7 | 0/1/2/3=0°/90°/180°/270°，4-7 为镜像或交换轴模式 |
| SIZE | 1, 2, 3, 4, 5, 6, 7 | 文本大小 |
| FONT | 1, 2, 4, 6, 7 | 绘制字符串时使用的字体编号 |
| COLOR | TFT_WHITE, TFT_BLACK, TFT_RED, TFT_GREEN, TFT_BLUE, TFT_YELLOW, TFT_MAGENTA, TFT_CYAN, TFT_ORANGE, TFT_PINK, TFT_PURPLE, TFT_BROWN, TFT_DARKGREY, TFT_LIGHTGREY, TFT_GOLD, TFT_SILVER, TFT_SKYBLUE, TFT_VIOLET, TFT_OLIVE, TFT_NAVY, TFT_DARKGREEN, TFT_DARKCYAN, TFT_MAROON, TFT_GREENYELLOW | 常用颜色宏 |

## Initialization Contract

### TFT path

`seeed_gfx_init("tft", MODEL)` 会同时完成以下行为：

1. 设置 `BOARD_SCREEN_COMBO=MODEL`
2. 创建 `TFT_eSPI` 对象变量
3. 调用 `.init()` 初始化屏幕

因此，**常规 TFT 使用时直接用 `seeed_gfx_init(...)` 即可**。不要再对同一个变量额外调用 `seeed_gfx_create_tft(...)`，否则文档层面会出现“先声明又重复声明”的歧义，生成器也可能产生重复对象定义。

### EPaper path

`seeed_gfx_epaper_begin("epaper", MODEL)` 也会自己创建并初始化 `EPaper` 对象。

因此，常规墨水屏使用时只需要：

1. `seeed_gfx_epaper_begin(...)`
2. 绘制内容
3. `seeed_gfx_epaper_update(...)`
4. 需要省电时调用 `seeed_gfx_epaper_sleep(...)`

### LVGL integration

当前 Seeed GFX 的 TFT 路径底层仍然是 `TFT_eSPI`，所以和 LVGL 联动时顺序应为：

1. `seeed_gfx_init("tft", MODEL)`
2. `lvgl_init(TFT_eSPI, WIDTH, HEIGHT, ROTATION)`
3. 创建 screen 和控件

### Common board configs

| Board | MODEL | Physical LCD | Common config |
|-------|-------|--------------|---------------|
| Seeed XIAO Round Display | 501 | 240x240 | 纯 GFX 常见为 `seeed_gfx_set_rotation($tft, 3)`；LVGL 常见为 `lvgl_init(TFT_eSPI, math_number(240), math_number(240), LV_DISPLAY_ROTATION_270)` |
| Wio Terminal | 500 | 320x240 | 纯 GFX 常见为 `seeed_gfx_set_rotation($tft, 3)`； LVGL 常见为 `lvgl_init(TFT_eSPI, math_number(240), math_number(320), LV_DISPLAY_ROTATION_270)`，两者都可能是正确配方 |

### Orientation rule

1. `MODEL` 先决定底层屏幕配方；`WIDTH`、`HEIGHT`、`ROTATION` 再决定 LVGL 逻辑坐标
2. `ROTATION_90/270` 会交换 LVGL 逻辑宽高
3. 若文字方向、居中效果、输入方向都正确，就保留当前 `lvgl_init(...)`
4. 若只有对象坐标范围不对，修业务坐标；只有整屏朝向错误时才改初始化
5. Wio Terminal 虽然物理 LCD 是 320x240，但接手已有项目时不要机械改成 `320x240 + ROTATION_0`；像当前项目这类 `240x320 + ROTATION_270` 也是有效配方，先看当前画面和输入是否已经对齐用户视角

## Important Constraints

1. `seeed_gfx_create_sprite(...)` 生成的是 `TFT_eSprite sprite(&tft);`，它默认依赖一个名为 `tft` 的底层显示对象
2. 因此，如果要使用 Sprite，**推荐 TFT 变量名保持为 `tft`**
3. `seeed_gfx_create_tft(...)` 只创建对象，不会调用 `.init()`；对大多数项目不推荐单独使用
4. `seeed_gfx_init(...)` 和 `seeed_gfx_epaper_begin(...)` 是两条不同初始化路线，不要在一个最小示例里混写成同一条启动流程

## ABS Examples

### Recipe 1: Seeed XIAO Round Display 纯绘图
```
arduino_setup()
    seeed_gfx_init("tft", 501)
    seeed_gfx_set_rotation($tft, 3)
    seeed_gfx_fill_screen($tft, seeed_gfx_color(TFT_BLACK))
    seeed_gfx_set_text_color($tft, seeed_gfx_color(TFT_WHITE), seeed_gfx_color(TFT_BLACK))
    seeed_gfx_draw_string($tft, text("Seeed GFX"), math_number(40), math_number(40), 2)
    seeed_gfx_fill_circle($tft, math_number(120), math_number(120), math_number(18), seeed_gfx_rgb565($tft, #00C2FF))

arduino_loop()
```

### Recipe 2: Seeed GFX + LVGL 触摸界面
```
arduino_setup()
    seeed_gfx_init("tft", 501)
    chsc6x_setup("touch", Wire, math_number(46), io_pin_digi(D7), math_number(240), math_number(240), 3)
    lvgl_init(TFT_eSPI, math_number(240), math_number(240), LV_DISPLAY_ROTATION_270)
    lvgl_indev_create(global, "indev", LV_INDEV_TYPE_POINTER)
        controls_if()
            @IF0: chsc6x_run($touch)
            @DO0:
                controls_ifelse(chsc6x_is_pressed($touch))
                    @do:
                        lvgl_indev_data_param_set(state, lvgl_indev_state_param(LV_INDEV_STATE_PR))
                        lvgl_indev_data_param_set(point.x, chsc6x_get_x($touch))
                        lvgl_indev_data_param_set(point.y, chsc6x_get_y($touch))
                    @else:
                        lvgl_indev_data_param_set(state, lvgl_indev_state_param(LV_INDEV_STATE_REL))
    lvgl_screen_create(global, "screen")
    lvgl_button_create(global, "btn", $screen)
    lvgl_obj_align($btn, LV_ALIGN_CENTER, math_number(0), math_number(15))
    lvgl_event_add_cb($btn, LV_EVENT_CLICKED)
        variable_define_advanced(static, , "count", uint8_t)
        variables_set($count, math_arithmetic(variables_get($count), ADD, math_number(1)))
        lvgl_obj_get_child("label", $btn, math_number(0))
        lvgl_label_set_text($label, text_join(text("Button: "), variables_get($count)))
    lvgl_label_create(global, "label", $btn)
    lvgl_label_set_text($label, text("Button"))
    lvgl_obj_center($label)
    lvgl_screen_load($screen)

arduino_loop()
    time_delay(math_number(5))
```

### Recipe 3: EPaper 基本使用
```
arduino_setup()
    seeed_gfx_epaper_begin("epaper", 502)

arduino_loop()
    seeed_gfx_epaper_update($epaper)
    seeed_gfx_epaper_sleep($epaper)
```

## Notes

1. **Variable creation**: `seeed_gfx_init("tft", ...)` 会创建 `$tft`；`seeed_gfx_epaper_begin("epaper", ...)` 会创建 `$epaper`
2. **Do not mix declaration styles**: 对同一个 TFT 变量，不要同时使用 `seeed_gfx_create_tft(...)` 和 `seeed_gfx_init(...)`
3. **Sprite limitation**: `seeed_gfx_create_sprite(...)` 默认绑定 `&tft`，所以使用 Sprite 时推荐 TFT 变量名固定为 `tft`
4. **LVGL dependency**: Seeed GFX 与 LVGL 联动时，`lvgl_init` 的 `DRIVER` 仍然写 `TFT_eSPI`
5. **Screen size source**: TFT 路径的实际分辨率由 `MODEL` 对应的板级宏决定；LVGL 的 `WIDTH`、`HEIGHT` 仍需手动写成真实分辨率或当前驱动配方要求的原生尺寸
6. **Rotation changes logical axes**: 当 LVGL 使用 `ROTATION_90/270` 时，业务层应按旋转后的逻辑坐标写边界和位置
7. **Fix the right layer**: 若画面和输入方向已经正确，则优先修对象坐标范围，而不是重写 LVGL 初始化组合
8. **Parameter order**: 所有 ABS 参数顺序严格遵循 `block.json` 的 `args0` 顺序

# GxEPD2 墨水屏全家桶（全型号 + 双IC）

All-in-one：官方 GxEPD2 绘图积木与内置源码 + 全型号初始化（99 款单IC）+ 双IC HINK-E042A03-A1 初始化。

## Library Info
- **Name**: @aily-project/lib-gxepd2-all
- **Version**: 1.0.0
- **合并自**: @aily-project/lib-gxepd2 1.6.9（绘图积木与源码）、@aily-project/lib-gxepd2-any（gxepd2any_setup 单IC目录）、@aily-project/lib-gxepd2-2ic（双IC）
- **源码许可**: GxEPD2 by Jean-Marc Zingg (GPL-3.0)；GxEPD2_2IC by xljxlj；Adafruit_GFX/U8g2_for_Adafruit_GFX 随上游分发

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `gxepd2_setup` | Statement | VAR(field_input), PANEL(dropdown), CS(input_value), DC(input_value), RST(input_value), BUSY(input_value), BAUD(dropdown), RESET_DURATION(dropdown), INITIAL(dropdown), PULLDOWN(dropdown) | `gxepd2_setup("display", BW_GDEH0154D67, math_number(5), math_number(17), math_number(16), math_number(4), 0, 2, TRUE, FALSE)` | `display.init(0, true, 2, false);` |
| `gxepd2any_setup` | Statement | VAR(field_input), PANEL(dropdown), SCK(input_value), MOSI(input_value), CS(input_value), DC(input_value), RST(input_value), BUSY(input_value), BAUD(dropdown), RESET_DURATION(dropdown), INITIAL(dropdown), PULLDOWN(dropdown) | `gxepd2any_setup("display", GxEPD2_154_D67, math_number(18), math_number(23), math_number(5), math_number(17), math_number(21), math_number(4), "115200", "10", TRUE, FALSE)` | `#include <GxEPD2_BW.h>` 等 ↵ `SPI.end();`↵`SPI.begin(18, -1, 23, 5);` ↵ 全局: `GxEPD2_BW<GxEPD2_154_D67, 200> display(GxEPD2_154_D67(5, 17, 21, 4));` ↵ `display.init(115200, true, 10, false);` |
| `gxepd22ic_setup` | Statement | VAR(field_input), SCK(input_value), MOSI(input_value), CS(input_value), CS2(input_value), DC(input_value), RST(input_value), BUSY(input_value), PWR(input_value), BAUD(dropdown), RESET_DURATION(dropdown), INITIAL(dropdown), PULLDOWN(dropdown) | `gxepd22ic_setup("display", math_number(18), math_number(23), math_number(5), math_number(22), math_number(17), math_number(16), math_number(4), math_number(-1), "115200", "10", TRUE, FALSE)` | `#include "GxEPD2_2IC_BW.h"` 等 ↵ `SPI.end();`↵`SPI.begin(18, -1, 23, 5);` ↵ PWR≥0 时 `pinMode`+置低 ↵ 全局: `GxEPD2_2IC_BW<GxEPD2_2IC_420_A03, GxEPD2_2IC_420_A03::HEIGHT> display(GxEPD2_2IC_420_A03(5, 22, 17, 16, 4));` ↵ `display.init(115200, true, 10, false);` |
| `gxepd2_page_update` | Statement | VAR(field_variable), WINDOW(dropdown), DRAW(input_statement) | `gxepd2_page_update($display, FULL)` | `display.setFullWindow(); ↵ display.firstPage(); ↵ do { ↵ } while (display.nextPage());` |
| `gxepd2_clear_display` | Statement | VAR(field_variable), COLOR(input_value) | `gxepd2_clear_display($display, gxepd2_color(GxEPD_WHITE))` | `display.setFullWindow(); ↵ display.firstPage(); ↵ do { ↵ display.fillScreen(1); ↵ } while (display.nextPage());` |
| `gxepd2_set_partial_window` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value) | `gxepd2_set_partial_window($display, math_number(0), math_number(0), math_number(128), math_number(64))` | `display.setPartialWindow(1, 1, 1, 1);` |
| `gxepd2_fill_screen` | Statement | VAR(field_variable), COLOR(input_value) | `gxepd2_fill_screen($display, gxepd2_color(GxEPD_WHITE))` | `display.fillScreen(1);` |
| `gxepd2_set_rotation` | Statement | VAR(field_variable), ROTATION(dropdown) | `gxepd2_set_rotation($display, 1)` | `display.setRotation(0);` |
| `gxepd2_set_text_color` | Statement | VAR(field_variable), COLOR(input_value) | `gxepd2_set_text_color($display, gxepd2_color(GxEPD_BLACK))` | `display.setTextColor(1);` |
| `gxepd2_set_text_size` | Statement | VAR(field_variable), SIZE(dropdown) | `gxepd2_set_text_size($display, 2)` | `display.setTextSize(1);` |
| `gxepd2_set_font` | Statement | VAR(field_variable), FONT(dropdown) | `gxepd2_set_font($display, &FreeMonoBold9pt7b)` | `display.setFont();` |
| `gxepd2_set_cursor` | Statement | VAR(field_variable), X(input_value), Y(input_value) | `gxepd2_set_cursor($display, math_number(10), math_number(30))` | `display.setCursor(1, 1);` |
| `gxepd2_print` | Statement | VAR(field_variable), TEXT(input_value) | `gxepd2_print($display, text("Hello"))` | `display.print(1);` |
| `gxepd2_draw_pixel` | Statement | VAR(field_variable), X(input_value), Y(input_value), COLOR(input_value) | `gxepd2_draw_pixel($display, math_number(10), math_number(10), gxepd2_color(GxEPD_BLACK))` | `display.drawPixel(1, 1, 1);` |
| `gxepd2_draw_line` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), COLOR(input_value) | `gxepd2_draw_line($display, math_number(0), math_number(0), math_number(100), math_number(50), gxepd2_color(GxEPD_BLACK))` | `display.drawLine(1, 1, 1, 1, 1);` |
| `gxepd2_draw_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value), FILL(dropdown) | `gxepd2_draw_rect($display, math_number(10), math_number(10), math_number(80), math_number(40), gxepd2_color(GxEPD_BLACK), OUTLINE)` | `display.drawRect(1, 1, 1, 1, 1);` |
| `gxepd2_draw_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_value), FILL(dropdown) | `gxepd2_draw_circle($display, math_number(50), math_number(50), math_number(20), gxepd2_color(GxEPD_BLACK), FILLED)` | `display.drawCircle(1, 1, 1, 1);` |
| `gxepd2_refresh` | Statement | VAR(field_variable), MODE(dropdown) | `gxepd2_refresh($display, FULL)` | `display.refresh(false);` |
| `gxepd2_sleep` | Statement | VAR(field_variable), MODE(dropdown) | `gxepd2_sleep($display, HIBERNATE)` | `display.powerOff();` |
| `gxepd2_width` | Value | VAR(field_variable) | `gxepd2_width($display)` | `display.width()` |
| `gxepd2_height` | Value | VAR(field_variable) | `gxepd2_height($display)` | `display.height()` |
| `gxepd2_color` | Value | COLOR(dropdown) | `gxepd2_color(GxEPD_BLACK)` | `GxEPD_BLACK` |
| `gxepd2_spi_pins` | Statement | SCK(input_value), MISO(input_value), MOSI(input_value), CS(input_value) | `gxepd2_spi_pins(math_number(6), math_number(5), math_number(7), math_number(10))` | `SPI.end(); ↵ SPI.begin(1, 1, 1, 1);` |
| `gxepd2_u8g2_begin` | Statement | VAR(field_variable) | `gxepd2_u8g2_begin($display)` | `u8g2Fonts.begin(display); ↵ u8g2Fonts.setFontMode(1); ↵ u8g2Fonts.setFontDirection(0);` |
| `gxepd2_u8g2_font` | Statement | FONT(dropdown) | `gxepd2_u8g2_font(u8g2_font_wqy12_t_gb2312a)` | `u8g2Fonts.setFont(u8g2_font_wqy12_t_gb2312a);` |
| `gxepd2_u8g2_color` | Statement | FG(dropdown), BG(dropdown) | `gxepd2_u8g2_color(GxEPD_BLACK, GxEPD_WHITE)` | `u8g2Fonts.setForegroundColor(GxEPD_BLACK); ↵ u8g2Fonts.setBackgroundColor(GxEPD_WHITE);` |
| `gxepd2_u8g2_mode` | Statement | MODE(dropdown) | `gxepd2_u8g2_mode(1)` | `u8g2Fonts.setFontMode(1);` |
| `gxepd2_u8g2_text` | Statement | X(input_value), Y(input_value), TEXT(input_value) | `gxepd2_u8g2_text(math_number(4), math_number(20), text("你好"))` | `u8g2Fonts.setCursor(1, 1); ↵ u8g2Fonts.print("value");` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PANEL | BW_GDEH0154D67, BW_GDEY0213B74, BW_DEPG0266BN, BW_GDEM029T94, BW_GDEW042T2, BW_GDEW075T7, C3_GDEH0154Z90, C3_GDEY0213Z98, C3_GDEM029C90, C3_GDEW042Z15, C3_GDEW0583Z83, C3_GDEW075Z08, C4_WS300, C7_WS565 | Display driver and color class |
| WINDOW | FULL, CURRENT | `FULL` calls `setFullWindow`; `CURRENT` uses the previously configured partial window |
| COLOR | GxEPD_BLACK, GxEPD_WHITE, GxEPD_RED, GxEPD_YELLOW | GxEPD2 color constants |
| FILL | OUTLINE, FILLED | Shape drawing mode |
| MODE | FULL, PARTIAL, POWER_OFF, HIBERNATE | Refresh or power mode depending on block |
| PANEL (gxepd2any_setup) | GxEPD2_102, GxEPD2_213_flex, GxEPD2_213_M21, GxEPD2_213_T5D, GxEPD2_213, GxEPD2_213_B72, GxEPD2_213_B73, GxEPD2_213_B74, GxEPD2_213_BN, GxEPD2_213_GDEY0213B74, GxEPD2_290, GxEPD2_290_BS, GxEPD2_290_GDEY029T94, GxEPD2_290_I6FD, GxEPD2_290_M06, GxEPD2_290_T5, GxEPD2_290_T5D, GxEPD2_290_T94, GxEPD2_290_T94_V2, GxEPD2_154_M10, GxEPD2_154_T8, GxEPD2_260, GxEPD2_260_M01, GxEPD2_266_BN, GxEPD2_266_GDEY0266T90, GxEPD2_290_GDEY029T71H, GxEPD2_270, GxEPD2_270_GDEY027T91, GxEPD2_150_BN, GxEPD2_154, GxEPD2_154_D67, GxEPD2_154_GDEY0154D67, GxEPD2_154_M09, GxEPD2_310_GDEQ031T10, GxEPD2_370_GDEY037T03, GxEPD2_371, GxEPD2_370_TC1, GxEPD2_420, GxEPD2_420_GDEY042T81, GxEPD2_420_GYE042A87, GxEPD2_420_M01, GxEPD2_420_SE0420NQ04, GxEPD2_583, GxEPD2_750, GxEPD2_583_GDEQ0583T31, GxEPD2_583_T8, GxEPD2_579_GDEY0579T93, GxEPD2_397_GDEM0397T81, GxEPD2_426_GDEQ0426T82, GxEPD2_750_GDEY075T7, GxEPD2_750_T7, GxEPD2_576_GDEH0576T81, GxEPD2_1020_GDEM102T91, GxEPD2_1160_T91, GxEPD2_1330_GDEM133T91, GxEPD2_1248, GxEPD2_1085_GDEM1085T51, GxEPD2_213_Z19c, GxEPD2_213c, GxEPD2_213_Z98c, GxEPD2_290_C90c, GxEPD2_290_Z13c, GxEPD2_290c, GxEPD2_266c, GxEPD2_270c, GxEPD2_154_Z90c, GxEPD2_154c, GxEPD2_420c, GxEPD2_420c_GDEY042Z98, GxEPD2_420c_Z21, GxEPD2_583c, GxEPD2_750c, GxEPD2_583c_GDEQ0583Z31, GxEPD2_583c_Z83, GxEPD2_579c_GDEY0579Z93, GxEPD2_750c_GDEW075Z08, GxEPD2_750c_GDEY075Z08, GxEPD2_750c_Z08, GxEPD2_750c_Z90, GxEPD2_1160c_GDEY116Z91, GxEPD2_1330c_GDEM133Z91, GxEPD2_1248c, GxEPD2_213c_GDEY0213F51, GxEPD2_290c_GDEY029F51H, GxEPD2_300c, GxEPD2_266c_GDEY0266F51H, GxEPD2_350c_GDEM035F51, GxEPD2_154c_GDEM0154F51H, GxEPD2_420c_GDEY0420F51, GxEPD2_437c, GxEPD2_579c_GDEY0579F51, GxEPD2_397c_GDEM0397F81, GxEPD2_750c_GDEM075F52, GxEPD2_1160c_GDEY116F51, GxEPD2_565c, GxEPD2_565c_GDEP0565D90, GxEPD2_730c_ACeP_730, GxEPD2_730c_GDEP073E01, GxEPD2_730c_GDEY073D46 | 99 个单IC面板驱动类名（捆绑 GxEPD2 1.6.9 全目录）；双IC屏不在此列 |

## ABS Examples

### Hello World
```abs
arduino_setup()
    gxepd2_setup("display", BW_GDEH0154D67, math_number(5), math_number(17), math_number(16), math_number(4), 0, 2, TRUE, FALSE)
    gxepd2_set_rotation($display, 1)

arduino_loop()
    gxepd2_page_update($display, FULL)
        @DRAW:
            gxepd2_fill_screen($display, gxepd2_color(GxEPD_WHITE))
            gxepd2_set_font($display, &FreeMonoBold9pt7b)
            gxepd2_set_text_color($display, gxepd2_color(GxEPD_BLACK))
            gxepd2_set_cursor($display, math_number(20), math_number(60))
            gxepd2_print($display, text("Hello e-paper"))
    gxepd2_sleep($display, HIBERNATE)
```

## Notes

1. `gxepd2_setup("display", ...)` creates `$display`; pass `$display` directly to `field_variable` slots. Use `variables_get($display)` only when another block explicitly expects an `input_value`.
2. Put drawing blocks inside `gxepd2_page_update`; GxEPD2 may call the body multiple times while paging.
3. Use `gxepd2_set_partial_window` before `gxepd2_page_update(..., CURRENT)` for partial refresh areas.
4. E-paper modules need correct voltage and wiring. Most bare panels require 3.3V power and 3.3V logic.
5. **双IC块仅支持 HINK-E042A03-A1**（4.2寸 400x300，双 SSD1608）：上游 GxEPD2_2IC 面板枚举仅 GDEH042A03 一个值、src/epd 仅 420_A03 一个驱动。半屏映射 CS=左半屏(列0..199)、CS2=右半屏(列200..399)。PWR 默认 -1（不使用，不碰任何引脚）；仅当转接板真有电源使能脚才填实际引脚。
6. **不要与 @aily-project/lib-gxepd2、lib-gxepd2-any、lib-gxepd2-2ic 同时安装**：gxepd2_* 等块类型同名会冲突；本库已内置全部源码与翻译。
7. 单IC面板的 page_height 采用全高缓冲（ESP32 RAM 足够）；99 型号目录与捆绑 GxEPD2 1.6.9 一致。真机仅验证过双IC HINK-E042A03-A1；其余型号清以上游 GxEPD2 例程为准。

# GxEPD2 e-Paper

GxEPD2 Blockly blocks for SPI e-paper displays from Good Display and Waveshare.

## Library Info
- **Name**: @aily-project/lib-gxepd2
- **Version**: 1.6.10

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `gxepd2_setup` | Statement | VAR(field_input), PANEL(dropdown), CS(input_value), DC(input_value), RST(input_value), BUSY(input_value), BAUD(dropdown), RESET_DURATION(dropdown), INITIAL(dropdown), PULLDOWN(dropdown) | `gxepd2_setup("display", BW_GDEH0154D67, math_number(5), math_number(17), math_number(16), math_number(4), 0, 2, TRUE, FALSE)` | `display.init(0, true, 2, false);` |
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

### linkbit: onboard 2.13" 3-color panel
```abs
arduino_setup()
    gxepd2_setup("display", C3_GDEY0213Z98, math_number(2), math_number(3), math_number(1), math_number(0), 0, 2, TRUE, FALSE)
    gxepd2_spi_pins(math_number(6), math_number(-1), math_number(7), math_number(2))
    gxepd2_set_rotation($display, 1)
    gxepd2_page_update($display, FULL)
        @DRAW:
            gxepd2_fill_screen($display, gxepd2_color(GxEPD_WHITE))
            gxepd2_set_text_color($display, gxepd2_color(GxEPD_RED))
            gxepd2_set_cursor($display, math_number(10), math_number(30))
            gxepd2_print($display, text("linkbit"))
    gxepd2_sleep($display, HIBERNATE)
```

## Notes

1. `gxepd2_setup("display", ...)` creates `$display`; pass `$display` directly to `field_variable` slots. Use `variables_get($display)` only when another block explicitly expects an `input_value`.
2. Put drawing blocks inside `gxepd2_page_update`; GxEPD2 may call the body multiple times while paging.
3. Use `gxepd2_set_partial_window` before `gxepd2_page_update(..., CURRENT)` for partial refresh areas.
4. E-paper modules need correct voltage and wiring. Most bare panels require 3.3V power and 3.3V logic.
5. **Board defaults**: when the board’s `board.json` `displayConfig` has `interface` `spi` and a `model` that matches a PANEL value without its color prefix (linkbit: `gdey0213z98` → `C3_GDEY0213Z98`), a `gxepd2_setup` taken from the toolbox starts with that panel and the `cs`/`dc`/`rst`/`busy` pins, and `gxepd2_spi_pins` with `sclk`, `miso` (or -1), `mosi` and `cs`. Other boards keep the defaults; saved programs keep their values. On ESP32 boards, when `gxepd2_setup` uses exactly the board’s panel and pins, the board gives `sclk`/`mosi`, and the workspace has no `gxepd2_spi_pins`, the generated code adds `SPI.end(); SPI.begin(sclk, miso, mosi, cs);` after `init`. In ABS, write `gxepd2_spi_pins` explicitly, as in the linkbit example.

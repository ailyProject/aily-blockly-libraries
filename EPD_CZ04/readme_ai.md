# CZ04 4-Grey e-Paper

2.13" 104x212 four-grey e-paper (CZ04) with drawing, Chinese text and weather icons

## Library Info
- **Name**: @aily-project/lib-epd-cz04
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `epd_cz04_init` | Statement | VAR(field_input), WIDTH(input_value), HEIGHT(input_value), CS(input_value), DC(input_value), RST(input_value), BUSY(input_value), SCK(input_value), MOSI(input_value) | `epd_cz04_init("epd", math_number(104), math_number(212), math_number(2), math_number(3), math_number(1), math_number(0), math_number(6), math_number(7))` | `epd.begin();` |
| `epd_cz04_set_rotation` | Statement | VAR(field_variable), ROTATION(dropdown) | `epd_cz04_set_rotation($epd, 0)` | `epd.setRotation(0);` |
| `epd_cz04_clear_ghosting` | Statement | VAR(field_variable), ROUNDS(input_value) | `epd_cz04_clear_ghosting($epd, math_number(0))` | `epd.clearGhosting(0);` |
| `epd_cz04_frame` | Statement | VAR(field_variable), BG(dropdown), DRAW(input_statement) | `epd_cz04_frame($epd, WHITE)` | `epd.fillScreen(EPD_CZ04_WHITE); ↵ if (!epd.display()) { ↵ Serial.println("墨水屏刷新超时，请检查屏幕排线"); ↵ }` |
| `epd_cz04_display` | Statement | VAR(field_variable) | `epd_cz04_display($epd)` | `if (!epd.display()) { ↵ Serial.println("墨水屏刷新超时，请检查屏幕排线"); ↵ }` |
| `epd_cz04_clear` | Statement | VAR(field_variable), COLOR(input_value) | `epd_cz04_clear($epd, math_number(0))` | `epd.clear(0);` |
| `epd_cz04_fill_screen` | Statement | VAR(field_variable), COLOR(input_value) | `epd_cz04_fill_screen($epd, math_number(0))` | `epd.fillScreen(0);` |
| `epd_cz04_draw_pixel` | Statement | VAR(field_variable), X(input_value), Y(input_value), COLOR(input_value) | `epd_cz04_draw_pixel($epd, math_number(0), math_number(0), math_number(0))` | `epd.drawPixel(0, 0, 0);` |
| `epd_cz04_draw_line` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), COLOR(input_value) | `epd_cz04_draw_line($epd, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `epd.drawLine(0, 0, 0, 0, 0);` |
| `epd_cz04_draw_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value), FILL(dropdown) | `epd_cz04_draw_rect($epd, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), OUTLINE)` | `epd.drawRect(0, 0, 0, 0, 0);` |
| `epd_cz04_draw_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_value), FILL(dropdown) | `epd_cz04_draw_circle($epd, math_number(0), math_number(0), math_number(0), math_number(0), OUTLINE)` | `epd.drawCircle(0, 0, 0, 0);` |
| `epd_cz04_set_text_color` | Statement | VAR(field_variable), COLOR(input_value) | `epd_cz04_set_text_color($epd, math_number(0))` | `epd.setTextColor(0);` |
| `epd_cz04_set_text_size` | Statement | VAR(field_variable), SIZE(dropdown) | `epd_cz04_set_text_size($epd, 1)` | `epd.setTextSize(1);` |
| `epd_cz04_set_font` | Statement | VAR(field_variable), FONT(dropdown) | `epd_cz04_set_font($epd, NULL)` | `epd.setFont();` |
| `epd_cz04_set_cursor` | Statement | VAR(field_variable), X(input_value), Y(input_value) | `epd_cz04_set_cursor($epd, math_number(0), math_number(0))` | `epd.setCursor(0, 0);` |
| `epd_cz04_print` | Statement | VAR(field_variable), TEXT(input_value), MODE(dropdown) | `epd_cz04_print($epd, text("value"), print)` | `epd.print("value");` |
| `epd_cz04_cn_text` | Statement | VAR(field_variable), X(input_value), Y(input_value), TEXT(input_value), FONT(dropdown), COLOR(input_value) | `epd_cz04_cn_text($epd, math_number(0), math_number(0), text("value"), u8g2_font_wqy12_t_gb2312a, math_number(0))` | `epd_u8g2.setFont(u8g2_font_wqy12_t_gb2312a); ↵ epd_u8g2.setFontMode(1); ↵ epd_u8g2.setForegroundColor(0); ↵ epd_u8g2.setCursor(0, 0); ↵ epd_u8g2.print("value");` |
| `epd_cz04_draw_weather` | Statement | VAR(field_variable), X(input_value), Y(input_value), ICON(dropdown), COLOR(input_value) | `epd_cz04_draw_weather($epd, math_number(0), math_number(0), EPD_CZ04_WEATHER_SUNNY, math_number(0))` | `epd.drawWeatherIcon(0, 0, EPD_CZ04_WEATHER_SUNNY, 0);` |
| `epd_cz04_draw_image` | Statement | VAR(field_variable), X(input_value), Y(input_value), IMAGE(input_value), COLOR(input_value) | `epd_cz04_draw_image($epd, math_number(0), math_number(0), math_number(0), math_number(0))` | `epd.drawImage(0, 0, 0, 0);` |
| `epd_cz04_image_portrait` | Value | CUSTOM_BITMAP(field_bitmap_u8g2) | `epd_cz04_image_portrait({"schemaVersion":1,"encoding":"xbm-lsb-row-v1","width":104,"height":212,"bitmap":null})` | `epd_cz04_image_generatorcoverageepdcz04imageportrait` |
| `epd_cz04_image_landscape` | Value | CUSTOM_BITMAP(field_bitmap_u8g2) | `epd_cz04_image_landscape({"schemaVersion":1,"encoding":"xbm-lsb-row-v1","width":212,"height":104,"bitmap":null})` | `epd_cz04_image_generatorcoverageepdcz04imagelandscape` |
| `epd_cz04_image_icon` | Value | CUSTOM_BITMAP(field_bitmap_u8g2) | `epd_cz04_image_icon({"schemaVersion":1,"encoding":"xbm-lsb-row-v1","width":32,"height":32,"bitmap":null})` | `epd_cz04_image_generatorcoverageepdcz04imageicon` |
| `epd_cz04_width` | Value | VAR(field_variable) | `epd_cz04_width($epd)` | `epd.width()` |
| `epd_cz04_height` | Value | VAR(field_variable) | `epd_cz04_height($epd)` | `epd.height()` |
| `epd_cz04_color` | Value | COLOR(dropdown) | `epd_cz04_color(EPD_CZ04_BLACK)` | `EPD_CZ04_BLACK` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ROTATION | 0, 1, 2, 3 | epd_cz04_set_rotation |
| BG | WHITE, KEEP | epd_cz04_frame |
| FILL | OUTLINE, FILLED | epd_cz04_draw_rect, epd_cz04_draw_circle |
| SIZE | 1, 2, 3, 4, 5, 6 | epd_cz04_set_text_size |
| FONT | NULL, FreeSans9pt7b, FreeSansBold12pt7b, FreeSansBold18pt7b, FreeMono9pt7b, FreeMonoBold12pt7b, FreeSerif9pt7b | epd_cz04_set_font |
| MODE | print, println | epd_cz04_print |
| FONT | u8g2_font_wqy12_t_gb2312a, u8g2_font_wqy14_t_gb2312a, u8g2_font_wqy16_t_gb2312a, u8g2_font_logisoso32_tn | epd_cz04_cn_text |
| ICON | EPD_CZ04_WEATHER_SUNNY, EPD_CZ04_WEATHER_PARTLY_CLOUDY, EPD_CZ04_WEATHER_CLOUDY, EPD_CZ04_WEATHER_OVERCAST, EPD_CZ04_WEATHER_CLEAR_NIGHT, EPD_CZ04_WEATHER_CLOUDY_NIGHT, EPD_CZ04_WEATHER_SHOWER, LI... | epd_cz04_draw_weather |
| COLOR | EPD_CZ04_BLACK, EPD_CZ04_DARKGREY, EPD_CZ04_LIGHTGREY, EPD_CZ04_WHITE | epd_cz04_color |

## ABS Examples

### Basic Usage
```abs
arduino_setup()
    epd_cz04_init("epd", math_number(104), math_number(212), math_number(2), math_number(3), math_number(1), math_number(0), math_number(6), math_number(7))
    epd_cz04_clear_ghosting($epd, math_number(1))
    epd_cz04_set_rotation($epd, 1)
    epd_cz04_frame($epd, WHITE)
        @DRAW:
            epd_cz04_cn_text($epd, math_number(4), math_number(20), text("你好，墨水屏"), u8g2_font_wqy16_t_gb2312a, epd_cz04_color(EPD_CZ04_BLACK))
            epd_cz04_draw_weather($epd, math_number(170), math_number(4), EPD_CZ04_WEATHER_PARTLY_CLOUDY, epd_cz04_color(EPD_CZ04_BLACK))
            epd_cz04_draw_rect($epd, math_number(4), math_number(40), math_number(60), math_number(20), epd_cz04_color(EPD_CZ04_DARKGREY), FILLED)
            epd_cz04_set_font($epd, FreeSansBold12pt7b)
            epd_cz04_set_cursor($epd, math_number(4), math_number(90))
            epd_cz04_print($epd, text("23:45"), print)

arduino_loop()
    time_delay(math_number(1000))
```

## Notes

1. **Board, resolution and pins**: ESP32 boards. `epd_cz04_init` takes WIDTH and HEIGHT (default 104 × 212, the CZ04; keep WIDTH a multiple of 8) and CS, DC, RST, BUSY, SCK, MOSI (defaults 2, 3, 1, 0, 6, 7, the linkbit wiring), and declares `EPD_CZ04 epd(cs, dc, rst, busy, sck, mosi, width, height);` with a frame buffer of WIDTH/4 × HEIGHT bytes. When the board’s `board.json` `displayConfig` has `model` `epd_cz04` (or `cz04`), an `epd_cz04_init` taken from the toolbox starts with its `width`, `height` and `pins.cs`, `dc`, `rst`, `busy`, `sclk`, `mosi`; other boards keep the defaults and saved programs keep their values. In ABS, always write all eight numbers. The waveform is tuned for the CZ04; other sizes need a panel with the same controller. The full-screen image blocks stay 104 × 212 / 212 × 104.
2. **Variable**: `epd_cz04_init("epd", ...)` creates `$epd`; pass `$epd` directly to field_variable slots.
3. **Canvas then refresh**: drawing blocks only change the canvas. Nothing appears until `epd_cz04_display`, `epd_cz04_clear` or the end of `epd_cz04_frame`. Each refresh is a full refresh that blocks for several seconds, so do not refresh inside a fast loop.
4. **Colours**: four grey levels from `epd_cz04_color` (black, dark grey, light grey, white). Plain numbers 0..3 are grey levels too; larger values are read as RGB565 and mapped by brightness.
5. **Orientation**: portrait 104x212 (0/180) or landscape 212x104 (90/270). `epd_cz04_width` / `epd_cz04_height` follow the current orientation.
6. **Text**: `epd_cz04_print` uses Adafruit GFX fonts for Latin text; the default font is positioned by its top-left corner, the FreeFonts by the baseline. `epd_cz04_cn_text` draws UTF-8 Chinese with U8g2 fonts, (X, Y) is the baseline and the background is transparent. The 32 px digit font only has digits and : - . /
7. **Ghosting**: `epd_cz04_clear_ghosting` does black/white full refreshes (two per round) and keeps the canvas, useful once at start-up.
8. **Images**: image blocks store a 1-bit picture drawn or imported in the editor; `epd_cz04_draw_image` paints the lit pixels in the chosen colour and leaves the rest of the canvas unchanged.

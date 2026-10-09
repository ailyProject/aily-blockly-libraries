# linkbit Greyscale e-Paper

linkbit only: 2.13" 104x212 four-grey e-paper with drawing, Chinese text and weather icons

## Library Info
- **Name**: @aily-project/lib-linkbit_epd_cz04
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `linkbit_epd_init` | Statement | VAR(field_input) | `linkbit_epd_init("epd")` | `epd.begin();` |
| `linkbit_epd_set_rotation` | Statement | VAR(field_variable), ROTATION(dropdown) | `linkbit_epd_set_rotation($epd, 0)` | `epd.setRotation(0);` |
| `linkbit_epd_clear_ghosting` | Statement | VAR(field_variable), ROUNDS(input_value) | `linkbit_epd_clear_ghosting($epd, math_number(0))` | `epd.clearGhosting(0);` |
| `linkbit_epd_frame` | Statement | VAR(field_variable), BG(dropdown), DRAW(input_statement) | `linkbit_epd_frame($epd, WHITE)` | `epd.fillScreen(LINKBIT_EPD_WHITE); ↵ if (!epd.display()) { ↵ Serial.println("墨水屏刷新超时，请检查屏幕排线"); ↵ }` |
| `linkbit_epd_display` | Statement | VAR(field_variable) | `linkbit_epd_display($epd)` | `if (!epd.display()) { ↵ Serial.println("墨水屏刷新超时，请检查屏幕排线"); ↵ }` |
| `linkbit_epd_clear` | Statement | VAR(field_variable), COLOR(input_value) | `linkbit_epd_clear($epd, math_number(0))` | `epd.clear(0);` |
| `linkbit_epd_fill_screen` | Statement | VAR(field_variable), COLOR(input_value) | `linkbit_epd_fill_screen($epd, math_number(0))` | `epd.fillScreen(0);` |
| `linkbit_epd_draw_pixel` | Statement | VAR(field_variable), X(input_value), Y(input_value), COLOR(input_value) | `linkbit_epd_draw_pixel($epd, math_number(0), math_number(0), math_number(0))` | `epd.drawPixel(0, 0, 0);` |
| `linkbit_epd_draw_line` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), COLOR(input_value) | `linkbit_epd_draw_line($epd, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `epd.drawLine(0, 0, 0, 0, 0);` |
| `linkbit_epd_draw_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value), FILL(dropdown) | `linkbit_epd_draw_rect($epd, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), OUTLINE)` | `epd.drawRect(0, 0, 0, 0, 0);` |
| `linkbit_epd_draw_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_value), FILL(dropdown) | `linkbit_epd_draw_circle($epd, math_number(0), math_number(0), math_number(0), math_number(0), OUTLINE)` | `epd.drawCircle(0, 0, 0, 0);` |
| `linkbit_epd_set_text_color` | Statement | VAR(field_variable), COLOR(input_value) | `linkbit_epd_set_text_color($epd, math_number(0))` | `epd.setTextColor(0);` |
| `linkbit_epd_set_text_size` | Statement | VAR(field_variable), SIZE(dropdown) | `linkbit_epd_set_text_size($epd, 1)` | `epd.setTextSize(1);` |
| `linkbit_epd_set_font` | Statement | VAR(field_variable), FONT(dropdown) | `linkbit_epd_set_font($epd, NULL)` | `epd.setFont();` |
| `linkbit_epd_set_cursor` | Statement | VAR(field_variable), X(input_value), Y(input_value) | `linkbit_epd_set_cursor($epd, math_number(0), math_number(0))` | `epd.setCursor(0, 0);` |
| `linkbit_epd_print` | Statement | VAR(field_variable), TEXT(input_value), MODE(dropdown) | `linkbit_epd_print($epd, text("value"), print)` | `epd.print("value");` |
| `linkbit_epd_cn_text` | Statement | VAR(field_variable), X(input_value), Y(input_value), TEXT(input_value), FONT(dropdown), COLOR(input_value) | `linkbit_epd_cn_text($epd, math_number(0), math_number(0), text("value"), u8g2_font_wqy12_t_gb2312a, math_number(0))` | `epd_u8g2.setFont(u8g2_font_wqy12_t_gb2312a); ↵ epd_u8g2.setFontMode(1); ↵ epd_u8g2.setForegroundColor(0); ↵ epd_u8g2.setCursor(0, 0); ↵ epd_u8g2.print("value");` |
| `linkbit_epd_draw_weather` | Statement | VAR(field_variable), X(input_value), Y(input_value), ICON(dropdown), COLOR(input_value) | `linkbit_epd_draw_weather($epd, math_number(0), math_number(0), LINKBIT_EPD_WEATHER_SUNNY, math_number(0))` | `epd.drawWeatherIcon(0, 0, LINKBIT_EPD_WEATHER_SUNNY, 0);` |
| `linkbit_epd_draw_image` | Statement | VAR(field_variable), X(input_value), Y(input_value), IMAGE(input_value), COLOR(input_value) | `linkbit_epd_draw_image($epd, math_number(0), math_number(0), math_number(0), math_number(0))` | `epd.drawImage(0, 0, 0, 0);` |
| `linkbit_epd_image_portrait` | Value | CUSTOM_BITMAP(field_bitmap_u8g2) | `linkbit_epd_image_portrait({"schemaVersion":1,"encoding":"xbm-lsb-row-v1","width":104,"height":212,"bitmap":null})` | `linkbit_epd_image_generatorcoveragelinkbitepdimageportrait` |
| `linkbit_epd_image_landscape` | Value | CUSTOM_BITMAP(field_bitmap_u8g2) | `linkbit_epd_image_landscape({"schemaVersion":1,"encoding":"xbm-lsb-row-v1","width":212,"height":104,"bitmap":null})` | `linkbit_epd_image_generatorcoveragelinkbitepdimagelandscape` |
| `linkbit_epd_image_icon` | Value | CUSTOM_BITMAP(field_bitmap_u8g2) | `linkbit_epd_image_icon({"schemaVersion":1,"encoding":"xbm-lsb-row-v1","width":32,"height":32,"bitmap":null})` | `linkbit_epd_image_generatorcoveragelinkbitepdimageicon` |
| `linkbit_epd_width` | Value | VAR(field_variable) | `linkbit_epd_width($epd)` | `epd.width()` |
| `linkbit_epd_height` | Value | VAR(field_variable) | `linkbit_epd_height($epd)` | `epd.height()` |
| `linkbit_epd_color` | Value | COLOR(dropdown) | `linkbit_epd_color(LINKBIT_EPD_BLACK)` | `LINKBIT_EPD_BLACK` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ROTATION | 0, 1, 2, 3 | linkbit_epd_set_rotation |
| BG | WHITE, KEEP | linkbit_epd_frame |
| FILL | OUTLINE, FILLED | linkbit_epd_draw_rect, linkbit_epd_draw_circle |
| SIZE | 1, 2, 3, 4, 5, 6 | linkbit_epd_set_text_size |
| FONT | NULL, FreeSans9pt7b, FreeSansBold12pt7b, FreeSansBold18pt7b, FreeMono9pt7b, FreeMonoBold12pt7b, FreeSerif9pt7b | linkbit_epd_set_font |
| MODE | print, println | linkbit_epd_print |
| FONT | u8g2_font_wqy12_t_gb2312a, u8g2_font_wqy14_t_gb2312a, u8g2_font_wqy16_t_gb2312a, u8g2_font_logisoso32_tn | linkbit_epd_cn_text |
| ICON | LINKBIT_EPD_WEATHER_SUNNY, LINKBIT_EPD_WEATHER_PARTLY_CLOUDY, LINKBIT_EPD_WEATHER_CLOUDY, LINKBIT_EPD_WEATHER_OVERCAST, LINKBIT_EPD_WEATHER_CLEAR_NIGHT, LINKBIT_EPD_WEATHER_CLOUDY_NIGHT, LINKBIT_EPD_WEATHER_SHOWER, LI... | linkbit_epd_draw_weather |
| COLOR | LINKBIT_EPD_BLACK, LINKBIT_EPD_DARKGREY, LINKBIT_EPD_LIGHTGREY, LINKBIT_EPD_WHITE | linkbit_epd_color |

## ABS Examples

### Basic Usage
```abs
arduino_setup()
    linkbit_epd_init("epd")
    linkbit_epd_clear_ghosting($epd, math_number(1))
    linkbit_epd_set_rotation($epd, 1)
    linkbit_epd_frame($epd, WHITE)
        @DRAW:
            linkbit_epd_cn_text($epd, math_number(4), math_number(20), text("你好，linkbit"), u8g2_font_wqy16_t_gb2312a, linkbit_epd_color(LINKBIT_EPD_BLACK))
            linkbit_epd_draw_weather($epd, math_number(170), math_number(4), LINKBIT_EPD_WEATHER_PARTLY_CLOUDY, linkbit_epd_color(LINKBIT_EPD_BLACK))
            linkbit_epd_draw_rect($epd, math_number(4), math_number(40), math_number(60), math_number(20), linkbit_epd_color(LINKBIT_EPD_DARKGREY), FILLED)
            linkbit_epd_set_font($epd, FreeSansBold12pt7b)
            linkbit_epd_set_cursor($epd, math_number(4), math_number(90))
            linkbit_epd_print($epd, text("23:45"), print)

arduino_loop()
    time_delay(math_number(1000))
```

## Notes

1. **Board**: linkbit (ESP32-C3) only. The panel pins are fixed (CS=2 DC=3 RST=1 BUSY=0 SCK=6 MOSI=7), so there are no pin fields.
2. **Variable**: `linkbit_epd_init("epd")` creates `$epd`; pass `$epd` directly to field_variable slots.
3. **Canvas then refresh**: drawing blocks only change the canvas. Nothing appears until `linkbit_epd_display`, `linkbit_epd_clear` or the end of `linkbit_epd_frame`. Each refresh is a full refresh that blocks for several seconds, so do not refresh inside a fast loop.
4. **Colours**: four grey levels from `linkbit_epd_color` (black, dark grey, light grey, white). Plain numbers 0..3 are grey levels too; larger values are read as RGB565 and mapped by brightness.
5. **Orientation**: portrait 104x212 (0/180) or landscape 212x104 (90/270). `linkbit_epd_width` / `linkbit_epd_height` follow the current orientation.
6. **Text**: `linkbit_epd_print` uses Adafruit GFX fonts for Latin text; the default font is positioned by its top-left corner, the FreeFonts by the baseline. `linkbit_epd_cn_text` draws UTF-8 Chinese with U8g2 fonts, (X, Y) is the baseline and the background is transparent. The 32 px digit font only has digits and : - . /
7. **Ghosting**: `linkbit_epd_clear_ghosting` does black/white full refreshes (two per round) and keeps the canvas, useful once at start-up.
8. **Images**: image blocks store a 1-bit picture drawn or imported in the editor; `linkbit_epd_draw_image` paints the lit pixels in the chosen colour and leaves the rest of the canvas unchanged.

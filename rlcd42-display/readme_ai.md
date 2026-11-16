# @aily-project/lib-rlcd42-display

## Library Info

- **Name**: @aily-project/lib-rlcd42-display
- **Version**: 0.0.1
- **Purpose**: Driver for the on-board 4.2-inch ST7305 reflective panel of the Waveshare ESP32-S3-RLCD-4.2 (400x300 landscape, 300x400 portrait). Provides initialisation, clearing, pixels, lines, rectangles, circles, ASCII text, Chinese text, wrapped multi-line text, emotion faces and full-frame refresh.
- **Wiring**: fixed on-board SPI3, MOSI=12 SCK=11 DC=5 CS=40 RST=41, no external wiring.
- **License**: UNLICENSED (see package.json). Author: Bryan.

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| --- | --- | --- | --- | --- |
| `rlcd42_display_init` | Statement | ORIENTATION(dropdown) | `rlcd42_display_init(LANDSCAPE)` | `#include "Rlcd42.h"`↵`rlcd42.begin(true);` |
| `rlcd42_clear` | Statement | COLOR(dropdown) | `rlcd42_clear(WHITE)` | `#include "Rlcd42.h"`↵`rlcd42.clear(false);` |
| `rlcd42_draw_pixel` | Statement | X(input_value), Y(input_value), COLOR(dropdown) | `rlcd42_draw_pixel(math_number(10), math_number(10), BLACK)` | `#include "Rlcd42.h"`↵`rlcd42.setPixel(10, 10, true);` |
| `rlcd42_draw_line` | Statement | X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), COLOR(dropdown) | `rlcd42_draw_line(math_number(0), math_number(0), math_number(100), math_number(100), BLACK)` | `#include "Rlcd42.h"`↵`rlcd42.drawLine(0, 0, 100, 100, true);` |
| `rlcd42_draw_rect` | Statement | X(input_value), Y(input_value), W(input_value), H(input_value), FILL(field_checkbox), COLOR(dropdown) | `rlcd42_draw_rect(math_number(0), math_number(0), math_number(400), math_number(30), TRUE, BLACK)` | `#include "Rlcd42.h"`↵`rlcd42.drawRect(0, 0, 400, 30, true, true);` |
| `rlcd42_draw_circle` | Statement | X(input_value), Y(input_value), R(input_value), FILL(field_checkbox), COLOR(dropdown) | `rlcd42_draw_circle(math_number(200), math_number(150), math_number(40), FALSE, BLACK)` | `#include "Rlcd42.h"`↵`rlcd42.drawCircle(200, 150, 40, false, true);` |
| `rlcd42_draw_str` | Statement | X(input_value), Y(input_value), TEXT(input_value), SCALE(input_value), COLOR(dropdown) | `rlcd42_draw_str(math_number(8), math_number(12), text("12:30"), math_number(2), BLACK)` | `#include "Rlcd42.h"`↵`rlcd42.drawStr(8, 12, String("12:30").c_str(), 2, true);` |
| `rlcd42_draw_text` | Statement | X(input_value), Y(input_value), TEXT(input_value), SCALE(input_value), COLOR(dropdown) | `rlcd42_draw_text(math_number(20), math_number(60), text("temperature"), math_number(1), BLACK)` | `#include "Rlcd42.h"`↵`rlcd42.drawText(20, 60, String("temperature").c_str(), 1, true);` |
| `rlcd42_draw_text_wrap` | Statement | X(input_value), Y(input_value), W(input_value), LH(input_value), TEXT(input_value), SCALE(input_value), COLOR(dropdown) | `rlcd42_draw_text_wrap(math_number(20), math_number(150), math_number(288), math_number(18), text("wrapped line"), math_number(1), BLACK)` | `#include "Rlcd42.h"`↵`rlcd42.drawTextWrap(20, 150, 288, 18, String("wrapped line").c_str(), 1, true);` |
| `rlcd42_draw_emotion` | Statement | ID(input_value), X(input_value), Y(input_value), SIZE(input_value), COLOR(dropdown) | `rlcd42_draw_emotion(math_number(2), math_number(292), math_number(52), math_number(96), BLACK)` | `#include "Rlcd42.h"`↵`rlcd42.drawEmotion((int)(2), (int)(292), (int)(52), (int)(96), true);` |
| `rlcd42_display` | Statement | (none) | `rlcd42_display()` | `#include "Rlcd42.h"`↵`rlcd42.display();` |
| `rlcd42_width` | Value | (none) | `rlcd42_width()` | `#include "Rlcd42.h"`↵`rlcd42.width()` |
| `rlcd42_height` | Value | (none) | `rlcd42_height()` | `#include "Rlcd42.h"`↵`rlcd42.height()` |

## Parameter Options

| Parameter | Values | Description |
| --- | --- | --- |
| ORIENTATION | LANDSCAPE, PORTRAIT | `LANDSCAPE` is 400x300, `PORTRAIT` is 300x400. |
| COLOR | BLACK, WHITE | Ink colour. On `rlcd42_clear`, `WHITE` clears to the light background and `BLACK` clears to a filled dark screen. |
| FILL | TRUE, FALSE | `TRUE` fills the shape, `FALSE` draws only the outline. |
| SCALE | integer value input | Text magnification. `drawStr` accepts 1-8, `drawText` accepts 1-4. |
| ID | integer value input | Xiaozhi emotion id 0-21, see the emotion table below. |

## Emotion faces (`rlcd42_draw_emotion`)

Ids match the Xiaozhi `Emotion` enum, so `xiaozhi_emotion_id()` can be connected
directly. The standard Xiaozhi set is 21 emotions with `neutral` as the default.

| ID | Name | ID | Name | ID | Name |
| --- | --- | --- | --- | --- | --- |
| 0 | unknown (fallback) | 8 | loving | 16 | delicious |
| 1 | neutral | 9 | embarrassed | 17 | kissy |
| 2 | happy | 10 | surprised | 18 | confident |
| 3 | laughing | 11 | shocked | 19 | sleepy |
| 4 | funny | 12 | thinking | 20 | silly |
| 5 | sad | 13 | winking | 21 | confused |
| 6 | angry | 14 | cool | | |
| 7 | crying | 15 | relaxed | | |

## ABS Examples

### Text and shapes on the panel

```abs
arduino_setup()
    serial_begin(Serial, 9600)
    rlcd42_display_init(LANDSCAPE)

arduino_loop()
    rlcd42_clear(WHITE)
    rlcd42_draw_str(math_number(8), math_number(12), text("12:30"), math_number(2), BLACK)
    rlcd42_draw_rect(math_number(0), math_number(0), rlcd42_width(), math_number(30), FALSE, BLACK)
    rlcd42_draw_line(math_number(0), math_number(40), math_number(100), math_number(100), BLACK)
    rlcd42_draw_circle(math_number(200), math_number(150), math_number(40), FALSE, BLACK)
    rlcd42_display()
    time_delay(math_number(1000))
```

### Wrapped Chinese text

```abs
arduino_setup()
    serial_begin(Serial, 9600)
    rlcd42_display_init(PORTRAIT)

arduino_loop()
    rlcd42_clear(WHITE)
    rlcd42_draw_text_wrap(math_number(20), math_number(150), rlcd42_width(), math_number(18), text("wrapped line"), math_number(1), BLACK)
    rlcd42_display()
    time_delay(math_number(1000))
```

## Notes

- Call `rlcd42_display_init` once in `arduino_setup()` before any drawing block.
- Always call `rlcd42_display` after drawing to push the frame buffer to the panel. Without it the panel keeps showing the previous frame.
- `rlcd42_draw_str` uses the built-in 5x7 ASCII font (codes 0x20-0x7E) with scale 1-8. Characters outside that range, including emoji, render as `?`.
- `rlcd42_draw_text` supports ASCII plus 6763 GB2312 Chinese glyphs in 16x16 cells with scale 1-4. The font carries hanzi only, so common full-width punctuation is mapped to close ASCII equivalents, and anything else outside the font (emoji, rare hanzi) is skipped instead of drawing a `?`.
- `rlcd42_draw_text_wrap` needs a positive width and line height; text is wrapped at the given width and each line advances by `LH` pixels.
- `rlcd42_draw_emotion` draws a face inside the `SIZE x SIZE` box whose top-left corner is `(X, Y)`. For ids 1-21 the block blits a 1-bit bitmap converted from the Xiaozhi twemoji32 set: silhouette outline ring plus luminance threshold, so dark features are black and the face body stays white. The requested size snaps to the closer master (48 px or 72 px); only id 0 or an out-of-range id uses the vector fallback face.
- Emotion ids outside 0-21 do not fail; they draw the unknown face.
- `rlcd42_width` and `rlcd42_height` return the logical size for the current orientation, so they can size layouts without hard-coding 400x300.
- Coordinates are in panel pixels with `(0, 0)` at the top-left corner of the current orientation.

# LED Backpack Display

Adafruit LED Backpack driver library based on HT16K33 chip, supports multiple display modules via I2C: 4-digit 7-segment, 4-digit 14-segment alphanumeric, 8x8 matrix, 8x16 matrix, bi-color matrix, and 24-bar bargraph.

## Library Info
- **Name**: @aily-project/lib-adafruit-ledbackpack
- **Version**: 1.5.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ledbp_init` | Statement | DISPLAY_TYPE(dropdown), ADDR(input_value) | `ledbp_init(Adafruit_7segment, math_number(0))` | Dynamic code |
| `ledbp_write_display` | Statement | (none) | `ledbp_write_display()` | ledbp.writeDisplay();\n |
| `ledbp_clear` | Statement | (none) | `ledbp_clear()` | ledbp.clear();\n |
| `ledbp_set_brightness` | Statement | BRIGHTNESS(input_value) | `ledbp_set_brightness(math_number(0))` | ledbp.setBrightness( |
| `ledbp_blink_rate` | Statement | RATE(dropdown) | `ledbp_blink_rate(HT16K33_BLINK_OFF)` | ledbp.blinkRate( |
| `ledbp_set_display_state` | Statement | STATE(dropdown) | `ledbp_set_display_state(true)` | ledbp.setDisplayState( |
| `ledbp_seven_print_number` | Statement | NUM(input_value) | `ledbp_seven_print_number(math_number(0))` | ledbp.print( |
| `ledbp_seven_print_number_base` | Statement | NUM(input_value), BASE(dropdown) | `ledbp_seven_print_number_base(math_number(0), DEC)` | ledbp.print( |
| `ledbp_seven_write_digit_num` | Statement | POS(input_value), NUM(input_value), DOT(dropdown) | `ledbp_seven_write_digit_num(math_number(0), math_number(0), false)` | ledbp.writeDigitNum( |
| `ledbp_seven_draw_colon` | Statement | STATE(dropdown) | `ledbp_seven_draw_colon(true)` | ledbp.drawColon( |
| `ledbp_alpha_write_digit_ascii` | Statement | POS(input_value), CHAR(input_value), DOT(dropdown) | `ledbp_alpha_write_digit_ascii(math_number(0), math_number(0), false)` | ledbp.writeDigitAscii( |
| `ledbp_alpha_print_text` | Statement | TEXT(input_value) | `ledbp_alpha_print_text(text("value"))` | ledbp_alpha_print(ledbp, |
| `ledbp_matrix_color` | Value | COLOR(dropdown) | `ledbp_matrix_color(LED_ON)` | Dynamic code |
| `ledbp_matrix_draw_pixel` | Statement | X(input_value), Y(input_value), COLOR(input_value) | `ledbp_matrix_draw_pixel(math_number(0), math_number(0), math_number(0))` | ledbp.drawPixel( |
| `ledbp_matrix_draw_line` | Statement | X0(input_value), Y0(input_value), X1(input_value), Y1(input_value), COLOR(input_value) | `ledbp_matrix_draw_line(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | ledbp.drawLine( |
| `ledbp_matrix_draw_rect` | Statement | X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value) | `ledbp_matrix_draw_rect(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | ledbp.drawRect( |
| `ledbp_matrix_fill_rect` | Statement | X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value) | `ledbp_matrix_fill_rect(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | ledbp.fillRect( |
| `ledbp_matrix_draw_circle` | Statement | X(input_value), Y(input_value), R(input_value), COLOR(input_value) | `ledbp_matrix_draw_circle(math_number(0), math_number(0), math_number(0), math_number(0))` | ledbp.drawCircle( |
| `ledbp_matrix_set_text_size` | Statement | SIZE(input_value) | `ledbp_matrix_set_text_size(math_number(0))` | ledbp.setTextSize( |
| `ledbp_matrix_set_text_color` | Statement | COLOR(input_value) | `ledbp_matrix_set_text_color(math_number(0))` | ledbp.setTextColor( |
| `ledbp_matrix_set_cursor` | Statement | X(input_value), Y(input_value) | `ledbp_matrix_set_cursor(math_number(0), math_number(0))` | ledbp.setCursor( |
| `ledbp_matrix_print` | Statement | TEXT(input_value) | `ledbp_matrix_print(text("value"))` | ledbp.print( |
| `ledbp_matrix_set_rotation` | Statement | ROTATION(dropdown) | `ledbp_matrix_set_rotation("0")` | ledbp.setRotation( |
| `ledbp_matrix_set_text_wrap` | Statement | WRAP(dropdown) | `ledbp_matrix_set_text_wrap(true)` | ledbp.setTextWrap( |
| `ledbp_bar_set_bar` | Statement | BAR(input_value), COLOR(input_value) | `ledbp_bar_set_bar(math_number(0), math_number(0))` | ledbp.setBar( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DISPLAY_TYPE | Adafruit_7segment, Adafruit_AlphaNum4, Adafruit_8x8matrix, Adafruit_8x16matrix, Adafruit_8x16minimatrix, Adafruit_BicolorMatrix, Adafruit_24bargraph | ledbp_init |
| RATE | HT16K33_BLINK_OFF, HT16K33_BLINK_2HZ, HT16K33_BLINK_1HZ, HT16K33_BLINK_HALFHZ | ledbp_blink_rate |
| STATE | true, false | ledbp_set_display_state, ledbp_seven_draw_colon |
| BASE | DEC, HEX, BIN, OCT | ledbp_seven_print_number_base |
| DOT | false, true | ledbp_seven_write_digit_num, ledbp_alpha_write_digit_ascii |
| COLOR | LED_ON, LED_OFF, LED_RED, LED_YELLOW, LED_GREEN | ledbp_matrix_color |
| ROTATION | 0, 1, 2, 3 | ledbp_matrix_set_rotation |
| WRAP | true, false | ledbp_matrix_set_text_wrap |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ledbp_init(Adafruit_7segment, math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ledbp_matrix_color(LED_ON))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

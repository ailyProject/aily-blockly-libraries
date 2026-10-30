# IBox S31 RGB LED

IBox S31 onboard four WS2812 LEDs (IO38): colours, brightness, bar, rainbow and animations

## Library Info
- **Name**: @aily-project/lib-iboxs31_rgbled
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `iboxs31_led_init` | Statement | DATA_PIN(dropdown), COUNT(field_number) | `iboxs31_led_init(DATA_PIN, 4)` | `iboxs31_led.begin(DATA_PIN, 4); ↵ iboxs31_led.setAutoShow(true);` |
| `iboxs31_led_brightness` | Statement | BRIGHTNESS(input_value) | `iboxs31_led_brightness(math_number(0))` | `iboxs31_led.setBrightness((uint8_t)constrain((int)(0), 0, 255));` |
| `iboxs31_led_set_pixel` | Statement | INDEX(input_value), COLOR(input_value) | `iboxs31_led_set_pixel(math_number(0), math_number(0))` | `iboxs31_led.setPixel((int)(0) - 1, (uint32_t)(0));` |
| `iboxs31_led_set_range` | Statement | START(input_value), END(input_value), COLOR(input_value) | `iboxs31_led_set_range(math_number(0), math_number(0), math_number(0))` | `iboxs31_led.fillRange((int)(0) - 1, (int)(0) - 1, (uint32_t)(0));` |
| `iboxs31_led_fill` | Statement | COLOR(input_value) | `iboxs31_led_fill(math_number(0))` | `iboxs31_led.fill((uint32_t)(0));` |
| `iboxs31_led_bar` | Statement | START(input_value), END(input_value), LEVEL(input_value), FOREGROUND(input_value), BACKGROUND(input_value) | `iboxs31_led_bar(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `iboxs31_led.bar((int)(0) - 1, (int)(0) - 1, (int)(0), (uint32_t)(0), (uint32_t)(0));` |
| `iboxs31_led_rainbow` | Statement | HUE(input_value), DELTA(input_value) | `iboxs31_led_rainbow(math_number(0), math_number(0))` | `iboxs31_led.rainbow((uint8_t)((int)(0) & 0xFF), (uint8_t)((int)(0) & 0xFF));` |
| `iboxs31_led_effect` | Statement | EFFECT(dropdown), COLOR(input_value), SPEED(input_value) | `iboxs31_led_effect(RAINBOW, math_number(0), math_number(9600))` | `iboxs31_led.effect(IBoxS31_LED::RAINBOW, (uint32_t)(0), (uint8_t)constrain((int)(9600), 1, 10));` |
| `iboxs31_led_clear` | Statement | (none) | `iboxs31_led_clear()` | `iboxs31_led.clear();` |
| `iboxs31_led_auto_show` | Statement | STATE(dropdown) | `iboxs31_led_auto_show(true)` | `iboxs31_led.setAutoShow(true);` |
| `iboxs31_led_show` | Statement | (none) | `iboxs31_led_show()` | `iboxs31_led.show();` |
| `iboxs31_led_count` | Value | (none) | `iboxs31_led_count()` | `iboxs31_led.count()` |
| `iboxs31_led_color` | Value | COLOR(field_colour_hsv_sliders) | `iboxs31_led_color("#ff0000")` | `0xFF0000` |
| `iboxs31_led_rgb` | Value | RED(input_value), GREEN(input_value), BLUE(input_value) | `iboxs31_led_rgb(math_number(0), math_number(0), math_number(0))` | `IBoxS31_LED::rgb((uint8_t)constrain((int)(0), 0, 255), (uint8_t)constrain((int)(0), 0, 255), (uint8_t)constrain((int)(0), 0, 255))` |
| `iboxs31_led_hsv` | Value | HUE(input_value), SATURATION(input_value), VALUE(input_value) | `iboxs31_led_hsv(math_number(0), math_number(0), math_number(0))` | `IBoxS31_LED::hsv((uint8_t)((int)(0) & 0xFF), (uint8_t)constrain((int)(0), 0, 255), (uint8_t)constrain((int)(0), 0, 255))` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| EFFECT | RAINBOW, BREATH, CHASE, TWINKLE, BLINK | iboxs31_led_effect |
| STATE | true, false | iboxs31_led_auto_show |

## ABS Examples

### Colours, a bar and a moving rainbow
```abs
arduino_global()
    variable_define("hue", int, math_number(0))

arduino_setup()
    iboxs31_led_init(38, 4)
    iboxs31_led_brightness(math_number(40))
    iboxs31_led_set_pixel(math_number(1), iboxs31_led_color("#ff0000"))
    iboxs31_led_set_range(math_number(2), math_number(3), iboxs31_led_rgb(math_number(0), math_number(255), math_number(0)))
    iboxs31_led_set_pixel(math_number(4), iboxs31_led_hsv(math_number(160), math_number(255), math_number(255)))
    time_delay(math_number(1000))
    iboxs31_led_bar(math_number(1), math_number(4), math_number(3), iboxs31_led_color("#00ff00"), iboxs31_led_color("#000000"))
    time_delay(math_number(1000))

arduino_loop()
    iboxs31_led_rainbow(variables_get($hue), math_number(64))
    variables_set($hue, math_arithmetic(variables_get($hue), ADD, math_number(4)))
    time_delay(math_number(30))
```

### Breathing animation that keeps the loop free
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    iboxs31_led_init(38, 4)
    iboxs31_led_brightness(math_number(60))

arduino_loop()
    iboxs31_led_effect(BREATH, iboxs31_led_color("#00a0ff"), math_number(5))
    serial_println(Serial, time_millis())
```

## Notes

1. **Board**: IBox S31 only (Aily board IBOX S31, ESP32-S31, Arduino-ESP32 4.0.0). Four WS2812 LEDs on IO38 (`GPIO38/WS2812` in the pin list), GRB order, driven by the core RMT API at 10 MHz; an external WS2812 strip works too by choosing its pin and count in `iboxs31_led_init`.
2. **Colours**: colour blocks give a 0xRRGGBB number, so a plain number such as `math_number(16711680)` (red) also works. LEDs are numbered from 1. Brightness 0–255 scales the output only; 255 is very bright on the board.
3. **Refresh**: after init every change shows at once; turn auto refresh off to set many LEDs and show them together with `iboxs31_led_show`. `iboxs31_led_effect` draws one frame per call from `millis()` (at most 50 per second), so keep it in the loop without long delays.
4. **Origin**: the RMT waveform code comes from the board_test port (IBoxS31_Buttons); the block set follows the aily FastLED strip library without using FastLED itself.

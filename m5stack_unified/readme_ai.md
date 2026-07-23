# M5Stack Onboard Hardware

Blockly bindings for the official M5Unified and M5GFX libraries. The selected M5Stack board is detected automatically, with no onboard pin configuration required.

## Library Info
- **Name**: @aily-project/lib-m5stack-unified
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `m5stack_init` | Statement | (none) | `m5stack_init()` | Dynamic code |
| `m5stack_has_feature` | Value | FEATURE(dropdown) | `m5stack_has_feature(DISPLAY)` | Dynamic code |
| `m5stack_display_fill` | Statement | COLOR(input_value) | `m5stack_display_fill(math_number(0))` | M5.Display.fillScreen( |
| `m5stack_display_refresh` | Statement | (none) | `m5stack_display_refresh()` | M5.Display.display();\n |
| `m5stack_display_set_rotation` | Statement | ROTATION(dropdown) | `m5stack_display_set_rotation("0")` | M5.Display.setRotation( |
| `m5stack_display_set_brightness` | Statement | VALUE(input_value) | `m5stack_display_set_brightness(math_number(0))` | M5.Display.setBrightness((uint8_t)constrain( |
| `m5stack_display_draw_pixel` | Statement | X(input_value), Y(input_value), COLOR(input_value) | `m5stack_display_draw_pixel(math_number(0), math_number(0), math_number(0))` | M5.Display.drawPixel( |
| `m5stack_display_draw_line` | Statement | X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), COLOR(input_value) | `m5stack_display_draw_line(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | M5.Display.drawLine( |
| `m5stack_display_rect` | Statement | MODE(dropdown), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value) | `m5stack_display_rect(OUTLINE, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | M5.Display. |
| `m5stack_display_circle` | Statement | MODE(dropdown), X(input_value), Y(input_value), R(input_value), COLOR(input_value) | `m5stack_display_circle(OUTLINE, math_number(0), math_number(0), math_number(0), math_number(0))` | M5.Display. |
| `m5stack_display_text_style` | Statement | COLOR(input_value), BACKGROUND(input_value), SIZE(input_value) | `m5stack_display_text_style(math_number(0), math_number(0), math_number(0))` | M5.Display.setTextColor( |
| `m5stack_display_set_cursor` | Statement | X(input_value), Y(input_value) | `m5stack_display_set_cursor(math_number(0), math_number(0))` | M5.Display.setCursor( |
| `m5stack_display_print` | Statement | TEXT(input_value), NEWLINE(field_checkbox) | `m5stack_display_print(text("value"), TRUE)` | M5.Display. |
| `m5stack_display_draw_string` | Statement | TEXT(input_value), X(input_value), Y(input_value) | `m5stack_display_draw_string(text("value"), math_number(0), math_number(0))` | M5.Display.drawString(String( |
| `m5stack_display_size` | Value | DIMENSION(dropdown) | `m5stack_display_size(WIDTH)` | M5.Display. |
| `m5stack_color` | Value | COLOR(dropdown) | `m5stack_color(TFT_BLACK)` | Dynamic code |
| `m5stack_color_rgb` | Value | R(input_value), G(input_value), B(input_value) | `m5stack_color_rgb(math_number(0), math_number(0), math_number(0))` | M5.Display.color565( |
| `m5stack_button_state` | Value | BUTTON(dropdown), STATE(dropdown) | `m5stack_button_state(BtnA, isPressed)` | Dynamic code |
| `m5stack_button_event` | Value | BUTTON(dropdown), EVENT(dropdown) | `m5stack_button_event(BtnA, wasPressed)` | Dynamic code |
| `m5stack_touch_state` | Value | STATE(dropdown) | `m5stack_touch_state(isPressed)` | M5.Touch.getDetail(). |
| `m5stack_touch_coordinate` | Value | AXIS(dropdown) | `m5stack_touch_coordinate(X)` | M5.Touch.getDetail(). |
| `m5stack_imu_value` | Value | SENSOR(dropdown), AXIS(dropdown) | `m5stack_imu_value(ACCEL, X)` | ailyM5ImuValue( |
| `m5stack_rtc_get` | Value | PART(dropdown) | `m5stack_rtc_get(YEAR)` | ailyM5RtcPart( |
| `m5stack_rtc_set` | Statement | YEAR(input_value), MONTH(input_value), DAY(input_value), HOUR(input_value), MINUTE(input_value), SECOND(input_value) | `m5stack_rtc_set(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | ailyM5RtcSet( |
| `m5stack_speaker_tone` | Statement | FREQUENCY(input_value), DURATION(input_value) | `m5stack_speaker_tone(math_number(0), math_number(1000))` | if (M5.Speaker.isEnabled()) M5.Speaker.tone( |
| `m5stack_speaker_stop` | Statement | (none) | `m5stack_speaker_stop()` | M5.Speaker.stop();\n |
| `m5stack_speaker_volume` | Statement | VALUE(input_value) | `m5stack_speaker_volume(math_number(0))` | M5.Speaker.setVolume((uint8_t)constrain( |
| `m5stack_mic_level` | Value | (none) | `m5stack_mic_level()` | ailyM5MicLevel() |
| `m5stack_power_value` | Value | VALUE(dropdown) | `m5stack_power_value(LEVEL)` | Dynamic code |
| `m5stack_power_charging` | Value | (none) | `m5stack_power_charging()` | Dynamic code |
| `m5stack_power_ext_output` | Statement | ENABLED(field_checkbox) | `m5stack_power_ext_output(TRUE)` | M5.Power.setExtOutput( |
| `m5stack_power_sleep` | Statement | MODE(dropdown), SECONDS(input_value) | `m5stack_power_sleep(TIMER, math_number(10))` | Dynamic code |
| `m5stack_vibration` | Statement | VALUE(input_value) | `m5stack_vibration(math_number(128))` | M5.Power.setVibration( |
| `m5stack_status_led` | Statement | VALUE(input_value) | `m5stack_status_led(math_number(255))` | M5.Power.setLed( |
| `m5stack_power_off` | Statement | (none) | `m5stack_power_off()` | M5.Power.powerOff();\n |
| `m5stack_led_set_all` | Statement | R(input_value), G(input_value), B(input_value) | `m5stack_led_set_all(math_number(0), math_number(0), math_number(0))` | if (M5.Led.isEnabled()) M5.Led.setAllColor( |
| `m5stack_led_set_one` | Statement | INDEX(input_value), R(input_value), G(input_value), B(input_value) | `m5stack_led_set_one(math_number(0), math_number(0), math_number(0), math_number(0))` | if (M5.Led.isEnabled()) M5.Led.setColor( |
| `m5stack_led_brightness` | Statement | VALUE(input_value) | `m5stack_led_brightness(math_number(0))` | if (M5.Led.isEnabled()) M5.Led.setBrightness((uint8_t)constrain( |
| `m5stack_led_count` | Value | (none) | `m5stack_led_count()` | M5.Led.getCount() |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FEATURE | DISPLAY, TOUCH, IMU, RTC, SPEAKER, MIC, LED, SD, BATTERY | m5stack_has_feature |
| ROTATION | 0, 1, 2, 3 | m5stack_display_set_rotation |
| MODE | OUTLINE, FILL | m5stack_display_rect, m5stack_display_circle |
| DIMENSION | WIDTH, HEIGHT | m5stack_display_size |
| COLOR | TFT_BLACK, TFT_WHITE, TFT_RED, TFT_GREEN, TFT_BLUE, TFT_YELLOW, TFT_CYAN, TFT_MAGENTA, TFT_ORANGE | m5stack_color |
| BUTTON | BtnA, BtnB, BtnC, BtnPWR, BtnEXT | m5stack_button_state, m5stack_button_event |
| STATE | isPressed, isReleased, isHolding | m5stack_button_state |
| EVENT | wasPressed, wasReleased, wasClicked, wasDoubleClicked, wasHold | m5stack_button_event |
| STATE | isPressed, wasPressed, wasReleased, isHolding, wasClicked | m5stack_touch_state |
| AXIS | X, Y | m5stack_touch_coordinate |
| SENSOR | ACCEL, GYRO, MAG, TEMP | m5stack_imu_value |
| AXIS | X, Y, Z | m5stack_imu_value |
| PART | YEAR, MONTH, DAY, HOUR, MINUTE, SECOND | m5stack_rtc_get |
| VALUE | LEVEL, VOLTAGE, CURRENT | m5stack_power_value |
| MODE | TIMER, DEEP, LIGHT | m5stack_power_sleep |

## ABS Examples

### Basic Usage
```
arduino_setup()
    m5stack_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, m5stack_has_feature(DISPLAY))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **Official source versions**: bundled `src.7z` contains M5Unified 0.2.18 and M5GFX 0.2.26.
4. **Aily compatibility**: upstream `ESP_IDF_VERSION_VAL(...)` comparisons use equivalent hexadecimal constants because Aily Builder 1.2.10 cannot evaluate function-style macros during dependency analysis; runtime branch selection is unchanged.
5. **Build coverage**: Arduino-ESP32 3.3.10 builds passed for M5Stack Core, Cardputer, Dial, DinMeter, and the fixed-pin SD wrapper. NanoC6 and Tab5 require the local `esp32c6-libs` and `esp32p4_es-libs` tool packages.
6. **Capability fixes**: battery presence uses the documented `getBatteryLevel() != -2` unsupported sentinel; Tough is recognized as having SD despite the missing upstream SD table entry; NanoC6 RGB power GPIO19 is enabled automatically.

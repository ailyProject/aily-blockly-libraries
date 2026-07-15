# Wio Terminal Buttons

Wio Terminal A/B/C buttons and 5-way switch with OneButton event handling.

## Library Info
- **Name**: @aily-project/lib-seeed-wio-buttons
- **Version**: 1.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `wio_buttons_setup` | Statement | (none) | `wio_buttons_setup()` | initializes all OneButton objects |
| `wio_button_is_pressed` | Value | BUTTON(dropdown) | `wio_button_is_pressed(WIO_KEY_A)` | `<object>.debouncedValue()` |
| `wio_switch_is_pressed` | Value | DIRECTION(dropdown) | `wio_switch_is_pressed(WIO_5S_UP)` | `<object>.debouncedValue()` |
| `wio_control_on_event` | Hat | CONTROL(dropdown), EVENT(dropdown) | `wio_control_on_event(WIO_KEY_A, CLICK)` | `<object>.attachClick(callback)` |
| `wio_control_set_debounce_ms` | Statement | CONTROL(dropdown), MS(value) | `wio_control_set_debounce_ms(WIO_KEY_A, math_number(50))` | `<object>.setDebounceMs(50)` |
| `wio_control_set_click_ms` | Statement | CONTROL(dropdown), MS(value) | `wio_control_set_click_ms(WIO_KEY_A, math_number(400))` | `<object>.setClickMs(400)` |
| `wio_control_set_press_ms` | Statement | CONTROL(dropdown), MS(value) | `wio_control_set_press_ms(WIO_KEY_A, math_number(800))` | `<object>.setPressMs(800)` |
| `wio_control_set_long_press_interval_ms` | Statement | CONTROL(dropdown), MS(value) | `wio_control_set_long_press_interval_ms(WIO_KEY_A, math_number(1000))` | `<object>.setLongPressIntervalMs(1000)` |
| `wio_control_is_long_pressed` | Value | CONTROL(dropdown) | `wio_control_is_long_pressed(WIO_KEY_A)` | `<object>.isLongPressed()` |
| `wio_control_get_pressed_ms` | Value | CONTROL(dropdown) | `wio_control_get_pressed_ms(WIO_KEY_A)` | `<object>.getPressedMs()` |
| `wio_control_get_number_clicks` | Value | CONTROL(dropdown) | `wio_control_get_number_clicks(WIO_KEY_A)` | `<object>.getNumberClicks()` |
| `wio_control_reset` | Statement | CONTROL(dropdown) | `wio_control_reset(WIO_KEY_A)` | `<object>.reset()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BUTTON | `WIO_KEY_A`, `WIO_KEY_B`, `WIO_KEY_C` | top buttons |
| DIRECTION | `WIO_5S_UP`, `WIO_5S_DOWN`, `WIO_5S_LEFT`, `WIO_5S_RIGHT`, `WIO_5S_PRESS` | 5-way switch |
| CONTROL | all BUTTON and DIRECTION values | any onboard input |
| EVENT | `CLICK`, `DOUBLE_CLICK`, `MULTI_CLICK`, `PRESS`, `LONG_PRESS_START`, `DURING_LONG_PRESS`, `LONG_PRESS_STOP` | OneButton event |

## ABS Examples

```text
wio_control_set_press_ms(WIO_5S_PRESS, math_number(800))
wio_control_on_event(WIO_5S_PRESS, LONG_PRESS_START)
    serial_println(Serial, text("long press"))
```

## Notes

Each referenced control gets one global OneButton object. The generator adds the library include, active-low `INPUT_PULLUP` setup and a deduplicated `tick()` call automatically. The original pressed-state block ids remain compatible.

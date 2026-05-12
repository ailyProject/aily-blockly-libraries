# Wio Terminal Buttons

Library for Wio Terminal built-in buttons (A/B/C) and 5-way switch

## Library Info
- **Name**: @aily-project/lib-seeed-wio-buttons
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `wio_button_is_pressed` | Value | BUTTON(dropdown) | `wio_button_is_pressed(WIO_KEY_A)` | (digitalRead( |
| `wio_switch_is_pressed` | Value | DIRECTION(dropdown) | `wio_switch_is_pressed(WIO_5S_UP)` | (digitalRead( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BUTTON | WIO_KEY_A, WIO_KEY_B, WIO_KEY_C | wio_button_is_pressed |
| DIRECTION | WIO_5S_UP, WIO_5S_DOWN, WIO_5S_LEFT, WIO_5S_RIGHT, WIO_5S_PRESS | wio_switch_is_pressed |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, wio_button_is_pressed(WIO_KEY_A))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

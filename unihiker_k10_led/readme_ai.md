# K10 RGB LED

UNIHIKER K10 onboard RGB LED control library, supports brightness and color settings

## Library Info
- **Name**: @aily-project/lib-unihiker-k10-led
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `k10_rgb_brightness` | Statement | BRIGHTNESS(field_number) | `k10_rgb_brightness(50)` | k10.rgb->brightness(round( |
| `k10_rgb_switch` | Statement | INDEX(dropdown), STATE(dropdown) | `k10_rgb_switch("-1", "ON")` | `k10.rgb->write(index, 0xFFFFFF/0x000000);` |
| `k10_rgb_write` | Statement | INDEX(dropdown), R(input_value), G(input_value), B(input_value) | `k10_rgb_write("-1", math_number(0), math_number(0), math_number(0))` | k10.rgb->write( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| INDEX | -1, 0, 1, 2 | k10_rgb_switch, k10_rgb_write |
| STATE | ON, OFF | k10_rgb_switch |

## ABS Examples

### Basic Usage
```
arduino_setup()
    k10_rgb_brightness(50)
    serial_begin(Serial, 9600)

arduino_loop()
    k10_rgb_switch("0", "ON")
    k10_rgb_write("-1", math_number(0), math_number(0), math_number(0))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **Per-LED switch**: `k10_rgb_switch` turns a selected LED on with white (`0xFFFFFF`) or off with black (`0x000000`) without changing global brightness, so other LEDs keep their state.

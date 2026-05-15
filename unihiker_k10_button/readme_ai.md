# K10 Button

UNIHIKER K10 onboard button library, supports A/B/AB button polling and interrupt callbacks

## Library Info
- **Name**: @aily-project/lib-unihiker-k10-button
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `k10_button_pressed` | Value | BTN(dropdown) | `k10_button_pressed(buttonA)` | (k10. |
| `k10_button_callback` | Hat | BTN(dropdown), EVENT(dropdown), DO(input_statement) | `k10_button_callback(buttonA, pressed) @DO: child_block()` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BTN | buttonA, buttonB, buttonAB | k10_button_pressed, k10_button_callback |
| EVENT | pressed, released | k10_button_callback |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, k10_button_pressed(buttonA))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

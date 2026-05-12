# Seeed Gesture

Blockly library for Seeed Gesture.

## Library Info
- **Name**: @aily-project/lib-seeed-gesture
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `gesture_init` | Statement | (none) | `gesture_init()` | gesture_sensor.init();\n |
| `gesture_read` | Value | (none) | `gesture_read()` | gesture_readGesture() |
| `gesture_is` | Value | GESTURE(dropdown) | `gesture_is(UP)` | (gesture_readGesture() == (int) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| GESTURE | UP, DOWN, LEFT, RIGHT, PUSH, POLL, CLOCKWISE, ANTI_CLOCKWISE, WAVE | gesture_is |

## ABS Examples

### Basic Usage
```
arduino_setup()
    gesture_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, gesture_read())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

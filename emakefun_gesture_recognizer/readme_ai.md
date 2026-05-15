# Gesture recognition

Emakefun gesture recognition module library supports recognition of right move, left move, backward move, forward move, pull up, press down, leave, hover and other gestures

## Library Info
- **Name**: @aily-project/lib-emakefun-gesture-recognizer
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `gesture_recognizer_setup` | Statement | VAR(field_input), I2C_ADDRESS(field_input) | `gesture_recognizer_setup("gesture", "0x39")` | if ( |
| `gesture_recognizer_get_gesture` | Value | VAR(field_variable) | `gesture_recognizer_get_gesture(variables_get($gesture))` | Dynamic code |
| `gesture_recognizer_gesture_type` | Value | GESTURE_TYPE(dropdown) | `gesture_recognizer_gesture_type("0")` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| GESTURE_TYPE | 0, 1, 2, 3, 4, 5, 6, 7, 8 | gesture_recognizer_gesture_type |

## ABS Examples

### Basic Usage
```
arduino_setup()
    gesture_recognizer_setup("gesture", "0x39")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, gesture_recognizer_get_gesture(variables_get($gesture)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `gesture_recognizer_setup("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

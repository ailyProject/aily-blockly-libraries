# SparkFun ZX Distance and Gesture Sensor

Blockly wrapper for the SparkFun ZX distance and gesture sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-zx-sensor
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `zx_sensor_init` | Statement | VAR(field_input) | `zx_sensor_init("gesture")` | `Wire.begin(); ↵ gesture.init();` |
| `zx_sensor_position_available` | Value | VAR(field_variable) | `zx_sensor_position_available($gesture)` | `gesture.positionAvailable()` |
| `zx_sensor_gesture_available` | Value | VAR(field_variable) | `zx_sensor_gesture_available($gesture)` | `gesture.gestureAvailable()` |
| `zx_sensor_read_x` | Value | VAR(field_variable) | `zx_sensor_read_x($gesture)` | `gesture.readX()` |
| `zx_sensor_read_z` | Value | VAR(field_variable) | `zx_sensor_read_z($gesture)` | `gesture.readZ()` |
| `zx_sensor_read_gesture` | Value | VAR(field_variable) | `zx_sensor_read_gesture($gesture)` | `gesture.readGesture()` |

## ABS Examples

### Basic Usage
```
arduino_setup()
    zx_sensor_init("gesture")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, zx_sensor_position_available($gesture))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `zx_sensor_init("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

The default I²C address is `0x10`. Failed or incomplete transfers return false for availability and 255 for coordinates and gestures. Native `init()` returns false on version, configuration or transfer errors and can be retried after reconnecting.

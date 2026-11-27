# SparkFun Qwiic XM125 Pulsed Coherent Radar

Blockly wrapper for SparkFun Qwiic XM125 Pulsed Coherent Radar sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-qwiic-xm125
- **Version**: 0.0.3

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `xm125_presence_init` | Statement | VAR(field_input), START_MM(input_value), END_MM(input_value) | `xm125_presence_init("radar", math_number(0), math_number(0))` | `radar.begin(); ↵ radar.detectorStart(1, 1);` |
| `xm125_is_detected` | Value | VAR(field_variable) | `xm125_is_detected($radar)` | `([&](){ radar.getDetectorPresenceDetected(_xm125_presence_radar); return _xm125_presence_radar != 0; })()` |
| `xm125_get_distance` | Value | VAR(field_variable) | `xm125_get_distance($radar)` | `([&](){ radar.getDistance(_xm125_dist_radar); return (int)_xm125_dist_radar; })()` |

## ABS Examples

### Basic Usage
```
arduino_setup()
    xm125_presence_init("radar", math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, xm125_is_detected($radar))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `xm125_presence_init("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

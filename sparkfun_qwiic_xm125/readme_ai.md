# SparkFun Qwiic XM125 Pulsed Coherent Radar

Blockly wrapper for SparkFun Qwiic XM125 Pulsed Coherent Radar sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-qwiic-xm125
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `xm125_presence_init` | Statement | VAR(field_input), START_MM(input_value), END_MM(input_value) | `xm125_presence_init("radar", math_number(0), math_number(0))` | Dynamic code |
| `xm125_is_detected` | Value | VAR(field_variable) | `xm125_is_detected(variables_get($radar))` | + presVar + |
| `xm125_get_distance` | Value | VAR(field_variable) | `xm125_get_distance(variables_get($radar))` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    xm125_presence_init("radar", math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, xm125_is_detected(variables_get($radar)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `xm125_presence_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

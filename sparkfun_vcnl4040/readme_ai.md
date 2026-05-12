# SparkFun VCNL4040 Proximity and Ambient Light Sensor

Blockly wrapper for the SparkFun VCNL4040 I2C proximity and ambient light sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-vcnl4040
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `vcnl4040_init` | Statement | VAR(field_input) | `vcnl4040_init("prox")` | Wire.begin();\n |
| `vcnl4040_get_proximity` | Value | VAR(field_variable) | `vcnl4040_get_proximity(variables_get($prox))` | Dynamic code |
| `vcnl4040_get_ambient` | Value | VAR(field_variable) | `vcnl4040_get_ambient(variables_get($prox))` | Dynamic code |
| `vcnl4040_get_white` | Value | VAR(field_variable) | `vcnl4040_get_white(variables_get($prox))` | Dynamic code |
| `vcnl4040_power_proximity` | Statement | VAR(field_variable), STATE(dropdown) | `vcnl4040_power_proximity(variables_get($prox), ON)` | Dynamic code |
| `vcnl4040_power_ambient` | Statement | VAR(field_variable), STATE(dropdown) | `vcnl4040_power_ambient(variables_get($prox), ON)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| STATE | ON, OFF | vcnl4040_power_proximity, vcnl4040_power_ambient |

## ABS Examples

### Basic Usage
```
arduino_setup()
    vcnl4040_init("prox")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, vcnl4040_get_proximity(variables_get($prox)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `vcnl4040_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

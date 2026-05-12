# SparkFun VEML7700 Ambient Light Sensor

Blockly wrapper for the SparkFun VEML7700 high-accuracy I2C ambient light sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-veml7700
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `veml7700_init` | Statement | VAR(field_input) | `veml7700_init("als")` | Wire.begin();\n |
| `veml7700_get_lux` | Value | VAR(field_variable) | `veml7700_get_lux(variables_get($als))` | Dynamic code |
| `veml7700_get_ambient` | Value | VAR(field_variable) | `veml7700_get_ambient(variables_get($als))` | Dynamic code |
| `veml7700_get_white` | Value | VAR(field_variable) | `veml7700_get_white(variables_get($als))` | Dynamic code |
| `veml7700_power` | Statement | VAR(field_variable), STATE(dropdown) | `veml7700_power(variables_get($als), ON)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| STATE | ON, OFF | veml7700_power |

## ABS Examples

### Basic Usage
```
arduino_setup()
    veml7700_init("als")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, veml7700_get_lux(variables_get($als)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `veml7700_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

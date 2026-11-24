# SparkFun VEML7700 Ambient Light Sensor

Blockly wrapper for the SparkFun VEML7700 high-accuracy I2C ambient light sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-veml7700
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `veml7700_init` | Statement | VAR(field_input) | `veml7700_init("als")` | `Wire.begin(); ↵ als.begin();` |
| `veml7700_get_lux` | Value | VAR(field_variable) | `veml7700_get_lux($als)` | `als.getLux()` |
| `veml7700_get_ambient` | Value | VAR(field_variable) | `veml7700_get_ambient($als)` | `als.getAmbientLight()` |
| `veml7700_get_white` | Value | VAR(field_variable) | `veml7700_get_white($als)` | `als.getWhiteLevel()` |
| `veml7700_power` | Statement | VAR(field_variable), STATE(dropdown) | `veml7700_power($als, ON)` | `als.powerOn();` |

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
    serial_println(Serial, veml7700_get_lux($als))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `veml7700_init("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

The native source archive includes SparkFun Toolkit 1.2.1 and its MIT license. Installing this package supplies both the sensor driver and its Toolkit dependency. [Upstream Toolkit source](https://github.com/sparkfun/SparkFun_Toolkit/tree/b65201164e14c67255de1a07965f035420181db4)

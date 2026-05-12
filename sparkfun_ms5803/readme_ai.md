# SparkFun MS5803 Pressure Sensor

Blockly wrapper for the SparkFun MS5803-14BA I2C pressure and temperature sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-ms5803
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ms5803_init` | Statement | VAR(field_input), ADDRESS(dropdown) | `ms5803_init("ms5803", ADDRESS_HIGH)` | Wire.begin();\n |
| `ms5803_get_temperature` | Value | VAR(field_variable), UNIT(dropdown), PREC(dropdown) | `ms5803_get_temperature(variables_get($ms5803), CELSIUS, ADC_256)` | Dynamic code |
| `ms5803_get_pressure` | Value | VAR(field_variable), PREC(dropdown) | `ms5803_get_pressure(variables_get($ms5803), ADC_256)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | ADDRESS_HIGH, ADDRESS_LOW | ms5803_init |
| UNIT | CELSIUS, FAHRENHEIT | ms5803_get_temperature |
| PREC | ADC_256, ADC_512, ADC_1024, ADC_2048, ADC_4096 | ms5803_get_temperature, ms5803_get_pressure |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ms5803_init("ms5803", ADDRESS_HIGH)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ms5803_get_temperature(variables_get($ms5803), CELSIUS, ADC_256))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `ms5803_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

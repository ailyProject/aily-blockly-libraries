# SparkFun HTU21D Humidity & Temperature Sensor

Blockly wrapper for the SparkFun HTU21D I2C humidity and temperature sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-htu21d
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `htu21d_init` | Statement | VAR(field_input) | `htu21d_init("htu21d")` | `Wire.begin(); ↵ htu21d.begin();` |
| `htu21d_read_humidity` | Value | VAR(field_variable) | `htu21d_read_humidity($htu21d)` | `htu21d.readHumidity()` |
| `htu21d_read_temperature` | Value | VAR(field_variable) | `htu21d_read_temperature($htu21d)` | `htu21d.readTemperature()` |
| `htu21d_set_resolution` | Statement | VAR(field_variable), RES(dropdown) | `htu21d_set_resolution($htu21d, "0x00")` | `htu21d.setResolution(0x00);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| RES | 0x00, 0x01, 0x80, 0x81 | htu21d_set_resolution |

## ABS Examples

### Basic Usage
```
arduino_setup()
    htu21d_init("htu21d")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, htu21d_read_humidity($htu21d))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `htu21d_init("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

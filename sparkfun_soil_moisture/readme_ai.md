# SparkFun Soil Moisture Sensor

Blockly wrapper for the SparkFun I2C soil moisture sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-soil-moisture
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `soil_moisture_init` | Statement | VAR(field_input) | `soil_moisture_init("soilSensor")` | Wire.begin();\n |
| `soil_moisture_read_value` | Value | VAR(field_variable) | `soil_moisture_read_value(variables_get($soilSensor))` | Dynamic code |
| `soil_moisture_read_percentage` | Value | VAR(field_variable) | `soil_moisture_read_percentage(variables_get($soilSensor))` | Dynamic code |
| `soil_moisture_led` | Statement | VAR(field_variable), STATE(dropdown) | `soil_moisture_led(variables_get($soilSensor), ON)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| STATE | ON, OFF | soil_moisture_led |

## ABS Examples

### Basic Usage
```
arduino_setup()
    soil_moisture_init("soilSensor")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, soil_moisture_read_value(variables_get($soilSensor)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `soil_moisture_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

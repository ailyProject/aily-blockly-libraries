# SparkFun ADXL345 accelerometer

Blockly wrapper for the SparkFun ADXL345 triple-axis accelerometer.

## Library Info
- **Name**: @aily-project/lib-sparkfun-adxl345
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adxl345_init` | Statement | VAR(field_input), BUS(dropdown), CS(field_number), RANGE(dropdown), RATE(dropdown) | `adxl345_init("adxl345", I2C, 10, "2", "25.0")` | Dynamic code |
| `adxl345_read_axis` | Value | VAR(field_variable), AXIS(dropdown) | `adxl345_read_axis(variables_get($adxl345), "0")` | adxl345ReadAxis( |
| `adxl345_read_g_axis` | Value | VAR(field_variable), AXIS(dropdown) | `adxl345_read_g_axis(variables_get($adxl345), "0")` | adxl345ReadGAxis( |
| `adxl345_set_range` | Statement | VAR(field_variable), RANGE(dropdown) | `adxl345_set_range(variables_get($adxl345), "2")` | Dynamic code |
| `adxl345_set_rate` | Statement | VAR(field_variable), RATE(dropdown) | `adxl345_set_rate(variables_get($adxl345), "25.0")` | Dynamic code |
| `adxl345_set_activity_threshold` | Statement | VAR(field_variable), THRESHOLD(input_value) | `adxl345_set_activity_threshold(variables_get($adxl345), math_number(0))` | Dynamic code |
| `adxl345_set_tap_threshold` | Statement | VAR(field_variable), THRESHOLD(input_value) | `adxl345_set_tap_threshold(variables_get($adxl345), math_number(0))` | Dynamic code |
| `adxl345_get_interrupt_source` | Value | VAR(field_variable) | `adxl345_get_interrupt_source(variables_get($adxl345))` | Dynamic code |
| `adxl345_interrupt_triggered` | Value | VAR(field_variable), INTERRUPTS(input_value), SOURCE(dropdown) | `adxl345_interrupt_triggered(variables_get($adxl345), math_number(0), ADXL345_ACTIVITY)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BUS | I2C, SPI | adxl345_init |
| RANGE | 2, 4, 8, 16 | adxl345_init, adxl345_set_range |
| RATE | 25.0, 50.0, 100.0, 200.0, 400.0 | adxl345_init |
| AXIS | 0, 1, 2 | adxl345_read_axis, adxl345_read_g_axis |
| RATE | 25.0, 50.0, 100.0, 200.0, 400.0, 800.0 | adxl345_set_rate |
| SOURCE | ADXL345_ACTIVITY, ADXL345_INACTIVITY, ADXL345_FREE_FALL, ADXL345_SINGLE_TAP, ADXL345_DOUBLE_TAP, ADXL345_DATA_READY | adxl345_interrupt_triggered |

## ABS Examples

### Basic Usage
```
arduino_setup()
    adxl345_init("adxl345", I2C, 10, "2", "25.0")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, adxl345_read_axis(variables_get($adxl345), "0"))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `adxl345_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

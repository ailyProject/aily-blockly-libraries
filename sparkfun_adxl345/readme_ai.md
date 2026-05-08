# SparkFun ADXL345

Triple-axis accelerometer blocks for ADXL345.

## Library Info
- **Name**: @aily-project/lib-sparkfun-adxl345
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adxl345_init` | Statement | VAR(field_input), BUS(dropdown), CS(field_number), RANGE(dropdown), RATE(dropdown) | `adxl345_init("adxl345", I2C, 10, 16, 100.0)` | `ADXL345 adxl345; adxl345.powerOn();` |
| `adxl345_read_axis` | Value | VAR(field_variable), AXIS(dropdown) | `adxl345_read_axis(variables_get($adxl345), 0)` | `adxl345ReadAxis(sensor, axis)` |
| `adxl345_read_g_axis` | Value | VAR(field_variable), AXIS(dropdown) | `adxl345_read_g_axis(variables_get($adxl345), 0)` | `adxl345ReadGAxis(sensor, axis)` |
| `adxl345_set_range` | Statement | VAR(field_variable), RANGE(dropdown) | `adxl345_set_range(variables_get($adxl345), 16)` | `adxl345.setRangeSetting(range);` |
| `adxl345_set_rate` | Statement | VAR(field_variable), RATE(dropdown) | `adxl345_set_rate(variables_get($adxl345), 100.0)` | `adxl345.setRate(rate);` |
| `adxl345_set_activity_threshold` | Statement | VAR(field_variable), THRESHOLD(input_value) | `adxl345_set_activity_threshold(variables_get($adxl345), math_number(75))` | `adxl345.setActivityThreshold(value);` |
| `adxl345_set_tap_threshold` | Statement | VAR(field_variable), THRESHOLD(input_value) | `adxl345_set_tap_threshold(variables_get($adxl345), math_number(50))` | `adxl345.setTapThreshold(value);` |
| `adxl345_get_interrupt_source` | Value | VAR(field_variable) | `adxl345_get_interrupt_source(variables_get($adxl345))` | `adxl345.getInterruptSource()` |
| `adxl345_interrupt_triggered` | Value | VAR(field_variable), INTERRUPTS(input_value), SOURCE(dropdown) | `adxl345_interrupt_triggered(variables_get($adxl345), variables_get($ints), ADXL345_ACTIVITY)` | `adxl345.triggered(ints, source)` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BUS | I2C, SPI | Communication mode; CS is used only for SPI |
| AXIS | 0, 1, 2 | X, Y, Z |
| RANGE | 2, 4, 8, 16 | g range |
| RATE | 25.0, 50.0, 100.0, 200.0, 400.0, 800.0 | Output data rate |
| SOURCE | ADXL345_ACTIVITY, INACTIVITY, FREE_FALL, SINGLE_TAP, DOUBLE_TAP, DATA_READY | Interrupt bit |

## ABS Examples

```text
arduino_setup()
    adxl345_init("adxl345", I2C, 10, 16, 100.0)

arduino_loop()
    serial_println(Serial, adxl345_read_g_axis(variables_get($adxl345), 0))
```

## Notes

`adxl345_init` creates `$adxl345`. For SPI, the CS input is used in the constructor; for I2C it is ignored.
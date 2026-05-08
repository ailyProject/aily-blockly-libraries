# SparkFun BMP180

BMP180 气压/温度传感器 ABS 参考。

## Library Info
- **Name**: @aily-project/lib-sparkfun-bmp180
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bmp180_init` | Statement | VAR(field_input) | `bmp180_init("bmp180")` | `SFE_BMP180 bmp180; bmp180_ready = bmp180.begin();` |
| `bmp180_is_ready` | Value(Boolean) | VAR(field_variable) | `bmp180_is_ready($bmp180)` | `bmp180_ready` |
| `bmp180_read_temperature` | Value(Number) | VAR(field_variable) | `bmp180_read_temperature($bmp180)` | `bmp180ReadTemperature(bmp180)` |
| `bmp180_read_pressure` | Value(Number) | VAR(field_variable), OVERSAMPLING(dropdown) | `bmp180_read_pressure($bmp180, ULTRA)` | `bmp180ReadPressure(bmp180, 3)` |
| `bmp180_sea_level` | Value(Number) | VAR(field_variable), PRESSURE(input_value), ALTITUDE(input_value) | `bmp180_sea_level($bmp180, math_number(1013.25), math_number(100))` | `bmp180.sealevel(pressure, altitude)` |
| `bmp180_altitude` | Value(Number) | VAR(field_variable), PRESSURE(input_value), BASELINE(input_value) | `bmp180_altitude($bmp180, math_number(900), math_number(1013.25))` | `bmp180.altitude(pressure, baseline)` |
| `bmp180_get_error` | Value(Number) | VAR(field_variable) | `bmp180_get_error($bmp180)` | `bmp180.getError()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| OVERSAMPLING | 0, 1, 2, 3 | 气压测量过采样，数值越大分辨率越高、等待越久 |

## ABS Examples

```text
arduino_setup()
    bmp180_init("bmp180")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, bmp180_read_temperature($bmp180))
    serial_println(Serial, bmp180_read_pressure($bmp180, 3))
    time_delay(math_number(1000))
```

## Notes

1. `bmp180_init("name")` creates variable `$name`.
2. BMP180 needs 3.3V power and I2C wiring.
3. Pressure read helper automatically performs the required temperature read first.
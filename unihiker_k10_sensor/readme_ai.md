# K10 Sensor

UNIHIKER K10 onboard sensor library, supports accelerometer, light intensity and AHT20 temperature & humidity

## Library Info
- **Name**: @aily-project/lib-unihiker-k10-sensor
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `k10_get_accelerometer` | Value | AXIS(dropdown) | `k10_get_accelerometer(X)` | `(k10.getAccelerometerX/Y/Z())` |
| `k10_get_strength` | Value | (none) | `k10_get_strength()` | (k10.readALS()) |
| `k10_aht20_measure` | Value | CRC(dropdown) | `k10_aht20_measure(true)` | (aht20.startMeasurementReady( |
| `k10_aht20_get_temperature` | Value | UNIT(dropdown) | `k10_aht20_get_temperature(C)` | `k10Aht20Read(aht20, 0/1)` |
| `k10_aht20_get_humidity` | Value | (none) | `k10_aht20_get_humidity()` | `k10Aht20Read(aht20, 2)` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| AXIS | X, Y, Z | k10_get_accelerometer |
| CRC | true, false | k10_aht20_measure |
| UNIT | C, F | k10_aht20_get_temperature |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, k10_aht20_get_temperature(C))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **Axis values**: accelerometer axis values are normalized to uppercase before generating SDK calls, so localized dropdown values still emit `getAccelerometerX/Y/Z()`.
4. **AHT20 direct reads**: temperature and humidity blocks automatically start a measurement before returning the value. The manual `k10_aht20_measure` block remains for compatibility but is hidden from the toolbox and is not needed for normal use.

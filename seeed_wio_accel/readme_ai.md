# Wio Terminal Accelerometer

Blockly library for the Wio Terminal built-in LIS3DHTR 3-axis accelerometer.

## Library Info
- **Name**: @aily-project/lib-seeed-wio-accel
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|-------------------------|------------|----------------|
| `wio_accel_init` | Statement | DATARATE(dropdown), RANGE(dropdown) | `wio_accel_init(LIS3DHTR_DATARATE_25HZ, LIS3DHTR_RANGE_2G)` | `begin(Wire1)` + data rate + range |
| `wio_accel_set_datarate` | Statement | DATARATE(dropdown) | `wio_accel_set_datarate(LIS3DHTR_DATARATE_100HZ)` | `ailyWioAccel.setOutputDataRate(...)` |
| `wio_accel_set_range` | Statement | RANGE(dropdown) | `wio_accel_set_range(LIS3DHTR_RANGE_4G)` | `ailyWioAccel.setFullScaleRange(...)` |
| `wio_accel_read_axis` | Value | AXIS(dropdown) | `wio_accel_read_axis(X)` | `ailyWioAccel.getAccelerationX()` |
| `wio_accel_read_xyz` | Statement | X_VAR(variable), Y_VAR(variable), Z_VAR(variable) | `wio_accel_read_xyz($accelX, $accelY, $accelZ)` | `ailyWioAccel.getAcceleration(&accelX, &accelY, &accelZ)` |
| `wio_accel_data_ready` | Value | none | `wio_accel_data_ready()` | `ailyWioAccel.available()` |
| `wio_accel_is_connected` | Value | none | `wio_accel_is_connected()` | `ailyWioAccel.isConnection()` |
| `wio_accel_on_tap` | Hat | CLICK_TYPE(dropdown), THRESHOLD(value), HANDLER(statement) | `wio_accel_on_tap(1, math_number(40))` | `click()` + `GYROSCOPE_INT1` interrupt + loop dispatch |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DATARATE | `LIS3DHTR_DATARATE_1HZ` ... `LIS3DHTR_DATARATE_5KHZ` | LIS3DHTR output data rate; initialization defaults to 25 Hz |
| RANGE | `LIS3DHTR_RANGE_2G`, `4G`, `8G`, `16G` | Full-scale range; initialization defaults to ±2 g |
| AXIS | `X`, `Y`, `Z` | Axis returned by the value block |
| CLICK_TYPE | `1`, `2` | Single or double tap |
| THRESHOLD | Number | Suggested: 2g 40-80, 4g 20-40, 8g 10-20, 16g 5-10 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    wio_accel_init(LIS3DHTR_DATARATE_25HZ, LIS3DHTR_RANGE_2G)
    serial_begin(Serial, 115200)

arduino_loop()
    serial_println(Serial, wio_accel_read_axis(X))
    time_delay(math_number(50))
```

### Tap Detection
```
arduino_setup()
    wio_accel_init(LIS3DHTR_DATARATE_25HZ, LIS3DHTR_RANGE_2G)

wio_accel_on_tap(1, math_number(40))
    serial_println(Serial, text("Tap"))
```

## Notes

1. The library is Wio Terminal-only and always uses `Wire1`.
2. Tap detection always uses the board macro `GYROSCOPE_INT1`.
3. The interrupt service routine only sets a volatile flag; HANDLER blocks run from `loop()`.
4. Add a delay of at least 50 ms for the basic 25 Hz reading example.
5. ABS parameters follow the `block.json` argument order.

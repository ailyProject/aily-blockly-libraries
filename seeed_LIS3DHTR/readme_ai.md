# LIS3DHTR驱动库

LIS3DHTR加速度传感器支持库，支持Arduino UNO、MEGA、ESP8266、ESP32等开发板

## Library Info
- **Name**: @aily-project/lib-lis3dhtr
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lis3dhtr_begin` | Statement | ADDRESS(field_input) | `lis3dhtr_begin("0x19")` | `accel_sensor.begin(Wire,` |
| `lis3dhtr_set_datarate` | Statement | DATARATE(dropdown) | `lis3dhtr_set_datarate(LIS3DHTR_DATARATE_100HZ)` | `accel_sensor.setOutputDataRate(` |
| `lis3dhtr_set_resolution` | Statement | ENABLE(dropdown) | `lis3dhtr_set_resolution(true)` | `accel_sensor.setHighSolution(` |
| `lis3dhtr_get_acceleration_x` | Value | (none) | `lis3dhtr_get_acceleration_x()` | `accel_sensor.getAccelerationX()` |
| `lis3dhtr_get_acceleration_y` | Value | (none) | `lis3dhtr_get_acceleration_y()` | `accel_sensor.getAccelerationY()` |
| `lis3dhtr_get_acceleration_z` | Value | (none) | `lis3dhtr_get_acceleration_z()` | `accel_sensor.getAccelerationZ()` |
| `lis3dhtr_get_acceleration` | Value | AXIS(dropdown) | `lis3dhtr_get_acceleration(X)` | (dynamic code) |
| `lis3dhtr_get_acceleration_xyz` | Statement | X_VAR(field_variable), Y_VAR(field_variable), Z_VAR(field_variable) | `lis3dhtr_get_acceleration_xyz($x, $y, $z)` | `accel_sensor.getAcceleration(&` |
| `lis3dhtr_open_temp` | Statement | (none) | `lis3dhtr_open_temp()` | `accel_sensor.openTemp();\n` |
| `lis3dhtr_close_temp` | Statement | (none) | `lis3dhtr_close_temp()` | `accel_sensor.closeTemp();\n` |
| `lis3dhtr_get_temperature` | Value | (none) | `lis3dhtr_get_temperature()` | `accel_sensor.getTemperature()` |
| `lis3dhtr_get_temperature_simple` | Value | (none) | `lis3dhtr_get_temperature_simple()` | `accel_sensor.getTemperature()` |
| `lis3dhtr_read_adc1` | Value | (none) | `lis3dhtr_read_adc1()` | `accel_sensor.readbitADC1()` |
| `lis3dhtr_read_adc2` | Value | (none) | `lis3dhtr_read_adc2()` | `accel_sensor.readbitADC2()` |
| `lis3dhtr_read_adc3` | Value | (none) | `lis3dhtr_read_adc3()` | `accel_sensor.readbitADC3()` |
| `lis3dhtr_read_adc` | Value | CHANNEL(dropdown) | `lis3dhtr_read_adc(1)` | (dynamic code) |
| `lis3dhtr_is_connection` | Value | (none) | `lis3dhtr_is_connection()` | `accel_sensor.isConnection()` |
| `lis3dhtr_get_device_id` | Value | (none) | `lis3dhtr_get_device_id()` | `accel_sensor.getDeviceID()` |
| `lis3dhtr_set_full_scale_range` | Statement | RANGE(dropdown) | `lis3dhtr_set_full_scale_range(LIS3DHTR_RANGE_2G)` | `accel_sensor.setFullScaleRange(` |
| `lis3dhtr_set_power_mode` | Statement | MODE(dropdown) | `lis3dhtr_set_power_mode(LIS3DHTR_POWER_NORMAL)` | `accel_sensor.setPowerMode(` |
| `lis3dhtr_init_simplified` | Statement | ADDRESS(field_input), DATARATE(dropdown), RANGE(dropdown), HIGHRES(dropdown) | `lis3dhtr_init_simplified("LIS3DHTR_DEFAULT_ADDRESS", LIS3DHTR_DATARATE_100HZ, LIS3DHTR_RANGE_2G, true)` | `accel_sensor.begin(Wire,` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DATARATE | LIS3DHTR_DATARATE_100HZ, LIS3DHTR_DATARATE_50HZ, LIS3DHTR_DATARATE_400HZ | 100Hz / 50Hz / 400Hz |
| ENABLE | true, false | 开启 / 关闭 |
| AXIS | X, Y, Z | X / Y / Z |
| CHANNEL | 1, 2, 3 | 1 / 2 / 3 |
| RANGE | LIS3DHTR_RANGE_2G, LIS3DHTR_RANGE_4G, LIS3DHTR_RANGE_8G, LIS3DHTR_RANGE_16G | 2G / 4G / 8G / 16G |
| MODE | LIS3DHTR_POWER_NORMAL, LIS3DHTR_POWER_LOW | 正常 / 低功耗 |
| HIGHRES | true, false | 开启 / 关闭 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    lis3dhtr_begin("0x19")
    lis3dhtr_init_simplified("LIS3DHTR_DEFAULT_ADDRESS", LIS3DHTR_DATARATE_100HZ, LIS3DHTR_RANGE_2G, true)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, lis3dhtr_get_acceleration_x())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

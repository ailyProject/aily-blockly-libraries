# LIS3DHTR driver library

LIS3DHTR acceleration sensor support library supports Arduino UNO, MEGA, ESP8266, ESP32 and other development boards

## Library Info
- **Name**: @aily-project/lib-seeed-lis3dhtr
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lis3dhtr_begin` | Statement | WIRE(dropdown), ADDRESS(field_input) | `lis3dhtr_begin(Wire, "0x19")` | accel_sensor.begin( |
| `lis3dhtr_set_datarate` | Statement | DATARATE(dropdown) | `lis3dhtr_set_datarate(LIS3DHTR_DATARATE_POWERDOWN)` | accel_sensor.setOutputDataRate( |
| `lis3dhtr_set_resolution` | Statement | ENABLE(dropdown) | `lis3dhtr_set_resolution(true)` | accel_sensor.setHighSolution( |
| `lis3dhtr_get_acceleration_x` | Value | (none) | `lis3dhtr_get_acceleration_x()` | accel_sensor.getAccelerationX() |
| `lis3dhtr_get_acceleration_y` | Value | (none) | `lis3dhtr_get_acceleration_y()` | accel_sensor.getAccelerationY() |
| `lis3dhtr_get_acceleration_z` | Value | (none) | `lis3dhtr_get_acceleration_z()` | accel_sensor.getAccelerationZ() |
| `lis3dhtr_get_acceleration` | Value | AXIS(dropdown) | `lis3dhtr_get_acceleration(X)` | Dynamic code |
| `lis3dhtr_get_acceleration_xyz` | Statement | X_VAR(field_variable), Y_VAR(field_variable), Z_VAR(field_variable) | `lis3dhtr_get_acceleration_xyz(variables_get($x), variables_get($y), variables_get($z))` | accel_sensor.getAcceleration(& |
| `lis3dhtr_open_temp` | Statement | (none) | `lis3dhtr_open_temp()` | accel_sensor.openTemp();\n |
| `lis3dhtr_close_temp` | Statement | (none) | `lis3dhtr_close_temp()` | accel_sensor.closeTemp();\n |
| `lis3dhtr_get_temperature` | Value | (none) | `lis3dhtr_get_temperature()` | accel_sensor.getTemperature() |
| `lis3dhtr_get_temperature_simple` | Value | (none) | `lis3dhtr_get_temperature_simple()` | accel_sensor.getTemperature() |
| `lis3dhtr_read_adc1` | Value | (none) | `lis3dhtr_read_adc1()` | accel_sensor.readbitADC1() |
| `lis3dhtr_read_adc2` | Value | (none) | `lis3dhtr_read_adc2()` | accel_sensor.readbitADC2() |
| `lis3dhtr_read_adc3` | Value | (none) | `lis3dhtr_read_adc3()` | accel_sensor.readbitADC3() |
| `lis3dhtr_read_adc` | Value | CHANNEL(dropdown) | `lis3dhtr_read_adc("1")` | Dynamic code |
| `lis3dhtr_is_connection` | Value | (none) | `lis3dhtr_is_connection()` | accel_sensor.isConnection() |
| `lis3dhtr_get_device_id` | Value | (none) | `lis3dhtr_get_device_id()` | accel_sensor.getDeviceID() |
| `lis3dhtr_set_full_scale_range` | Statement | RANGE(dropdown) | `lis3dhtr_set_full_scale_range(LIS3DHTR_RANGE_2G)` | accel_sensor.setFullScaleRange( |
| `lis3dhtr_set_power_mode` | Statement | MODE(dropdown) | `lis3dhtr_set_power_mode(POWER_MODE_NORMAL)` | accel_sensor.setPowerMode( |
| `lis3dhtr_init_simplified` | Statement | WIRE(dropdown), ADDRESS(field_input), DATARATE(dropdown), RANGE(dropdown), HIGHRES(dropdown) | `lis3dhtr_init_simplified(Wire, "LIS3DHTR_DEFAULT_ADDRESS", LIS3DHTR_DATARATE_100HZ, LIS3DHTR_RANGE_2G, true)` | accel_sensor.begin( |
| `lis3dhtr_available` | Value | (none) | `lis3dhtr_available()` | accel_sensor.available() |
| `lis3dhtr_reset` | Statement | (none) | `lis3dhtr_reset()` | accel_sensor.reset();\n |
| `lis3dhtr_on_tap` | Hat | CLICK_TYPE(dropdown), THRESHOLD(input_value), INT_PIN(field_input), HANDLER(input_statement) | `lis3dhtr_on_tap("1", math_number(40), "2") @HANDLER: child_block()` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| WIRE | Wire, Wire1 | lis3dhtr_begin, lis3dhtr_init_simplified |
| DATARATE | LIS3DHTR_DATARATE_POWERDOWN, LIS3DHTR_DATARATE_1HZ, LIS3DHTR_DATARATE_10HZ, LIS3DHTR_DATARATE_25HZ, LIS3DHTR_DATARATE_50HZ, LIS3DHTR_DATARATE_100HZ, LIS3DHTR_DATARATE_200HZ, LIS3DHTR_DATARATE_400HZ, LIS3DHTR_DATARATE_... | lis3dhtr_set_datarate |
| ENABLE | true, false | lis3dhtr_set_resolution |
| AXIS | X, Y, Z | lis3dhtr_get_acceleration |
| CHANNEL | 1, 2, 3 | lis3dhtr_read_adc |
| RANGE | LIS3DHTR_RANGE_2G, LIS3DHTR_RANGE_4G, LIS3DHTR_RANGE_8G, LIS3DHTR_RANGE_16G | lis3dhtr_set_full_scale_range, lis3dhtr_init_simplified |
| MODE | POWER_MODE_NORMAL, POWER_MODE_LOW | lis3dhtr_set_power_mode |
| DATARATE | LIS3DHTR_DATARATE_100HZ, LIS3DHTR_DATARATE_50HZ, LIS3DHTR_DATARATE_400HZ | lis3dhtr_init_simplified |
| HIGHRES | true, false | lis3dhtr_init_simplified |
| CLICK_TYPE | 1, 2 | lis3dhtr_on_tap |
| INT_PIN | Any interrupt-capable digital pin | lis3dhtr_on_tap |

## ABS Examples

### Basic Usage
```
arduino_setup()
    lis3dhtr_begin(Wire, "0x19")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, lis3dhtr_get_acceleration_x())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

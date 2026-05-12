# ADXL345 acceleration sensor

ADXL345 three-axis acceleration sensor library, I2C communication, can read X/Y/Z axis acceleration data

## Library Info
- **Name**: @aily-project/lib-adafruit-adxl345
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adxl345_init` | Statement | SENSOR_ID(field_number) | `adxl345_init(12345)` | Dynamic code |
| `adxl345_read_x` | Value | (none) | `adxl345_read_x()` | adxl345_getX() |
| `adxl345_read_y` | Value | (none) | `adxl345_read_y()` | adxl345_getY() |
| `adxl345_read_z` | Value | (none) | `adxl345_read_z()` | adxl345_getZ() |
| `adxl345_read_xyz` | Statement | VAR_X(field_variable), VAR_Y(field_variable), VAR_Z(field_variable) | `adxl345_read_xyz(variables_get($accel_x), variables_get($accel_y), variables_get($accel_z))` | sensors_event_t event;\n |
| `adxl345_set_range` | Statement | RANGE(dropdown) | `adxl345_set_range(ADXL345_RANGE_2_G)` | accel.setRange( |
| `adxl345_set_data_rate` | Statement | DATA_RATE(dropdown) | `adxl345_set_data_rate(ADXL345_DATARATE_0_10_HZ)` | accel.setDataRate( |
| `adxl345_get_range` | Value | (none) | `adxl345_get_range()` | accel.getRange() |
| `adxl345_get_data_rate` | Value | (none) | `adxl345_get_data_rate()` | accel.getDataRate() |
| `adxl345_display_sensor_details` | Statement | (none) | `adxl345_display_sensor_details()` | adxl345_displaySensorDetails();\n |
| `adxl345_check_connection` | Value | (none) | `adxl345_check_connection()` | adxl345_checkConnection() |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| RANGE | ADXL345_RANGE_2_G, ADXL345_RANGE_4_G, ADXL345_RANGE_8_G, ADXL345_RANGE_16_G | adxl345_set_range |
| DATA_RATE | ADXL345_DATARATE_0_10_HZ, ADXL345_DATARATE_0_20_HZ, ADXL345_DATARATE_0_39_HZ, ADXL345_DATARATE_0_78_HZ, ADXL345_DATARATE_1_56_HZ, ADXL345_DATARATE_3_13_HZ, ADXL345_DATARATE_6_25HZ, ADXL345_DATARATE_12_5_HZ, ADXL345_DA... | adxl345_set_data_rate |

## ABS Examples

### Basic Usage
```
arduino_setup()
    adxl345_init(12345)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, adxl345_read_x())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

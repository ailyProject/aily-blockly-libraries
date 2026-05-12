# MMA8653 Accelerometer

MMA8653 three-axis accelerometer library, I2C communication, supports 2/4/8G range, 8/10-bit resolution, multiple data rates

## Library Info
- **Name**: @aily-project/lib-mma8653
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mma8653_init` | Statement | RANGE(dropdown), RESOLUTION(dropdown), DATA_RATE(dropdown) | `mma8653_init(MMA8653_2G_RANGE, MMA8653_10BIT_RES, MMA8653_ODR_800)` | Dynamic code |
| `mma8653_set_mode` | Statement | MODE(dropdown) | `mma8653_set_mode(MMA8653_MODS_NORMAL)` | accel.setMODS( |
| `mma8653_begin` | Statement | (none) | `mma8653_begin()` | accel.begin();\n |
| `mma8653_read_x` | Value | (none) | `mma8653_read_x()` | mma8653_getX() |
| `mma8653_read_y` | Value | (none) | `mma8653_read_y()` | mma8653_getY() |
| `mma8653_read_z` | Value | (none) | `mma8653_read_z()` | mma8653_getZ() |
| `mma8653_read_xyz` | Statement | VAR_X(field_variable), VAR_Y(field_variable), VAR_Z(field_variable) | `mma8653_read_xyz(variables_get($accel_x), variables_get($accel_y), variables_get($accel_z))` | accel.readSensor(& |
| `mma8653_set_range` | Statement | RANGE(dropdown) | `mma8653_set_range(MMA8653_2G_RANGE)` | accel.setRange( |
| `mma8653_set_data_rate` | Statement | DATA_RATE(dropdown) | `mma8653_set_data_rate(MMA8653_ODR_800)` | accel.setDataRate( |
| `mma8653_set_resolution` | Statement | RESOLUTION(dropdown) | `mma8653_set_resolution(MMA8653_10BIT_RES)` | accel.setResolution( |
| `mma8653_is_active` | Value | (none) | `mma8653_is_active()` | accel.isActive() |
| `mma8653_check_connection` | Value | (none) | `mma8653_check_connection()` | accel.whoAmI() |
| `mma8653_get_roll` | Value | (none) | `mma8653_get_roll()` | mma8653_getRoll() |
| `mma8653_get_pitch` | Value | (none) | `mma8653_get_pitch()` | mma8653_getPitch() |
| `mma8653_get_tilt` | Value | (none) | `mma8653_get_tilt()` | mma8653_getTilt() |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| RANGE | MMA8653_2G_RANGE, MMA8653_4G_RANGE, MMA8653_8G_RANGE | mma8653_init, mma8653_set_range |
| RESOLUTION | MMA8653_10BIT_RES, MMA8653_8BIT_RES | mma8653_init, mma8653_set_resolution |
| DATA_RATE | MMA8653_ODR_800, MMA8653_ODR_400, MMA8653_ODR_200, MMA8653_ODR_100, MMA8653_ODR_50, MMA8653_ODR_12_5, MMA8653_ODR_6_25, MMA8653_ODR_1_56 | mma8653_init, mma8653_set_data_rate |
| MODE | MMA8653_MODS_NORMAL, MMA8653_MODS_LOW_NOISE_LOW_POWER, MMA8653_MODS_HIGH_RES, MMA8653_MODS_LOW_POWER | mma8653_set_mode |

## ABS Examples

### Basic Usage
```
arduino_setup()
    mma8653_init(MMA8653_2G_RANGE, MMA8653_10BIT_RES, MMA8653_ODR_800)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, mma8653_read_x())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

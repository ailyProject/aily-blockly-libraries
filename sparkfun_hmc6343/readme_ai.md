# SparkFun HMC6343 3-Axis Compass

Blockly wrapper for the SparkFun HMC6343 3-axis compass sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-hmc6343
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `hmc6343_init` | Statement | VAR(field_input) | `hmc6343_init("compass")` | `Wire.begin(); ↵ compass.init();` |
| `hmc6343_initialized` | Value | VAR(field_variable) | `hmc6343_initialized($compass)` | `compass.isInitialized()` |
| `hmc6343_read_tilt` | Statement | VAR(field_variable) | `hmc6343_read_tilt($compass)` | `compass.readTilt();` |
| `hmc6343_read_heading` | Statement | VAR(field_variable) | `hmc6343_read_heading($compass)` | `compass.readHeading();` |
| `hmc6343_read_mag` | Statement | VAR(field_variable) | `hmc6343_read_mag($compass)` | `compass.readMag();` |
| `hmc6343_read_accel` | Statement | VAR(field_variable) | `hmc6343_read_accel($compass)` | `compass.readAccel();` |
| `hmc6343_get_value` | Value | VAR(field_variable), FIELD(dropdown) | `hmc6343_get_value($compass, heading)` | `compass.value(SFE_HMC6343::Measurement::Heading)` |
| `hmc6343_set_orientation` | Statement | VAR(field_variable), ORIENT(dropdown) | `hmc6343_set_orientation($compass, "0")` | `compass.setOrientation(0);` |
| `hmc6343_sleep_control` | Statement | VAR(field_variable), MODE(dropdown) | `hmc6343_sleep_control($compass, sleep)` | `compass.enterSleep();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FIELD | heading, pitch, roll, magX, magY, magZ, accelX, accelY, accelZ, temperature | hmc6343_get_value |
| ORIENT | 0, 1, 2 | hmc6343_set_orientation |
| MODE | sleep, wake | hmc6343_sleep_control |

## ABS Examples

### Basic Usage
```
arduino_setup()
    hmc6343_init("compass")
    serial_begin(Serial, 9600)

arduino_loop()
    hmc6343_read_heading($compass)
    serial_println(Serial, hmc6343_get_value($compass, heading))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `hmc6343_init("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

A complete heading or tilt frame updates pitch and roll. Temperature requires read_tilt. Failed I²C transfers clear the initialized flag and invalidate all numeric blocks. Run init again after reconnection. A wake operation leaves sleep and then enters run mode.

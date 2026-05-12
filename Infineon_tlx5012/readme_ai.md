# TLx5012B Magnetic Angle Sensor

Infineon TLx5012B magnetic angle sensor control library, suitable for Arduino, ESP32 and other development boards. Use the SPI interface to read 360° angle, angular velocity, number of rotations and temperature, suita...

## Library Info
- **Name**: @aily-project/lib-infineon-tlx5012
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tlx5012_init` | Statement | VAR(field_input), CS_PIN(dropdown) | `tlx5012_init("angleSensor", CS_PIN)` | Dynamic code |
| `tlx5012_read_angle` | Value | VAR(field_variable) | `tlx5012_read_angle(variables_get($angleSensor))` | tlx5012_getAngle_ |
| `tlx5012_read_speed` | Value | VAR(field_variable) | `tlx5012_read_speed(variables_get($angleSensor))` | tlx5012_getSpeed_ |
| `tlx5012_read_revolutions` | Value | VAR(field_variable) | `tlx5012_read_revolutions(variables_get($angleSensor))` | tlx5012_getRevolutions_ |
| `tlx5012_read_temperature` | Value | VAR(field_variable) | `tlx5012_read_temperature(variables_get($angleSensor))` | tlx5012_getTemperature_ |
| `tlx5012_read_angle_range` | Value | VAR(field_variable) | `tlx5012_read_angle_range(variables_get($angleSensor))` | tlx5012_getAngleRange_ |
| `tlx5012_reset` | Statement | VAR(field_variable) | `tlx5012_reset(variables_get($angleSensor))` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    tlx5012_init("angleSensor", CS_PIN)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, tlx5012_read_angle(variables_get($angleSensor)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `tlx5012_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

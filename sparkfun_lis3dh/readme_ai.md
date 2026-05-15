# SparkFun LIS3DH Accelerometer

Blockly wrapper for SparkFun LIS3DH 3-axis accelerometer.

## Library Info
- **Name**: @aily-project/lib-sparkfun-lis3dh
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lis3dh_init` | Statement | VAR(field_input), ADDR(dropdown) | `lis3dh_init("accel", "0x19")` | Dynamic code |
| `lis3dh_read_accel_x` | Value | VAR(field_variable) | `lis3dh_read_accel_x(variables_get($accel))` | Dynamic code |
| `lis3dh_read_accel_y` | Value | VAR(field_variable) | `lis3dh_read_accel_y(variables_get($accel))` | Dynamic code |
| `lis3dh_read_accel_z` | Value | VAR(field_variable) | `lis3dh_read_accel_z(variables_get($accel))` | Dynamic code |
| `lis3dh_set_range` | Statement | VAR(field_variable), RANGE(dropdown) | `lis3dh_set_range(variables_get($accel), "2")` | Dynamic code |
| `lis3dh_set_sample_rate` | Statement | VAR(field_variable), RATE(dropdown) | `lis3dh_set_sample_rate(variables_get($accel), "1")` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDR | 0x19, 0x18 | lis3dh_init |
| RANGE | 2, 4, 8, 16 | lis3dh_set_range |
| RATE | 1, 10, 25, 50, 100, 200, 400 | lis3dh_set_sample_rate |

## ABS Examples

### Basic Usage
```
arduino_setup()
    lis3dh_init("accel", "0x19")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, lis3dh_read_accel_x(variables_get($accel)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `lis3dh_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

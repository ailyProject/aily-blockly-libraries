# LSM303AGR Accelerometer & Magnetometer

LSM303AGR 3D accelerometer and 3D magnetometer sensor control library. Reads acceleration, magnetic field and temperature data via I2C interface, suitable for Arduino, STM32 and other development boards.

## Library Info
- **Name**: @aily-project/lib-lsm303agr
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lsm303agr_acc_init` | Statement | VAR(field_input), WIRE(dropdown) | `lsm303agr_acc_init("Acc", WIRE)` | Dynamic code |
| `lsm303agr_mag_init` | Statement | VAR(field_input), WIRE(dropdown) | `lsm303agr_mag_init("Mag", WIRE)` | Dynamic code |
| `lsm303agr_acc_get_axis` | Value | VAR(field_variable), AXIS(dropdown) | `lsm303agr_acc_get_axis(variables_get($Acc), "0")` | Dynamic code |
| `lsm303agr_mag_get_axis` | Value | VAR(field_variable), AXIS(dropdown) | `lsm303agr_mag_get_axis(variables_get($Mag), "0")` | Dynamic code |
| `lsm303agr_acc_get_temperature` | Value | VAR(field_variable) | `lsm303agr_acc_get_temperature(variables_get($Acc))` | Dynamic code |
| `lsm303agr_ahrs_update` | Statement | ACC_VAR(field_variable), MAG_VAR(field_variable) | `lsm303agr_ahrs_update(variables_get($Acc), variables_get($Mag))` | Dynamic code |
| `lsm303agr_ahrs_get_angle` | Value | ANGLE(dropdown) | `lsm303agr_ahrs_get_angle(ROLL)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| AXIS | 0, 1, 2 | lsm303agr_acc_get_axis, lsm303agr_mag_get_axis |
| ANGLE | ROLL, PITCH, HEADING | lsm303agr_ahrs_get_angle |

## ABS Examples

### Basic Usage
```
arduino_setup()
    lsm303agr_acc_init("Acc", WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, lsm303agr_acc_get_axis(variables_get($Acc), "0"))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `lsm303agr_acc_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Dynamic fields**: `lsm303agr_acc_init`, `lsm303agr_mag_init` may add fields at runtime through Blockly extensions.

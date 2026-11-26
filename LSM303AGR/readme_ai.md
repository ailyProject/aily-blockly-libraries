# LSM303AGR Accelerometer & Magnetometer

LSM303AGR 3D accelerometer and 3D magnetometer sensor control library. Reads acceleration, magnetic field and temperature data via I2C interface, suitable for Arduino, STM32 and other development boards.

## Library Info
- **Name**: @aily-project/lib-lsm303agr
- **Version**: 0.0.2

On a missing device or a short I²C transfer the driver returns an error. The axis blocks return `INT32_MIN` and the temperature block returns `NaN`. The angle block returns `NaN` before the first successful AHRS update and after an update with invalid acceleration or magnetic data. Call the update block again after the device reconnects. Temperature acquisition allows one full 1 Hz sample period plus 100 ms.

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lsm303agr_acc_init` | Statement | VAR(field_input), WIRE(dropdown) | `lsm303agr_acc_init("Acc", WIRE)` | `Acc.begin(); ↵ Acc.Enable(); ↵ Acc.EnableTemperatureSensor();` |
| `lsm303agr_mag_init` | Statement | VAR(field_input), WIRE(dropdown) | `lsm303agr_mag_init("Mag", WIRE)` | `Mag.begin(); ↵ Mag.Enable();` |
| `lsm303agr_acc_get_axis` | Value | VAR(field_variable), AXIS(dropdown) | `lsm303agr_acc_get_axis($Acc, "0")` | `_lsm303agr_acc_read_axis(Acc, 0)` |
| `lsm303agr_mag_get_axis` | Value | VAR(field_variable), AXIS(dropdown) | `lsm303agr_mag_get_axis($Mag, "0")` | `_lsm303agr_mag_read_axis(Mag, 0)` |
| `lsm303agr_acc_get_temperature` | Value | VAR(field_variable) | `lsm303agr_acc_get_temperature($Acc)` | `_lsm303agr_acc_read_temp(Acc)` |
| `lsm303agr_ahrs_update` | Statement | ACC_VAR(field_variable), MAG_VAR(field_variable) | `lsm303agr_ahrs_update($Acc, $Mag)` | `_lsm303agr_ahrs_update(Acc, Mag);` |
| `lsm303agr_ahrs_get_angle` | Value | ANGLE(dropdown) | `lsm303agr_ahrs_get_angle(ROLL)` | `(_lsm303agr_ahrs_valid ? _lsm303agr_ahrs_filter.getRoll() : NAN)` |

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
    serial_println(Serial, lsm303agr_acc_get_axis($Acc, "0"))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `lsm303agr_acc_init("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **UI-only extensions**: `lsm303agr_acc_init` and `lsm303agr_mag_init` refresh board/I2C presentation only; neither adds ABS arguments.

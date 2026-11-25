# SparkFun VL53L1X ToF Laser Distance Sensor

Blockly wrapper for the SparkFun VL53L1X I2C laser ToF distance sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-vl53l1x
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `vl53l1x_init` | Statement | VAR(field_input) | `vl53l1x_init("tof")` | `Wire.begin(); ↵ tof.begin();` |
| `vl53l1x_start_ranging` | Statement | VAR(field_variable) | `vl53l1x_start_ranging($tof)` | `tof.startRanging();` |
| `vl53l1x_stop_ranging` | Statement | VAR(field_variable) | `vl53l1x_stop_ranging($tof)` | `tof.stopRanging();` |
| `vl53l1x_data_ready` | Value | VAR(field_variable) | `vl53l1x_data_ready($tof)` | `tof.checkForDataReady()` |
| `vl53l1x_get_distance` | Value | VAR(field_variable) | `vl53l1x_get_distance($tof)` | `tof.getDistance()` |
| `vl53l1x_clear_interrupt` | Statement | VAR(field_variable) | `vl53l1x_clear_interrupt($tof)` | `tof.clearInterrupt();` |
| `vl53l1x_set_distance_mode` | Statement | VAR(field_variable), MODE(dropdown) | `vl53l1x_set_distance_mode($tof, SHORT)` | `tof.setDistanceModeShort();` |
| `vl53l1x_get_range_status` | Value | VAR(field_variable) | `vl53l1x_get_range_status($tof)` | `tof.getRangeStatus()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | SHORT, LONG | vl53l1x_set_distance_mode |

## ABS Examples

### Basic Usage
```
arduino_setup()
    vl53l1x_init("tof")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, vl53l1x_data_ready($tof))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `vl53l1x_init("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

Use the last-initialization-success block after init. In C++, begin() retains its original zero-on-success convention. Missing or short I²C reads yield data ready false, distance 0 and range status 255. Reinitialize after reconnecting the device.

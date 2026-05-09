# SparkFun VL53L1X 激光测距传感器

## Library Info
- **Name**: @aily-project/lib-sparkfun-vl53l1x
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `vl53l1x_init` | Statement | VAR(field_input) | `vl53l1x_init("tof")` | `SFEVL53L1X tof; tof.begin();` |
| `vl53l1x_start_ranging` | Statement | VAR(field_variable) | `vl53l1x_start_ranging(variables_get($tof))` | `tof.startRanging();` |
| `vl53l1x_stop_ranging` | Statement | VAR(field_variable) | `vl53l1x_stop_ranging(variables_get($tof))` | `tof.stopRanging();` |
| `vl53l1x_data_ready` | Value→Boolean | VAR(field_variable) | `vl53l1x_data_ready(variables_get($tof))` | `tof.checkForDataReady()` |
| `vl53l1x_get_distance` | Value→Number | VAR(field_variable) | `vl53l1x_get_distance(variables_get($tof))` | `tof.getDistance()` |
| `vl53l1x_clear_interrupt` | Statement | VAR(field_variable) | `vl53l1x_clear_interrupt(variables_get($tof))` | `tof.clearInterrupt();` |
| `vl53l1x_set_distance_mode` | Statement | VAR(field_variable), MODE(dropdown:SHORT/LONG) | `vl53l1x_set_distance_mode(variables_get($tof), SHORT)` | `tof.setDistanceModeShort();` |
| `vl53l1x_get_range_status` | Value→Number | VAR(field_variable) | `vl53l1x_get_range_status(variables_get($tof))` | `tof.getRangeStatus()` |

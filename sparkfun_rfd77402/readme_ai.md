# SparkFun RFD77402 激光测距传感器

## Library Info
- **Name**: @aily-project/lib-sparkfun-rfd77402
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `rfd77402_init` | Statement | VAR(field_input) | `rfd77402_init("tof")` | `RFD77402 tof; tof.begin();` |
| `rfd77402_take_measurement` | Statement | VAR(field_variable) | `rfd77402_take_measurement(variables_get($tof))` | `tof.takeMeasurement();` |
| `rfd77402_get_distance` | Value→Number | VAR(field_variable) | `rfd77402_get_distance(variables_get($tof))` | `tof.getDistance()` |
| `rfd77402_get_valid_pixels` | Value→Number | VAR(field_variable) | `rfd77402_get_valid_pixels(variables_get($tof))` | `tof.getValidPixels()` |
| `rfd77402_get_confidence` | Value→Number | VAR(field_variable) | `rfd77402_get_confidence(variables_get($tof))` | `tof.getConfidenceValue()` |

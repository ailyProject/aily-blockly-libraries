# SparkFun VL53L1X ToF Laser Distance Sensor

Blockly wrapper for the SparkFun VL53L1X I2C laser ToF distance sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-vl53l1x
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `vl53l1x_init` | Statement | VAR(field_input) | `vl53l1x_init("tof")` | Wire.begin();\n |
| `vl53l1x_start_ranging` | Statement | VAR(field_variable) | `vl53l1x_start_ranging(variables_get($tof))` | Dynamic code |
| `vl53l1x_stop_ranging` | Statement | VAR(field_variable) | `vl53l1x_stop_ranging(variables_get($tof))` | Dynamic code |
| `vl53l1x_data_ready` | Value | VAR(field_variable) | `vl53l1x_data_ready(variables_get($tof))` | Dynamic code |
| `vl53l1x_get_distance` | Value | VAR(field_variable) | `vl53l1x_get_distance(variables_get($tof))` | Dynamic code |
| `vl53l1x_clear_interrupt` | Statement | VAR(field_variable) | `vl53l1x_clear_interrupt(variables_get($tof))` | Dynamic code |
| `vl53l1x_set_distance_mode` | Statement | VAR(field_variable), MODE(dropdown) | `vl53l1x_set_distance_mode(variables_get($tof), SHORT)` | Dynamic code |
| `vl53l1x_get_range_status` | Value | VAR(field_variable) | `vl53l1x_get_range_status(variables_get($tof))` | Dynamic code |

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
    serial_println(Serial, vl53l1x_data_ready(variables_get($tof)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `vl53l1x_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

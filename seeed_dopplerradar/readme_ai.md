# Doppler Radar Sensor

Seeed BGT24LTR11 Doppler radar sensor control library for detecting target motion state (approaching/leaving) and speed. Communicates via serial port, supports target detection mode and I/Q ADC mode, with configurable...

## Library Info
- **Name**: @aily-project/lib-seeed-dopplerradar
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `doppler_radar_init` | Statement | VAR(field_input), SERIAL(dropdown), MODE(dropdown) | `doppler_radar_init("BGT", SERIAL, "0")` | Dynamic code |
| `doppler_radar_set_mode` | Statement | VAR(field_variable), MODE(dropdown) | `doppler_radar_set_mode(variables_get($BGT), "0")` | Dynamic code |
| `doppler_radar_target_is` | Value | VAR(field_variable), STATE(dropdown) | `doppler_radar_target_is(variables_get($BGT), APPROACH)` | Dynamic code |
| `doppler_radar_get_speed` | Value | VAR(field_variable) | `doppler_radar_get_speed(variables_get($BGT))` | Dynamic code |
| `doppler_radar_set_threshold` | Statement | VAR(field_variable), THRESHOLD(input_value) | `doppler_radar_set_threshold(variables_get($BGT), math_number(0))` | Dynamic code |
| `doppler_radar_get_threshold` | Value | VAR(field_variable) | `doppler_radar_get_threshold(variables_get($BGT))` | Dynamic code |
| `doppler_radar_set_speed_scope` | Statement | VAR(field_variable), MAX_SPEED(input_value), MIN_SPEED(input_value) | `doppler_radar_set_speed_scope(variables_get($BGT), math_number(9600), math_number(9600))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | 0, 1 | doppler_radar_init, doppler_radar_set_mode |
| STATE | APPROACH, LEAVE, NONE | doppler_radar_target_is |

## ABS Examples

### Basic Usage
```
arduino_setup()
    doppler_radar_init("BGT", SERIAL, "0")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, doppler_radar_target_is(variables_get($BGT), APPROACH))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `doppler_radar_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# HX711 load cell library

Used to control the HX711 load cell module. It supports calibration, tare and weight reading functions. It supports differential input and programmable gain. Software calibration is required to convert weight to numer...

## Library Info
- **Name**: @aily-project/lib-hx711
- **Version**: 0.5.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `hx711_create` | Statement | VAR(field_variable) | `hx711_create(variables_get($scale))` | Dynamic code |
| `hx711_begin` | Statement | VAR(field_variable), DATAPIN(dropdown), CLOCKPIN(dropdown) | `hx711_begin(variables_get($scale), DATAPIN, CLOCKPIN)` | Dynamic code |
| `hx711_tare` | Statement | VAR(field_variable), TIMES(field_number) | `hx711_tare(variables_get($scale), 10)` | Dynamic code |
| `hx711_set_scale` | Statement | VAR(field_variable), SCALE(input_value) | `hx711_set_scale(variables_get($scale), math_number(0))` | Dynamic code |
| `hx711_get_units` | Value | VAR(field_variable), TIMES(field_number) | `hx711_get_units(variables_get($scale), 1)` | Dynamic code |
| `hx711_read` | Value | VAR(field_variable) | `hx711_read(variables_get($scale))` | Dynamic code |
| `hx711_read_average` | Value | VAR(field_variable), TIMES(field_number) | `hx711_read_average(variables_get($scale), 10)` | Dynamic code |
| `hx711_power_down` | Statement | VAR(field_variable) | `hx711_power_down(variables_get($scale))` | Dynamic code |
| `hx711_power_up` | Statement | VAR(field_variable) | `hx711_power_up(variables_get($scale))` | Dynamic code |
| `hx711_set_gain` | Statement | VAR(field_variable), GAIN(dropdown) | `hx711_set_gain(variables_get($scale), HX711_CHANNEL_A_GAIN_128)` | Dynamic code |
| `hx711_calibrate_scale` | Statement | VAR(field_variable), WEIGHT(input_value), TIMES(field_number) | `hx711_calibrate_scale(variables_get($scale), math_number(0), 10)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| GAIN | HX711_CHANNEL_A_GAIN_128, HX711_CHANNEL_A_GAIN_64, HX711_CHANNEL_B_GAIN_32 | hx711_set_gain |

## ABS Examples

### Basic Usage
```
arduino_setup()
    hx711_create(variables_get($scale))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, hx711_get_units(variables_get($scale), 1))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

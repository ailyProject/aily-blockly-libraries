# SparkFun Bio Sensor Hub

Blockly wrapper for the SparkFun MAX32664 Bio Sensor Hub and MAX30101 pulse oximeter.

## Library Info
- **Name**: @aily-project/lib-sparkfun-bio-sensor-hub
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `biohub_init` | Statement | VAR(field_input), RESET_PIN(field_number), MFIO_PIN(field_number) | `biohub_init("bioHub", 4, 13)` | Wire.begin();\n |
| `biohub_is_ready` | Value | VAR(field_variable) | `biohub_is_ready(variables_get($bioHub))` | Dynamic code |
| `biohub_config_bpm` | Statement | VAR(field_variable), MODE(dropdown) | `biohub_config_bpm(variables_get($bioHub), MODE_ONE)` | Dynamic code |
| `biohub_config_sensor_bpm` | Statement | VAR(field_variable), MODE(dropdown) | `biohub_config_sensor_bpm(variables_get($bioHub), MODE_ONE)` | Dynamic code |
| `biohub_read_bpm` | Statement | VAR(field_variable) | `biohub_read_bpm(variables_get($bioHub))` | Dynamic code |
| `biohub_read_sensor_bpm` | Statement | VAR(field_variable) | `biohub_read_sensor_bpm(variables_get($bioHub))` | Dynamic code |
| `biohub_value` | Value | VAR(field_variable), FIELD(dropdown) | `biohub_value(variables_get($bioHub), heartRate)` | Dynamic code |
| `biohub_set_pulse_width` | Statement | VAR(field_variable), WIDTH(dropdown) | `biohub_set_pulse_width(variables_get($bioHub), "69")` | Dynamic code |
| `biohub_set_sample_rate` | Statement | VAR(field_variable), RATE(dropdown) | `biohub_set_sample_rate(variables_get($bioHub), "50")` | Dynamic code |
| `biohub_set_adc_range` | Statement | VAR(field_variable), RANGE(dropdown) | `biohub_set_adc_range(variables_get($bioHub), "2048")` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | MODE_ONE, MODE_TWO | biohub_config_bpm, biohub_config_sensor_bpm |
| FIELD | heartRate, oxygen, confidence, status, irLed, redLed, rValue | biohub_value |
| WIDTH | 69, 118, 215, 411 | biohub_set_pulse_width |
| RATE | 50, 100, 200, 400, 800, 1000, 1600, 3200 | biohub_set_sample_rate |
| RANGE | 2048, 4096, 8192, 16384 | biohub_set_adc_range |

## ABS Examples

### Basic Usage
```
arduino_setup()
    biohub_init("bioHub", 4, 13)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, biohub_is_ready(variables_get($bioHub)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `biohub_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

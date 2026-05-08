# SparkFun Bio Sensor Hub

Heart-rate, SpO2, confidence, status, and LED data blocks for MAX32664 Bio Sensor Hub.

## Library Info
- **Name**: @aily-project/lib-sparkfun-bio-sensor-hub
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `biohub_init` | Statement | VAR(field_input), RESET_PIN(field_number), MFIO_PIN(field_number) | `biohub_init("bioHub", 4, 13)` | `SparkFun_Bio_Sensor_Hub bioHub; bioHub.begin(Wire, 4, 13);` |
| `biohub_is_ready` | Value | VAR(field_variable) | `biohub_is_ready(variables_get($bioHub))` | `bioHub_ready` |
| `biohub_config_bpm` | Statement | VAR(field_variable), MODE(dropdown) | `biohub_config_bpm(variables_get($bioHub), MODE_ONE)` | `bioHub.configBpm(MODE_ONE);` |
| `biohub_config_sensor_bpm` | Statement | VAR(field_variable), MODE(dropdown) | `biohub_config_sensor_bpm(variables_get($bioHub), MODE_ONE)` | `bioHub.configSensorBpm(MODE_ONE);` |
| `biohub_read_bpm` | Statement | VAR(field_variable) | `biohub_read_bpm(variables_get($bioHub))` | `bioHub_data = bioHub.readBpm();` |
| `biohub_read_sensor_bpm` | Statement | VAR(field_variable) | `biohub_read_sensor_bpm(variables_get($bioHub))` | `bioHub_data = bioHub.readSensorBpm();` |
| `biohub_value` | Value | VAR(field_variable), FIELD(dropdown) | `biohub_value(variables_get($bioHub), heartRate)` | `bioHub_data.heartRate` |
| `biohub_set_pulse_width` | Statement | VAR(field_variable), WIDTH(dropdown) | `biohub_set_pulse_width(variables_get($bioHub), 69)` | `bioHub.setPulseWidth(69);` |
| `biohub_set_sample_rate` | Statement | VAR(field_variable), RATE(dropdown) | `biohub_set_sample_rate(variables_get($bioHub), 100)` | `bioHub.setSampleRate(100);` |
| `biohub_set_adc_range` | Statement | VAR(field_variable), RANGE(dropdown) | `biohub_set_adc_range(variables_get($bioHub), 2048)` | `bioHub.setAdcRange(2048);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | MODE_ONE, MODE_TWO | Algorithm output mode |
| FIELD | heartRate, oxygen, confidence, status, irLed, redLed, rValue | Cached `bioData` field |
| WIDTH | 69, 118, 215, 411 | LED pulse width in microseconds |
| RATE | 50, 100, 200, 400, 800, 1000, 1600, 3200 | Sample rate |
| RANGE | 2048, 4096, 8192, 16384 | ADC dynamic range nA |

## ABS Examples

```text
arduino_setup()
    biohub_init("bioHub", 4, 13)
    biohub_config_bpm(variables_get($bioHub), MODE_ONE)
    time_delay(math_number(4000))

arduino_loop()
    biohub_read_bpm(variables_get($bioHub))
    serial_println(Serial, biohub_value(variables_get($bioHub), heartRate))
```

## Notes

`biohub_init("name", ...)` creates variable `$name` and cached struct `$name_data` internally. Read a data block before using `biohub_value`.
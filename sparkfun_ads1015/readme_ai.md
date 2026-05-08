# SparkFun ADS1015

12-bit 4-channel I2C ADC blocks for ADS1015.

## Library Info
- **Name**: @aily-project/lib-sparkfun-ads1015
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ads1015_init` | Statement | VAR(field_input), ADDRESS(dropdown) | `ads1015_init("ads1015", ADS1015_ADDRESS_GND)` | `ADS1015 ads1015; ads1015_ready = ads1015.begin(addr);` |
| `ads1015_is_ready` | Value | VAR(field_variable) | `ads1015_is_ready(variables_get($ads1015))` | `ads1015_ready` |
| `ads1015_read_single` | Value | VAR(field_variable), CHANNEL(dropdown) | `ads1015_read_single(variables_get($ads1015), 0)` | `ads1015.getSingleEnded(0)` |
| `ads1015_read_millivolts` | Value | VAR(field_variable), CHANNEL(dropdown) | `ads1015_read_millivolts(variables_get($ads1015), 0)` | `ads1015.getSingleEndedMillivolts(0)` |
| `ads1015_read_differential` | Value | VAR(field_variable), MUX(dropdown) | `ads1015_read_differential(variables_get($ads1015), ADS1015_CONFIG_MUX_DIFF_P0_N1)` | `ads1015.getDifferential(mux)` |
| `ads1015_read_differential_mv` | Value | VAR(field_variable), MUX(dropdown) | `ads1015_read_differential_mv(variables_get($ads1015), ADS1015_CONFIG_MUX_DIFF_P0_N1)` | `ads1015.getDifferentialMillivolts(mux)` |
| `ads1015_set_gain` | Statement | VAR(field_variable), GAIN(dropdown) | `ads1015_set_gain(variables_get($ads1015), ADS1015_CONFIG_PGA_2)` | `ads1015.setGain(gain);` |
| `ads1015_set_sample_rate` | Statement | VAR(field_variable), RATE(dropdown) | `ads1015_set_sample_rate(variables_get($ads1015), ADS1015_CONFIG_RATE_1600HZ)` | `ads1015.setSampleRate(rate);` |
| `ads1015_set_mode` | Statement | VAR(field_variable), MODE(dropdown) | `ads1015_set_mode(variables_get($ads1015), ADS1015_CONFIG_MODE_CONT)` | `ads1015.setMode(mode);` |
| `ads1015_conversion_ready` | Value | VAR(field_variable) | `ads1015_conversion_ready(variables_get($ads1015))` | `ads1015.available()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | ADS1015_ADDRESS_GND, ADS1015_ADDRESS_VDD, ADS1015_ADDRESS_SDA, ADS1015_ADDRESS_SCL | I2C address |
| CHANNEL | 0, 1, 2, 3 | Single-ended channel |
| MUX | ADS1015_CONFIG_MUX_DIFF_P0_N1, ADS1015_CONFIG_MUX_DIFF_P0_N3, ADS1015_CONFIG_MUX_DIFF_P1_N3, ADS1015_CONFIG_MUX_DIFF_P2_N3 | Differential pair |
| GAIN | ADS1015_CONFIG_PGA_TWOTHIRDS, ADS1015_CONFIG_PGA_1, ADS1015_CONFIG_PGA_2, ADS1015_CONFIG_PGA_4, ADS1015_CONFIG_PGA_8, ADS1015_CONFIG_PGA_16 | Voltage range |
| RATE | ADS1015_CONFIG_RATE_128HZ ... ADS1015_CONFIG_RATE_3300HZ | Sample rate |
| MODE | ADS1015_CONFIG_MODE_CONT, ADS1015_CONFIG_MODE_SINGLE | Conversion mode |

## ABS Examples

```text
arduino_setup()
    ads1015_init("ads1015", ADS1015_ADDRESS_GND)
    ads1015_set_gain(variables_get($ads1015), ADS1015_CONFIG_PGA_2)

arduino_loop()
    serial_println(Serial, ads1015_read_millivolts(variables_get($ads1015), 0))
```

## Notes

`ads1015_init("name", ...)` creates variable `$name`; use `variables_get($name)` in later blocks.
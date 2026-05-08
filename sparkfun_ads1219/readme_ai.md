# SparkFun ADS1219

24-bit 4-channel I2C ADC blocks for ADS1219.

## Library Info
- **Name**: @aily-project/lib-sparkfun-ads1219
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ads1219_init` | Statement | VAR(field_input), ADDRESS(dropdown) | `ads1219_init("ads1219", 0x40)` | `SfeADS1219ArdI2C ads1219; ads1219.begin(Wire, addr);` |
| `ads1219_is_ready` | Value | VAR(field_variable) | `ads1219_is_ready(variables_get($ads1219))` | `ads1219_ready` |
| `ads1219_read_millivolts` | Value | VAR(field_variable), REFERENCE(input_value) | `ads1219_read_millivolts(variables_get($ads1219), math_number(2048))` | `ads1219ReadMillivolts(adc, ref)` |
| `ads1219_read_raw` | Value | VAR(field_variable) | `ads1219_read_raw(variables_get($ads1219))` | `ads1219ReadRaw(adc)` |
| `ads1219_start_sync` | Statement | VAR(field_variable) | `ads1219_start_sync(variables_get($ads1219))` | `ads1219.startSync();` |
| `ads1219_data_ready` | Value | VAR(field_variable) | `ads1219_data_ready(variables_get($ads1219))` | `ads1219.dataReady()` |
| `ads1219_set_mux` | Statement | VAR(field_variable), MUX(dropdown) | `ads1219_set_mux(variables_get($ads1219), ADS1219_CONFIG_MUX_SINGLE_0)` | `ads1219.setInputMultiplexer(mux);` |
| `ads1219_set_gain` | Statement | VAR(field_variable), GAIN(dropdown) | `ads1219_set_gain(variables_get($ads1219), ADS1219_GAIN_1)` | `ads1219.setGain(gain);` |
| `ads1219_set_data_rate` | Statement | VAR(field_variable), RATE(dropdown) | `ads1219_set_data_rate(variables_get($ads1219), ADS1219_DATA_RATE_20SPS)` | `ads1219.setDataRate(rate);` |
| `ads1219_set_mode` | Statement | VAR(field_variable), MODE(dropdown) | `ads1219_set_mode(variables_get($ads1219), ADS1219_CONVERSION_SINGLE_SHOT)` | `ads1219.setConversionMode(mode);` |
| `ads1219_set_vref` | Statement | VAR(field_variable), VREF(dropdown) | `ads1219_set_vref(variables_get($ads1219), ADS1219_VREF_INTERNAL)` | `ads1219.setVoltageReference(vref);` |
| `ads1219_power_down` | Statement | VAR(field_variable) | `ads1219_power_down(variables_get($ads1219))` | `ads1219.powerDown();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x40-0x4F | I2C address |
| MUX | ADS1219_CONFIG_MUX_DIFF_P0_N1, DIFF_P2_N3, DIFF_P1_N2, SINGLE_0..3, SHORTED | Input mux |
| GAIN | ADS1219_GAIN_1, ADS1219_GAIN_4 | PGA gain |
| RATE | ADS1219_DATA_RATE_20SPS, 90SPS, 330SPS, 1000SPS | Data rate |
| MODE | ADS1219_CONVERSION_SINGLE_SHOT, ADS1219_CONVERSION_CONTINUOUS | Conversion mode |
| VREF | ADS1219_VREF_INTERNAL, ADS1219_VREF_EXTERNAL | Reference source |

## ABS Examples

```text
arduino_setup()
    ads1219_init("ads1219", 0x40)
    ads1219_set_mux(variables_get($ads1219), ADS1219_CONFIG_MUX_SINGLE_0)

arduino_loop()
    serial_println(Serial, ads1219_read_millivolts(variables_get($ads1219), math_number(2048)))
```

## Notes

The read helper starts one conversion, waits up to about 1100 ms, reads data, and returns 0 on failure.
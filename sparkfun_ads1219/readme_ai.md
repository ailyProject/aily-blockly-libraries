# SparkFun ADS1219 ADC

Blockly wrapper for the SparkFun ADS1219 24-bit 4-channel I2C ADC.

## Library Info
- **Name**: @aily-project/lib-sparkfun-ads1219
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ads1219_init` | Statement | VAR(field_input), ADDRESS(dropdown) | `ads1219_init("ads1219", "0x40")` | `Wire.begin(); ↵ ads1219_ready = ads1219.begin(Wire, 0x40);` |
| `ads1219_is_ready` | Value | VAR(field_variable) | `ads1219_is_ready($ads1219)` | `ads1219_ready` |
| `ads1219_read_millivolts` | Value | VAR(field_variable), REFERENCE(input_value) | `ads1219_read_millivolts($ads1219, math_number(0))` | `ads1219ReadMillivolts(ads1219, 1)` |
| `ads1219_read_raw` | Value | VAR(field_variable) | `ads1219_read_raw($ads1219)` | `ads1219ReadRaw(ads1219)` |
| `ads1219_start_sync` | Statement | VAR(field_variable) | `ads1219_start_sync($ads1219)` | `ads1219.startSync();` |
| `ads1219_data_ready` | Value | VAR(field_variable) | `ads1219_data_ready($ads1219)` | `ads1219.dataReady()` |
| `ads1219_set_mux` | Statement | VAR(field_variable), MUX(dropdown) | `ads1219_set_mux($ads1219, ADS1219_CONFIG_MUX_DIFF_P0_N1)` | `ads1219.setInputMultiplexer(ADS1219_CONFIG_MUX_DIFF_P0_N1);` |
| `ads1219_set_gain` | Statement | VAR(field_variable), GAIN(dropdown) | `ads1219_set_gain($ads1219, ADS1219_GAIN_1)` | `ads1219.setGain(ADS1219_GAIN_1);` |
| `ads1219_set_data_rate` | Statement | VAR(field_variable), RATE(dropdown) | `ads1219_set_data_rate($ads1219, ADS1219_DATA_RATE_20SPS)` | `ads1219.setDataRate(ADS1219_DATA_RATE_20SPS);` |
| `ads1219_set_mode` | Statement | VAR(field_variable), MODE(dropdown) | `ads1219_set_mode($ads1219, ADS1219_CONVERSION_SINGLE_SHOT)` | `ads1219.setConversionMode(ADS1219_CONVERSION_SINGLE_SHOT);` |
| `ads1219_set_vref` | Statement | VAR(field_variable), VREF(dropdown) | `ads1219_set_vref($ads1219, ADS1219_VREF_INTERNAL)` | `ads1219.setVoltageReference(ADS1219_VREF_INTERNAL);` |
| `ads1219_power_down` | Statement | VAR(field_variable) | `ads1219_power_down($ads1219)` | `ads1219.powerDown();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x40, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4A, 0x4B, 0x4C, 0x4D, 0x4E, 0x4F | ads1219_init |
| MUX | ADS1219_CONFIG_MUX_DIFF_P0_N1, ADS1219_CONFIG_MUX_DIFF_P2_N3, ADS1219_CONFIG_MUX_DIFF_P1_N2, ADS1219_CONFIG_MUX_SINGLE_0, ADS1219_CONFIG_MUX_SINGLE_1, ADS1219_CONFIG_MUX_SINGLE_2, ADS1219_CONFIG_MUX_SINGLE_3, ADS1219_... | ads1219_set_mux |
| GAIN | ADS1219_GAIN_1, ADS1219_GAIN_4 | ads1219_set_gain |
| RATE | ADS1219_DATA_RATE_20SPS, ADS1219_DATA_RATE_90SPS, ADS1219_DATA_RATE_330SPS, ADS1219_DATA_RATE_1000SPS | ads1219_set_data_rate |
| MODE | ADS1219_CONVERSION_SINGLE_SHOT, ADS1219_CONVERSION_CONTINUOUS | ads1219_set_mode |
| VREF | ADS1219_VREF_INTERNAL, ADS1219_VREF_EXTERNAL | ads1219_set_vref |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ads1219_init("ads1219", "0x40")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ads1219_is_ready($ads1219))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `ads1219_init("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

Successful reset restores 1x gain for millivolt conversion. A rejected configuration write preserves the previously acknowledged gain.

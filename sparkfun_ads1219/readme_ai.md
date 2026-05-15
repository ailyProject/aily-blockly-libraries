# SparkFun ADS1219 ADC

Blockly wrapper for the SparkFun ADS1219 24-bit 4-channel I2C ADC.

## Library Info
- **Name**: @aily-project/lib-sparkfun-ads1219
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ads1219_init` | Statement | VAR(field_input), ADDRESS(dropdown) | `ads1219_init("ads1219", "0x40")` | Wire.begin();\n |
| `ads1219_is_ready` | Value | VAR(field_variable) | `ads1219_is_ready(variables_get($ads1219))` | Dynamic code |
| `ads1219_read_millivolts` | Value | VAR(field_variable), REFERENCE(input_value) | `ads1219_read_millivolts(variables_get($ads1219), math_number(0))` | ads1219ReadMillivolts( |
| `ads1219_read_raw` | Value | VAR(field_variable) | `ads1219_read_raw(variables_get($ads1219))` | ads1219ReadRaw( |
| `ads1219_start_sync` | Statement | VAR(field_variable) | `ads1219_start_sync(variables_get($ads1219))` | Dynamic code |
| `ads1219_data_ready` | Value | VAR(field_variable) | `ads1219_data_ready(variables_get($ads1219))` | Dynamic code |
| `ads1219_set_mux` | Statement | VAR(field_variable), MUX(dropdown) | `ads1219_set_mux(variables_get($ads1219), ADS1219_CONFIG_MUX_DIFF_P0_N1)` | Dynamic code |
| `ads1219_set_gain` | Statement | VAR(field_variable), GAIN(dropdown) | `ads1219_set_gain(variables_get($ads1219), ADS1219_GAIN_1)` | Dynamic code |
| `ads1219_set_data_rate` | Statement | VAR(field_variable), RATE(dropdown) | `ads1219_set_data_rate(variables_get($ads1219), ADS1219_DATA_RATE_20SPS)` | Dynamic code |
| `ads1219_set_mode` | Statement | VAR(field_variable), MODE(dropdown) | `ads1219_set_mode(variables_get($ads1219), ADS1219_CONVERSION_SINGLE_SHOT)` | Dynamic code |
| `ads1219_set_vref` | Statement | VAR(field_variable), VREF(dropdown) | `ads1219_set_vref(variables_get($ads1219), ADS1219_VREF_INTERNAL)` | Dynamic code |
| `ads1219_power_down` | Statement | VAR(field_variable) | `ads1219_power_down(variables_get($ads1219))` | Dynamic code |

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
    serial_println(Serial, ads1219_is_ready(variables_get($ads1219)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `ads1219_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

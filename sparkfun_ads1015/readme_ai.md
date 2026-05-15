# SparkFun ADS1015 ADC

Blockly wrapper for the SparkFun ADS1015 12-bit 4-channel I2C ADC.

## Library Info
- **Name**: @aily-project/lib-sparkfun-ads1015
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ads1015_init` | Statement | VAR(field_input), ADDRESS(dropdown) | `ads1015_init("ads1015", ADS1015_ADDRESS_GND)` | Wire.begin();\n |
| `ads1015_is_ready` | Value | VAR(field_variable) | `ads1015_is_ready(variables_get($ads1015))` | Dynamic code |
| `ads1015_read_single` | Value | VAR(field_variable), CHANNEL(dropdown) | `ads1015_read_single(variables_get($ads1015), "0")` | Dynamic code |
| `ads1015_read_millivolts` | Value | VAR(field_variable), CHANNEL(dropdown) | `ads1015_read_millivolts(variables_get($ads1015), "0")` | Dynamic code |
| `ads1015_read_differential` | Value | VAR(field_variable), MUX(dropdown) | `ads1015_read_differential(variables_get($ads1015), ADS1015_CONFIG_MUX_DIFF_P0_N1)` | Dynamic code |
| `ads1015_read_differential_mv` | Value | VAR(field_variable), MUX(dropdown) | `ads1015_read_differential_mv(variables_get($ads1015), ADS1015_CONFIG_MUX_DIFF_P0_N1)` | Dynamic code |
| `ads1015_set_gain` | Statement | VAR(field_variable), GAIN(dropdown) | `ads1015_set_gain(variables_get($ads1015), ADS1015_CONFIG_PGA_TWOTHIRDS)` | Dynamic code |
| `ads1015_set_sample_rate` | Statement | VAR(field_variable), RATE(dropdown) | `ads1015_set_sample_rate(variables_get($ads1015), ADS1015_CONFIG_RATE_128HZ)` | Dynamic code |
| `ads1015_set_mode` | Statement | VAR(field_variable), MODE(dropdown) | `ads1015_set_mode(variables_get($ads1015), ADS1015_CONFIG_MODE_CONT)` | Dynamic code |
| `ads1015_conversion_ready` | Value | VAR(field_variable) | `ads1015_conversion_ready(variables_get($ads1015))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | ADS1015_ADDRESS_GND, ADS1015_ADDRESS_VDD, ADS1015_ADDRESS_SDA, ADS1015_ADDRESS_SCL | ads1015_init |
| CHANNEL | 0, 1, 2, 3 | ads1015_read_single, ads1015_read_millivolts |
| MUX | ADS1015_CONFIG_MUX_DIFF_P0_N1, ADS1015_CONFIG_MUX_DIFF_P0_N3, ADS1015_CONFIG_MUX_DIFF_P1_N3, ADS1015_CONFIG_MUX_DIFF_P2_N3 | ads1015_read_differential, ads1015_read_differential_mv |
| GAIN | ADS1015_CONFIG_PGA_TWOTHIRDS, ADS1015_CONFIG_PGA_1, ADS1015_CONFIG_PGA_2, ADS1015_CONFIG_PGA_4, ADS1015_CONFIG_PGA_8, ADS1015_CONFIG_PGA_16 | ads1015_set_gain |
| RATE | ADS1015_CONFIG_RATE_128HZ, ADS1015_CONFIG_RATE_250HZ, ADS1015_CONFIG_RATE_490HZ, ADS1015_CONFIG_RATE_920HZ, ADS1015_CONFIG_RATE_1600HZ, ADS1015_CONFIG_RATE_2400HZ, ADS1015_CONFIG_RATE_3300HZ | ads1015_set_sample_rate |
| MODE | ADS1015_CONFIG_MODE_CONT, ADS1015_CONFIG_MODE_SINGLE | ads1015_set_mode |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ads1015_init("ads1015", ADS1015_ADDRESS_GND)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ads1015_is_ready(variables_get($ads1015)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `ads1015_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

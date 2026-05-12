# Seeed Ads1115

Blockly library for Seeed Ads1115.

## Library Info
- **Name**: @aily-project/lib-seeed-ads1115
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ads1115_init` | Statement | ADDRESS(dropdown) | `ads1115_init(ADS1115_GND_ADDRESS)` | Wire.begin();\nads1115_adc.begin( |
| `ads1115_set_gain` | Statement | GAIN(dropdown) | `ads1115_set_gain(ADS1115_PGA_6_144)` | ads1115_adc.setPGAGain( |
| `ads1115_read_raw` | Value | CHANNEL(dropdown) | `ads1115_read_raw(channel0)` | ads1115_adc.getConversionResults( |
| `ads1115_read_voltage` | Value | CHANNEL(dropdown), VRANGE(dropdown) | `ads1115_read_voltage(channel0, "6.144")` | ads1115_toVoltage(ads1115_adc.getConversionResults( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | ADS1115_GND_ADDRESS, ADS1115_VDD_ADDRESS, ADS1115_SDA_ADDRESS, ADS1115_SCL_ADDRESS | ads1115_init |
| GAIN | ADS1115_PGA_6_144, ADS1115_PGA_4_096, ADS1115_PGA_2_048, ADS1115_PGA_1_024, ADS1115_PGA_0_512, ADS1115_PGA_0_256 | ads1115_set_gain |
| CHANNEL | channel0, channel1, channel2, channel3, channel01, channel03, channel13, channel23 | ads1115_read_raw |
| CHANNEL | channel0, channel1, channel2, channel3 | ads1115_read_voltage |
| VRANGE | 6.144, 4.096, 2.048, 1.024, 0.512, 0.256 | ads1115_read_voltage |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ads1115_init(ADS1115_GND_ADDRESS)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ads1115_read_raw(channel0))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

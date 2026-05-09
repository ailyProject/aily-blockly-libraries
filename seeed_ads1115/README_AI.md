# ADS1115 16位ADC

ADS1115 16位I2C ADC，4通道单端/差分输入，可编程增益。

## Library Info
- **Name**: @aily-project/lib-seeed-ads1115
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ads1115_init` | Statement | ADDRESS(dropdown) | `ads1115_init(ADS1115_GND_ADDRESS)` | `Wire.begin(); ads1115_adc.begin(ADS1115_GND_ADDRESS);` |
| `ads1115_set_gain` | Statement | GAIN(dropdown) | `ads1115_set_gain(ADS1115_PGA_2_048)` | `ads1115_adc.setPGAGain(ADS1115_PGA_2_048);` |
| `ads1115_read_raw` | Value | CHANNEL(dropdown) | `ads1115_read_raw(channel0)` | `ads1115_adc.getConversionResults(channel0)` |
| `ads1115_read_voltage` | Value | CHANNEL(dropdown), VRANGE(dropdown) | `ads1115_read_voltage(channel0, 2.048)` | `ads1115_toVoltage(ads1115_adc.getConversionResults(channel0), 2.048)` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | ADS1115_GND_ADDRESS, ADS1115_VDD_ADDRESS, ADS1115_SDA_ADDRESS, ADS1115_SCL_ADDRESS | I2C地址 |
| GAIN | ADS1115_PGA_6_144 ~ ADS1115_PGA_0_256 | 增益量程 |
| CHANNEL | channel0~3, channel01, channel03, channel13, channel23 | 读取通道 |
| VRANGE | 6.144, 4.096, 2.048, 1.024, 0.512, 0.256 | 电压量程（与GAIN匹配） |

## Notes

1. **全局对象**: 使用固定名称 `ads1115_adc`
2. **电压换算**: VRANGE应与设置的GAIN匹配，否则换算不准确
3. **原始值范围**: 16位有符号整数，-32768~32767

# SparkFun LP55231 9通道 LED 驱动

通过 I2C 独立控制 9 路 LED 亮度。

## Library Info
- **Name**: @aily-project/lib-sparkfun-lp55231
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lp55231_init` | Statement | VAR(field_input), ADDR(dropdown) | `lp55231_init("ledDriver", 0x32)` | `Lp55231 ledDriver(0x32); ledDriver.Begin(); ledDriver.Enable();` |
| `lp55231_enable` | Statement | VAR(field_variable) | `lp55231_enable(variables_get($ledDriver))` | `ledDriver.Enable();` |
| `lp55231_disable` | Statement | VAR(field_variable) | `lp55231_disable(variables_get($ledDriver))` | `ledDriver.Disable();` |
| `lp55231_set_channel_pwm` | Statement | VAR(field_variable), CHANNEL(input_value), VALUE(input_value) | `lp55231_set_channel_pwm(variables_get($ledDriver), math_number(0), math_number(128))` | `ledDriver.SetChannelPWM(0, 128);` |
| `lp55231_set_master_fader` | Statement | VAR(field_variable), FADER(dropdown), VALUE(input_value) | `lp55231_set_master_fader(variables_get($ledDriver), 0, math_number(128))` | `ledDriver.SetMasterFader(0, 128);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDR | 0x32,0x33,0x34,0x35 | I2C 地址（ADDR0/ADDR1 引脚决定） |
| CHANNEL | 0-8 | LED 通道编号 |
| FADER | 0,1,2 | 主 Fader 编号 |

## ABS Examples

```
arduino_setup()
    lp55231_init("ledDriver", 0x32)

arduino_loop()
    lp55231_set_channel_pwm(variables_get($ledDriver), math_number(0), math_number(255))
    time_delay(math_number(500))
    lp55231_set_channel_pwm(variables_get($ledDriver), math_number(0), math_number(0))
    time_delay(math_number(500))
```

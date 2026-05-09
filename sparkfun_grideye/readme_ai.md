# SparkFun GridEYE AMG88 热成像传感器

8×8 热成像 I2C 传感器库，通过 `GridEYE` 对象读取每个像素的温度。

## Library Info
- **Name**: @aily-project/lib-sparkfun-grideye
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `grideye_init` | Statement | VAR(field_input), ADDRESS(field_dropdown) | `grideye_init("grideye", 0x69)` | `GridEYE grideye; Wire.begin(); grideye.begin(0x69);` |
| `grideye_get_pixel_temp` | Value | VAR(field_variable), PIXEL(input_value) | `grideye_get_pixel_temp(variables_get($grideye), math_number(0))` | `grideye.getPixelTemperature(0)` |
| `grideye_get_device_temp` | Value | VAR(field_variable) | `grideye_get_device_temp(variables_get($grideye))` | `grideye.getDeviceTemperature()` |
| `grideye_set_framerate` | Statement | VAR(field_variable), RATE(field_dropdown) | `grideye_set_framerate(variables_get($grideye), 1)` | `grideye.setFramerate1FPS();` |
| `grideye_power` | Statement | VAR(field_variable), MODE(field_dropdown) | `grideye_power(variables_get($grideye), WAKE)` | `grideye.wake();` |
| `grideye_set_interrupt` | Statement | VAR(field_variable), UPPER(input_value), LOWER(input_value) | `grideye_set_interrupt(variables_get($grideye), math_number(40), math_number(20))` | `grideye.setUpperInterruptValue(40); grideye.setLowerInterruptValue(20);` |
| `grideye_moving_avg` | Statement | VAR(field_variable), ENABLE(field_dropdown) | `grideye_moving_avg(variables_get($grideye), ENABLE)` | `grideye.movingAverageEnable();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x69, 0x68 | I2C 地址 |
| RATE | 1, 10 | 帧率（FPS）|
| MODE | wake, sleep | 电源模式 |
| ENABLE | enable, disable | 移动平均 |

## Notes

1. **像素地址**: 0-63，对应 8×8 阵列（行优先）
2. **温度单位**: 返回摄氏度（float）

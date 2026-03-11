# 颜色识别库

颜色识别传感器库,支持Arduino UNO、MEGA等开发板

## Library Info
- **Name**: @aily-project/lib-tcs34725
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tcs34725_init` | Statement | TCS34725NAME(field_variable) | `tcs34725_init(variables_get($tcs))` | `` |
| `tcs34725_led_ctrl` | Statement | TCS34725NAME(field_variable), TCSLEDSTATE(dropdown) | `tcs34725_led_ctrl(variables_get($tcs), false)` | (dynamic code) |
| `tcs34725_get_rgb` | Statement | TCS34725NAME(field_variable) | `tcs34725_get_rgb(variables_get($tcs))` | (dynamic code) |
| `tcs34725_rgb_value` | Value | TCSRGBVALUE(dropdown) | `tcs34725_rgb_value(red)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TCSLEDSTATE | false, true | 打开 / 关闭 |
| TCSRGBVALUE | red, green, blue | 红 / 绿 / 蓝 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    tcs34725_init(variables_get($tcs))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, tcs34725_rgb_value(red))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

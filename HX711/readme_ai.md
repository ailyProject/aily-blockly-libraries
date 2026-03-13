# HX711称重传感器库

用于控制HX711称重传感器模块，支持校准、去皮和读取重量功能，支持差分输入和可编程增益，需要软件校准实现重量到数值的转换。

## Library Info
- **Name**: @aily-project/lib-hx711
- **Version**: 0.5.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `hx711_create` | Statement | VAR(field_variable) | `hx711_create($scale)` | `` |
| `hx711_begin` | Statement | VAR(field_variable), DATAPIN(dropdown), CLOCKPIN(dropdown) | `hx711_begin($scale, DATAPIN, CLOCKPIN)` | (dynamic code) |
| `hx711_tare` | Statement | VAR(field_variable), TIMES(field_number) | `hx711_tare($scale, 10)` | (dynamic code) |
| `hx711_set_scale` | Statement | VAR(field_variable), SCALE(input_value) | `hx711_set_scale($scale, math_number(0))` | (dynamic code) |
| `hx711_get_units` | Value | VAR(field_variable), TIMES(field_number) | `hx711_get_units($scale, 1)` | (dynamic code) |
| `hx711_read` | Value | VAR(field_variable) | `hx711_read($scale)` | (dynamic code) |
| `hx711_read_average` | Value | VAR(field_variable), TIMES(field_number) | `hx711_read_average($scale, 10)` | (dynamic code) |
| `hx711_power_down` | Statement | VAR(field_variable) | `hx711_power_down($scale)` | (dynamic code) |
| `hx711_power_up` | Statement | VAR(field_variable) | `hx711_power_up($scale)` | (dynamic code) |
| `hx711_set_gain` | Statement | VAR(field_variable), GAIN(dropdown) | `hx711_set_gain($scale, HX711_CHANNEL_A_GAIN_128)` | (dynamic code) |
| `hx711_calibrate_scale` | Statement | VAR(field_variable), WEIGHT(input_value), TIMES(field_number) | `hx711_calibrate_scale($scale, math_number(0), 10)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| GAIN | HX711_CHANNEL_A_GAIN_128, HX711_CHANNEL_A_GAIN_64, HX711_CHANNEL_B_GAIN_32 | 128 (通道A) / 64 (通道A) / 32 (通道B) |

## ABS Examples

### Basic Usage
```
arduino_setup()
    hx711_create($scale)
    hx711_begin($scale, DATAPIN, CLOCKPIN)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, hx711_get_units($scale, 1))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

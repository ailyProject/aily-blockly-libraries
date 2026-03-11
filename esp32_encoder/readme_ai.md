# ESP32旋转编码器库

ESP32旋转编码器驱动库适用于esp32，通过I2C通信，实现对旋转编码器信号的高效采集与处理，简化编码器应用开发流程。支持多通道编码器输入、旋转方向与步数精准检测，兼容多种编码器类型。

## Library Info
- **Name**: @aily-project/lib-esp32_encoder
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `rotary_encoder_init` | Statement | CLK_PIN(field_number), DT_PIN(field_number), SW_PIN(field_number) | `rotary_encoder_init(6, 7, 8)` | `` |
| `rotary_encoder_read` | Value | (none) | `rotary_encoder_read()` | `displayPos` |
| `rotary_encoder_value_changed` | Value | (none) | `rotary_encoder_value_changed()` | `positionChanged` |
| `rotary_encoder_state_change` | Statement | STATE(dropdown), DO(input_statement) | `rotary_encoder_state_change(CHANGED)` @DO: ... | (dynamic code) |
| `rotary_encoder_get_property` | Value | PROPERTY(dropdown) | `rotary_encoder_get_property(POSITION)` | (dynamic code) |
| `rotary_encoder_set_property` | Statement | PROPERTY(dropdown), VALUE(input_value) | `rotary_encoder_set_property(POSITION, math_number(0))` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| STATE | CHANGED, LEFT, RIGHT, ABOVE_LIMIT, BELOW_LIMIT | 位置改变 / 向左旋转 / 向右旋转 / 高于上限 / 低于下限 |
| PROPERTY | POSITION, DIRECTION, INCREMENT, UPPER_LIMIT, LOWER_LIMIT | 位置 / 方向 / 增量 / 上限 / 下限 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    rotary_encoder_init(6, 7, 8)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, rotary_encoder_read())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

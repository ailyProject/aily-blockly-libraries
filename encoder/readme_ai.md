# Arduino旋转编码器库

Arduino旋转编码器驱动库，支持I2C通信，支持旋转方向识别、步数计数、按键检测（带按键编码器），响应速度快，兼容多种主流开发板。

## Library Info
- **Name**: @aily-project/lib-encoder
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `encoder_init` | Statement | ENCODER(field_variable), PIN_A(dropdown), PIN_B(dropdown) | `encoder_init(variables_get($encoder1), PIN_A, PIN_B)` | `` |
| `encoder_set_property` | Statement | ENCODER(field_variable), PROPERTY(dropdown), VALUE(input_value) | `encoder_set_property(variables_get($encoder1), position, math_number(0))` | (dynamic code) |
| `encoder_value_changed` | Value | (none) | `encoder_value_changed()` | — |
| `encoder_state_change` | Statement | STATE(dropdown), DO(input_statement) | `encoder_state_change(LEFT)` @DO: ... | (dynamic code) |
| `encoder_get_property` | Value | ENCODER(field_variable), PROPERTY(dropdown) | `encoder_get_property(variables_get($encoder1), POSITION)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PROPERTY | position, upper_limit, lower_limit | 位置 / 上限 / 下限 |
| STATE | LEFT, RIGHT, ABOVE_LIMIT, BELOW_LIMIT | 向左旋转 / 向右旋转 / 高于上限 / 低于下限 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    encoder_init(variables_get($encoder1), PIN_A, PIN_B)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, encoder_value_changed())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

# Seeed CAN

SeeedStudio CAN总线通信库，支持MCP2515和MCP2518FD控制器

## Library Info
- **Name**: @aily-project/lib-seeed-can
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_can_create` | Statement | VAR(field_input), CS_PIN(field_number) | `seeed_can_create("can", 9)` | `` |
| `seeed_can_begin` | Statement | VAR(field_variable), SPEED(dropdown), CLOCK(dropdown) | `seeed_can_begin($can, CAN_5KBPS, MCP_8MHz)` | (dynamic code) |
| `seeed_can_send` | Statement | VAR(field_variable), ID(input_value), EXT(dropdown), DATA(input_value) | `seeed_can_send($can, math_number(0), 0, math_number(0))` | (dynamic code) |
| `seeed_can_receive_check` | Value | VAR(field_variable) | `seeed_can_receive_check($can)` | — |
| `seeed_can_receive` | Statement | VAR(field_variable), LEN(field_variable), ID(field_variable), DATA(field_variable) | `seeed_can_receive($can, $len, $id, $data)` | (dynamic code) |
| `seeed_can_get_id` | Value | VAR(field_variable) | `seeed_can_get_id($can)` | (dynamic code) |
| `seeed_can_init_mask` | Statement | VAR(field_variable), NUM(dropdown), EXT(dropdown), MASK(input_value) | `seeed_can_init_mask($can, 0, 0, math_number(0))` | (dynamic code) |
| `seeed_can_init_filter` | Statement | VAR(field_variable), NUM(dropdown), EXT(dropdown), FILTER(input_value) | `seeed_can_init_filter($can, 0, 0, math_number(0))` | (dynamic code) |
| `seeed_can_set_mode` | Statement | VAR(field_variable), MODE(dropdown) | `seeed_can_set_mode($can, MODE_NORMAL)` | (dynamic code) |
| `seeed_can_sleep` | Statement | VAR(field_variable) | `seeed_can_sleep($can)` | (dynamic code) |
| `seeed_can_wake` | Statement | VAR(field_variable) | `seeed_can_wake($can)` | (dynamic code) |
| `seeed_can_check_error` | Value | VAR(field_variable) | `seeed_can_check_error($can)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SPEED | CAN_5KBPS, CAN_10KBPS, CAN_20KBPS, CAN_25KBPS, CAN_31K25BPS, CAN_33KBPS, CAN_40KBPS, CAN_50KBPS, CAN_80KBPS, CAN_83K3BPS, CAN_95KBPS, CAN_95K2BPS, CAN_100KBPS, CAN_125KBPS, CAN_200KBPS, CAN_250KBPS, CAN_500KBPS, CAN_666KBPS, CAN_800KBPS, CAN_1000KBPS | 5KBPS / 10KBPS / 20KBPS / 25KBPS / 31.25KBPS / 33KBPS / 40KBPS / 50KBPS / 80KBPS / 83.3KBPS / 95KBPS / 95.2KBPS / 100KBPS / 125KBPS / 200KBPS / 250KBPS / 500KBPS / 666KBPS / 800KBPS / 1000KBPS |
| CLOCK | MCP_8MHz, MCP_12MHz, MCP_16MHz | 8MHz / 12MHz / 16MHz |
| EXT | 0, 1 | 标准帧 / 扩展帧 |
| NUM | 0, 1 | 掩码0 / 掩码1 |
| MODE | MODE_NORMAL, MODE_SLEEP, MODE_LISTEN, MODE_CONFIG | 正常模式 / 睡眠模式 / 监听模式 / 配置模式 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    seeed_can_create("can", 9)
    seeed_can_begin($can, CAN_5KBPS, MCP_8MHz)
    seeed_can_init_mask($can, 0, 0, math_number(0))
    seeed_can_init_filter($can, 0, 0, math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, seeed_can_receive_check($can))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `seeed_can_create("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

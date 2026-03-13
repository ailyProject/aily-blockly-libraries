# R4 CAN总线通信库

用于Arduino UNO R4的CAN总线通信库，支持CAN消息的发送和接收

## Library Info
- **Name**: @aily-project/lib-r4-can
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `can_begin` | Statement | BITRATE(dropdown) | `can_begin(CanBitRate::BR_125k)` | `CAN1.begin(` |
| `can_available` | Value | (none) | `can_available()` | `CAN1.available()` |
| `can_read` | Statement | VAR(field_variable) | `can_read($canMsg)` | (dynamic code) |
| `can_create_message` | Value | ID(input_value), DATA(input_value) | `can_create_message(math_number(0), math_number(0))` | `CANMessage(` |
| `can_write` | Statement | MSG(input_value) | `can_write(text("hello"))` | `CAN1.write(` |
| `can_get_message_id` | Value | VAR(field_variable) | `can_get_message_id($canMsg)` | (dynamic code) |
| `can_get_message_data` | Value | VAR(field_variable), INDEX(input_value) | `can_get_message_data($canMsg, math_number(0))` | (dynamic code) |
| `can_set_filter_mask` | Statement | TYPE(dropdown), MASK(input_value) | `can_set_filter_mask(Standard, math_number(0))` | `CAN.setFilterMask_` |
| `can_set_filter_id` | Statement | TYPE(dropdown), ID(input_value) | `can_set_filter_id(Standard, math_number(0))` | `CAN.setFilterId_` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BITRATE | CanBitRate::BR_125k, CanBitRate::BR_250k, CanBitRate::BR_500k, CanBitRate::BR_1m | 125Kbps / 250Kbps / 500Kbps / 1Mbps |
| TYPE | Standard, Extended | 标准 / 扩展 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    can_begin(CanBitRate::BR_125k)
    can_create_message(math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, can_available())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

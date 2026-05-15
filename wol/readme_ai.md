# WOL Wake-on-LAN

Wake-on-LAN library for sending magic packets to wake up devices on the local network (PC, NAS, server, etc.)

## Library Info
- **Name**: @aily-project/lib-wol
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `wol_send` | Statement | MAC(input_value), BROADCAST_IP(input_value), PORT(input_value) | `wol_send(text("value"), text("value"), math_number(0))` | wolSendMagicPacket( |
| `wol_send_result` | Value | MAC(input_value), BROADCAST_IP(input_value), PORT(input_value) | `wol_send_result(text("value"), text("value"), math_number(0))` | wolSendMagicPacket( |

## ABS Examples

### Basic Usage
```
arduino_setup()
    wol_send(text("value"), text("value"), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, wol_send_result(text("value"), text("value"), math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# ESP32 Asynchronous UDP

ESP32 asynchronous UDP communication library supports UDP listening, sending, broadcast and multicast

## Library Info
- **Name**: @aily-project/lib-esp32-asyncudp
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_asyncudp_create` | Statement | VAR(field_input) | `esp32_asyncudp_create("udp")` | Dynamic code |
| `esp32_asyncudp_listen` | Statement | VAR(field_variable), PORT(input_value) | `esp32_asyncudp_listen(variables_get($udp), math_number(0))` | Dynamic code |
| `esp32_asyncudp_on_packet` | Hat | VAR(field_variable), DATA_VAR(field_input), IP_VAR(field_input), PORT_VAR(field_input), HANDLER(input_statement) | `esp32_asyncudp_on_packet(variables_get($udp), "data", "remoteIP", "remotePort") @HANDLER: child_block()` | Dynamic code |
| `esp32_asyncudp_send` | Statement | VAR(field_variable), DATA(input_value), IP(input_value), PORT(input_value) | `esp32_asyncudp_send(variables_get($udp), text("value"), text("value"), math_number(0))` | Dynamic code |
| `esp32_asyncudp_broadcast` | Statement | VAR(field_variable), DATA(input_value), PORT(input_value) | `esp32_asyncudp_broadcast(variables_get($udp), text("value"), math_number(0))` | Dynamic code |
| `esp32_asyncudp_close` | Statement | VAR(field_variable) | `esp32_asyncudp_close(variables_get($udp))` | Dynamic code |
| `esp32_asyncudp_listen_multicast` | Statement | VAR(field_variable), IP(input_value), PORT(input_value) | `esp32_asyncudp_listen_multicast(variables_get($udp), text("value"), math_number(0))` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_asyncudp_create("udp")
    serial_begin(Serial, 9600)

arduino_loop()
    esp32_asyncudp_listen(variables_get($udp), math_number(0))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `esp32_asyncudp_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

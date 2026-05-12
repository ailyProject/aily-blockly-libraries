# ESP32 DNS server

ESP32 DNS server supports applications such as Captive Portal

## Library Info
- **Name**: @aily-project/lib-esp32-dnsserver
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_dnsserver_start` | Statement | PORT(input_value), DOMAIN(input_value), IP(input_value) | `esp32_dnsserver_start(math_number(0), text("value"), text("value"))` | Dynamic code |
| `esp32_dnsserver_start_captive` | Statement | (none) | `esp32_dnsserver_start_captive()` | dnsServer.start(53, |
| `esp32_dnsserver_stop` | Statement | (none) | `esp32_dnsserver_stop()` | dnsServer.stop();\n |
| `esp32_dnsserver_process` | Statement | (none) | `esp32_dnsserver_process()` | dnsServer.processNextRequest();\n |
| `esp32_dnsserver_set_ttl` | Statement | TTL(input_value) | `esp32_dnsserver_set_ttl(math_number(0))` | dnsServer.setTTL( |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_dnsserver_start(math_number(0), text("value"), text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    esp32_dnsserver_start_captive()
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

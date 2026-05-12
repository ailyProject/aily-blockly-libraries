# ESP32 mDNS

ESP32 mDNS multicast DNS service, supporting hostname resolution and service discovery

## Library Info
- **Name**: @aily-project/lib-esp32-mdns
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_mdns_begin` | Statement | HOSTNAME(input_value) | `esp32_mdns_begin(text("value"))` | if (!MDNS.begin( |
| `esp32_mdns_end` | Statement | (none) | `esp32_mdns_end()` | MDNS.end();\n |
| `esp32_mdns_add_service` | Statement | SERVICE(input_value), PROTO(dropdown), PORT(input_value) | `esp32_mdns_add_service(text("value"), tcp, math_number(0))` | MDNS.addService( |
| `esp32_mdns_add_service_txt` | Statement | SERVICE(input_value), PROTO(dropdown), KEY(input_value), VALUE(input_value) | `esp32_mdns_add_service_txt(text("value"), tcp, text("value"), text("value"))` | MDNS.addServiceTxt( |
| `esp32_mdns_query_host` | Value | HOST(input_value) | `esp32_mdns_query_host(text("value"))` | MDNS.queryHost( |
| `esp32_mdns_query_service` | Value | SERVICE(input_value), PROTO(dropdown) | `esp32_mdns_query_service(text("value"), tcp)` | MDNS.queryService( |
| `esp32_mdns_result` | Value | INDEX(input_value), ATTR(dropdown) | `esp32_mdns_result(math_number(0), hostname)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PROTO | tcp, udp | esp32_mdns_add_service, esp32_mdns_add_service_txt, esp32_mdns_query_service |
| ATTR | hostname, address, port | esp32_mdns_result |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_mdns_begin(text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_mdns_query_host(text("value")))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

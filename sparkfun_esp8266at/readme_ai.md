# SparkFun ESP8266 AT WiFi Shield

Blockly wrapper for the SparkFun ESP8266 AT WiFi Shield Arduino Library.

## Library Info
- **Name**: @aily-project/lib-sparkfun-esp8266at
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp8266at_begin` | Statement | BAUD(dropdown), PORT(dropdown) | `esp8266at_begin("9600", "0")` | esp8266.begin( |
| `esp8266at_connect` | Statement | SSID(input_value), PWD(input_value) | `esp8266at_connect(text("value"), text("value"))` | esp8266.connect( |
| `esp8266at_disconnect` | Statement | (none) | `esp8266at_disconnect()` | esp8266.disconnect();\n |
| `esp8266at_is_connected` | Value | (none) | `esp8266at_is_connected()` | esp8266.status() == STATION_GOT_IP |
| `esp8266at_local_ip` | Value | (none) | `esp8266at_local_ip()` | esp8266.localIP().toString() |
| `esp8266at_tcp_connect` | Statement | LINK_ID(field_number), HOST(input_value), PORT(input_value) | `esp8266at_tcp_connect(0, text("value"), math_number(0))` | esp8266.tcpConnect( |
| `esp8266at_tcp_send` | Statement | LINK_ID(field_number), DATA(input_value) | `esp8266at_tcp_send(0, text("value"))` | esp8266.print( |
| `esp8266at_close` | Statement | LINK_ID(field_number) | `esp8266at_close(0)` | esp8266.close( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BAUD | 9600, 115200, 57600, 19200 | esp8266at_begin |
| PORT | 0, 1 | esp8266at_begin |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp8266at_begin("9600", "0")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp8266at_is_connected())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

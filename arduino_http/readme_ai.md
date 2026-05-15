# ArduinoHTTP

Arduino HTTP and WebSocket library, supports WiFi connection and HTTP request operation

## Library Info
- **Name**: @aily-project/lib-arduino-http
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `wifi_connect` | Statement | SSID(field_input), PASS(field_input) | `wifi_connect("yourSSID", "yourPASS")` | WiFi.begin( |
| `wifi_ssid` | Value | (none) | `wifi_ssid()` | WiFi.SSID() |
| `wifi_localip` | Value | (none) | `wifi_localip()` | WiFi.localIP() |
| `http_get` | Statement | URL(field_input) | `http_get("http://example.com")` | client.beginRequest();\n |
| `http_post` | Statement | URL(field_input), TYPE(field_input), DATA(field_input) | `http_post("http://example.com", "application/json", "{}")` | client.beginRequest();\n |
| `analog_read` | Value | PIN(dropdown) | `analog_read(A0)` | analogRead( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PIN | A0, A1, A2, A3, A4, A5 | analog_read |

## ABS Examples

### Basic Usage
```
arduino_setup()
    wifi_connect("yourSSID", "yourPASS")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, wifi_ssid())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# ArduinoWiFi

WiFi and Ciao data transfer support library specifically for Arduino UNO R3

## Library Info
- **Name**: @aily-project/lib-arduino-wifi
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `wifi_begin` | Statement | (none) | `wifi_begin()` | Wifi.begin();\n |
| `wifi_connect` | Statement | SSID(input_value), PASSWORD(input_value) | `wifi_connect(text("value"), text("value"))` | Wifi.connect( |
| `wifi_connected` | Value | (none) | `wifi_connected()` | Wifi.connected() |
| `ciao_begin` | Statement | (none) | `ciao_begin()` | Ciao.begin();\n |
| `ciao_read` | Value | CONNECTOR(dropdown), HOSTNAME(input_value), METHOD(dropdown) | `ciao_read(rest, text("value"), GET)` | Ciao.read( |
| `ciao_write` | Statement | CONNECTOR(dropdown), HOSTNAME(input_value), DATA(input_value), METHOD(dropdown) | `ciao_write(rest, text("value"), math_number(0), GET)` | Ciao.write( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| CONNECTOR | rest, mqtt | ciao_read, ciao_write |
| METHOD | GET, POST | ciao_read, ciao_write |

## ABS Examples

### Basic Usage
```
arduino_setup()
    wifi_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, wifi_connected())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

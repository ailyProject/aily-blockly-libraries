# SparkFun ESP8266 AT WiFi 扩展板

I2C/软件串口接口 WiFi 模块，使用库内置的全局 `esp8266` 对象（无需用户声明变量）。

## Library Info
- **Name**: @aily-project/lib-sparkfun-esp8266at
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp8266at_begin` | Statement | BAUD(field_dropdown), PORT(field_dropdown) | `esp8266at_begin(9600, SW)` | `esp8266.begin(9600, ESP8266_SOFTWARE_SERIAL);` |
| `esp8266at_connect` | Statement | SSID(input_value), PWD(input_value) | `esp8266at_connect(text("MySSID"), text("MyPwd"))` | `esp8266.connect("MySSID", "MyPwd");` |
| `esp8266at_disconnect` | Statement | — | `esp8266at_disconnect()` | `esp8266.disconnect();` |
| `esp8266at_is_connected` | Value(Boolean) | — | `esp8266at_is_connected()` | `esp8266.status() == STATION_GOT_IP` |
| `esp8266at_local_ip` | Value(String) | — | `esp8266at_local_ip()` | `esp8266.localIP().toString()` |
| `esp8266at_tcp_connect` | Statement | LINK_ID(field_number), HOST(input_value), PORT(input_value) | `esp8266at_tcp_connect(0, text("example.com"), math_number(80))` | `esp8266.tcpConnect(0, "example.com", 80);` |
| `esp8266at_tcp_send` | Statement | LINK_ID(field_number), DATA(input_value) | `esp8266at_tcp_send(0, text("Hello"))` | `esp8266.print(0, "Hello");` |
| `esp8266at_close` | Statement | LINK_ID(field_number) | `esp8266at_close(0)` | `esp8266.close(0);` |

## Notes

1. **全局对象**: 库声明了 `extern ESP8266Class esp8266;`，所有块直接使用 `esp8266.xxx()` 无需变量
2. **默认串口引脚**: 软件串口 TX=8, RX=9

## ABS Examples

```
arduino_setup()
    esp8266at_begin(9600, SW)
    esp8266at_connect(text("MySSID"), text("MyPassword"))
arduino_loop()
    if esp8266at_is_connected()
        esp8266at_tcp_connect(0, text("example.com"), math_number(80))
        esp8266at_tcp_send(0, text("GET / HTTP/1.1\r\n\r\n"))
        esp8266at_close(0)
```

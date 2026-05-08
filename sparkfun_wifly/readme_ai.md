# SparkFun WiFly WiFi 扩展板

## Library Info
- **Name**: @aily-project/lib-sparkfun-wifly
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `wifly_init` | Statement | (none) | `wifly_init()` | `SoftwareSerial _wiflySerial(2,3); WiFly.begin(_wiflySerial);` |
| `wifly_join` | Value→Boolean | SSID(value), PASS(value) | `wifly_join("mySSID", "myPass")` | `WiFly.join("mySSID", "myPass")` |
| `wifly_connected` | Value→Boolean | (none) | `wifly_connected()` | `WiFly.isConnected()` |
| `wifly_open` | Value→Boolean | HOST(value), PORT(value) | `wifly_open("example.com", 80)` | `WiFly.open("example.com", 80)` |
| `wifly_print` | Statement | DATA(value) | `wifly_print("GET /\r\n")` | `WiFly.print("GET /\r\n");` |
| `wifly_available` | Value→Boolean | (none) | `wifly_available()` | `WiFly.available()` |

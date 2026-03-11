# NTPClient

NTP时间同步库，用于获取网络时间

## Library Info
- **Name**: @aily-project/lib-ntpclient
- **Version**: 3.2.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ntpclient_create_with_params` | Statement | SERVER(input_value), OFFSET(input_value) | `ntpclient_create_with_params(math_number(0), math_number(0))` | `timeClient.begin();\n` |
| `ntpclient_update` | Statement | (none) | `ntpclient_update()` | `timeClient.update();\n` |
| `ntpclient_force_update` | Statement | (none) | `ntpclient_force_update()` | `timeClient.forceUpdate();\n` |
| `ntpclient_get_formatted_time` | Value | (none) | `ntpclient_get_formatted_time()` | `timeClient.getFormattedTime()` |
| `ntpclient_get_epoch_time` | Value | (none) | `ntpclient_get_epoch_time()` | `timeClient.getEpochTime()` |
| `ntpclient_get_year` | Value | (none) | `ntpclient_get_year()` | `timeClient.getYear()` |
| `ntpclient_get_month` | Value | (none) | `ntpclient_get_month()` | `timeClient.getMonth()` |
| `ntpclient_get_yday` | Value | (none) | `ntpclient_get_yday()` | `timeClient.getYDay()` |
| `ntpclient_get_mday` | Value | (none) | `ntpclient_get_mday()` | `timeClient.getMDay()` |
| `ntpclient_get_hours` | Value | (none) | `ntpclient_get_hours()` | `timeClient.getHours()` |
| `ntpclient_get_minutes` | Value | (none) | `ntpclient_get_minutes()` | `timeClient.getMinutes()` |
| `ntpclient_get_seconds` | Value | (none) | `ntpclient_get_seconds()` | `timeClient.getSeconds()` |
| `ntpclient_get_day` | Value | (none) | `ntpclient_get_day()` | `timeClient.getDay()` |
| `ntpclient_is_time_set` | Value | (none) | `ntpclient_is_time_set()` | `timeClient.isTimeSet()` |
| `ntpclient_set_time_offset` | Statement | OFFSET(input_value) | `ntpclient_set_time_offset(math_number(0))` | `timeClient.setTimeOffset(` |
| `ntpclient_set_update_interval` | Statement | INTERVAL(input_value) | `ntpclient_set_update_interval(math_number(1000))` | `timeClient.setUpdateInterval(` |
| `ntpclient_set_pool_server_name` | Statement | SERVER(input_value) | `ntpclient_set_pool_server_name(math_number(0))` | `timeClient.setPoolServerName(` |
| `ntpclient_end` | Statement | (none) | `ntpclient_end()` | `timeClient.end();\n` |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ntpclient_create_with_params(math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ntpclient_get_formatted_time())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

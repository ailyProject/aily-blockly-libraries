# ESP32 WiFi

ESP32 WiFi库，包含WiFi连接、SmartConfig、热点模式、网络扫描等WiFi基础功能。

## Library Info
- **Name**: @aily-project/lib-esp32-wifi
- **Version**: 1.0.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_wifi_begin` | Statement | SSID(input_value), PASSWORD(input_value) | `esp32_wifi_begin(math_number(0), math_number(0))` | `WiFi.begin(` |
| `esp32_wifi_begin_advanced` | Statement | SSID(input_value), PASSWORD(input_value), CHANNEL(input_value), BSSID(input_value) | `esp32_wifi_begin_advanced(math_number(0), math_number(0), math_number(0), math_number(0))` | `WiFi.begin(` |
| `esp32_wifi_disconnect` | Statement | ERASE_AP(dropdown) | `esp32_wifi_disconnect(FALSE)` | `WiFi.disconnect(` |
| `esp32_wifi_status` | Value | (none) | `esp32_wifi_status()` | `WiFi.status()` |
| `esp32_wifi_status_type` | Value | STATUS(dropdown) | `esp32_wifi_status_type(WL_NO_SHIELD)` | (dynamic code) |
| `esp32_wifi_is_connected` | Value | (none) | `esp32_wifi_is_connected()` | `WiFi.isConnected()` |
| `esp32_wifi_local_ip` | Value | (none) | `esp32_wifi_local_ip()` | `WiFi.localIP().toString()` |
| `esp32_wifi_mac_address` | Value | (none) | `esp32_wifi_mac_address()` | `WiFi.macAddress()` |
| `esp32_wifi_rssi` | Value | (none) | `esp32_wifi_rssi()` | `WiFi.RSSI()` |
| `esp32_wifi_ssid` | Value | (none) | `esp32_wifi_ssid()` | `WiFi.SSID()` |
| `esp32_wifi_scan_networks` | Value | ASYNC(dropdown) | `esp32_wifi_scan_networks(FALSE)` | `WiFi.scanNetworks(` |
| `esp32_wifi_get_ssid` | Value | INDEX(input_value) | `esp32_wifi_get_ssid(math_number(0))` | `WiFi.SSID(` |
| `esp32_wifi_get_rssi` | Value | INDEX(input_value) | `esp32_wifi_get_rssi(math_number(0))` | `WiFi.RSSI(` |
| `esp32_wifi_get_encryption_type` | Value | INDEX(input_value) | `esp32_wifi_get_encryption_type(math_number(0))` | `WiFi.encryptionType(` |
| `esp32_wifi_encryption_type` | Value | TYPE(dropdown) | `esp32_wifi_encryption_type(WIFI_AUTH_OPEN)` | (dynamic code) |
| `esp32_wifi_scan_complete` | Value | (none) | `esp32_wifi_scan_complete()` | `WiFi.scanComplete()` |
| `esp32_wifi_scan_delete` | Statement | (none) | `esp32_wifi_scan_delete()` | `WiFi.scanDelete();\n` |
| `esp32_wifi_softap` | Statement | SSID(input_value), PASSWORD(input_value), CHANNEL(input_value) | `esp32_wifi_softap(math_number(0), math_number(0), math_number(0))` | `` |
| `esp32_wifi_softap_config` | Statement | IP(field_input), GATEWAY(field_input), SUBNET(field_input) | `esp32_wifi_softap_config("192.168.4.1", "192.168.4.1", "255.255.255.0")` | `WiFi.softAPConfig(` |
| `esp32_wifi_softap_disconnect` | Statement | WIFI_OFF(dropdown) | `esp32_wifi_softap_disconnect(FALSE)` | `WiFi.softAPdisconnect(` |
| `esp32_wifi_softap_station_count` | Value | (none) | `esp32_wifi_softap_station_count()` | `WiFi.softAPgetStationNum()` |
| `esp32_wifi_softap_ip` | Value | (none) | `esp32_wifi_softap_ip()` | `WiFi.softAPIP().toString()` |
| `esp32_wifi_set_mode` | Statement | MODE(dropdown) | `esp32_wifi_set_mode(WIFI_STA)` | `WiFi.mode(` |
| `esp32_wifi_get_mode` | Value | (none) | `esp32_wifi_get_mode()` | `WiFi.getMode()` |
| `esp32_wifi_mode` | Value | MODE(dropdown) | `esp32_wifi_mode(WIFI_MODE_STA)` | (dynamic code) |
| `esp32_wifi_set_auto_reconnect` | Statement | AUTO_RECONNECT(dropdown) | `esp32_wifi_set_auto_reconnect(TRUE)` | `WiFi.setAutoReconnect(` |
| `esp32_wifi_wait_for_connect_result` | Value | TIMEOUT(input_value) | `esp32_wifi_wait_for_connect_result(math_number(1000))` | `WiFi.waitForConnectResult(` |
| `esp32_wifi_smartconfig_start` | Statement | (none) | `esp32_wifi_smartconfig_start()` | `WiFi.beginSmartConfig();\n` |
| `esp32_wifi_smartconfig_stop` | Statement | (none) | `esp32_wifi_smartconfig_stop()` | `WiFi.stopSmartConfig();\n` |
| `esp32_wifi_smartconfig_done` | Value | (none) | `esp32_wifi_smartconfig_done()` | `WiFi.smartConfigDone()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ERASE_AP | FALSE, TRUE | 保留配置 / 清除配置 |
| STATUS | WL_NO_SHIELD, WL_STOPPED, WL_IDLE_STATUS, WL_NO_SSID_AVAIL, WL_SCAN_COMPLETED, WL_CONNECTED, WL_CONNECT_FAILED, WL_CONNECTION_LOST, WL_DISCONNECTED | 未连接 / 停止 / 空闲 / 无可用SSID / 扫描完成 / 已连接 / 连接失败 / 连接丢失 / 断开连接 |
| ASYNC | FALSE, TRUE | 同步扫描 / 异步扫描 |
| TYPE | WIFI_AUTH_OPEN, WIFI_AUTH_WEP, WIFI_AUTH_WPA_PSK, WIFI_AUTH_WPA2_PSK, WIFI_AUTH_WPA_WPA2_PSK, WIFI_AUTH_WPA2_ENTERPRISE, WIFI_AUTH_WPA3_PSK, WIFI_AUTH_WPA2_WPA3_PSK | 开放 / WEP / WPA_PSK / WPA2_PSK / WPA_WPA2_PSK / WPA2_ENTERPRISE / WPA3_PSK / WPA2_WPA3_PSK |
| WIFI_OFF | FALSE, TRUE | 保持WiFi开启 / 关闭WiFi |
| MODE | WIFI_STA, WIFI_AP, WIFI_AP_STA, WIFI_MODE_NULL | 仅站点模式 / 仅热点模式 / 混合模式 / 关闭模式 |
| AUTO_RECONNECT | TRUE, FALSE | 启用 / 禁用 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_wifi_begin(math_number(0), math_number(0))
    esp32_wifi_begin_advanced(math_number(0), math_number(0), math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_wifi_status())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

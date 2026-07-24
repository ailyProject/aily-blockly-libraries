# ESP8266 WiFi

WiFi station, access point, scanning and SmartConfig blocks for ESP8266.

## Library Info
- **Name**: @aily-project/lib-esp8266-wifi
- **Version**: 1.0.3
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_wifi_begin` | Statement | SSID(input_value), PASSWORD(input_value) | `esp8266_wifi_begin(SSID, PASSWORD)` | Dynamic code |
| `esp8266_wifi_begin_advanced` | Statement | SSID(input_value), PASSWORD(input_value), CHANNEL(input_value), BSSID(input_value) | `esp8266_wifi_begin_advanced(SSID, PASSWORD, CHANNEL, BSSID)` | Dynamic code |
| `esp8266_wifi_disconnect` | Statement | ERASE_AP(field_dropdown) | `esp8266_wifi_disconnect(ERASE_AP)` | Dynamic code |
| `esp8266_wifi_status` | Value | None | `esp8266_wifi_status()` | Dynamic code |
| `esp8266_wifi_status_type` | Value | STATUS(field_dropdown) | `esp8266_wifi_status_type(STATUS)` | Dynamic code |
| `esp8266_wifi_is_connected` | Value | None | `esp8266_wifi_is_connected()` | Dynamic code |
| `esp8266_wifi_local_ip` | Value | None | `esp8266_wifi_local_ip()` | Dynamic code |
| `esp8266_wifi_mac_address` | Value | None | `esp8266_wifi_mac_address()` | Dynamic code |
| `esp8266_wifi_rssi` | Value | None | `esp8266_wifi_rssi()` | Dynamic code |
| `esp8266_wifi_ssid` | Value | None | `esp8266_wifi_ssid()` | Dynamic code |
| `esp8266_wifi_scan_networks` | Value | ASYNC(field_dropdown) | `esp8266_wifi_scan_networks(ASYNC)` | Dynamic code |
| `esp8266_wifi_get_ssid` | Value | INDEX(input_value) | `esp8266_wifi_get_ssid(INDEX)` | Dynamic code |
| `esp8266_wifi_get_rssi` | Value | INDEX(input_value) | `esp8266_wifi_get_rssi(INDEX)` | Dynamic code |
| `esp8266_wifi_get_encryption_type` | Value | INDEX(input_value) | `esp8266_wifi_get_encryption_type(INDEX)` | Dynamic code |
| `esp8266_wifi_encryption_type` | Value | TYPE(field_dropdown) | `esp8266_wifi_encryption_type(TYPE)` | Dynamic code |
| `esp8266_wifi_scan_complete` | Value | None | `esp8266_wifi_scan_complete()` | Dynamic code |
| `esp8266_wifi_scan_delete` | Statement | None | `esp8266_wifi_scan_delete()` | Dynamic code |
| `esp8266_wifi_softap` | Statement | SSID(input_value), PASSWORD(input_value), CHANNEL(input_value) | `esp8266_wifi_softap(SSID, PASSWORD, CHANNEL)` | Dynamic code |
| `esp8266_wifi_softap_config` | Statement | IP(field_input), GATEWAY(field_input), SUBNET(field_input) | `esp8266_wifi_softap_config(IP, GATEWAY, SUBNET)` | Dynamic code |
| `esp8266_wifi_softap_disconnect` | Statement | WIFI_OFF(field_dropdown) | `esp8266_wifi_softap_disconnect(WIFI_OFF)` | Dynamic code |
| `esp8266_wifi_softap_station_count` | Value | None | `esp8266_wifi_softap_station_count()` | Dynamic code |
| `esp8266_wifi_softap_ip` | Value | None | `esp8266_wifi_softap_ip()` | Dynamic code |
| `esp8266_wifi_set_mode` | Statement | MODE(field_dropdown) | `esp8266_wifi_set_mode(MODE)` | Dynamic code |
| `esp8266_wifi_get_mode` | Value | None | `esp8266_wifi_get_mode()` | Dynamic code |
| `esp8266_wifi_mode` | Value | MODE(field_dropdown) | `esp8266_wifi_mode(MODE)` | Dynamic code |
| `esp8266_wifi_set_auto_reconnect` | Statement | AUTO_RECONNECT(field_dropdown) | `esp8266_wifi_set_auto_reconnect(AUTO_RECONNECT)` | Dynamic code |
| `esp8266_wifi_wait_for_connect_result` | Value | TIMEOUT(input_value) | `esp8266_wifi_wait_for_connect_result(TIMEOUT)` | Dynamic code |
| `esp8266_wifi_reconnect` | Statement | None | `esp8266_wifi_reconnect()` | Dynamic code |
| `esp8266_wifi_smartconfig_start` | Statement | None | `esp8266_wifi_smartconfig_start()` | Dynamic code |
| `esp8266_wifi_smartconfig_stop` | Statement | None | `esp8266_wifi_smartconfig_stop()` | Dynamic code |
| `esp8266_wifi_smartconfig_done` | Value | None | `esp8266_wifi_smartconfig_done()` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_wifi_disconnect.ERASE_AP | FALSE, TRUE | Selects the generated API option. |
| esp8266_wifi_status_type.STATUS | WL_NO_SHIELD, WL_STOPPED, WL_IDLE_STATUS, WL_NO_SSID_AVAIL, WL_SCAN_COMPLETED, WL_CONNECTED, WL_CONNECT_FAILED, WL_CONNECTION_LOST, WL_DISCONNECTED | Selects the generated API option. |
| esp8266_wifi_scan_networks.ASYNC | FALSE, TRUE | Selects the generated API option. |
| esp8266_wifi_encryption_type.TYPE | WIFI_AUTH_OPEN, WIFI_AUTH_WEP, WIFI_AUTH_WPA_PSK, WIFI_AUTH_WPA2_PSK, WIFI_AUTH_WPA_WPA2_PSK, WIFI_AUTH_WPA2_ENTERPRISE, WIFI_AUTH_WPA3_PSK, WIFI_AUTH_WPA2_WPA3_PSK | Selects the generated API option. |
| esp8266_wifi_softap_disconnect.WIFI_OFF | FALSE, TRUE | Selects the generated API option. |
| esp8266_wifi_set_mode.MODE | WIFI_STA, WIFI_AP, WIFI_AP_STA, WIFI_MODE_NULL | Selects the generated API option. |
| esp8266_wifi_mode.MODE | WIFI_MODE_STA, WIFI_MODE_AP, WIFI_MODE_APSTA, WIFI_MODE_NULL | Selects the generated API option. |
| esp8266_wifi_set_auto_reconnect.AUTO_RECONNECT | TRUE, FALSE | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.

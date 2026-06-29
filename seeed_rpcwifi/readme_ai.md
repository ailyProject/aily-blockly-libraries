# Seeed RPC WiFi

Blockly wrapper for Seeed Wio Terminal RPC WiFi, including WiFi connection, scan, AP mode, TCP/UDP, HTTP, WebServer, and DNS.

## Library Info
- **Name**: @aily-project/lib-seeed-rpcwifi
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_rpcwifi_set_mode` | Statement | MODE(dropdown) | `seeed_rpcwifi_set_mode(WIFI_STA)` | WiFi.mode( |
| `seeed_rpcwifi_begin` | Statement | SSID(input_value), PASSWORD(input_value) | `seeed_rpcwifi_begin(text("value"), text("value"))` | WiFi.begin(String( |
| `seeed_rpcwifi_connect_wait` | Statement | SSID(input_value), PASSWORD(input_value), TIMEOUT(input_value) | `seeed_rpcwifi_connect_wait(text("value"), text("value"), math_number(1000))` | seeedRpcWiFiConnectWait(String( |
| `seeed_rpcwifi_disconnect` | Statement | WIFI_OFF(dropdown), ERASE_AP(dropdown) | `seeed_rpcwifi_disconnect(FALSE, FALSE)` | WiFi.disconnect( |
| `seeed_rpcwifi_reconnect` | Value | (none) | `seeed_rpcwifi_reconnect()` | WiFi.reconnect() |
| `seeed_rpcwifi_status` | Value | (none) | `seeed_rpcwifi_status()` | WiFi.status() |
| `seeed_rpcwifi_status_type` | Value | STATUS(dropdown) | `seeed_rpcwifi_status_type(WL_IDLE_STATUS)` | Dynamic code |
| `seeed_rpcwifi_is_connected` | Value | (none) | `seeed_rpcwifi_is_connected()` | WiFi.isConnected() |
| `seeed_rpcwifi_wait_for_connect_result` | Value | (none) | `seeed_rpcwifi_wait_for_connect_result()` | WiFi.waitForConnectResult() |
| `seeed_rpcwifi_local_ip` | Value | (none) | `seeed_rpcwifi_local_ip()` | WiFi.localIP().toString() |
| `seeed_rpcwifi_mac_address` | Value | (none) | `seeed_rpcwifi_mac_address()` | WiFi.macAddress() |
| `seeed_rpcwifi_current_ssid` | Value | (none) | `seeed_rpcwifi_current_ssid()` | WiFi.SSID() |
| `seeed_rpcwifi_rssi` | Value | (none) | `seeed_rpcwifi_rssi()` | WiFi.RSSI() |
| `seeed_rpcwifi_set_auto_reconnect` | Statement | ENABLE(dropdown) | `seeed_rpcwifi_set_auto_reconnect(TRUE)` | WiFi.setAutoReconnect( |
| `seeed_rpcwifi_mode_value` | Value | MODE(dropdown) | `seeed_rpcwifi_mode_value(WIFI_MODE_STA)` | Dynamic code |
| `seeed_rpcwifi_firmware_version` | Value | (none) | `seeed_rpcwifi_firmware_version()` | seeedRpcWiFiFirmwareVersion() |
| `seeed_rpcwifi_scan_networks` | Value | ASYNC(dropdown), SHOW_HIDDEN(dropdown) | `seeed_rpcwifi_scan_networks(FALSE, FALSE)` | WiFi.scanNetworks( |
| `seeed_rpcwifi_scan_complete` | Value | (none) | `seeed_rpcwifi_scan_complete()` | WiFi.scanComplete() |
| `seeed_rpcwifi_scan_delete` | Statement | (none) | `seeed_rpcwifi_scan_delete()` | WiFi.scanDelete();\n |
| `seeed_rpcwifi_scanned_ssid` | Value | INDEX(input_value) | `seeed_rpcwifi_scanned_ssid(math_number(0))` | WiFi.SSID( |
| `seeed_rpcwifi_scanned_rssi` | Value | INDEX(input_value) | `seeed_rpcwifi_scanned_rssi(math_number(0))` | WiFi.RSSI( |
| `seeed_rpcwifi_scanned_encryption` | Value | INDEX(input_value) | `seeed_rpcwifi_scanned_encryption(math_number(0))` | WiFi.encryptionType( |
| `seeed_rpcwifi_scanned_channel` | Value | INDEX(input_value) | `seeed_rpcwifi_scanned_channel(math_number(0))` | WiFi.channel( |
| `seeed_rpcwifi_encryption_type` | Value | TYPE(dropdown) | `seeed_rpcwifi_encryption_type(WIFI_AUTH_OPEN)` | Dynamic code |
| `seeed_rpcwifi_multi_create` | Statement | VAR(field_input) | `seeed_rpcwifi_multi_create("wifiMulti")` | Dynamic code |
| `seeed_rpcwifi_multi_add_ap` | Statement | VAR(field_variable), SSID(input_value), PASSWORD(input_value) | `seeed_rpcwifi_multi_add_ap(variables_get($wifiMulti), text("value"), text("value"))` | Dynamic code |
| `seeed_rpcwifi_multi_run` | Value | VAR(field_variable), TIMEOUT(input_value) | `seeed_rpcwifi_multi_run(variables_get($wifiMulti), math_number(1000))` | Dynamic code |
| `seeed_rpcwifi_softap` | Statement | SSID(input_value), PASSWORD(input_value), CHANNEL(input_value), HIDDEN(dropdown), MAX_CONN(input_value) | `seeed_rpcwifi_softap(text("value"), text("value"), math_number(0), FALSE, math_number(0))` | WiFi.softAP(String( |
| `seeed_rpcwifi_softap_config` | Statement | IP(field_input), GATEWAY(field_input), SUBNET(field_input) | `seeed_rpcwifi_softap_config("192.168.1.1", "192.168.1.1", "255.255.255.0")` | WiFi.softAPConfig( |
| `seeed_rpcwifi_softap_disconnect` | Statement | WIFI_OFF(dropdown) | `seeed_rpcwifi_softap_disconnect(FALSE)` | WiFi.softAPdisconnect( |
| `seeed_rpcwifi_softap_station_count` | Value | (none) | `seeed_rpcwifi_softap_station_count()` | WiFi.softAPgetStationNum() |
| `seeed_rpcwifi_softap_ip` | Value | (none) | `seeed_rpcwifi_softap_ip()` | WiFi.softAPIP().toString() |
| `seeed_rpcwifi_client_create` | Statement | VAR(field_input), SECURE(dropdown) | `seeed_rpcwifi_client_create("client", NORMAL)` | Dynamic code |
| `seeed_rpcwifi_client_connect` | Value | VAR(field_variable), HOST(input_value), PORT(input_value) | `seeed_rpcwifi_client_connect(variables_get($client), text("value"), math_number(0))` | Dynamic code |
| `seeed_rpcwifi_secure_set_ca` | Statement | VAR(field_variable), CA_CERT(input_value) | `seeed_rpcwifi_secure_set_ca(variables_get($secureClient), text("value"))` | Dynamic code |
| `seeed_rpcwifi_client_print` | Statement | VAR(field_variable), DATA(input_value), NEWLINE(dropdown) | `seeed_rpcwifi_client_print(variables_get($client), math_number(0), TRUE)` | Dynamic code |
| `seeed_rpcwifi_client_available` | Value | VAR(field_variable) | `seeed_rpcwifi_client_available(variables_get($client))` | Dynamic code |
| `seeed_rpcwifi_client_read_string` | Value | VAR(field_variable) | `seeed_rpcwifi_client_read_string(variables_get($client))` | Dynamic code |
| `seeed_rpcwifi_client_connected` | Value | VAR(field_variable) | `seeed_rpcwifi_client_connected(variables_get($client))` | Dynamic code |
| `seeed_rpcwifi_client_stop` | Statement | VAR(field_variable) | `seeed_rpcwifi_client_stop(variables_get($client))` | Dynamic code |
| `seeed_rpcwifi_udp_create` | Statement | VAR(field_input) | `seeed_rpcwifi_udp_create("udp")` | Dynamic code |
| `seeed_rpcwifi_udp_begin` | Statement | VAR(field_variable), PORT(input_value) | `seeed_rpcwifi_udp_begin(variables_get($udp), math_number(0))` | Dynamic code |
| `seeed_rpcwifi_udp_send` | Statement | VAR(field_variable), HOST(input_value), PORT(input_value), DATA(input_value) | `seeed_rpcwifi_udp_send(variables_get($udp), text("value"), math_number(0), math_number(0))` | seeedRpcWiFiUdpSend( |
| `seeed_rpcwifi_udp_parse_packet` | Value | VAR(field_variable) | `seeed_rpcwifi_udp_parse_packet(variables_get($udp))` | Dynamic code |
| `seeed_rpcwifi_udp_read_string` | Value | VAR(field_variable) | `seeed_rpcwifi_udp_read_string(variables_get($udp))` | seeedRpcWiFiUdpReadString( |
| `seeed_rpcwifi_http_create` | Statement | VAR(field_input) | `seeed_rpcwifi_http_create("http")` | Dynamic code |
| `seeed_rpcwifi_http_begin` | Statement | VAR(field_variable), URL(input_value) | `seeed_rpcwifi_http_begin(variables_get($http), text("value"))` | Dynamic code |
| `seeed_rpcwifi_http_begin_https` | Statement | VAR(field_variable), URL(input_value), CA_CERT(input_value) | `seeed_rpcwifi_http_begin_https(variables_get($http), text("value"), text("value"))` | Dynamic code |
| `seeed_rpcwifi_http_add_header` | Statement | VAR(field_variable), NAME(input_value), VALUE(input_value) | `seeed_rpcwifi_http_add_header(variables_get($http), text("value"), text("value"))` | Dynamic code |
| `seeed_rpcwifi_http_request` | Value | VAR(field_variable), METHOD(dropdown), DATA(input_value) | `seeed_rpcwifi_http_request(variables_get($http), GET, math_number(0))` | Dynamic code |
| `seeed_rpcwifi_http_get_string` | Value | VAR(field_variable) | `seeed_rpcwifi_http_get_string(variables_get($http))` | String( |
| `seeed_rpcwifi_http_end` | Statement | VAR(field_variable) | `seeed_rpcwifi_http_end(variables_get($http))` | Dynamic code |
| `seeed_rpcwifi_webserver_create` | Statement | VAR(field_input), PORT(field_number) | `seeed_rpcwifi_webserver_create("server", 80)` | Dynamic code |
| `seeed_rpcwifi_webserver_begin` | Statement | VAR(field_variable) | `seeed_rpcwifi_webserver_begin(variables_get($server))` | Dynamic code |
| `seeed_rpcwifi_webserver_on` | Statement | VAR(field_variable), PATH(input_value), METHOD(dropdown), HANDLER(input_statement) | `seeed_rpcwifi_webserver_on(variables_get($server), text("value"), HTTP_GET) @HANDLER: child_block()` | Dynamic code |
| `seeed_rpcwifi_webserver_send` | Statement | VAR(field_variable), CODE(input_value), TYPE(input_value), CONTENT(input_value) | `seeed_rpcwifi_webserver_send(variables_get($server), math_number(0), text("value"), text("value"))` | Dynamic code |
| `seeed_rpcwifi_webserver_handle_client` | Statement | VAR(field_variable) | `seeed_rpcwifi_webserver_handle_client(variables_get($server))` | Dynamic code |
| `seeed_rpcwifi_dns_create` | Statement | VAR(field_input) | `seeed_rpcwifi_dns_create("dns")` | Dynamic code |
| `seeed_rpcwifi_dns_start` | Statement | VAR(field_variable), PORT(input_value), DOMAIN(input_value), IP(input_value) | `seeed_rpcwifi_dns_start(variables_get($dns), math_number(0), text("value"), text("value"))` | Dynamic code |
| `seeed_rpcwifi_dns_start_captive` | Statement | VAR(field_variable) | `seeed_rpcwifi_dns_start_captive(variables_get($dns))` | Dynamic code |
| `seeed_rpcwifi_dns_process` | Statement | VAR(field_variable) | `seeed_rpcwifi_dns_process(variables_get($dns))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | WIFI_STA, WIFI_AP, WIFI_AP_STA, WIFI_OFF | seeed_rpcwifi_set_mode |
| WIFI_OFF | FALSE, TRUE | seeed_rpcwifi_disconnect, seeed_rpcwifi_softap_disconnect |
| ERASE_AP | FALSE, TRUE | seeed_rpcwifi_disconnect |
| STATUS | WL_IDLE_STATUS, WL_NO_SSID_AVAIL, WL_SCAN_COMPLETED, WL_CONNECTED, WL_CONNECT_FAILED, WL_CONNECTION_LOST, WL_DISCONNECTED, WL_NO_SHIELD | seeed_rpcwifi_status_type |
| ENABLE | TRUE, FALSE | seeed_rpcwifi_set_auto_reconnect |
| MODE | WIFI_MODE_STA, WIFI_MODE_AP, WIFI_MODE_APSTA, WIFI_MODE_NULL | seeed_rpcwifi_mode_value |
| ASYNC | FALSE, TRUE | seeed_rpcwifi_scan_networks |
| SHOW_HIDDEN | FALSE, TRUE | seeed_rpcwifi_scan_networks |
| TYPE | WIFI_AUTH_OPEN, WIFI_AUTH_WEP, WIFI_AUTH_WPA_PSK, WIFI_AUTH_WPA2_PSK, WIFI_AUTH_WPA_WPA2_PSK, WIFI_AUTH_WPA2_ENTERPRISE | seeed_rpcwifi_encryption_type |
| HIDDEN | FALSE, TRUE | seeed_rpcwifi_softap |
| SECURE | NORMAL, SECURE | seeed_rpcwifi_client_create |
| NEWLINE | TRUE, FALSE | seeed_rpcwifi_client_print |
| METHOD | GET, POST, PUT, PATCH | seeed_rpcwifi_http_request |
| METHOD | HTTP_GET, HTTP_POST, HTTP_PUT, HTTP_DELETE, HTTP_ANY | seeed_rpcwifi_webserver_on |

## ABS Examples

### Basic Usage
```
arduino_setup()
    seeed_rpcwifi_begin(text("value"), text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, seeed_rpcwifi_reconnect())
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `seeed_rpcwifi_multi_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

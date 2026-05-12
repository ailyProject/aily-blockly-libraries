# Peak WiFi

Raspberry Pi Pico W WiFi library supports WiFi connection, hotspot mode, network scanning, DNS resolution, Ping and other functions.

## Library Info
- **Name**: @aily-project/lib-rp-wifi
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `rp_wifi_begin` | Statement | SSID(input_value), PASSWORD(input_value) | `rp_wifi_begin(text("value"), text("value"))` | WiFi.begin( |
| `rp_wifi_begin_open` | Statement | SSID(input_value) | `rp_wifi_begin_open(text("value"))` | WiFi.begin( |
| `rp_wifi_begin_noblock` | Statement | SSID(input_value), PASSWORD(input_value) | `rp_wifi_begin_noblock(text("value"), text("value"))` | WiFi.beginNoBlock( |
| `rp_wifi_disconnect` | Statement | WIFI_OFF(dropdown) | `rp_wifi_disconnect(FALSE)` | WiFi.disconnect( |
| `rp_wifi_end` | Statement | (none) | `rp_wifi_end()` | WiFi.end();\n |
| `rp_wifi_connected` | Value | (none) | `rp_wifi_connected()` | WiFi.connected() |
| `rp_wifi_status` | Value | (none) | `rp_wifi_status()` | WiFi.status() |
| `rp_wifi_status_type` | Value | STATUS(dropdown) | `rp_wifi_status_type(WL_IDLE_STATUS)` | Dynamic code |
| `rp_wifi_wait_for_connect` | Value | TIMEOUT(input_value) | `rp_wifi_wait_for_connect(math_number(1000))` | WiFi.waitForConnectResult( |
| `rp_wifi_local_ip` | Value | (none) | `rp_wifi_local_ip()` | WiFi.localIP().toString() |
| `rp_wifi_subnet_mask` | Value | (none) | `rp_wifi_subnet_mask()` | WiFi.subnetMask().toString() |
| `rp_wifi_gateway_ip` | Value | (none) | `rp_wifi_gateway_ip()` | WiFi.gatewayIP().toString() |
| `rp_wifi_dns_ip` | Value | (none) | `rp_wifi_dns_ip()` | WiFi.dnsIP().toString() |
| `rp_wifi_mac_address` | Value | (none) | `rp_wifi_mac_address()` | WiFi.macAddress() |
| `rp_wifi_ssid` | Value | (none) | `rp_wifi_ssid()` | WiFi.SSID() |
| `rp_wifi_rssi` | Value | (none) | `rp_wifi_rssi()` | WiFi.RSSI() |
| `rp_wifi_channel` | Value | (none) | `rp_wifi_channel()` | WiFi.channel() |
| `rp_wifi_encryption_type` | Value | (none) | `rp_wifi_encryption_type()` | WiFi.encryptionType() |
| `rp_wifi_set_hostname` | Statement | HOSTNAME(input_value) | `rp_wifi_set_hostname(text("value"))` | WiFi.setHostname( |
| `rp_wifi_get_hostname` | Value | (none) | `rp_wifi_get_hostname()` | WiFi.getHostname() |
| `rp_wifi_config_static` | Statement | LOCAL_IP(field_input), DNS(field_input), GATEWAY(field_input), SUBNET(field_input) | `rp_wifi_config_static("192.168.1.100", "192.168.1.1", "192.168.1.1", "255.255.255.0")` | WiFi.config( |
| `rp_wifi_set_dns` | Statement | DNS1(field_input) | `rp_wifi_set_dns("8.8.8.8")` | WiFi.setDNS( |
| `rp_wifi_set_mode` | Statement | MODE(dropdown) | `rp_wifi_set_mode(WIFI_STA)` | WiFi.mode( |
| `rp_wifi_get_mode` | Value | (none) | `rp_wifi_get_mode()` | WiFi.getMode() |
| `rp_wifi_scan_networks` | Value | ASYNC(dropdown) | `rp_wifi_scan_networks(FALSE)` | WiFi.scanNetworks( |
| `rp_wifi_scan_complete` | Value | (none) | `rp_wifi_scan_complete()` | WiFi.scanComplete() |
| `rp_wifi_scan_delete` | Statement | (none) | `rp_wifi_scan_delete()` | WiFi.scanDelete();\n |
| `rp_wifi_get_ssid` | Value | INDEX(input_value) | `rp_wifi_get_ssid(math_number(0))` | WiFi.SSID( |
| `rp_wifi_get_rssi` | Value | INDEX(input_value) | `rp_wifi_get_rssi(math_number(0))` | WiFi.RSSI( |
| `rp_wifi_get_encryption` | Value | INDEX(input_value) | `rp_wifi_get_encryption(math_number(0))` | WiFi.encryptionType( |
| `rp_wifi_get_channel` | Value | INDEX(input_value) | `rp_wifi_get_channel(math_number(0))` | WiFi.channel( |
| `rp_wifi_encryption_constant` | Value | TYPE(dropdown) | `rp_wifi_encryption_constant(ENC_TYPE_NONE)` | Dynamic code |
| `rp_wifi_begin_ap` | Statement | SSID(input_value), PASSWORD(input_value), CHANNEL(input_value) | `rp_wifi_begin_ap(text("value"), text("value"), math_number(0))` | WiFi.beginAP( |
| `rp_wifi_begin_ap_open` | Statement | SSID(input_value), CHANNEL(input_value) | `rp_wifi_begin_ap_open(text("value"), math_number(0))` | WiFi.beginAP( |
| `rp_wifi_softap_config` | Statement | IP(field_input), GATEWAY(field_input), SUBNET(field_input) | `rp_wifi_softap_config("192.168.4.1", "192.168.4.1", "255.255.255.0")` | WiFi.softAPConfig( |
| `rp_wifi_softap_disconnect` | Statement | WIFI_OFF(dropdown) | `rp_wifi_softap_disconnect(FALSE)` | WiFi.softAPdisconnect( |
| `rp_wifi_softap_ip` | Value | (none) | `rp_wifi_softap_ip()` | WiFi.softAPIP().toString() |
| `rp_wifi_softap_mac` | Value | (none) | `rp_wifi_softap_mac()` | WiFi.softAPmacAddress() |
| `rp_wifi_softap_ssid` | Value | (none) | `rp_wifi_softap_ssid()` | WiFi.softAPSSID() |
| `rp_wifi_softap_station_count` | Value | (none) | `rp_wifi_softap_station_count()` | WiFi.softAPgetStationNum() |
| `rp_wifi_host_by_name` | Value | HOSTNAME(input_value) | `rp_wifi_host_by_name(text("value"))` | resolveHostname( |
| `rp_wifi_ping` | Value | HOST(input_value), TTL(input_value) | `rp_wifi_ping(text("value"), math_number(0))` | WiFi.ping( |
| `rp_wifi_get_time` | Value | (none) | `rp_wifi_get_time()` | WiFi.getTime() |
| `rp_wifi_set_timeout` | Statement | TIMEOUT(input_value) | `rp_wifi_set_timeout(math_number(1000))` | WiFi.setTimeout( |
| `rp_wifi_no_low_power` | Statement | (none) | `rp_wifi_no_low_power()` | WiFi.noLowPowerMode();\n |
| `rp_wifi_firmware_version` | Value | (none) | `rp_wifi_firmware_version()` | WiFi.firmwareVersion() |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| WIFI_OFF | FALSE, TRUE | rp_wifi_disconnect, rp_wifi_softap_disconnect |
| STATUS | WL_IDLE_STATUS, WL_NO_SSID_AVAIL, WL_SCAN_COMPLETED, WL_CONNECTED, WL_CONNECT_FAILED, WL_CONNECTION_LOST, WL_DISCONNECTED | rp_wifi_status_type |
| MODE | WIFI_STA, WIFI_AP, WIFI_AP_STA, WIFI_OFF | rp_wifi_set_mode |
| ASYNC | FALSE, TRUE | rp_wifi_scan_networks |
| TYPE | ENC_TYPE_NONE, ENC_TYPE_TKIP, ENC_TYPE_CCMP, ENC_TYPE_AUTO | rp_wifi_encryption_constant |

## ABS Examples

### Basic Usage
```
arduino_setup()
    rp_wifi_begin(text("value"), text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, rp_wifi_connected())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

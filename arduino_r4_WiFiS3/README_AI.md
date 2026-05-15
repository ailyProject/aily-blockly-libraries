# R4 WiFi

WiFi library for Arduino UNO R4 WiFi, providing WiFi connection, network query and network operation functions

## Library Info
- **Name**: @aily-project/lib-r4-wifis3
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `wifis3_begin` | Statement | SSID(input_value), PASS(input_value) | `wifis3_begin(text("value"), text("value"))` | int wifi_status = WiFi.begin( |
| `wifis3_begin_open` | Statement | SSID(input_value) | `wifis3_begin_open(text("value"))` | int wifi_status = WiFi.begin( |
| `wifis3_begin_ap` | Statement | SSID(input_value), PASS(input_value), CHANNEL(input_value) | `wifis3_begin_ap(text("value"), text("value"), math_number(0))` | WiFi.beginAP( |
| `wifis3_disconnect` | Statement | (none) | `wifis3_disconnect()` | WiFi.disconnect();\n |
| `wifis3_status` | Value | (none) | `wifis3_status()` | WiFi.status() |
| `wifis3_is_connected` | Value | (none) | `wifis3_is_connected()` | (WiFi.status() == WL_CONNECTED) |
| `wifis3_local_ip` | Value | (none) | `wifis3_local_ip()` | ipToString(WiFi.localIP()) |
| `wifis3_mac_address` | Value | (none) | `wifis3_mac_address()` | macToString() |
| `wifis3_gateway_ip` | Value | (none) | `wifis3_gateway_ip()` | ipToString(WiFi.gatewayIP()) |
| `wifis3_subnet_mask` | Value | (none) | `wifis3_subnet_mask()` | ipToString(WiFi.subnetMask()) |
| `wifis3_dns_ip` | Value | DNS_INDEX(dropdown) | `wifis3_dns_ip("0")` | ipToString(WiFi.dnsIP( |
| `wifis3_set_dns` | Statement | DNS1(input_value), DNS2(input_value) | `wifis3_set_dns(text("value"), text("value"))` | WiFi.setDNS( |
| `wifis3_config_ip` | Statement | IP(input_value), GW(input_value), SUBNET(input_value) | `wifis3_config_ip(text("value"), text("value"), text("value"))` | WiFi.config(stringToIP( |
| `wifis3_set_hostname` | Statement | HOSTNAME(input_value) | `wifis3_set_hostname(text("value"))` | WiFi.setHostname( |
| `wifis3_scan_networks` | Statement | (none) | `wifis3_scan_networks()` | WiFi.scanNetworks();\n |
| `wifis3_ssid_by_index` | Value | INDEX(input_value) | `wifis3_ssid_by_index(math_number(0))` | WiFi.SSID( |
| `wifis3_rssi_by_index` | Value | INDEX(input_value) | `wifis3_rssi_by_index(math_number(0))` | WiFi.RSSI( |
| `wifis3_scanned_networks_count` | Value | (none) | `wifis3_scanned_networks_count()` | WiFi.scanNetworks() |
| `wifis3_ping` | Value | HOST(input_value), TTL(input_value), COUNT(input_value) | `wifis3_ping(text("value"), math_number(0), math_number(0))` | WiFi.ping( |
| `wifis3_firmware_version` | Value | (none) | `wifis3_firmware_version()` | WiFi.firmwareVersion() |
| `wifis3_wait_for_connection` | Statement | TIMEOUT(input_value) | `wifis3_wait_for_connection(math_number(1000))` | unsigned long startTime = millis();\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DNS_INDEX | 0, 1 | wifis3_dns_ip |

## ABS Examples

### Basic Usage
```
arduino_setup()
    wifis3_begin(text("value"), text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, wifis3_status())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

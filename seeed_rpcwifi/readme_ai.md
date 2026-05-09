# Seeed RPC WiFi

Blockly ABS reference for Wio Terminal RPC WiFi networking.

## Library Info
- **Name**: @aily-project/lib-seeed-rpcwifi
- **Version**: 1.0.0
- **Includes**: `#include <rpcWiFi.h>`, `#include <HTTPClient.h>`, `#include <WebServer.h>`, `#include <DNSServer.h>`, `#include <RPCmDNS.h>`, `#include <WiFiManager.h>` as needed
- **Global objects**: `WiFi`, `MDNS`

## Block Definitions

### WiFi Core

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_rpcwifi_set_mode` | Statement | MODE(dropdown) | `seeed_rpcwifi_set_mode(WIFI_STA)` | `WiFi.mode(WIFI_STA);` |
| `seeed_rpcwifi_begin` | Statement | SSID(input_value), PASSWORD(input_value) | `seeed_rpcwifi_begin(text("ssid"), text("pass"))` | `WiFi.begin(ssid, pass);` |
| `seeed_rpcwifi_connect_wait` | Statement | SSID(input_value), PASSWORD(input_value), TIMEOUT(input_value) | `seeed_rpcwifi_connect_wait(text("ssid"), text("pass"), math_number(15000))` | Connects and waits until connected or timed out |
| `seeed_rpcwifi_disconnect` | Statement | WIFI_OFF(dropdown), ERASE_AP(dropdown) | `seeed_rpcwifi_disconnect(FALSE, FALSE)` | `WiFi.disconnect(wifiOff, eraseAp);` |
| `seeed_rpcwifi_reconnect` | Value | - | `seeed_rpcwifi_reconnect()` | `WiFi.reconnect()` |
| `seeed_rpcwifi_status` | Value | - | `seeed_rpcwifi_status()` | `WiFi.status()` |
| `seeed_rpcwifi_status_type` | Value | STATUS(dropdown) | `seeed_rpcwifi_status_type(WL_CONNECTED)` | WiFi status constant |
| `seeed_rpcwifi_is_connected` | Value | - | `seeed_rpcwifi_is_connected()` | `WiFi.isConnected()` |
| `seeed_rpcwifi_wait_for_connect_result` | Value | - | `seeed_rpcwifi_wait_for_connect_result()` | `WiFi.waitForConnectResult()` |
| `seeed_rpcwifi_local_ip` | Value | - | `seeed_rpcwifi_local_ip()` | `WiFi.localIP().toString()` |
| `seeed_rpcwifi_mac_address` | Value | - | `seeed_rpcwifi_mac_address()` | `WiFi.macAddress()` |
| `seeed_rpcwifi_current_ssid` | Value | - | `seeed_rpcwifi_current_ssid()` | `WiFi.SSID()` |
| `seeed_rpcwifi_rssi` | Value | - | `seeed_rpcwifi_rssi()` | `WiFi.RSSI()` |
| `seeed_rpcwifi_set_auto_reconnect` | Statement | ENABLE(dropdown) | `seeed_rpcwifi_set_auto_reconnect(TRUE)` | `WiFi.setAutoReconnect(true);` |
| `seeed_rpcwifi_mode_value` | Value | MODE(dropdown) | `seeed_rpcwifi_mode_value(WIFI_MODE_STA)` | WiFi mode constant |
| `seeed_rpcwifi_firmware_version` | Value | - | `seeed_rpcwifi_firmware_version()` | `rpc_system_version()` wrapped as `String` |

### Scan, AP, and Multi-AP

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_rpcwifi_scan_networks` | Value | ASYNC(dropdown), SHOW_HIDDEN(dropdown) | `seeed_rpcwifi_scan_networks(FALSE, FALSE)` | `WiFi.scanNetworks(...)` |
| `seeed_rpcwifi_scan_complete` | Value | - | `seeed_rpcwifi_scan_complete()` | `WiFi.scanComplete()` |
| `seeed_rpcwifi_scan_delete` | Statement | - | `seeed_rpcwifi_scan_delete()` | `WiFi.scanDelete();` |
| `seeed_rpcwifi_scanned_ssid` | Value | INDEX(input_value) | `seeed_rpcwifi_scanned_ssid(math_number(0))` | `WiFi.SSID(index)` |
| `seeed_rpcwifi_scanned_rssi` | Value | INDEX(input_value) | `seeed_rpcwifi_scanned_rssi(math_number(0))` | `WiFi.RSSI(index)` |
| `seeed_rpcwifi_scanned_encryption` | Value | INDEX(input_value) | `seeed_rpcwifi_scanned_encryption(math_number(0))` | `WiFi.encryptionType(index)` |
| `seeed_rpcwifi_scanned_channel` | Value | INDEX(input_value) | `seeed_rpcwifi_scanned_channel(math_number(0))` | `WiFi.channel(index)` |
| `seeed_rpcwifi_encryption_type` | Value | TYPE(dropdown) | `seeed_rpcwifi_encryption_type(WIFI_AUTH_OPEN)` | Encryption constant |
| `seeed_rpcwifi_multi_create` | Statement | VAR(field_input) | `seeed_rpcwifi_multi_create("wifiMulti")` | `WiFiMulti wifiMulti;` |
| `seeed_rpcwifi_multi_add_ap` | Statement | VAR(field_variable), SSID(input_value), PASSWORD(input_value) | `seeed_rpcwifi_multi_add_ap($wifiMulti, text("ssid"), text("pass"))` | `wifiMulti.addAP(ssid, pass);` |
| `seeed_rpcwifi_multi_run` | Value | VAR(field_variable), TIMEOUT(input_value) | `seeed_rpcwifi_multi_run($wifiMulti, math_number(5000))` | `wifiMulti.run(timeout)` |
| `seeed_rpcwifi_softap` | Statement | SSID(input_value), PASSWORD(input_value), CHANNEL(input_value), HIDDEN(dropdown), MAX_CONN(input_value) | `seeed_rpcwifi_softap(text("WioAP"), text("12345678"), math_number(11), FALSE, math_number(4))` | `WiFi.softAP(...)` |
| `seeed_rpcwifi_softap_config` | Statement | IP(field_input), GATEWAY(field_input), SUBNET(field_input) | `seeed_rpcwifi_softap_config("192.168.1.1", "192.168.1.1", "255.255.255.0")` | `WiFi.softAPConfig(...)` |
| `seeed_rpcwifi_softap_disconnect` | Statement | WIFI_OFF(dropdown) | `seeed_rpcwifi_softap_disconnect(FALSE)` | `WiFi.softAPdisconnect(false);` |
| `seeed_rpcwifi_softap_station_count` | Value | - | `seeed_rpcwifi_softap_station_count()` | `WiFi.softAPgetStationNum()` |
| `seeed_rpcwifi_softap_ip` | Value | - | `seeed_rpcwifi_softap_ip()` | `WiFi.softAPIP().toString()` |

### TCP, UDP, HTTP, and WebServer

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_rpcwifi_client_create` | Statement | VAR(field_input), SECURE(dropdown) | `seeed_rpcwifi_client_create("client", NORMAL)` | `WiFiClient client;` or `WiFiClientSecure client;` |
| `seeed_rpcwifi_client_connect` | Value | VAR(field_variable), HOST(input_value), PORT(input_value) | `seeed_rpcwifi_client_connect($client, text("example.com"), math_number(80))` | `client.connect(host, port)` |
| `seeed_rpcwifi_secure_set_ca` | Statement | VAR(field_variable), CA_CERT(input_value) | `seeed_rpcwifi_secure_set_ca($client, text("-----BEGIN..."))` | `client.setCACert(ca);` |
| `seeed_rpcwifi_client_print` | Statement | VAR(field_variable), DATA(input_value), NEWLINE(dropdown) | `seeed_rpcwifi_client_print($client, text("GET / HTTP/1.1"), TRUE)` | `client.println(data);` |
| `seeed_rpcwifi_client_available` | Value | VAR(field_variable) | `seeed_rpcwifi_client_available($client)` | `client.available()` |
| `seeed_rpcwifi_client_read_string` | Value | VAR(field_variable) | `seeed_rpcwifi_client_read_string($client)` | `client.readString()` |
| `seeed_rpcwifi_client_connected` | Value | VAR(field_variable) | `seeed_rpcwifi_client_connected($client)` | `client.connected()` |
| `seeed_rpcwifi_client_stop` | Statement | VAR(field_variable) | `seeed_rpcwifi_client_stop($client)` | `client.stop();` |
| `seeed_rpcwifi_udp_create` | Statement | VAR(field_input) | `seeed_rpcwifi_udp_create("udp")` | `WiFiUDP udp;` |
| `seeed_rpcwifi_udp_begin` | Statement | VAR(field_variable), PORT(input_value) | `seeed_rpcwifi_udp_begin($udp, math_number(2390))` | `udp.begin(port);` |
| `seeed_rpcwifi_udp_send` | Statement | VAR(field_variable), HOST(input_value), PORT(input_value), DATA(input_value) | `seeed_rpcwifi_udp_send($udp, text("192.168.0.255"), math_number(3333), text("hello"))` | begin/write/end packet |
| `seeed_rpcwifi_udp_parse_packet` | Value | VAR(field_variable) | `seeed_rpcwifi_udp_parse_packet($udp)` | `udp.parsePacket()` |
| `seeed_rpcwifi_udp_read_string` | Value | VAR(field_variable) | `seeed_rpcwifi_udp_read_string($udp)` | helper reads available UDP bytes |
| `seeed_rpcwifi_http_create` | Statement | VAR(field_input) | `seeed_rpcwifi_http_create("http")` | `HTTPClient http;` |
| `seeed_rpcwifi_http_begin` | Statement | VAR(field_variable), URL(input_value) | `seeed_rpcwifi_http_begin($http, text("http://example.com"))` | `http.begin(url);` |
| `seeed_rpcwifi_http_begin_https` | Statement | VAR(field_variable), URL(input_value), CA_CERT(input_value) | `seeed_rpcwifi_http_begin_https($http, text("https://example.com"), text("CA"))` | `http.begin(url, ca);` |
| `seeed_rpcwifi_http_add_header` | Statement | VAR(field_variable), NAME(input_value), VALUE(input_value) | `seeed_rpcwifi_http_add_header($http, text("Content-Type"), text("text/plain"))` | `http.addHeader(name, value);` |
| `seeed_rpcwifi_http_request` | Value | VAR(field_variable), METHOD(dropdown), DATA(input_value) | `seeed_rpcwifi_http_request($http, GET, text(""))` | `http.GET()` / `http.POST(data)` etc. |
| `seeed_rpcwifi_http_get_string` | Value | VAR(field_variable) | `seeed_rpcwifi_http_get_string($http)` | `String(http.getString())` |
| `seeed_rpcwifi_http_end` | Statement | VAR(field_variable) | `seeed_rpcwifi_http_end($http)` | `http.end();` |
| `seeed_rpcwifi_webserver_create` | Statement | VAR(field_input), PORT(field_number) | `seeed_rpcwifi_webserver_create("server", 80)` | `WebServer server(80);` |
| `seeed_rpcwifi_webserver_begin` | Statement | VAR(field_variable) | `seeed_rpcwifi_webserver_begin($server)` | `server.begin();` |
| `seeed_rpcwifi_webserver_on` | Statement | VAR(field_variable), PATH(input_value), METHOD(dropdown), HANDLER(input_statement) | `seeed_rpcwifi_webserver_on($server, text("/"), HTTP_GET) @HANDLER: ...` | Registers callback in setup |
| `seeed_rpcwifi_webserver_send` | Statement | VAR(field_variable), CODE(input_value), TYPE(input_value), CONTENT(input_value) | `seeed_rpcwifi_webserver_send($server, math_number(200), text("text/plain"), text("OK"))` | `server.send(...)` |
| `seeed_rpcwifi_webserver_handle_client` | Statement | VAR(field_variable) | `seeed_rpcwifi_webserver_handle_client($server)` | `server.handleClient();` |

### DNS, mDNS, and WiFiManager

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_rpcwifi_dns_create` | Statement | VAR(field_input) | `seeed_rpcwifi_dns_create("dns")` | `DNSServer dns;` |
| `seeed_rpcwifi_dns_start` | Statement | VAR(field_variable), PORT(input_value), DOMAIN(input_value), IP(input_value) | `seeed_rpcwifi_dns_start($dns, math_number(53), text("www.wioterminal.com"), text("192.168.1.1"))` | `dns.start(...)` |
| `seeed_rpcwifi_dns_start_captive` | Statement | VAR(field_variable) | `seeed_rpcwifi_dns_start_captive($dns)` | `dns.start(53, "*", WiFi.softAPIP());` |
| `seeed_rpcwifi_dns_process` | Statement | VAR(field_variable) | `seeed_rpcwifi_dns_process($dns)` | `dns.processNextRequest();` |
| `seeed_rpcwifi_mdns_begin` | Statement | HOSTNAME(input_value) | `seeed_rpcwifi_mdns_begin(text("WioTerminal"))` | `MDNS.begin(hostname)` |
| `seeed_rpcwifi_mdns_add_service` | Statement | SERVICE(input_value), PROTO(dropdown), PORT(input_value) | `seeed_rpcwifi_mdns_add_service(text("http"), tcp, math_number(80))` | `MDNS.addService(...)` |
| `seeed_rpcwifi_mdns_query_host` | Value | HOST(input_value), TIMEOUT(input_value) | `seeed_rpcwifi_mdns_query_host(text("WioTerminal"), math_number(2000))` | `MDNS.queryHost(...).toString()` |
| `seeed_rpcwifi_mdns_query_service` | Value | SERVICE(input_value), PROTO(dropdown) | `seeed_rpcwifi_mdns_query_service(text("http"), tcp)` | `MDNS.queryService(...)` |
| `seeed_rpcwifi_wifimanager_create` | Statement | VAR(field_input) | `seeed_rpcwifi_wifimanager_create("wm")` | `WiFiManager wm;` |
| `seeed_rpcwifi_wifimanager_auto_connect` | Value | VAR(field_variable), AP_NAME(input_value), AP_PASSWORD(input_value) | `seeed_rpcwifi_wifimanager_auto_connect($wm, text("AutoConnectAP"), text(""))` | `wm.autoConnect(...)` |
| `seeed_rpcwifi_wifimanager_start_portal` | Value | VAR(field_variable), AP_NAME(input_value), AP_PASSWORD(input_value) | `seeed_rpcwifi_wifimanager_start_portal($wm, text("ConfigAP"), text(""))` | `wm.startConfigPortal(...)` |
| `seeed_rpcwifi_wifimanager_reset` | Statement | VAR(field_variable) | `seeed_rpcwifi_wifimanager_reset($wm)` | `wm.resetSettings();` |
| `seeed_rpcwifi_wifimanager_set_timeout` | Statement | VAR(field_variable), TYPE(dropdown), SECONDS(input_value) | `seeed_rpcwifi_wifimanager_set_timeout($wm, CONFIG, math_number(120))` | `wm.setConfigPortalTimeout(...)` or `wm.setConnectTimeout(...)` |
| `seeed_rpcwifi_wifimanager_get_info` | Value | VAR(field_variable), INFO(dropdown) | `seeed_rpcwifi_wifimanager_get_info($wm, SSID)` | `wm.getSSID()` etc. |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | `WIFI_STA`, `WIFI_AP`, `WIFI_AP_STA`, `WIFI_OFF` | WiFi operating mode |
| STATUS | `WL_IDLE_STATUS`, `WL_CONNECTED`, `WL_CONNECT_FAILED`, `WL_DISCONNECTED`, etc. | WiFi status constants |
| TYPE | `WIFI_AUTH_OPEN`, `WIFI_AUTH_WPA_PSK`, `WIFI_AUTH_WPA2_PSK`, etc. | Encryption constants |
| METHOD | `GET`, `POST`, `PUT`, `PATCH` / `HTTP_GET`, `HTTP_POST` | HTTP client or server method |
| PROTO | `tcp`, `udp` | mDNS service protocol |
| TYPE (WiFiManager timeout) | `CONFIG`, `CONNECT` | Portal timeout or connection timeout |

## ABS Examples

### Connect and HTTP GET
```
arduino_setup()
    serial_begin(Serial, 115200)
    seeed_rpcwifi_connect_wait(text("yourNetwork"), text("yourPassword"), math_number(15000))
    seeed_rpcwifi_http_create("http")
    seeed_rpcwifi_http_begin($http, text("http://www.example.com/index.html"))
    serial_println(Serial, seeed_rpcwifi_http_request($http, GET, text("")))
    serial_println(Serial, seeed_rpcwifi_http_get_string($http))
    seeed_rpcwifi_http_end($http)
```

### AP + DNS + WebServer
```
arduino_setup()
    seeed_rpcwifi_set_mode(WIFI_AP)
    seeed_rpcwifi_softap(text("WioAP"), text("12345678"), math_number(11), FALSE, math_number(4))
    seeed_rpcwifi_dns_create("dns")
    seeed_rpcwifi_dns_start_captive($dns)
    seeed_rpcwifi_webserver_create("server", 80)
    seeed_rpcwifi_webserver_on($server, text("/"), HTTP_GET)
        @HANDLER:
            seeed_rpcwifi_webserver_send($server, math_number(200), text("text/plain"), text("hello from Wio Terminal"))
    seeed_rpcwifi_webserver_begin($server)

arduino_loop()
    seeed_rpcwifi_dns_process($dns)
    seeed_rpcwifi_webserver_handle_client($server)
```

## Notes

1. Wio Terminal WiFi requires updated RTL8720 eRPC firmware and Seeed SAMD core.
2. Call WiFi connection blocks before HTTP, WebServer client access, mDNS, or cloud operations that need STA connectivity.
3. WebServer route blocks register callbacks into setup; put response blocks inside `@HANDLER`.
4. DNS captive portal mode requires AP mode and `seeed_rpcwifi_dns_process` in loop.
5. WiFiManager auto-connect is blocking while the configuration portal is active.
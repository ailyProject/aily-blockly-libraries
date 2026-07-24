# ESP8266 DNS Server

DNS server and captive portal blocks for ESP8266.

## Library Info
- **Name**: @aily-project/lib-esp8266-dnsserver
- **Version**: 0.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_dnsserver_start` | Statement | PORT(input_value), DOMAIN(input_value), IP(input_value) | `esp8266_dnsserver_start(PORT, DOMAIN, IP)` | Dynamic code |
| `esp8266_dnsserver_start_captive` | Statement | None | `esp8266_dnsserver_start_captive()` | Dynamic code |
| `esp8266_dnsserver_stop` | Statement | None | `esp8266_dnsserver_stop()` | Dynamic code |
| `esp8266_dnsserver_process` | Statement | None | `esp8266_dnsserver_process()` | Dynamic code |
| `esp8266_dnsserver_set_ttl` | Statement | TTL(input_value) | `esp8266_dnsserver_set_ttl(TTL)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| None | None | No dropdown parameters. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.

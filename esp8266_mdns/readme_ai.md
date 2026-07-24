# ESP8266 mDNS

mDNS hostname and service discovery for ESP8266.

## Library Info
- **Name**: @aily-project/lib-esp8266-mdns
- **Version**: 0.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_mdns_begin` | Statement | HOSTNAME(input_value) | `esp8266_mdns_begin(HOSTNAME)` | Dynamic code |
| `esp8266_mdns_end` | Statement | None | `esp8266_mdns_end()` | Dynamic code |
| `esp8266_mdns_add_service` | Statement | SERVICE(input_value), PROTO(field_dropdown), PORT(input_value) | `esp8266_mdns_add_service(SERVICE, PROTO, PORT)` | Dynamic code |
| `esp8266_mdns_add_service_txt` | Statement | SERVICE(input_value), PROTO(field_dropdown), KEY(input_value), VALUE(input_value) | `esp8266_mdns_add_service_txt(SERVICE, PROTO, KEY, VALUE)` | Dynamic code |
| `esp8266_mdns_query_service` | Value | SERVICE(input_value), PROTO(field_dropdown) | `esp8266_mdns_query_service(SERVICE, PROTO)` | Dynamic code |
| `esp8266_mdns_result` | Value | INDEX(input_value), ATTR(field_dropdown) | `esp8266_mdns_result(INDEX, ATTR)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_mdns_add_service.PROTO | tcp, udp | Selects the generated API option. |
| esp8266_mdns_add_service_txt.PROTO | tcp, udp | Selects the generated API option. |
| esp8266_mdns_query_service.PROTO | tcp, udp | Selects the generated API option. |
| esp8266_mdns_result.ATTR | hostname, address, port | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.

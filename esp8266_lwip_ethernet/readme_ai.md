# ESP8266 lwIP Ethernet

Attach ENC28J60, W5100 or W5500 Ethernet to the ESP8266 native lwIP stack.

## Library Info
- **Name**: @aily-project/lib-esp8266-lwip-ethernet
- **Version**: 0.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_lwip_ethernet_create` | Statement | VAR(field_input), DRIVER(field_dropdown), CS(field_dropdown) | `esp8266_lwip_ethernet_create(VAR, DRIVER, CS)` | Dynamic code |
| `esp8266_lwip_ethernet_begin_dhcp` | Value | VAR(field_variable) | `esp8266_lwip_ethernet_begin_dhcp(VAR)` | Dynamic code |
| `esp8266_lwip_ethernet_begin_static` | Value | VAR(field_variable), IP(input_value), GATEWAY(input_value), MASK(input_value), DNS(input_value) | `esp8266_lwip_ethernet_begin_static(VAR, IP, GATEWAY, MASK, DNS)` | Dynamic code |
| `esp8266_lwip_ethernet_connected` | Value | VAR(field_variable) | `esp8266_lwip_ethernet_connected(VAR)` | Dynamic code |
| `esp8266_lwip_ethernet_local_ip` | Value | VAR(field_variable) | `esp8266_lwip_ethernet_local_ip(VAR)` | Dynamic code |
| `esp8266_lwip_ethernet_linked` | Value | VAR(field_variable) | `esp8266_lwip_ethernet_linked(VAR)` | Dynamic code |
| `esp8266_lwip_ethernet_link_detectable` | Value | VAR(field_variable) | `esp8266_lwip_ethernet_link_detectable(VAR)` | Dynamic code |
| `esp8266_lwip_ethernet_set_default` | Statement | VAR(field_variable), ENABLE(field_dropdown) | `esp8266_lwip_ethernet_set_default(VAR, ENABLE)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_lwip_ethernet_create.DRIVER | Wiznet5500lwIP, Wiznet5100lwIP, ENC28J60lwIP | Selects the generated API option. |
| esp8266_lwip_ethernet_create.CS | board-provided options | Selects the generated API option. |
| esp8266_lwip_ethernet_set_default.ENABLE | true, false | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.

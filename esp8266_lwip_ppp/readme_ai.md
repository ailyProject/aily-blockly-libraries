# ESP8266 lwIP PPP Server

Run an lwIP PPP server over a serial stream on ESP8266.

## Library Info
- **Name**: @aily-project/lib-esp8266-lwip-ppp
- **Version**: 0.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_lwip_ppp_create` | Statement | VAR(field_input), SERIAL(field_dropdown) | `esp8266_lwip_ppp_create(VAR, SERIAL)` | Dynamic code |
| `esp8266_lwip_ppp_begin` | Value | VAR(field_variable), LOCAL(input_value), PEER(input_value) | `esp8266_lwip_ppp_begin(VAR, LOCAL, PEER)` | Dynamic code |
| `esp8266_lwip_ppp_stop` | Statement | VAR(field_variable) | `esp8266_lwip_ppp_stop(VAR)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_lwip_ppp_create.SERIAL | board-provided options | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.

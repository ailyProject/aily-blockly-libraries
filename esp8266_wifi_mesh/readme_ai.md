# ESP8266 WiFi Mesh

Create an ESP-NOW flooding mesh with the ESP8266 WiFiMesh library.

## Library Info
- **Name**: @aily-project/lib-esp8266-wifi-mesh
- **Version**: 0.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_wifi_mesh_begin` | Hat | VAR(field_input), PASSWORD(input_value), PREFIX(input_value), NODE_ID(input_value), VERBOSE(field_dropdown) | `esp8266_wifi_mesh_begin(VAR, PASSWORD, PREFIX, NODE_ID, VERBOSE)` | Dynamic code |
| `esp8266_wifi_mesh_broadcast` | Statement | VAR(field_variable), MESSAGE(input_value) | `esp8266_wifi_mesh_broadcast(VAR, MESSAGE)` | Dynamic code |
| `esp8266_wifi_mesh_encrypted_broadcast` | Statement | VAR(field_variable), MESSAGE(input_value) | `esp8266_wifi_mesh_encrypted_broadcast(VAR, MESSAGE)` | Dynamic code |
| `esp8266_wifi_mesh_maintenance` | Statement | None | `esp8266_wifi_mesh_maintenance()` | Dynamic code |
| `esp8266_wifi_mesh_deactivate_ap` | Statement | None | `esp8266_wifi_mesh_deactivate_ap()` | Dynamic code |
| `esp8266_wifi_mesh_message` | Value | None | `esp8266_wifi_mesh_message()` | Dynamic code |
| `esp8266_wifi_mesh_origin_mac` | Value | VAR(field_variable) | `esp8266_wifi_mesh_origin_mac(VAR)` | Dynamic code |
| `esp8266_wifi_mesh_max_plain` | Value | VAR(field_variable) | `esp8266_wifi_mesh_max_plain(VAR)` | Dynamic code |
| `esp8266_wifi_mesh_max_encrypted` | Value | VAR(field_variable) | `esp8266_wifi_mesh_max_encrypted(VAR)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_wifi_mesh_begin.VERBOSE | false, true | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.

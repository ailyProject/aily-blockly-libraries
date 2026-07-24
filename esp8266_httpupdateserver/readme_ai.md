# ESP8266 HTTP Update Server

Browser-based firmware update server for ESP8266.

## Library Info
- **Name**: @aily-project/lib-esp8266-httpupdateserver
- **Version**: 0.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_httpupdateserver_setup` | Statement | VAR(field_variable) | `esp8266_httpupdateserver_setup(VAR)` | Dynamic code |
| `esp8266_httpupdateserver_setup_path` | Statement | VAR(field_variable), PATH(input_value) | `esp8266_httpupdateserver_setup_path(VAR, PATH)` | Dynamic code |
| `esp8266_httpupdateserver_setup_auth` | Statement | VAR(field_variable), USERNAME(input_value), PASSWORD(input_value) | `esp8266_httpupdateserver_setup_auth(VAR, USERNAME, PASSWORD)` | Dynamic code |
| `esp8266_httpupdateserver_setup_full` | Statement | VAR(field_variable), PATH(input_value), USERNAME(input_value), PASSWORD(input_value) | `esp8266_httpupdateserver_setup_full(VAR, PATH, USERNAME, PASSWORD)` | Dynamic code |
| `esp8266_httpupdateserver_update_credentials` | Statement | USERNAME(input_value), PASSWORD(input_value) | `esp8266_httpupdateserver_update_credentials(USERNAME, PASSWORD)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| None | None | No dropdown parameters. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.

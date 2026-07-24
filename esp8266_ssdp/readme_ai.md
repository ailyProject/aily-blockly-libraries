# ESP8266 SSDP

Configure and publish a UPnP/SSDP device description.

## Library Info
- **Name**: @aily-project/lib-esp8266-ssdp
- **Version**: 0.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_ssdp_set_text` | Statement | FIELD(field_dropdown), VALUE(input_value) | `esp8266_ssdp_set_text(FIELD, VALUE)` | Dynamic code |
| `esp8266_ssdp_set_http_port` | Statement | PORT(input_value) | `esp8266_ssdp_set_http_port(PORT)` | Dynamic code |
| `esp8266_ssdp_set_ttl` | Statement | TTL(input_value) | `esp8266_ssdp_set_ttl(TTL)` | Dynamic code |
| `esp8266_ssdp_set_interval` | Statement | SECONDS(input_value) | `esp8266_ssdp_set_interval(SECONDS)` | Dynamic code |
| `esp8266_ssdp_begin` | Value | None | `esp8266_ssdp_begin()` | Dynamic code |
| `esp8266_ssdp_end` | Statement | None | `esp8266_ssdp_end()` | Dynamic code |
| `esp8266_ssdp_schema` | Statement | SERVER(field_variable) | `esp8266_ssdp_schema(SERVER)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_ssdp_set_text.FIELD | setDeviceType, setUUID, setName, setURL, setSchemaURL, setSerialNumber, setModelName, setModelNumber, setModelURL, setManufacturer, setManufacturerURL | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.

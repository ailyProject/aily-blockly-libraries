# ESP8266 SPI Slave

Exchange 32-byte data and 32-bit status through the ESP8266 HSPI slave.

## Library Info
- **Name**: @aily-project/lib-esp8266-spislave
- **Version**: 0.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_spislave_begin` | Statement | LENGTH(field_dropdown) | `esp8266_spislave_begin(LENGTH)` | Dynamic code |
| `esp8266_spislave_end` | Statement | None | `esp8266_spislave_end()` | Dynamic code |
| `esp8266_spislave_set_data` | Statement | DATA(input_value) | `esp8266_spislave_set_data(DATA)` | Dynamic code |
| `esp8266_spislave_set_status` | Statement | STATUS(input_value) | `esp8266_spislave_set_status(STATUS)` | Dynamic code |
| `esp8266_spislave_on_data` | Hat | None | `esp8266_spislave_on_data()` | Dynamic code |
| `esp8266_spislave_on_status` | Hat | None | `esp8266_spislave_on_status()` | Dynamic code |
| `esp8266_spislave_on_data_sent` | Hat | None | `esp8266_spislave_on_data_sent()` | Dynamic code |
| `esp8266_spislave_on_status_sent` | Hat | None | `esp8266_spislave_on_status_sent()` | Dynamic code |
| `esp8266_spislave_received_text` | Value | None | `esp8266_spislave_received_text()` | Dynamic code |
| `esp8266_spislave_received_length` | Value | None | `esp8266_spislave_received_length()` | Dynamic code |
| `esp8266_spislave_received_status` | Value | None | `esp8266_spislave_received_status()` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_spislave_begin.LENGTH | 4, 2, 1 | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.

# ESP8266 I2S

ESP8266-specific I2S audio input and output.

## Library Info
- **Name**: @aily-project/lib-esp8266-i2s
- **Version**: 0.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_i2s_begin` | Value | RATE(input_value), BITS(field_dropdown) | `esp8266_i2s_begin(RATE, BITS)` | Dynamic code |
| `esp8266_i2s_end` | Statement | None | `esp8266_i2s_end()` | Dynamic code |
| `esp8266_i2s_available` | Value | None | `esp8266_i2s_available()` | Dynamic code |
| `esp8266_i2s_available_for_write` | Value | None | `esp8266_i2s_available_for_write()` | Dynamic code |
| `esp8266_i2s_read` | Value | None | `esp8266_i2s_read()` | Dynamic code |
| `esp8266_i2s_peek` | Value | None | `esp8266_i2s_peek()` | Dynamic code |
| `esp8266_i2s_write` | Statement | SAMPLE(input_value) | `esp8266_i2s_write(SAMPLE)` | Dynamic code |
| `esp8266_i2s_flush` | Statement | None | `esp8266_i2s_flush()` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_i2s_begin.BITS | 16, 24 | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.

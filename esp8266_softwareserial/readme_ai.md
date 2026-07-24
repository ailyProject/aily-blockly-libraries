# ESP8266 SoftwareSerial

Software serial communication blocks for ESP8266.

## Library Info
- **Name**: @aily-project/lib-esp8266-softwareserial
- **Version**: 1.0.0
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_softwareserial_init` | Statement | VAR(field_input), RX_PIN(field_dropdown), TX_PIN(field_dropdown), BAUD(field_dropdown) | `esp8266_softwareserial_init(VAR, RX_PIN, TX_PIN, BAUD)` | Dynamic code |
| `esp8266_softwareserial_available` | Value | VAR(field_variable) | `esp8266_softwareserial_available(VAR)` | Dynamic code |
| `esp8266_softwareserial_read` | Value | VAR(field_variable), TYPE(field_dropdown) | `esp8266_softwareserial_read(VAR, TYPE)` | Dynamic code |
| `esp8266_softwareserial_print` | Statement | VAR(field_variable), DATA(input_value) | `esp8266_softwareserial_print(VAR, DATA)` | Dynamic code |
| `esp8266_softwareserial_println` | Statement | VAR(field_variable), DATA(input_value) | `esp8266_softwareserial_println(VAR, DATA)` | Dynamic code |
| `esp8266_softwareserial_write` | Statement | VAR(field_variable), DATA(input_value) | `esp8266_softwareserial_write(VAR, DATA)` | Dynamic code |
| `esp8266_softwareserial_listen` | Statement | VAR(field_variable) | `esp8266_softwareserial_listen(VAR)` | Dynamic code |
| `esp8266_softwareserial_islistening` | Value | VAR(field_variable) | `esp8266_softwareserial_islistening(VAR)` | Dynamic code |
| `esp8266_softwareserial_overflow` | Value | VAR(field_variable) | `esp8266_softwareserial_overflow(VAR)` | Dynamic code |
| `esp8266_softwareserial_end` | Statement | VAR(field_variable) | `esp8266_softwareserial_end(VAR)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_softwareserial_init.RX_PIN | board-provided options | Selects the generated API option. |
| esp8266_softwareserial_init.TX_PIN | board-provided options | Selects the generated API option. |
| esp8266_softwareserial_init.BAUD | 300, 1200, 2400, 4800, 9600, 14400, 19200, 28800, 38400, 57600, 115200 | Selects the generated API option. |
| esp8266_softwareserial_read.TYPE | read(), peek(), parseInt(), parseFloat(), readString() | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.

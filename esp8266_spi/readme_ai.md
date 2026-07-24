# ESP8266 SPI

ESP8266-specific SPI master configuration, transactions and transfers.

## Library Info
- **Name**: @aily-project/lib-esp8266-spi
- **Version**: 0.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_spi_begin` | Statement | None | `esp8266_spi_begin()` | Dynamic code |
| `esp8266_spi_end` | Statement | None | `esp8266_spi_end()` | Dynamic code |
| `esp8266_spi_pins` | Value | SCK(field_dropdown), MISO(field_dropdown), MOSI(field_dropdown), SS(field_dropdown) | `esp8266_spi_pins(SCK, MISO, MOSI, SS)` | Dynamic code |
| `esp8266_spi_hw_cs` | Statement | ENABLE(field_dropdown) | `esp8266_spi_hw_cs(ENABLE)` | Dynamic code |
| `esp8266_spi_begin_transaction` | Statement | FREQ(input_value), ORDER(field_dropdown), MODE(field_dropdown) | `esp8266_spi_begin_transaction(FREQ, ORDER, MODE)` | Dynamic code |
| `esp8266_spi_end_transaction` | Statement | None | `esp8266_spi_end_transaction()` | Dynamic code |
| `esp8266_spi_transfer8` | Value | DATA(input_value) | `esp8266_spi_transfer8(DATA)` | Dynamic code |
| `esp8266_spi_transfer16` | Value | DATA(input_value) | `esp8266_spi_transfer16(DATA)` | Dynamic code |
| `esp8266_spi_write8` | Statement | DATA(input_value) | `esp8266_spi_write8(DATA)` | Dynamic code |
| `esp8266_spi_write16` | Statement | DATA(input_value) | `esp8266_spi_write16(DATA)` | Dynamic code |
| `esp8266_spi_write32` | Statement | DATA(input_value) | `esp8266_spi_write32(DATA)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_spi_pins.SCK | board-provided options | Selects the generated API option. |
| esp8266_spi_pins.MISO | board-provided options | Selects the generated API option. |
| esp8266_spi_pins.MOSI | board-provided options | Selects the generated API option. |
| esp8266_spi_pins.SS | board-provided options | Selects the generated API option. |
| esp8266_spi_hw_cs.ENABLE | true, false | Selects the generated API option. |
| esp8266_spi_begin_transaction.ORDER | MSBFIRST, LSBFIRST | Selects the generated API option. |
| esp8266_spi_begin_transaction.MODE | SPI_MODE0, SPI_MODE1, SPI_MODE2, SPI_MODE3 | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.

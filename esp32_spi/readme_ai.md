# ESP32 SPI

ESP32 SPI communication support library, suitable for ESP32 series development boards

## Library Info
- **Name**: @aily-project/lib-esp32-spi
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_spi_create` | Statement | VAR(field_input), BUS(dropdown) | `esp32_spi_create("SPI", VSPI)` | Dynamic code |
| `esp32_spi_begin` | Statement | VAR(field_input), BUS(dropdown) | `esp32_spi_begin("SPI", HSPI)` | Dynamic code |
| `esp32_spi_begin_custom` | Statement | VAR(field_input), BUS(dropdown), SCK(input_value), MISO(input_value), MOSI(input_value), SS(input_value) | `esp32_spi_begin_custom("SPI", HSPI, math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `esp32_spi_settings` | Statement | SPI(dropdown), FREQUENCY(input_value), BIT_ORDER(dropdown), MODE(dropdown) | `esp32_spi_settings(SPI, math_number(0), MSBFIRST, "0")` | Dynamic code |
| `esp32_spi_begin_transaction` | Statement | SPI(dropdown), FREQUENCY(input_value), BIT_ORDER(dropdown), MODE(dropdown) | `esp32_spi_begin_transaction(SPI, math_number(0), MSBFIRST, "0")` | Dynamic code |
| `esp32_spi_end_transaction` | Statement | SPI(dropdown) | `esp32_spi_end_transaction(SPI)` | Dynamic code |
| `esp32_spi_transfer` | Value | SPI(dropdown), DATA(input_value) | `esp32_spi_transfer(SPI, math_number(0))` | Dynamic code |
| `esp32_spi_transfer16` | Value | SPI(dropdown), DATA(input_value) | `esp32_spi_transfer16(SPI, math_number(0))` | Dynamic code |
| `esp32_spi_write` | Statement | SPI(dropdown), DATA(input_value) | `esp32_spi_write(SPI, math_number(0))` | Dynamic code |
| `esp32_spi_write_bytes` | Statement | SPI(dropdown), DATA(input_value), LENGTH(input_value) | `esp32_spi_write_bytes(SPI, math_number(0), math_number(0))` | Dynamic code |
| `esp32_spi_set_frequency` | Statement | SPI(dropdown), FREQUENCY(input_value) | `esp32_spi_set_frequency(SPI, math_number(0))` | Dynamic code |
| `esp32_spi_set_bit_order` | Statement | SPI(dropdown), BIT_ORDER(dropdown) | `esp32_spi_set_bit_order(SPI, MSBFIRST)` | Dynamic code |
| `esp32_spi_set_data_mode` | Statement | SPI(dropdown), MODE(dropdown) | `esp32_spi_set_data_mode(SPI, "0")` | Dynamic code |
| `esp32_spi_get_ss_pin` | Value | SPI(dropdown) | `esp32_spi_get_ss_pin(SPI)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BUS | VSPI, HSPI | esp32_spi_create |
| BUS | HSPI, VSPI | esp32_spi_begin, esp32_spi_begin_custom |
| BIT_ORDER | MSBFIRST, LSBFIRST | esp32_spi_settings, esp32_spi_begin_transaction, esp32_spi_set_bit_order |
| MODE | 0, 1, 2, 3 | esp32_spi_settings, esp32_spi_begin_transaction, esp32_spi_set_data_mode |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_spi_create("SPI", VSPI)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_spi_transfer(SPI, math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `esp32_spi_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Dynamic fields**: `esp32_spi_create`, `esp32_spi_begin`, `esp32_spi_begin_custom`, `esp32_spi_settings`, `esp32_spi_begin_transaction`, `esp32_spi_end_transaction`, `esp32_spi_transfer`, `esp32_spi_transfer16`, `esp32_spi_write`, `esp32_spi_write_bytes`, `esp32_spi_set_frequency`, `esp32_spi_set_bit_order`, `esp32_spi_set_data_mode`, `esp32_spi_get_ss_pin` may add fields at runtime through Blockly extensions.

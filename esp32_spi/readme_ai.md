# ESP32 SPI

ESP32 SPI通信支持库，适用于ESP32系列开发板

## Library Info
- **Name**: @aily-project/lib-esp32-spi
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_spi_create` | Statement | VAR(field_input), BUS(dropdown) | `esp32_spi_create("SPI", VSPI)` | `` |
| `esp32_spi_begin` | Statement | VAR(field_input), BUS(dropdown) | `esp32_spi_begin("SPI", HSPI)` | `` |
| `esp32_spi_begin_custom` | Statement | VAR(field_input), BUS(dropdown), SCK(input_value), MISO(input_value), MOSI(input_value), SS(input_value) | `esp32_spi_begin_custom("SPI", HSPI, math_number(0), math_number(0), math_number(0), math_number(0))` | `` |
| `esp32_spi_settings` | Statement | SPI(dropdown), FREQUENCY(input_value), BIT_ORDER(dropdown), MODE(dropdown) | `esp32_spi_settings(SPI, math_number(0), MSBFIRST, 0)` | (dynamic code) |
| `esp32_spi_begin_transaction` | Statement | SPI(dropdown), FREQUENCY(input_value), BIT_ORDER(dropdown), MODE(dropdown) | `esp32_spi_begin_transaction(SPI, math_number(0), MSBFIRST, 0)` | (dynamic code) |
| `esp32_spi_end_transaction` | Statement | SPI(dropdown) | `esp32_spi_end_transaction(SPI)` | (dynamic code) |
| `esp32_spi_transfer` | Value | SPI(dropdown), DATA(input_value) | `esp32_spi_transfer(SPI, math_number(0))` | (dynamic code) |
| `esp32_spi_transfer16` | Value | SPI(dropdown), DATA(input_value) | `esp32_spi_transfer16(SPI, math_number(0))` | (dynamic code) |
| `esp32_spi_write` | Statement | SPI(dropdown), DATA(input_value) | `esp32_spi_write(SPI, math_number(0))` | (dynamic code) |
| `esp32_spi_write_bytes` | Statement | SPI(dropdown), DATA(input_value), LENGTH(input_value) | `esp32_spi_write_bytes(SPI, math_number(0), math_number(0))` | (dynamic code) |
| `esp32_spi_set_frequency` | Statement | SPI(dropdown), FREQUENCY(input_value) | `esp32_spi_set_frequency(SPI, math_number(0))` | (dynamic code) |
| `esp32_spi_set_bit_order` | Statement | SPI(dropdown), BIT_ORDER(dropdown) | `esp32_spi_set_bit_order(SPI, MSBFIRST)` | (dynamic code) |
| `esp32_spi_set_data_mode` | Statement | SPI(dropdown), MODE(dropdown) | `esp32_spi_set_data_mode(SPI, 0)` | (dynamic code) |
| `esp32_spi_get_ss_pin` | Value | SPI(dropdown) | `esp32_spi_get_ss_pin(SPI)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BUS | VSPI, HSPI | VSPI / HSPI |
| BIT_ORDER | MSBFIRST, LSBFIRST | MSB优先 / LSB优先 |
| MODE | 0, 1, 2, 3 | MODE0 / MODE1 / MODE2 / MODE3 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_spi_create("SPI", VSPI)
    esp32_spi_begin("SPI", HSPI)
    esp32_spi_begin_custom("SPI", HSPI, math_number(0), math_number(0), math_number(0), math_number(0))
    esp32_spi_begin_transaction(SPI, math_number(0), MSBFIRST, 0)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_spi_transfer(SPI, math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `esp32_spi_create("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

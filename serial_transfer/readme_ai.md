# SerialTransfer

Reliable data transmission based on the SerialTransfer library, supporting three communication methods: UART/I2C/SPI, CRC checksum data packaging

## Library Info
- **Name**: @aily-project/lib-serial-transfer
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `serial_transfer_init` | Statement | VAR(field_input), SERIAL(dropdown), BAUD(input_value) | `serial_transfer_init("myTransfer", Serial, math_number(9600))` | Dynamic code |
| `serial_transfer_send_int` | Statement | VAR(field_variable), VALUE(input_value), PACKET_ID(input_value) | `serial_transfer_send_int(variables_get($myTransfer), math_number(0), math_number(0))` | Dynamic code |
| `serial_transfer_send_float` | Statement | VAR(field_variable), VALUE(input_value), PACKET_ID(input_value) | `serial_transfer_send_float(variables_get($myTransfer), math_number(0), math_number(0))` | Dynamic code |
| `serial_transfer_send_string` | Statement | VAR(field_variable), VALUE(input_value), PACKET_ID(input_value) | `serial_transfer_send_string(variables_get($myTransfer), text("value"), math_number(0))` | Dynamic code |
| `serial_transfer_available` | Value | VAR(field_variable) | `serial_transfer_available(variables_get($myTransfer))` | Dynamic code |
| `serial_transfer_receive_int` | Value | VAR(field_variable) | `serial_transfer_receive_int(variables_get($myTransfer))` | Dynamic code |
| `serial_transfer_receive_float` | Value | VAR(field_variable) | `serial_transfer_receive_float(variables_get($myTransfer))` | Dynamic code |
| `serial_transfer_receive_string` | Value | VAR(field_variable), LENGTH(input_value) | `serial_transfer_receive_string(variables_get($myTransfer), math_number(0))` | Dynamic code |
| `serial_transfer_status` | Value | VAR(field_variable) | `serial_transfer_status(variables_get($myTransfer))` | Dynamic code |
| `serial_transfer_current_packet_id` | Value | VAR(field_variable) | `serial_transfer_current_packet_id(variables_get($myTransfer))` | Dynamic code |
| `i2c_transfer_init_master` | Statement | VAR(field_input), WIRE(dropdown) | `i2c_transfer_init_master("i2cTransfer", Wire)` | Dynamic code |
| `i2c_transfer_init_slave` | Statement | VAR(field_input), WIRE(dropdown), ADDRESS(input_value) | `i2c_transfer_init_slave("i2cTransfer", Wire, math_number(0))` | Dynamic code |
| `i2c_transfer_send_int` | Statement | VAR(field_variable), VALUE(input_value), ADDRESS(input_value), PACKET_ID(input_value) | `i2c_transfer_send_int(variables_get($i2cTransfer), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `i2c_transfer_send_float` | Statement | VAR(field_variable), VALUE(input_value), ADDRESS(input_value), PACKET_ID(input_value) | `i2c_transfer_send_float(variables_get($i2cTransfer), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `i2c_transfer_send_string` | Statement | VAR(field_variable), VALUE(input_value), ADDRESS(input_value), PACKET_ID(input_value) | `i2c_transfer_send_string(variables_get($i2cTransfer), text("value"), math_number(0), math_number(0))` | Dynamic code |
| `i2c_transfer_receive_int` | Value | VAR(field_variable) | `i2c_transfer_receive_int(variables_get($i2cTransfer))` | Dynamic code |
| `i2c_transfer_receive_float` | Value | VAR(field_variable) | `i2c_transfer_receive_float(variables_get($i2cTransfer))` | Dynamic code |
| `i2c_transfer_receive_string` | Value | VAR(field_variable), LENGTH(input_value) | `i2c_transfer_receive_string(variables_get($i2cTransfer), math_number(0))` | Dynamic code |
| `i2c_transfer_status` | Value | VAR(field_variable) | `i2c_transfer_status(variables_get($i2cTransfer))` | Dynamic code |
| `spi_transfer_init_master` | Statement | VAR(field_input), SS_PIN(input_value) | `spi_transfer_init_master("spiTransfer", math_number(2))` | Dynamic code |
| `spi_transfer_init_slave` | Statement | VAR(field_input) | `spi_transfer_init_slave("spiTransfer")` | Dynamic code |
| `spi_transfer_send_int` | Statement | VAR(field_variable), VALUE(input_value), PACKET_ID(input_value) | `spi_transfer_send_int(variables_get($spiTransfer), math_number(0), math_number(0))` | Dynamic code |
| `spi_transfer_send_float` | Statement | VAR(field_variable), VALUE(input_value), PACKET_ID(input_value) | `spi_transfer_send_float(variables_get($spiTransfer), math_number(0), math_number(0))` | Dynamic code |
| `spi_transfer_send_string` | Statement | VAR(field_variable), VALUE(input_value), PACKET_ID(input_value) | `spi_transfer_send_string(variables_get($spiTransfer), text("value"), math_number(0))` | Dynamic code |
| `spi_transfer_available` | Value | VAR(field_variable) | `spi_transfer_available(variables_get($spiTransfer))` | _spi_newPacket_ |
| `spi_transfer_receive_int` | Value | VAR(field_variable) | `spi_transfer_receive_int(variables_get($spiTransfer))` | Dynamic code |
| `spi_transfer_receive_float` | Value | VAR(field_variable) | `spi_transfer_receive_float(variables_get($spiTransfer))` | Dynamic code |
| `spi_transfer_receive_string` | Value | VAR(field_variable), LENGTH(input_value) | `spi_transfer_receive_string(variables_get($spiTransfer), math_number(0))` | Dynamic code |
| `spi_transfer_status` | Value | VAR(field_variable) | `spi_transfer_status(variables_get($spiTransfer))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SERIAL | Serial, Serial1, Serial2, Serial3 | serial_transfer_init |
| WIRE | Wire, Wire1 | i2c_transfer_init_master, i2c_transfer_init_slave |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_transfer_init("myTransfer", Serial, math_number(9600))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, serial_transfer_available(variables_get($myTransfer)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `serial_transfer_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

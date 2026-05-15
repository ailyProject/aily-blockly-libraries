# Arduino Modbus Communication Library

Arduino Modbus RTU/TCP client and server communication library, supports reading and writing coils, registers and other functions

## Library Info
- **Name**: @aily-project/lib-arduino-modbus
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `modbus_rtu_client_begin` | Statement | BAUDRATE(dropdown) | `modbus_rtu_client_begin("9600")` | if (!ModbusRTUClient.begin(...)) { Serial.println("Failed to start Modbus RTU Client!"); w |
| `modbus_rtu_server_begin` | Statement | SLAVE_ID(field_number), BAUDRATE(dropdown) | `modbus_rtu_server_begin(1, "9600")` | if (!ModbusRTUServer.begin(..., ...)) { Serial.println("Failed to start Modbus RTU Server! |
| `modbus_tcp_client_begin` | Statement | IP(input_value), PORT(field_number) | `modbus_tcp_client_begin(text("value"), 502)` | IPAddress serverIP; serverIP.fromString(...); if (!modbusTCPClient.begin(serverIP, ...)) { |
| `modbus_tcp_server_begin` | Statement | SLAVE_ID(field_number) | `modbus_tcp_server_begin(255)` | if (!modbusTCPServer.begin(...)) { Serial.println("Failed to start Modbus TCP Server!"); w |
| `modbus_coil_read` | Value | SLAVE_ID(field_number), ADDRESS(field_number) | `modbus_coil_read(1, 0)` | ....coilRead(...) |
| `modbus_coil_write` | Statement | SLAVE_ID(field_number), ADDRESS(field_number), VALUE(input_value) | `modbus_coil_write(1, 0, math_number(0))` | Dynamic code |
| `modbus_discrete_input_read` | Value | SLAVE_ID(field_number), ADDRESS(field_number) | `modbus_discrete_input_read(1, 0)` | ....discreteInputRead(...) |
| `modbus_holding_register_read` | Value | SLAVE_ID(field_number), ADDRESS(field_number) | `modbus_holding_register_read(1, 0)` | ....holdingRegisterRead(...) |
| `modbus_holding_register_write` | Statement | SLAVE_ID(field_number), ADDRESS(field_number), VALUE(input_value) | `modbus_holding_register_write(1, 0, math_number(0))` | Dynamic code |
| `modbus_input_register_read` | Value | SLAVE_ID(field_number), ADDRESS(field_number) | `modbus_input_register_read(1, 0)` | ....inputRegisterRead(...) |
| `modbus_server_configure_coils` | Statement | START_ADDRESS(field_number), COUNT(field_number) | `modbus_server_configure_coils(0, 1)` | ....configureCoils(..., ...);\n |
| `modbus_server_configure_discrete_inputs` | Statement | START_ADDRESS(field_number), COUNT(field_number) | `modbus_server_configure_discrete_inputs(0, 1)` | ....configureDiscreteInputs(..., ...);\n |
| `modbus_server_configure_holding_registers` | Statement | START_ADDRESS(field_number), COUNT(field_number) | `modbus_server_configure_holding_registers(0, 1)` | ....configureHoldingRegisters(..., ...);\n |
| `modbus_server_configure_input_registers` | Statement | START_ADDRESS(field_number), COUNT(field_number) | `modbus_server_configure_input_registers(0, 1)` | ....configureInputRegisters(..., ...);\n |
| `modbus_server_poll` | Value | (none) | `modbus_server_poll()` | ....poll() |
| `modbus_server_coil_read` | Value | ADDRESS(field_number) | `modbus_server_coil_read(0)` | ....coilRead(...) |
| `modbus_server_coil_write` | Statement | ADDRESS(field_number), VALUE(input_value) | `modbus_server_coil_write(0, math_number(0))` | ....coilWrite(..., ...);\n |
| `modbus_server_discrete_input_write` | Statement | ADDRESS(field_number), VALUE(input_value) | `modbus_server_discrete_input_write(0, math_number(0))` | ....discreteInputWrite(..., ...);\n |
| `modbus_server_holding_register_read` | Value | ADDRESS(field_number) | `modbus_server_holding_register_read(0)` | ....holdingRegisterRead(...) |
| `modbus_server_holding_register_write` | Statement | ADDRESS(field_number), VALUE(input_value) | `modbus_server_holding_register_write(0, math_number(0))` | ....holdingRegisterWrite(..., ...);\n |
| `modbus_server_input_register_write` | Statement | ADDRESS(field_number), VALUE(input_value) | `modbus_server_input_register_write(0, math_number(0))` | ....inputRegisterWrite(..., ...);\n |
| `modbus_last_error` | Value | (none) | `modbus_last_error()` | ....lastError() |
| `modbus_quick_coil_control` | Statement | SLAVE_ID(field_number), ADDRESS(field_number), VALUE(dropdown) | `modbus_quick_coil_control(1, 0, "1")` | ModbusRTUClient.coilWrite(..., ..., ...);\n |
| `modbus_quick_register_read` | Value | SLAVE_ID(field_number), ADDRESS(field_number) | `modbus_quick_register_read(1, 0)` | ModbusRTUClient.holdingRegisterRead(..., ...) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BAUDRATE | 9600, 19200, 38400, 57600, 115200 | modbus_rtu_client_begin, modbus_rtu_server_begin |
| VALUE | 1, 0 | modbus_quick_coil_control |

## ABS Examples

### Basic Usage
```
arduino_setup()
    modbus_rtu_client_begin("9600")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, modbus_coil_read(1, 0))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

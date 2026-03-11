# Arduino Modbus通信库

Arduino Modbus RTU/TCP客户端和服务器通信库，支持读写coils、寄存器等功能

## Library Info
- **Name**: @aily-project/lib-arduino-modbus
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `modbus_rtu_client_begin` | Statement | BAUDRATE(dropdown) | `modbus_rtu_client_begin(9600)` | (dynamic code) |
| `modbus_rtu_server_begin` | Statement | SLAVE_ID(field_number), BAUDRATE(dropdown) | `modbus_rtu_server_begin(1, 9600)` | (dynamic code) |
| `modbus_tcp_client_begin` | Statement | IP(input_value), PORT(field_number) | `modbus_tcp_client_begin(math_number(0), 502)` | (dynamic code) |
| `modbus_tcp_server_begin` | Statement | SLAVE_ID(field_number) | `modbus_tcp_server_begin(255)` | (dynamic code) |
| `modbus_coil_read` | Value | SLAVE_ID(field_number), ADDRESS(field_number) | `modbus_coil_read(1, 0)` | `....coilRead(...)` |
| `modbus_coil_write` | Statement | SLAVE_ID(field_number), ADDRESS(field_number), VALUE(input_value) | `modbus_coil_write(1, 0, math_number(0))` | (dynamic code) |
| `modbus_discrete_input_read` | Value | SLAVE_ID(field_number), ADDRESS(field_number) | `modbus_discrete_input_read(1, 0)` | `....discreteInputRead(...)` |
| `modbus_holding_register_read` | Value | SLAVE_ID(field_number), ADDRESS(field_number) | `modbus_holding_register_read(1, 0)` | `....holdingRegisterRead(...)` |
| `modbus_holding_register_write` | Statement | SLAVE_ID(field_number), ADDRESS(field_number), VALUE(input_value) | `modbus_holding_register_write(1, 0, math_number(0))` | (dynamic code) |
| `modbus_input_register_read` | Value | SLAVE_ID(field_number), ADDRESS(field_number) | `modbus_input_register_read(1, 0)` | `....inputRegisterRead(...)` |
| `modbus_server_configure_coils` | Statement | START_ADDRESS(field_number), COUNT(field_number) | `modbus_server_configure_coils(0, 1)` | `....configureCoils(..., ...);\n` |
| `modbus_server_configure_discrete_inputs` | Statement | START_ADDRESS(field_number), COUNT(field_number) | `modbus_server_configure_discrete_inputs(0, 1)` | `....configureDiscreteInputs(..., ...);\n` |
| `modbus_server_configure_holding_registers` | Statement | START_ADDRESS(field_number), COUNT(field_number) | `modbus_server_configure_holding_registers(0, 1)` | `....configureHoldingRegisters(..., ...);\n` |
| `modbus_server_configure_input_registers` | Statement | START_ADDRESS(field_number), COUNT(field_number) | `modbus_server_configure_input_registers(0, 1)` | `....configureInputRegisters(..., ...);\n` |
| `modbus_server_poll` | Value | (none) | `modbus_server_poll()` | `....poll()` |
| `modbus_server_coil_read` | Value | ADDRESS(field_number) | `modbus_server_coil_read(0)` | `....coilRead(...)` |
| `modbus_server_coil_write` | Statement | ADDRESS(field_number), VALUE(input_value) | `modbus_server_coil_write(0, math_number(0))` | `....coilWrite(..., ...);\n` |
| `modbus_server_discrete_input_write` | Statement | ADDRESS(field_number), VALUE(input_value) | `modbus_server_discrete_input_write(0, math_number(0))` | `....discreteInputWrite(..., ...);\n` |
| `modbus_server_holding_register_read` | Value | ADDRESS(field_number) | `modbus_server_holding_register_read(0)` | `....holdingRegisterRead(...)` |
| `modbus_server_holding_register_write` | Statement | ADDRESS(field_number), VALUE(input_value) | `modbus_server_holding_register_write(0, math_number(0))` | `....holdingRegisterWrite(..., ...);\n` |
| `modbus_server_input_register_write` | Statement | ADDRESS(field_number), VALUE(input_value) | `modbus_server_input_register_write(0, math_number(0))` | `....inputRegisterWrite(..., ...);\n` |
| `modbus_last_error` | Value | (none) | `modbus_last_error()` | `....lastError()` |
| `modbus_quick_coil_control` | Statement | SLAVE_ID(field_number), ADDRESS(field_number), VALUE(dropdown) | `modbus_quick_coil_control(1, 0, 1)` | `ModbusRTUClient.coilWrite(..., ..., ...);\n` |
| `modbus_quick_register_read` | Value | SLAVE_ID(field_number), ADDRESS(field_number) | `modbus_quick_register_read(1, 0)` | `ModbusRTUClient.holdingRegisterRead(..., ...)` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BAUDRATE | 9600, 19200, 38400, 57600, 115200 | 9600 / 19200 / 38400 / 57600 / 115200 |
| VALUE | 1, 0 | 开启 / 关闭 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    modbus_rtu_client_begin(9600)
    modbus_rtu_server_begin(1, 9600)
    modbus_tcp_client_begin(math_number(0), 502)
    modbus_tcp_server_begin(255)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, modbus_coil_read(1, 0))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

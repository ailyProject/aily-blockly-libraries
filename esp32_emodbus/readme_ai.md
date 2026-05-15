# ESP32 eModbus communication

ESP32 Modbus RTU/TCP client and server communication library, supporting asynchronous non-blocking communication, multiple function codes, and callback processing

## Library Info
- **Name**: @aily-project/lib-esp32-emodbus
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `emodbus_rtu_client_create` | Statement | VAR(field_input), RTS_PIN(dropdown) | `emodbus_rtu_client_create("mbClient", RTS_PIN)` | Dynamic code |
| `emodbus_rtu_client_begin` | Statement | VAR(field_variable), SERIAL(dropdown), BAUDRATE(dropdown), RX_PIN(dropdown), TX_PIN(dropdown) | `emodbus_rtu_client_begin(variables_get($mbClient), Serial1, "9600", RX_PIN, TX_PIN)` | Dynamic code |
| `emodbus_tcp_client_create` | Statement | VAR(field_input) | `emodbus_tcp_client_create("mbTcpClient")` | Dynamic code |
| `emodbus_tcp_client_begin` | Statement | VAR(field_variable) | `emodbus_tcp_client_begin(variables_get($mbTcpClient))` | Dynamic code |
| `emodbus_tcp_client_set_target` | Statement | VAR(field_variable), IP(input_value), PORT(field_number) | `emodbus_tcp_client_set_target(variables_get($mbTcpClient), text("value"), 502)` | Dynamic code |
| `emodbus_client_set_timeout` | Statement | VAR(field_variable), TIMEOUT(field_number) | `emodbus_client_set_timeout(variables_get($mbClient), 2000)` | Dynamic code |
| `emodbus_client_on_data` | Hat | VAR(field_variable), HANDLER(input_statement) | `emodbus_client_on_data(variables_get($mbClient)) @HANDLER: child_block()` | Dynamic code |
| `emodbus_client_on_error` | Hat | VAR(field_variable), HANDLER(input_statement) | `emodbus_client_on_error(variables_get($mbClient)) @HANDLER: child_block()` | Dynamic code |
| `emodbus_read_holding_registers` | Statement | VAR(field_variable), SERVER_ID(field_number), ADDRESS(input_value), COUNT(input_value) | `emodbus_read_holding_registers(variables_get($mbClient), 1, math_number(0), math_number(0))` | Dynamic code |
| `emodbus_read_input_registers` | Statement | VAR(field_variable), SERVER_ID(field_number), ADDRESS(input_value), COUNT(input_value) | `emodbus_read_input_registers(variables_get($mbClient), 1, math_number(0), math_number(0))` | Dynamic code |
| `emodbus_read_coils` | Statement | VAR(field_variable), SERVER_ID(field_number), ADDRESS(input_value), COUNT(input_value) | `emodbus_read_coils(variables_get($mbClient), 1, math_number(0), math_number(0))` | Dynamic code |
| `emodbus_read_discrete_inputs` | Statement | VAR(field_variable), SERVER_ID(field_number), ADDRESS(input_value), COUNT(input_value) | `emodbus_read_discrete_inputs(variables_get($mbClient), 1, math_number(0), math_number(0))` | Dynamic code |
| `emodbus_write_single_register` | Statement | VAR(field_variable), SERVER_ID(field_number), ADDRESS(input_value), VALUE(input_value) | `emodbus_write_single_register(variables_get($mbClient), 1, math_number(0), math_number(0))` | Dynamic code |
| `emodbus_write_single_coil` | Statement | VAR(field_variable), SERVER_ID(field_number), ADDRESS(input_value), VALUE(input_value) | `emodbus_write_single_coil(variables_get($mbClient), 1, math_number(0), logic_boolean(TRUE))` | Dynamic code |
| `emodbus_write_multiple_registers` | Statement | VAR(field_variable), SERVER_ID(field_number), ADDRESS(input_value), VALUES(input_value) | `emodbus_write_multiple_registers(variables_get($mbClient), 1, math_number(0), math_number(0))` | _emodbus_writeMultiRegs( |
| `emodbus_sync_read_holding_registers` | Value | VAR(field_variable), SERVER_ID(field_number), ADDRESS(input_value) | `emodbus_sync_read_holding_registers(variables_get($mbClient), 1, math_number(0))` | _emodbus_syncReadHoldReg( |
| `emodbus_sync_read_input_register` | Value | VAR(field_variable), SERVER_ID(field_number), ADDRESS(input_value) | `emodbus_sync_read_input_register(variables_get($mbClient), 1, math_number(0))` | _emodbus_syncReadInputReg( |
| `emodbus_sync_read_coil` | Value | VAR(field_variable), SERVER_ID(field_number), ADDRESS(input_value) | `emodbus_sync_read_coil(variables_get($mbClient), 1, math_number(0))` | _emodbus_syncReadCoil( |
| `emodbus_response_get_uint16` | Value | INDEX(input_value) | `emodbus_response_get_uint16(math_number(0))` | _emodbus_getResponseUint16(_emodbus_response_mbClient, |
| `emodbus_response_get_float` | Value | INDEX(input_value) | `emodbus_response_get_float(math_number(0))` | _emodbus_getResponseFloat(_emodbus_response_mbClient, |
| `emodbus_response_server_id` | Value | (none) | `emodbus_response_server_id()` | _emodbus_response_mbClient.getServerID() |
| `emodbus_response_function_code` | Value | (none) | `emodbus_response_function_code()` | _emodbus_response_mbClient.getFunctionCode() |
| `emodbus_response_length` | Value | (none) | `emodbus_response_length()` | _emodbus_response_mbClient.size() |
| `emodbus_error_code` | Value | (none) | `emodbus_error_code()` | (int)_emodbus_error_mbClient |
| `emodbus_error_message` | Value | (none) | `emodbus_error_message()` | (const char *)ModbusError(_emodbus_error_mbClient) |
| `emodbus_rtu_server_create` | Statement | VAR(field_input), TIMEOUT(field_number), RTS_PIN(dropdown) | `emodbus_rtu_server_create("mbServer", 2000, RTS_PIN)` | Dynamic code |
| `emodbus_rtu_server_begin` | Statement | VAR(field_variable), SERIAL(dropdown), BAUDRATE(dropdown), RX_PIN(dropdown), TX_PIN(dropdown) | `emodbus_rtu_server_begin(variables_get($mbServer), Serial1, "9600", RX_PIN, TX_PIN)` | Dynamic code |
| `emodbus_tcp_server_create` | Statement | VAR(field_input), PORT(field_number), MAX_CLIENTS(field_number) | `emodbus_tcp_server_create("mbTcpServer", 502, 4)` | Dynamic code |
| `emodbus_tcp_server_begin` | Statement | VAR(field_variable) | `emodbus_tcp_server_begin(variables_get($mbTcpServer))` | Dynamic code |
| `emodbus_server_register_fc03` | Hat | VAR(field_variable), SERVER_ID(field_number), ADDRESS_VAR(field_variable), COUNT_VAR(field_variable), HANDLER(input_statement) | `emodbus_server_register_fc03(variables_get($mbServer), 1, variables_get($reqAddress), variables_get($reqCount)) @HANDLER: child_block()` | Dynamic code |
| `emodbus_server_register_fc06` | Hat | VAR(field_variable), SERVER_ID(field_number), ADDRESS_VAR(field_variable), VALUE_VAR(field_variable), HANDLER(input_statement) | `emodbus_server_register_fc06(variables_get($mbServer), 1, variables_get($reqAddress), variables_get($reqValue)) @HANDLER: child_block()` | Dynamic code |
| `emodbus_server_add_response_data` | Statement | VALUE(input_value) | `emodbus_server_add_response_data(math_number(0))` | _emodbus_server_response.add((uint16_t) |
| `emodbus_server_set_error` | Statement | ERROR_CODE(dropdown) | `emodbus_server_set_error(ILLEGAL_FUNCTION)` | _emodbus_server_response.setError(request.getServerID(), request.getFunctionCode(), |
| `emodbus_client_pending_requests` | Value | VAR(field_variable) | `emodbus_client_pending_requests(variables_get($mbClient))` | Dynamic code |
| `emodbus_client_clear_queue` | Statement | VAR(field_variable) | `emodbus_client_clear_queue(variables_get($mbClient))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SERIAL | Serial1, Serial2 | emodbus_rtu_client_begin, emodbus_rtu_server_begin |
| BAUDRATE | 9600, 19200, 38400, 57600, 115200 | emodbus_rtu_client_begin, emodbus_rtu_server_begin |
| ERROR_CODE | ILLEGAL_FUNCTION, ILLEGAL_DATA_ADDRESS, ILLEGAL_DATA_VALUE, SERVER_DEVICE_FAILURE | emodbus_server_set_error |

## ABS Examples

### Basic Usage
```
arduino_setup()
    emodbus_rtu_client_create("mbClient", RTS_PIN)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, emodbus_sync_read_holding_registers(variables_get($mbClient), 1, math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `emodbus_rtu_client_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

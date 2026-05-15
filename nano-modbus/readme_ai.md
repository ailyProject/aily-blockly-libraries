# nanoModbus communication library

Lightweight Modbus RTU/TCP communication library, supports client and server modes

## Library Info
- **Name**: @aily-project/lib-nano-modbus
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `nmbs_client_create` | Statement | VAR(field_input), SERIAL(dropdown), BAUDRATE(dropdown) | `nmbs_client_create("modbusClient", SERIAL, BAUDRATE)` | Dynamic code |
| `nmbs_client_tcp_create` | Statement | VAR(field_input), SSID(input_value), PASS(input_value), IP(input_value), PORT(input_value) | `nmbs_client_tcp_create("modbusClient", text("value"), text("value"), text("value"), math_number(0))` | Dynamic code |
| `nmbs_set_dest_address` | Statement | VAR(field_variable), ADDRESS(input_value) | `nmbs_set_dest_address(variables_get($modbusClient), math_number(0))` | nmbs_set_destination_rtu_address(& |
| `nmbs_set_timeout` | Statement | VAR(field_variable), READ_TIMEOUT(input_value), BYTE_TIMEOUT(input_value) | `nmbs_set_timeout(variables_get($modbusClient), math_number(1000), math_number(1000))` | Dynamic code |
| `nmbs_read_holding_register` | Value | VAR(field_variable), ADDRESS(input_value) | `nmbs_read_holding_register(variables_get($modbusClient), math_number(0))` | nmbs_helper_read_holding(& |
| `nmbs_read_input_register` | Value | VAR(field_variable), ADDRESS(input_value) | `nmbs_read_input_register(variables_get($modbusClient), math_number(0))` | nmbs_helper_read_input(& |
| `nmbs_read_coil` | Value | VAR(field_variable), ADDRESS(input_value) | `nmbs_read_coil(variables_get($modbusClient), math_number(0))` | nmbs_helper_read_coil(& |
| `nmbs_read_discrete_input` | Value | VAR(field_variable), ADDRESS(input_value) | `nmbs_read_discrete_input(variables_get($modbusClient), math_number(0))` | nmbs_helper_read_discrete(& |
| `nmbs_write_single_coil` | Statement | VAR(field_variable), ADDRESS(input_value), VALUE(input_value) | `nmbs_write_single_coil(variables_get($modbusClient), math_number(0), logic_boolean(TRUE))` | nmbs_write_single_coil(& |
| `nmbs_write_single_register` | Statement | VAR(field_variable), ADDRESS(input_value), VALUE(input_value) | `nmbs_write_single_register(variables_get($modbusClient), math_number(0), math_number(0))` | nmbs_write_single_register(& |
| `nmbs_server_create` | Statement | VAR(field_input), SERIAL(dropdown), BAUDRATE(dropdown), ADDRESS(field_number) | `nmbs_server_create("modbusServer", Serial, "9600", 1)` | Dynamic code |
| `nmbs_server_tcp_create` | Statement | VAR(field_input), SSID(input_value), PASS(input_value), PORT(field_number) | `nmbs_server_tcp_create("modbusServer", text("value"), text("value"), 502)` | Dynamic code |
| `nmbs_server_poll` | Statement | VAR(field_variable) | `nmbs_server_poll(variables_get($modbusServer))` | nmbs_server_poll(& |
| `nmbs_server_tcp_poll` | Statement | VAR(field_variable) | `nmbs_server_tcp_poll(variables_get($modbusServer))` | nmbs_tcp_server_poll(& |
| `nmbs_server_set_coil` | Statement | ADDRESS(input_value), VALUE(input_value) | `nmbs_server_set_coil(math_number(0), logic_boolean(TRUE))` | nmbs_bitfield_write(nmbs_srv_coils, |
| `nmbs_server_get_coil` | Value | ADDRESS(input_value) | `nmbs_server_get_coil(math_number(0))` | nmbs_bitfield_read(nmbs_srv_coils, |
| `nmbs_server_set_register` | Statement | ADDRESS(input_value), VALUE(input_value) | `nmbs_server_set_register(math_number(0), math_number(0))` | nmbs_srv_holding_regs[ |
| `nmbs_server_get_register` | Value | ADDRESS(input_value) | `nmbs_server_get_register(math_number(0))` | nmbs_srv_holding_regs[ |
| `nmbs_server_set_input_register` | Statement | ADDRESS(input_value), VALUE(input_value) | `nmbs_server_set_input_register(math_number(0), math_number(0))` | nmbs_srv_input_regs[ |
| `nmbs_server_get_input_register` | Value | ADDRESS(input_value) | `nmbs_server_get_input_register(math_number(0))` | nmbs_srv_input_regs[ |
| `nmbs_server_set_discrete_input` | Statement | ADDRESS(input_value), VALUE(input_value) | `nmbs_server_set_discrete_input(math_number(0), logic_boolean(TRUE))` | nmbs_bitfield_write(nmbs_srv_discrete_inputs, |
| `nmbs_server_get_discrete_input` | Value | ADDRESS(input_value) | `nmbs_server_get_discrete_input(math_number(0))` | nmbs_bitfield_read(nmbs_srv_discrete_inputs, |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SERIAL | Serial, Serial1, Serial2 | nmbs_server_create |
| BAUDRATE | 9600, 19200, 38400, 57600, 115200 | nmbs_server_create |

## ABS Examples

### Basic Usage
```
arduino_setup()
    nmbs_client_create("modbusClient", SERIAL, BAUDRATE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, nmbs_read_holding_register(variables_get($modbusClient), math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `nmbs_client_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

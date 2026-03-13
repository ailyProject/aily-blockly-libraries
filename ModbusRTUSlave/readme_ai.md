# Modbus RTU Slave

Blockly library for building Modbus RTU slave devices over RS-485 serial communication.

## Library Info
- **Name**: @aily-project/lib-modbus-rtu-slave
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `modbus_rtu_slave_create` | Statement | VAR(field_input), SERIAL(field_dropdown), DE_PIN(input_value), RE_PIN(input_value) | `modbus_rtu_slave_create("modbus", Serial1, math_number(-1), math_number(-1))` | `ModbusRTUSlave modbus(SERIAL, -1, -1);` |
| `modbus_rtu_slave_set_response_delay` | Statement | VAR(field_variable), DELAY(input_value) | `modbus_rtu_slave_set_response_delay($modbus, math_number(5))` | `modbus.setResponseDelay(5);` |
| `modbus_rtu_slave_begin` | Statement | VAR(field_variable), UNIT_ID(field_number), BAUD(field_dropdown), CONFIG(field_dropdown) | `modbus_rtu_slave_begin($modbus, 1, 9600, SERIAL_8N1)` | `SERIAL.begin(9600, SERIAL_8N1); modbus.begin(1, 9600, SERIAL_8N1);` |
| `modbus_rtu_slave_poll` | Statement | VAR(field_variable), DO(input_statement) | `modbus_rtu_slave_poll($modbus) @DO: ...` | `if (modbus.poll()) { ... }` |
| `modbus_rtu_slave_bind_coils` | Statement | VAR(field_variable), ARRAY(field_input), LENGTH(field_number) | `modbus_rtu_slave_bind_coils($modbus, "coils", 2)` | `bool coils[2]={false}; modbus.configureCoils(coils,2);` |
| `modbus_rtu_slave_bind_discrete` | Statement | VAR(field_variable), ARRAY(field_input), LENGTH(field_number) | `modbus_rtu_slave_bind_discrete($modbus, "discreteInputs", 2)` | `bool discreteInputs[2]={false}; modbus.configureDiscreteInputs(discreteInputs,2);` |
| `modbus_rtu_slave_bind_holding` | Statement | VAR(field_variable), ARRAY(field_input), LENGTH(field_number) | `modbus_rtu_slave_bind_holding($modbus, "holdingRegisters", 2)` | `uint16_t holdingRegisters[2]={0}; modbus.configureHoldingRegisters(holdingRegisters,2);` |
| `modbus_rtu_slave_bind_input` | Statement | VAR(field_variable), ARRAY(field_input), LENGTH(field_number) | `modbus_rtu_slave_bind_input($modbus, "inputRegisters", 2)` | `uint16_t inputRegisters[2]={0}; modbus.configureInputRegisters(inputRegisters,2);` |
| `modbus_rtu_slave_coils_set` | Statement | ARRAY(field_variable), INDEX(input_value), VALUE(input_value) | `modbus_rtu_slave_coils_set($coils, math_number(0), logic_boolean(TRUE))` | `coils[0] = true;` |
| `modbus_rtu_slave_coils_get` | Value(Boolean) | ARRAY(field_variable), INDEX(input_value) | `modbus_rtu_slave_coils_get($coils, math_number(0))` | `coils[0]` |
| `modbus_rtu_slave_discrete_set` | Statement | ARRAY(field_variable), INDEX(input_value), VALUE(input_value) | `modbus_rtu_slave_discrete_set($discreteInputs, math_number(0), logic_boolean(TRUE))` | `discreteInputs[0] = true;` |
| `modbus_rtu_slave_discrete_get` | Value(Boolean) | ARRAY(field_variable), INDEX(input_value) | `modbus_rtu_slave_discrete_get($discreteInputs, math_number(0))` | `discreteInputs[0]` |
| `modbus_rtu_slave_holding_set` | Statement | ARRAY(field_variable), INDEX(input_value), VALUE(input_value) | `modbus_rtu_slave_holding_set($holdingRegisters, math_number(0), math_number(123))` | `holdingRegisters[0] = 123;` |
| `modbus_rtu_slave_holding_get` | Value(Number) | ARRAY(field_variable), INDEX(input_value) | `modbus_rtu_slave_holding_get($holdingRegisters, math_number(0))` | `holdingRegisters[0]` |
| `modbus_rtu_slave_input_set` | Statement | ARRAY(field_variable), INDEX(input_value), VALUE(input_value) | `modbus_rtu_slave_input_set($inputRegisters, math_number(0), math_number(456))` | `inputRegisters[0] = 456;` |
| `modbus_rtu_slave_input_get` | Value(Number) | ARRAY(field_variable), INDEX(input_value) | `modbus_rtu_slave_input_get($inputRegisters, math_number(0))` | `inputRegisters[0]` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SERIAL | Serial, Serial1, Serial2, ... | Serial port (board-dependent via `${board.serialPort}`) |
| BAUD | 9600, 19200, 38400, 57600, 115200 | Baud rate |
| CONFIG | SERIAL_8N1, SERIAL_8N2, SERIAL_8E1, SERIAL_8E2, SERIAL_8O1, SERIAL_8O2 | Serial frame format |
| UNIT_ID | 1–247 | Modbus slave address |
| LENGTH | 1–512 | Array length for coils/registers |

## ABS Examples

### Basic Slave with Coils and Holding Registers
```
arduino_setup()
    modbus_rtu_slave_create("modbus", Serial1, math_number(-1), math_number(-1))
    modbus_rtu_slave_bind_coils($modbus, "coils", 4)
    modbus_rtu_slave_bind_holding($modbus, "holdingRegisters", 4)
    modbus_rtu_slave_begin($modbus, 1, 9600, SERIAL_8N1)

arduino_loop()
    modbus_rtu_slave_poll($modbus)
        @DO:
            digital_write(math_number(13), modbus_rtu_slave_coils_get($coils, math_number(0)))
            modbus_rtu_slave_input_set($inputRegisters, math_number(0), analog_read(math_number(0)))
```

### Slave with Response Delay (for slow DE/RE transceivers)
```
arduino_setup()
    modbus_rtu_slave_create("modbus", Serial1, math_number(2), math_number(3))
    modbus_rtu_slave_set_response_delay($modbus, math_number(5))
    modbus_rtu_slave_bind_holding($modbus, "holdingRegisters", 2)
    modbus_rtu_slave_begin($modbus, 1, 38400, SERIAL_8N1)

arduino_loop()
    modbus_rtu_slave_poll($modbus)
```

## Notes

1. **Initialization**: Call `modbus_rtu_slave_create` and `modbus_rtu_slave_begin` inside `arduino_setup()`. Configure data arrays before `begin`.
2. **Auto-created variables**: `modbus_rtu_slave_create("name", ...)` creates variable `$name` (type `ModbusRTUSlave`). Bind blocks like `modbus_rtu_slave_bind_coils(_, "arrName", n)` create typed array variables: `$arrName` with types `ModbusCoilArray`, `ModbusDiscreteArray`, `ModbusHoldingArray`, or `ModbusInputArray`.
3. **DE/RE pins**: Set to `math_number(-1)` when the RS-485 transceiver handles direction switching automatically.
4. **Polling**: Place `modbus_rtu_slave_poll` in `arduino_loop()`. The `@DO:` statement body runs only when a valid master request is received.
5. **Parameter order**: Follows `block.json` args0 order — fields and inputs may interleave.

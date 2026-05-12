# SparkFun CAN-Bus Shield

Blockly wrapper for the SparkFun CAN-Bus Shield and MCP2515 controller.

## Library Info
- **Name**: @aily-project/lib-sparkfun-can-bus
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `canbus_init` | Statement | SPEED(dropdown) | `canbus_init(CANSPEED_500)` | canbus_ready = Canbus.init( |
| `canbus_is_ready` | Value | (none) | `canbus_is_ready()` | canbus_ready |
| `canbus_send_test` | Value | (none) | `canbus_send_test()` | Canbus.message_tx() |
| `canbus_read_message` | Value | (none) | `canbus_read_message()` | canbusReadMessage() |
| `canbus_last_id` | Value | (none) | `canbus_last_id()` | canbus_last_message.id |
| `canbus_last_length` | Value | (none) | `canbus_last_length()` | canbus_last_message.header.length |
| `canbus_data_byte` | Value | INDEX(dropdown) | `canbus_data_byte("0")` | canbus_rx_buffer[ |
| `canbus_obd_request` | Value | PID(dropdown) | `canbus_obd_request(ENGINE_COOLANT_TEMP)` | canbusRequestPid( |
| `canbus_send_message` | Statement | ID(input_value), LENGTH(dropdown), D0(input_value), D1(input_value), D2(input_value), D3(input_value), D4(input_value), D5(input_value), D6(input_value), D7(... | `canbus_send_message(math_number(0), "8", math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | canbusSendFrame( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SPEED | CANSPEED_500, CANSPEED_250, CANSPEED_125 | canbus_init |
| INDEX | 0, 1, 2, 3, 4, 5, 6, 7 | canbus_data_byte |
| PID | ENGINE_COOLANT_TEMP, ENGINE_RPM, VEHICLE_SPEED, MAF_SENSOR, O2_VOLTAGE, THROTTLE | canbus_obd_request |
| LENGTH | 8, 7, 6, 5, 4, 3, 2, 1, 0 | canbus_send_message |

## ABS Examples

### Basic Usage
```
arduino_setup()
    canbus_init(CANSPEED_500)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, canbus_is_ready())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

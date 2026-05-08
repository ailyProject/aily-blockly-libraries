# SparkFun CAN-Bus

CAN-Bus and OBD-II helper blocks for the SparkFun CAN-Bus Shield.

## Library Info
- **Name**: @aily-project/lib-sparkfun-can-bus
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `canbus_init` | Statement | SPEED(dropdown) | `canbus_init(CANSPEED_500)` | `canbus_ready = Canbus.init(CANSPEED_500);` |
| `canbus_is_ready` | Value | none | `canbus_is_ready()` | `canbus_ready` |
| `canbus_send_test` | Value | none | `canbus_send_test()` | `Canbus.message_tx()` |
| `canbus_read_message` | Value | none | `canbus_read_message()` | `canbusReadMessage()` |
| `canbus_last_id` | Value | none | `canbus_last_id()` | `canbus_last_message.id` |
| `canbus_last_length` | Value | none | `canbus_last_length()` | `canbus_last_message.header.length` |
| `canbus_data_byte` | Value | INDEX(dropdown) | `canbus_data_byte(0)` | `canbus_rx_buffer[0]` |
| `canbus_obd_request` | Value | PID(dropdown) | `canbus_obd_request(ENGINE_RPM)` | `canbusRequestPid(ENGINE_RPM)` |
| `canbus_send_message` | Statement | ID(input_value), LENGTH(dropdown), D0(input_value), D1(input_value), D2(input_value), D3(input_value), D4(input_value), D5(input_value), D6(input_value), D7(input_value) | `canbus_send_message(math_number(2015), 8, math_number(2), math_number(1), math_number(12), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `canbusSendFrame(id, len, d0...d7);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SPEED | CANSPEED_500, CANSPEED_250, CANSPEED_125 | CAN bitrate |
| INDEX | 0, 1, 2, 3, 4, 5, 6, 7 | Data byte index |
| PID | ENGINE_COOLANT_TEMP, ENGINE_RPM, VEHICLE_SPEED, MAF_SENSOR, O2_VOLTAGE, THROTTLE | OBD-II PID |
| LENGTH | 0, 1, 2, 3, 4, 5, 6, 7, 8 | CAN data length |

## ABS Examples

```text
arduino_setup()
    canbus_init(CANSPEED_500)

arduino_loop()
    controls_if()
        @IF0: canbus_read_message()
        @DO0:
            serial_println(Serial, canbus_last_id())
```

## Notes

The upstream library is AVR-oriented. Call `canbus_read_message()` before reading `canbus_last_id`, `canbus_last_length`, or `canbus_data_byte`.
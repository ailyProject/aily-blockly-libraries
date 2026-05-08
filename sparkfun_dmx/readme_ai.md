# SparkFun ESP32 DMX

SparkFunDMX ABS 参考。

## Library Info
- **Name**: @aily-project/lib-sparkfun-dmx
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `dmx_init` | Statement | VAR(field_input), UART(field_number), EN(input_value), CHANNELS(input_value), DIR(dropdown) | `dmx_init("dmx", 2, math_number(21), math_number(1), DMX_WRITE_DIR)` | `SparkFunDMX dmx; HardwareSerial dmxSerial(2); dmx.begin(...);` |
| `dmx_set_dir` | Statement | VAR(field_variable), DIR(dropdown) | `dmx_set_dir($dmx, DMX_READ_DIR)` | `dmx.setComDir(DMX_READ_DIR);` |
| `dmx_write_byte` | Statement | VAR(field_variable), CHANNEL(input_value), VALUE(input_value) | `dmx_write_byte($dmx, math_number(1), math_number(255))` | `dmx.writeByte(value, channel);` |
| `dmx_read_byte` | Value(Number) | VAR(field_variable), CHANNEL(input_value) | `dmx_read_byte($dmx, math_number(1))` | `dmx.readByte(channel)` |
| `dmx_data_available` | Value(Boolean) | VAR(field_variable) | `dmx_data_available($dmx)` | `dmx.dataAvailable()` |
| `dmx_update` | Statement | VAR(field_variable) | `dmx_update($dmx)` | `dmx.update();` |
| `dmx_update_ok` | Value(Boolean) | VAR(field_variable) | `dmx_update_ok($dmx)` | `dmx.update()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DIR | DMX_WRITE_DIR, DMX_READ_DIR | 发送或接收方向 |
| UART | 0, 1, 2 | ESP32 HardwareSerial 编号 |

## ABS Examples

```text
arduino_setup()
    dmx_init("dmx", 2, math_number(21), math_number(1), DMX_WRITE_DIR)

arduino_loop()
    dmx_write_byte($dmx, math_number(1), math_number(128))
    dmx_update($dmx)
    time_delay(math_number(100))
```

## Notes

1. `dmx_init("name", ...)` creates variable `$name` and a `HardwareSerial` named `nameSerial`.
2. Send mode requires `dmx_update` after writing channel values.
3. Receive mode requires repeated `dmx_update` calls before checking `dmx_data_available`.
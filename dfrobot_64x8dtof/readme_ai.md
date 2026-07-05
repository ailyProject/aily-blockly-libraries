# DFRobot 64x8 dTOF Matrix Aily Blocks

- Package: `@aily-project/lib-dfrobot-64x8dtof`
- Source: https://github.com/DFRobot/DFRobot_64x8DTOF
- Arduino class: `DFRobot_64x8DTOF`
- Transport: ESP32 hardware UART, 921600 baud.

## Library Info

- **Name**: `@aily-project/lib-dfrobot-64x8dtof`
- **Version**: `0.1.0`
- **Arduino class**: `DFRobot_64x8DTOF`
- **Transport**: ESP32 hardware UART, 921600 baud.

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
| --- | --- | --- | --- | --- |
| `dtof64x8_init_uart` | statement | `VAR` field_input, `SERIAL` dropdown, `RX` input_value, `TX` input_value | `dtof64x8_init_uart(dtof64x8, Serial1, math_number(25), math_number(26))` | Declares `DFRobot_64x8DTOF dtof64x8(Serial1, SERIAL_8N1, RX, TX);` and loops until `begin()` succeeds. |
| `dtof64x8_config_frame_single` | statement | `VAR` field_variable | `dtof64x8_config_frame_single($dtof64x8)` | Loops until `configFrameMode(DFRobot_64x8DTOF::eFrameSingle)` succeeds. |
| `dtof64x8_config_full` | statement | `VAR` field_variable | `dtof64x8_config_full($dtof64x8)` | Loops until `configMeasureMode()` succeeds. |
| `dtof64x8_config_line` | statement | `VAR` field_variable, `LINE` input_value | `dtof64x8_config_line($dtof64x8, math_number(4))` | Loops until `configMeasureMode(line)` succeeds. |
| `dtof64x8_config_point` | statement | `VAR` field_variable, `LINE` input_value, `POINT` input_value | `dtof64x8_config_point($dtof64x8, math_number(4), math_number(32))` | Loops until `configMeasureMode(line, point)` succeeds. |
| `dtof64x8_config_points` | statement | `VAR` field_variable, `LINE` input_value, `START` input_value, `END` input_value | `dtof64x8_config_points($dtof64x8, math_number(3), math_number(1), math_number(64))` | Loops until `configMeasureMode(line, start, end)` succeeds. |
| `dtof64x8_read_data` | value Number | `VAR` field_variable, `TIMEOUT` input_value | `dtof64x8_read_data($dtof64x8, math_number(300))` | `dtof64x8.getData(timeout)` |
| `dtof64x8_point_value` | value Number | `VAR` field_variable, `INDEX` input_value, `DATA` dropdown | `dtof64x8_point_value($dtof64x8, math_number(0), Z)` | `dtof64x8.point.zBuf[index]`, `xBuf`, `yBuf`, or `iBuf` |

## Parameter Options

- `SERIAL`: `Serial1`, `Serial2`
- `DATA`: `X`, `Y`, `Z`, `I`

## Examples

Single point:

```text
dtof64x8_init_uart(dtof64x8, Serial1, math_number(25), math_number(26))
dtof64x8_config_frame_single($dtof64x8)
dtof64x8_config_point($dtof64x8, math_number(4), math_number(32))
dtof64x8_read_data($dtof64x8, math_number(300))
dtof64x8_point_value($dtof64x8, math_number(0), Z)
```

Single line:

```text
dtof64x8_init_uart(dtof64x8, Serial1, math_number(25), math_number(26))
dtof64x8_config_frame_single($dtof64x8)
dtof64x8_config_line($dtof64x8, math_number(4))
dtof64x8_read_data($dtof64x8, math_number(300))
dtof64x8_point_value($dtof64x8, math_number(0), Z)
```

## Notes

- The upstream library explicitly returns false on AVR and ESP8266. This Aily package is limited to `esp32:esp32`.
- Call one measurement configuration block in setup before reading data.
- `dtof64x8_read_data` returns the number of parsed points. Negative values mean timeout or communication error.
- Cached point index is zero-based. For single-point mode, use index `0`; for single-line mode, valid indexes are `0..63`; for full-frame mode, valid indexes are `0..511`.
- The upstream header notes continuous frame mode is not implemented, so only single-frame mode is exposed.

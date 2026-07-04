# SFA40 HCHO Sensor

DFRobot SFA40 I2C formaldehyde, humidity, and temperature sensor blocks.

## Library Info

- **Name**: `@aily-project/lib-dfrobot-sfa40`
- **Version**: `0.1.0`
- **Arduino class**: `DFRobot_SFA40`
- **Transport**: I2C, fixed address `0x5D`

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sfa40_init_i2c` | Statement | `VAR(field_input)`, `WIRE(field_dropdown)` | `sfa40_init_i2c("sfa40", Wire)` | Declares `DFRobot_SFA40 sfa40(&Wire);` and waits for `begin() == 0`. |
| `sfa40_measurement` | Statement | `VAR(field_variable)`, `ACTION(field_dropdown)` | `sfa40_measurement($sfa40, START)` | Calls `startMeasurement()` or `stopMeasurement()`. |
| `sfa40_read_data` | Value Number | `VAR(field_variable)` | `sfa40_read_data($sfa40)` | `sfa40.readMeasurementData()` |
| `sfa40_value` | Value Number | `VAR(field_variable)`, `DATA(field_dropdown)` | `sfa40_value($sfa40, HCHO)` | Returns cached `HCHO`, `humidity`, `temperatureC`, or `temperatureF`. |
| `sfa40_read_serial` | Statement | `VAR(field_variable)` | `sfa40_read_serial($sfa40)` | Calls `getSerialNumber()` to update `serialNumberLen`. |
| `sfa40_serial_length` | Value Number | `VAR(field_variable)` | `sfa40_serial_length($sfa40)` | `sfa40.serialNumberLen` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| `ACTION` | `START`, `STOP` | Start or stop measurement. |
| `DATA` | `HCHO`, `HUMIDITY`, `TEMP_C`, `TEMP_F` | Cached measurement field. |

## ABS Examples

```text
sfa40_init_i2c("sfa40", Wire)
sfa40_measurement($sfa40, START)
sfa40_read_data($sfa40)
sfa40_value($sfa40, HCHO)
```

## Notes

1. `sfa40_read_data` returns status: `0` reliable, `1` not ready, `2` warming/not within specification, `3` communication or CRC failure.
2. Values are updated when status is `0`, `1`, or `2`; status `3` means cached values should not be trusted.
3. To read the serial number length, stop measurement, call `sfa40_read_serial`, then read `sfa40_serial_length`.

# SparkFun MAG3110 三轴磁力计

读取三轴磁场强度及航向角。

## Library Info
- **Name**: @aily-project/lib-sparkfun-mag3110
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mag3110_init` | Statement | VAR(field_input) | `mag3110_init("mag")` | `MAG3110 mag; Wire.begin(); mag.initialize();` |
| `mag3110_start` | Statement | VAR(field_variable) | `mag3110_start(variables_get($mag))` | `mag.start();` |
| `mag3110_data_ready` | Value→Boolean | VAR(field_variable) | `mag3110_data_ready(variables_get($mag))` | `mag.dataReady()` |
| `mag3110_read_axis` | Value→Number | VAR(field_variable), AXIS(dropdown) | `mag3110_read_axis(variables_get($mag), X)` | `(mag3110ReadMag_mag(), mag3110_x_mag)` |
| `mag3110_read_heading` | Value→Number | VAR(field_variable) | `mag3110_read_heading(variables_get($mag))` | `mag.readHeading()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| AXIS | X, Y, Z | 磁场轴向 |

## ABS Examples

```
arduino_setup()
    mag3110_init("mag")
    mag3110_start(variables_get($mag))
    serial_begin(Serial, 9600)

arduino_loop()
    controls_if()
        @IF0: mag3110_data_ready(variables_get($mag))
        @DO0:
            serial_println(Serial, mag3110_read_heading(variables_get($mag)))
    time_delay(math_number(100))
```

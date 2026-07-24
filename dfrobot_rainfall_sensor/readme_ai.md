# DFRobot Rainfall Sensor

Blocks for the DFRobot tipping-bucket rainfall sensor using its universal I2C interface.

## Library Info
- **Name**: @aily-project/lib-dfrobot-rainfall-sensor
- **Version**: 0.1.0
- **Author**: DFRobot
- **Source**: https://github.com/DFRobot/DFRobot_RainfallSensor
- **License**: MIT

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `dfrobot_rainfall_sensor_init` | Statement | VAR(field_input), WIRE(field_dropdown) | `dfrobot_rainfall_sensor_init(VAR, WIRE)` | Dynamic code |
| `dfrobot_rainfall_sensor_read` | Value | VAR(field_variable), DATA(field_dropdown), INDEX(input_value) | `dfrobot_rainfall_sensor_read(VAR, DATA, INDEX)` | Dynamic code |
| `dfrobot_rainfall_sensor_set` | Statement | VAR(field_variable), SETTING(field_dropdown), VALUE(input_value) | `dfrobot_rainfall_sensor_set(VAR, SETTING, VALUE)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| dfrobot_rainfall_sensor_init.WIRE | board-provided options | Selects the generated API option. |
| dfrobot_rainfall_sensor_read.DATA | period, total, raw, working_time | Selects the generated API option. |
| dfrobot_rainfall_sensor_set.SETTING | bucket | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    dfrobot_rainfall_sensor_init("rainfall")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

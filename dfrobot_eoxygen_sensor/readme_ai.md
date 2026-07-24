# DFRobot Electrochemical Oxygen

Blocks for the DFRobot electrochemical oxygen concentration sensor using I2C.

## Library Info
- **Name**: @aily-project/lib-dfrobot-eoxygen-sensor
- **Version**: 0.1.0
- **Author**: DFRobot
- **Source**: https://github.com/DFRobot/DFRobot_EOxygenSensor
- **License**: MIT

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `dfrobot_eoxygen_sensor_init` | Statement | VAR(field_input), WIRE(field_dropdown), ADDR(field_dropdown) | `dfrobot_eoxygen_sensor_init(VAR, WIRE, ADDR)` | Dynamic code |
| `dfrobot_eoxygen_sensor_read` | Value | VAR(field_variable), DATA(field_dropdown) | `dfrobot_eoxygen_sensor_read(VAR, DATA)` | Dynamic code |
| `dfrobot_eoxygen_sensor_action` | Statement | VAR(field_variable), ACTION(field_dropdown) | `dfrobot_eoxygen_sensor_action(VAR, ACTION)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| dfrobot_eoxygen_sensor_init.WIRE | board-provided options | Selects the generated API option. |
| dfrobot_eoxygen_sensor_init.ADDR | 0x30, 0x31, 0x32, 0x33 | Selects the generated API option. |
| dfrobot_eoxygen_sensor_read.DATA | oxygen, calibration | Selects the generated API option. |
| dfrobot_eoxygen_sensor_action.ACTION | calibrate_air, calibrate_high, clear | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    dfrobot_eoxygen_sensor_init("oxygen")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

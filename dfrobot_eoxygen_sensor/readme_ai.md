# DFRobot Electrochemical Oxygen

Blocks for the DFRobot electrochemical oxygen concentration sensor using I2C.

## Library Info
- **Name**: @aily-project/lib-dfrobot-eoxygen-sensor
- **Version**: 0.1.1
- **Author**: DFRobot
- **Source**: https://github.com/DFRobot/DFRobot_EOxygenSensor
- **License**: MIT

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `dfrobot_eoxygen_sensor_init` | Statement | VAR(field_input), WIRE(dropdown), ADDR(dropdown) | `dfrobot_eoxygen_sensor_init("oxygen", WIRE, "0x30")` | `DFRobot_EOxygenSensor_I2C oxygen(&WIRE, 0x70); ↵ WIRE.begin(); ↵ while (!(oxygen.begin())) { delay(100); }` |
| `dfrobot_eoxygen_sensor_read` | Value | VAR(field_variable), DATA(dropdown) | `dfrobot_eoxygen_sensor_read($oxygen, oxygen)` | `oxygen.readOxygenConcentration()` |
| `dfrobot_eoxygen_sensor_action` | Statement | VAR(field_variable), ACTION(dropdown) | `dfrobot_eoxygen_sensor_action($oxygen, calibrate_air)` | `oxygen.calibration_20_9();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| dfrobot_eoxygen_sensor_init.WIRE | board-provided options | Selects the generated API option. |
| dfrobot_eoxygen_sensor_init.ADDR | 0x30, 0x31, 0x32, 0x33 | Serialized switch positions. The dropdown displays and the generator emits 0x70, 0x71, 0x72 and 0x73 respectively. |
| dfrobot_eoxygen_sensor_read.DATA | oxygen, calibration | Selects the generated API option. |
| dfrobot_eoxygen_sensor_action.ACTION | calibrate_air, calibrate_high, clear | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    dfrobot_eoxygen_sensor_init("oxygen", WIRE, "0x30")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

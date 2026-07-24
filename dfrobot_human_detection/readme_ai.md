# DFRobot Human Detection

Blocks for the DFRobot C1001 mmWave human presence, sleep, respiration and heart-rate sensor.

## Library Info
- **Name**: @aily-project/lib-dfrobot-human-detection
- **Version**: 0.1.0
- **Author**: DFRobot
- **Source**: https://github.com/DFRobot/DFRobot_HumanDetection
- **License**: MIT

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `dfrobot_human_detection_init` | Statement | VAR(field_input), SERIAL(field_dropdown) | `dfrobot_human_detection_init(VAR, SERIAL)` | Dynamic code |
| `dfrobot_human_detection_read` | Value | VAR(field_variable), DATA(field_dropdown) | `dfrobot_human_detection_read(VAR, DATA)` | Dynamic code |
| `dfrobot_human_detection_action` | Statement | VAR(field_variable), ACTION(field_dropdown) | `dfrobot_human_detection_action(VAR, ACTION)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| dfrobot_human_detection_init.SERIAL | board-provided options | Selects the generated API option. |
| dfrobot_human_detection_read.DATA | presence, movement, range, distance, heart_rate, breathing, mode | Selects the generated API option. |
| dfrobot_human_detection_action.ACTION | sleep_mode, fall_mode | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    dfrobot_human_detection_init("human")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

# DFRobot ENS160

Blocks for the ENS160 digital air-quality sensor.

## Library Info
- **Name**: @aily-project/lib-dfrobot-ens160
- **Version**: 0.1.0
- **Author**: DFRobot
- **Source**: https://github.com/DFRobot/DFRobot_ENS160
- **License**: MIT

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `dfrobot_ens160_init` | Statement | VAR(field_input), WIRE(field_dropdown), ADDR(field_dropdown) | `dfrobot_ens160_init(VAR, WIRE, ADDR)` | Dynamic code |
| `dfrobot_ens160_read` | Value | VAR(field_variable), DATA(field_dropdown) | `dfrobot_ens160_read(VAR, DATA)` | Dynamic code |
| `dfrobot_ens160_action` | Statement | VAR(field_variable), ACTION(field_dropdown) | `dfrobot_ens160_action(VAR, ACTION)` | Dynamic code |
| `dfrobot_ens160_adjust` | Statement | VAR(field_variable), VALUE1(input_value), VALUE2(input_value) | `dfrobot_ens160_adjust(VAR, VALUE1, VALUE2)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| dfrobot_ens160_init.WIRE | board-provided options | Selects the generated API option. |
| dfrobot_ens160_init.ADDR | 0x53, 0x52 | Selects the generated API option. |
| dfrobot_ens160_read.DATA | aqi, tvoc, eco2, status | Selects the generated API option. |
| dfrobot_ens160_action.ACTION | standard, idle, sleep | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    dfrobot_ens160_init("ens160")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

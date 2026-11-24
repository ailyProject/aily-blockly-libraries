# DFRobot ENS160

Blocks for the ENS160 digital air-quality sensor.

## Library Info
- **Name**: @aily-project/lib-dfrobot-ens160
- **Version**: 0.1.1
- **Author**: DFRobot
- **Source**: https://github.com/DFRobot/DFRobot_ENS160
- **License**: MIT

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `dfrobot_ens160_init` | Statement | VAR(field_input), WIRE(dropdown), ADDR(dropdown) | `dfrobot_ens160_init("ens160", WIRE, "0x53")` | `DFRobot_ENS160_I2C ens160(&WIRE, 0x53); ↵ WIRE.begin(); ↵ while ((ens160.begin()) != 0) { delay(100); } ↵ ens160.setPWRMode(ENS160_STANDARD_MODE);` |
| `dfrobot_ens160_read` | Value | VAR(field_variable), DATA(dropdown) | `dfrobot_ens160_read($ens160, aqi)` | `ens160.getAQI()` |
| `dfrobot_ens160_action` | Statement | VAR(field_variable), ACTION(dropdown) | `dfrobot_ens160_action($ens160, standard)` | `ens160.setPWRMode(ENS160_STANDARD_MODE);` |
| `dfrobot_ens160_adjust` | Statement | VAR(field_variable), VALUE1(input_value), VALUE2(input_value) | `dfrobot_ens160_adjust($ens160, VALUE1, VALUE2)` | `ens160.setTempAndHum(1, 1);` |

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
    dfrobot_ens160_init("ens160", WIRE, "0x53")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

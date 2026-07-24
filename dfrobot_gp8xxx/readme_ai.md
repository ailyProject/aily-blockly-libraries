# DFRobot GP8XXX

Blocks for the DFRobot GP8XXX family of I2C DAC voltage and current output modules.

## Library Info
- **Name**: @aily-project/lib-dfrobot-gp8xxx
- **Version**: 0.1.0
- **Author**: DFRobot
- **Source**: https://github.com/DFRobot/DFRobot_GP8XXX
- **License**: MIT

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `dfrobot_gp8xxx_init` | Statement | VAR(field_input), WIRE(field_dropdown), MODEL(field_dropdown), ADDR(field_dropdown) | `dfrobot_gp8xxx_init(VAR, WIRE, MODEL, ADDR)` | Dynamic code |
| `dfrobot_gp8xxx_action` | Statement | VAR(field_variable), ACTION(field_dropdown) | `dfrobot_gp8xxx_action(VAR, ACTION)` | Dynamic code |
| `dfrobot_gp8xxx_set` | Statement | VAR(field_variable), SETTING(field_dropdown), VALUE(input_value) | `dfrobot_gp8xxx_set(VAR, SETTING, VALUE)` | Dynamic code |
| `dfrobot_gp8xxx_write` | Statement | VAR(field_variable), INDEX(input_value), VALUE(input_value) | `dfrobot_gp8xxx_write(VAR, INDEX, VALUE)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| dfrobot_gp8xxx_init.WIRE | board-provided options | Selects the generated API option. |
| dfrobot_gp8xxx_init.MODEL | 12, 15, 16 | Selects the generated API option. |
| dfrobot_gp8xxx_init.ADDR | 0x58, 0x59 | Selects the generated API option. |
| dfrobot_gp8xxx_action.ACTION | store | Selects the generated API option. |
| dfrobot_gp8xxx_set.SETTING | range | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    dfrobot_gp8xxx_init("gp8xxx")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

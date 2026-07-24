# DFRobot SCD4X

Blocks for the SCD40/SCD41 photoacoustic CO2, temperature and humidity sensor.

## Library Info
- **Name**: @aily-project/lib-dfrobot-scd4x
- **Version**: 0.1.0
- **Author**: DFRobot
- **Source**: https://github.com/DFRobot/DFRobot_SCD4X
- **License**: MIT

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `dfrobot_scd4x_init` | Statement | VAR(field_input), WIRE(field_dropdown), ADDR(field_dropdown) | `dfrobot_scd4x_init(VAR, WIRE, ADDR)` | Dynamic code |
| `dfrobot_scd4x_read` | Value | VAR(field_variable), DATA(field_dropdown) | `dfrobot_scd4x_read(VAR, DATA)` | Dynamic code |
| `dfrobot_scd4x_action` | Statement | VAR(field_variable), ACTION(field_dropdown) | `dfrobot_scd4x_action(VAR, ACTION)` | Dynamic code |
| `dfrobot_scd4x_set` | Statement | VAR(field_variable), SETTING(field_dropdown), VALUE(input_value) | `dfrobot_scd4x_set(VAR, SETTING, VALUE)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| dfrobot_scd4x_init.WIRE | board-provided options | Selects the generated API option. |
| dfrobot_scd4x_init.ADDR | 0x62 | Selects the generated API option. |
| dfrobot_scd4x_read.DATA | co2, temperature, humidity, ready | Selects the generated API option. |
| dfrobot_scd4x_action.ACTION | start, low_power, stop, persist, reset | Selects the generated API option. |
| dfrobot_scd4x_set.SETTING | temperature_offset, altitude, pressure, auto_calibration | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    dfrobot_scd4x_init("scd4x")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

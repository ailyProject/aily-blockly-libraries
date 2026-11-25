# DFRobot SCD4X

Blocks for the SCD40/SCD41 photoacoustic CO2, temperature and humidity sensor.

## Library Info
- **Name**: @aily-project/lib-dfrobot-scd4x
- **Version**: 0.1.1
- **Author**: DFRobot
- **Source**: https://github.com/DFRobot/DFRobot_SCD4X
- **License**: MIT

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `dfrobot_scd4x_init` | Statement | VAR(field_input), WIRE(dropdown), ADDR(dropdown) | `dfrobot_scd4x_init("scd4x", WIRE, "0x62")` | `DFRobot_SCD4X scd4x(&WIRE, 0x62); ↵ DFRobot_SCD4X::sSensorMeasurement_t scd4xData; ↵ WIRE.begin(); ↵ while (!(scd4x.begin())) { delay(100); } ↵ scd4x.enablePeriodMeasure(SCD4X_START_PERIODIC_MEASURE);` |
| `dfrobot_scd4x_read` | Value | VAR(field_variable), DATA(dropdown) | `dfrobot_scd4x_read($scd4x, co2)` | `(ailyScd4xRefresh_scd4x(), scd4xData.CO2ppm)` |
| `dfrobot_scd4x_action` | Statement | VAR(field_variable), ACTION(dropdown) | `dfrobot_scd4x_action($scd4x, start)` | `scd4x.enablePeriodMeasure(SCD4X_START_PERIODIC_MEASURE);` |
| `dfrobot_scd4x_set` | Statement | VAR(field_variable), SETTING(dropdown), VALUE(input_value) | `dfrobot_scd4x_set($scd4x, temperature_offset, math_number(0))` | `scd4x.setTempComp((float)1);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| dfrobot_scd4x_init.WIRE | board-provided options | Selects the generated API option. |
| dfrobot_scd4x_init.ADDR | 0x62 | Selects the generated API option. |
| dfrobot_scd4x_read.DATA | co2, temperature, humidity, ready | Measurement fields share the latest tuple. Ready checks for an unread sample. |
| dfrobot_scd4x_action.ACTION | start, low_power, stop, persist, reset | Selects the generated API option. |
| dfrobot_scd4x_set.SETTING | temperature_offset, altitude, pressure, auto_calibration | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    dfrobot_scd4x_init("scd4x", WIRE, "0x62")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

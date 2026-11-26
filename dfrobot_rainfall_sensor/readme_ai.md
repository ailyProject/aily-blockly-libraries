# DFRobot Rainfall Sensor

Blocks for the DFRobot tipping-bucket rainfall sensor using its universal I2C interface.

## Library Info
- **Name**: @aily-project/lib-dfrobot-rainfall-sensor
- **Version**: 0.1.1
- **Author**: DFRobot
- **Source**: https://github.com/DFRobot/DFRobot_RainfallSensor
- **License**: MIT

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `dfrobot_rainfall_sensor_init` | Statement | VAR(field_input), WIRE(dropdown) | `dfrobot_rainfall_sensor_init(VAR, WIRE)` | `DFRobot_RainfallSensor_I2C rainfall(&WIRE); ↵ WIRE.begin(); ↵ while (!(rainfall.begin())) { delay(100); }` |
| `dfrobot_rainfall_sensor_read` | Value | VAR(field_variable), DATA(dropdown), INDEX(input_value) | `dfrobot_rainfall_sensor_read($rainfall, period, math_number(0))` | `rainfall.getRainfall((uint8_t)constrain((int)1, 1, 24))` |
| `dfrobot_rainfall_sensor_set` | Statement | VAR(field_variable), SETTING(dropdown), VALUE(input_value) | `dfrobot_rainfall_sensor_set($rainfall, bucket, math_number(0))` | `rainfall.setRainAccumulatedValue((float)1);` |

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
    dfrobot_rainfall_sensor_init("rainfall", WIRE)
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

## I²C status and recovery

The initialization block calls `begin()` once during setup. A missing sensor allows the remaining setup and loop to run. Coder can call `begin()` again to check the product and vendor IDs. In I²C mode, calibration returns zero on success and a nonzero status on a rejected write. The period reading returns –1 on a failed window selection or incomplete response. Total rainfall, tip count and working time keep their original zero fallback, which also represents a valid dry or newly powered sensor. Use `begin()` to check presence. The selector accepts 1–24 hours in Blockly.

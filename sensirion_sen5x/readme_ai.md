# Sensirion SEN5x

Cross-controller Wire blocks for SEN50/SEN54/SEN55 particulate, humidity, temperature, VOC and NOx sensors.

## Library Info
- **Name**: @aily-project/lib-sensirion-sen5x
- **Version**: 0.1.1
- **Author**: Sensirion / Aily Project
- **Source**: https://github.com/Sensirion/arduino-i2c-sen5x
- **License**: MIT

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sensirion_sen5x_init` | Statement | VAR(field_input), WIRE(dropdown) | `sensirion_sen5x_init(VAR, WIRE)` | `AilySEN5X sen5x(&WIRE); ↵ WIRE.begin(); ↵ sen5x.ensureMeasurementSession();` |
| `sensirion_sen5x_read` | Value | VAR(field_variable), DATA(dropdown) | `sensirion_sen5x_read($sen5x, pm1)` | `(sen5x.ensureMeasurementSession() && sen5x.read() ? sen5x.pm1() : NAN)` |
| `sensirion_sen5x_action` | Statement | VAR(field_variable), ACTION(dropdown) | `sensirion_sen5x_action($sen5x, start)` | `if (sen5x.ensureMeasurementSession()) { sen5x.startMeasurement(); }` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| sensirion_sen5x_init.WIRE | board-provided options | Selects the generated API option. |
| sensirion_sen5x_read.DATA | pm1, pm25, pm4, pm10, humidity, temperature, voc, nox, ready | Selects the generated API option. |
| sensirion_sen5x_action.ACTION | start, stop, clean, reset | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    sensirion_sen5x_init("sen5x", WIRE)
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

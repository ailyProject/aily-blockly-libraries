# Sensirion SEN5x

Cross-controller Wire blocks for SEN50/SEN54/SEN55 particulate, humidity, temperature, VOC and NOx sensors.

## Library Info
- **Name**: @aily-project/lib-sensirion-sen5x
- **Version**: 0.1.0
- **Author**: Sensirion / Aily Project
- **Source**: https://github.com/Sensirion/arduino-i2c-sen5x
- **License**: MIT

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sensirion_sen5x_init` | Statement | VAR(field_input), WIRE(field_dropdown) | `sensirion_sen5x_init(VAR, WIRE)` | Dynamic code |
| `sensirion_sen5x_read` | Value | VAR(field_variable), DATA(field_dropdown) | `sensirion_sen5x_read(VAR, DATA)` | Dynamic code |
| `sensirion_sen5x_action` | Statement | VAR(field_variable), ACTION(field_dropdown) | `sensirion_sen5x_action(VAR, ACTION)` | Dynamic code |

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
    sensirion_sen5x_init("sen5x")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

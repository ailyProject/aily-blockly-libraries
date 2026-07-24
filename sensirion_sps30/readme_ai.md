# Sensirion SPS30

Cross-controller Wire blocks for the Sensirion SPS30 particulate matter sensor.

## Library Info
- **Name**: @aily-project/lib-sensirion-sps30
- **Version**: 0.1.0
- **Author**: Sensirion / Aily Project
- **Source**: https://github.com/Sensirion/arduino-sps
- **License**: MIT

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sensirion_sps30_init` | Statement | VAR(field_input), WIRE(field_dropdown) | `sensirion_sps30_init(VAR, WIRE)` | Dynamic code |
| `sensirion_sps30_read` | Value | VAR(field_variable), DATA(field_dropdown) | `sensirion_sps30_read(VAR, DATA)` | Dynamic code |
| `sensirion_sps30_action` | Statement | VAR(field_variable), ACTION(field_dropdown) | `sensirion_sps30_action(VAR, ACTION)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| sensirion_sps30_init.WIRE | board-provided options | Selects the generated API option. |
| sensirion_sps30_read.DATA | pm1, pm25, pm4, pm10, typical_size, ready | Selects the generated API option. |
| sensirion_sps30_action.ACTION | start, stop, clean, sleep, wake, reset | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    sensirion_sps30_init("sps30")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

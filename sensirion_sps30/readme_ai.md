# Sensirion SPS30

Cross-controller Wire blocks for the Sensirion SPS30 particulate matter sensor.

## Library Info
- **Name**: @aily-project/lib-sensirion-sps30
- **Version**: 0.1.1
- **Author**: Sensirion / Aily Project
- **Source**: https://github.com/Sensirion/arduino-sps
- **License**: MIT

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sensirion_sps30_init` | Statement | VAR(field_input), WIRE(dropdown) | `sensirion_sps30_init(VAR, WIRE)` | `AilySPS30 sps30(&WIRE); ↵ WIRE.begin(); ↵ while (!(sps30.begin())) { delay(100); } ↵ sps30.startMeasurement();` |
| `sensirion_sps30_read` | Value | VAR(field_variable), DATA(dropdown) | `sensirion_sps30_read($sps30, pm1)` | `(sps30.read(), sps30.pm1())` |
| `sensirion_sps30_action` | Statement | VAR(field_variable), ACTION(dropdown) | `sensirion_sps30_action($sps30, start)` | `sps30.startMeasurement();` |

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
    sensirion_sps30_init("sps30", WIRE)
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

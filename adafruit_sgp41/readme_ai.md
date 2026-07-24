# Adafruit SGP41

Blocks for the Sensirion SGP41 VOC and NOx gas sensor.

## Library Info
- **Name**: @aily-project/lib-adafruit-sgp41
- **Version**: 0.1.0
- **Author**: Adafruit
- **Source**: https://github.com/adafruit/Adafruit_SGP41
- **License**: BSD-3-Clause

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adafruit_sgp41_init` | Statement | VAR(field_input), WIRE(field_dropdown) | `adafruit_sgp41_init(VAR, WIRE)` | Dynamic code |
| `adafruit_sgp41_read` | Value | VAR(field_variable), DATA(field_dropdown) | `adafruit_sgp41_read(VAR, DATA)` | Dynamic code |
| `adafruit_sgp41_action` | Statement | VAR(field_variable), ACTION(field_dropdown) | `adafruit_sgp41_action(VAR, ACTION)` | Dynamic code |
| `adafruit_sgp41_adjust` | Statement | VAR(field_variable), VALUE1(input_value), VALUE2(input_value) | `adafruit_sgp41_adjust(VAR, VALUE1, VALUE2)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| adafruit_sgp41_init.WIRE | board-provided options | Selects the generated API option. |
| adafruit_sgp41_read.DATA | voc_raw, nox_raw, self_test | Selects the generated API option. |
| adafruit_sgp41_action.ACTION | conditioning, reset, heater_off | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    adafruit_sgp41_init("sgp41")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

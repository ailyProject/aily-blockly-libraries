# Adafruit SGP40

Blocks for the Sensirion SGP40 VOC gas sensor with humidity and temperature compensation.

## Library Info
- **Name**: @aily-project/lib-adafruit-sgp40
- **Version**: 0.1.0
- **Author**: Adafruit
- **Source**: https://github.com/adafruit/Adafruit_SGP40
- **License**: BSD-3-Clause

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adafruit_sgp40_init` | Statement | VAR(field_input), WIRE(field_dropdown) | `adafruit_sgp40_init(VAR, WIRE)` | Dynamic code |
| `adafruit_sgp40_read` | Value | VAR(field_variable), DATA(field_dropdown) | `adafruit_sgp40_read(VAR, DATA)` | Dynamic code |
| `adafruit_sgp40_measure` | Value | VAR(field_variable), VALUE1(input_value), VALUE2(input_value) | `adafruit_sgp40_measure(VAR, VALUE1, VALUE2)` | Dynamic code |
| `adafruit_sgp40_action` | Statement | VAR(field_variable), ACTION(field_dropdown) | `adafruit_sgp40_action(VAR, ACTION)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| adafruit_sgp40_init.WIRE | board-provided options | Selects the generated API option. |
| adafruit_sgp40_read.DATA | raw, voc_index, self_test | Selects the generated API option. |
| adafruit_sgp40_action.ACTION | reset, heater_off | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    adafruit_sgp40_init("sgp40")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

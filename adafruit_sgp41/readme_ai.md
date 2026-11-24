# Adafruit SGP41

Blocks for the Sensirion SGP41 VOC and NOx gas sensor.

## Library Info
- **Name**: @aily-project/lib-adafruit-sgp41
- **Version**: 0.1.2
- **Author**: Adafruit
- **Source**: https://github.com/adafruit/Adafruit_SGP41
- **License**: BSD-3-Clause

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adafruit_sgp41_init` | Statement | VAR(field_input), WIRE(dropdown) | `adafruit_sgp41_init(VAR, WIRE)` | `Adafruit_SGP41 sgp41; ↵ uint16_t sgp41VocRaw = 0; ↵ uint16_t sgp41NoxRaw = 0; ↵ WIRE.begin(); ↵ while (!(sgp41.begin(SGP41_DEFAULT_ADDR, &WIRE))) { delay(100); }` |
| `adafruit_sgp41_read` | Value | VAR(field_variable), DATA(dropdown) | `adafruit_sgp41_read($sgp41, voc_raw)` | `(sgp41.measureRawSignals(&sgp41VocRaw, &sgp41NoxRaw), sgp41VocRaw)` |
| `adafruit_sgp41_action` | Statement | VAR(field_variable), ACTION(dropdown) | `adafruit_sgp41_action($sgp41, conditioning)` | `sgp41.executeConditioning(&sgp41VocRaw);` |
| `adafruit_sgp41_adjust` | Statement | VAR(field_variable), VALUE1(input_value), VALUE2(input_value) | `adafruit_sgp41_adjust($sgp41, VALUE1, VALUE2)` | `sgp41.measureRawSignals(&sgp41VocRaw, &sgp41NoxRaw, 1, 1);` |

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
    adafruit_sgp41_init("sgp41", WIRE)
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

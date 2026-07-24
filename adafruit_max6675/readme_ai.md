# Adafruit MAX6675

Blocks for the MAX6675 K-type thermocouple-to-digital converter.

## Library Info
- **Name**: @aily-project/lib-adafruit-max6675
- **Version**: 0.1.0
- **Author**: Adafruit
- **Source**: https://github.com/adafruit/MAX6675-library
- **License**: MIT

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adafruit_max6675_init` | Statement | VAR(field_input), SCLK(field_dropdown), CS(field_dropdown), MISO(field_dropdown) | `adafruit_max6675_init(VAR, SCLK, CS, MISO)` | Dynamic code |
| `adafruit_max6675_read` | Value | VAR(field_variable), DATA(field_dropdown) | `adafruit_max6675_read(VAR, DATA)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| adafruit_max6675_init.SCLK | board-provided options | Selects the generated API option. |
| adafruit_max6675_init.CS | board-provided options | Selects the generated API option. |
| adafruit_max6675_init.MISO | board-provided options | Selects the generated API option. |
| adafruit_max6675_read.DATA | celsius, fahrenheit | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    adafruit_max6675_init("max6675")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

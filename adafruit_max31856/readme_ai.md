# Adafruit MAX31856

Blocks for the MAX31856 precision universal thermocouple-to-digital converter.

## Library Info
- **Name**: @aily-project/lib-adafruit-max31856
- **Version**: 0.1.0
- **Author**: Adafruit
- **Source**: https://github.com/adafruit/Adafruit_MAX31856
- **License**: BSD-3-Clause

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adafruit_max31856_init` | Statement | VAR(field_input), CS(field_dropdown) | `adafruit_max31856_init(VAR, CS)` | Dynamic code |
| `adafruit_max31856_read` | Value | VAR(field_variable), DATA(field_dropdown) | `adafruit_max31856_read(VAR, DATA)` | Dynamic code |
| `adafruit_max31856_set` | Statement | VAR(field_variable), SETTING(field_dropdown), VALUE(input_value) | `adafruit_max31856_set(VAR, SETTING, VALUE)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| adafruit_max31856_init.CS | board-provided options | Selects the generated API option. |
| adafruit_max31856_read.DATA | thermocouple, cold_junction, fault | Selects the generated API option. |
| adafruit_max31856_set.SETTING | type, mode | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    adafruit_max31856_init("max31856")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

# Adafruit MAX31856

Blocks for the MAX31856 precision universal thermocouple-to-digital converter.

## Library Info
- **Name**: @aily-project/lib-adafruit-max31856
- **Version**: 0.1.1
- **Author**: Adafruit
- **Source**: https://github.com/adafruit/Adafruit_MAX31856
- **License**: BSD-3-Clause

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adafruit_max31856_init` | Statement | VAR(field_input), CS(dropdown) | `adafruit_max31856_init(VAR, CS)` | `Adafruit_MAX31856 max31856(CS, &SPI); ↵ while (!(max31856.begin())) { delay(100); } ↵ max31856.setThermocoupleType(MAX31856_TCTYPE_K); ↵ max31856.setConversionMode(MAX31856_CONTINUOUS);` |
| `adafruit_max31856_read` | Value | VAR(field_variable), DATA(dropdown) | `adafruit_max31856_read($max31856, thermocouple)` | `max31856.readThermocoupleTemperature()` |
| `adafruit_max31856_set` | Statement | VAR(field_variable), SETTING(dropdown), VALUE(input_value) | `adafruit_max31856_set($max31856, type, math_number(0))` | `max31856.setThermocoupleType((max31856_thermocoupletype_t)constrain((int)1, 0, 7));` |

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
    adafruit_max31856_init("max31856", CS)
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

Cold-junction readings use the signed CJTH/CJTL register pair. For example, a raw value of 0xF600 represents −10 °C.

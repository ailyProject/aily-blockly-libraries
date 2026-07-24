# Adafruit ADS122C04

Blocks for the ADS122C04 24-bit delta-sigma I2C ADC.

## Library Info
- **Name**: @aily-project/lib-adafruit-ads122c04
- **Version**: 0.1.0
- **Author**: Adafruit
- **Source**: https://github.com/adafruit/Adafruit_ADS122C04
- **License**: BSD-3-Clause

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adafruit_ads122c04_init` | Statement | VAR(field_input), WIRE(field_dropdown), ADDR(field_dropdown) | `adafruit_ads122c04_init(VAR, WIRE, ADDR)` | Dynamic code |
| `adafruit_ads122c04_read` | Value | VAR(field_variable), DATA(field_dropdown) | `adafruit_ads122c04_read(VAR, DATA)` | Dynamic code |
| `adafruit_ads122c04_action` | Statement | VAR(field_variable), ACTION(field_dropdown) | `adafruit_ads122c04_action(VAR, ACTION)` | Dynamic code |
| `adafruit_ads122c04_set` | Statement | VAR(field_variable), SETTING(field_dropdown), VALUE(input_value) | `adafruit_ads122c04_set(VAR, SETTING, VALUE)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| adafruit_ads122c04_init.WIRE | board-provided options | Selects the generated API option. |
| adafruit_ads122c04_init.ADDR | 0x40, 0x41, 0x44, 0x45 | Selects the generated API option. |
| adafruit_ads122c04_read.DATA | raw, voltage, temperature, ready | Selects the generated API option. |
| adafruit_ads122c04_action.ACTION | start, powerdown, reset | Selects the generated API option. |
| adafruit_ads122c04_set.SETTING | gain, rate, continuous | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    adafruit_ads122c04_init("ads122c04")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

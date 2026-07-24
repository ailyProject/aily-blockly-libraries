# Adafruit PCF8574

Blocks for the PCF8574 quasi-bidirectional 8-bit I2C GPIO expander.

## Library Info
- **Name**: @aily-project/lib-adafruit-pcf8574
- **Version**: 0.1.0
- **Author**: Adafruit
- **Source**: https://github.com/adafruit/Adafruit_PCF8574
- **License**: BSD-3-Clause

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adafruit_pcf8574_init` | Statement | VAR(field_input), WIRE(field_dropdown), ADDR(field_dropdown) | `adafruit_pcf8574_init(VAR, WIRE, ADDR)` | Dynamic code |
| `adafruit_pcf8574_read` | Value | VAR(field_variable), DATA(field_dropdown), INDEX(input_value) | `adafruit_pcf8574_read(VAR, DATA, INDEX)` | Dynamic code |
| `adafruit_pcf8574_action` | Statement | VAR(field_variable), ACTION(field_dropdown) | `adafruit_pcf8574_action(VAR, ACTION)` | Dynamic code |
| `adafruit_pcf8574_write` | Statement | VAR(field_variable), INDEX(input_value), VALUE(input_value) | `adafruit_pcf8574_write(VAR, INDEX, VALUE)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| adafruit_pcf8574_init.WIRE | board-provided options | Selects the generated API option. |
| adafruit_pcf8574_init.ADDR | 0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27 | Selects the generated API option. |
| adafruit_pcf8574_read.DATA | pin, all | Selects the generated API option. |
| adafruit_pcf8574_action.ACTION | all_low, all_high | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    adafruit_pcf8574_init("pcf8574")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

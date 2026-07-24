# Adafruit MCP4725

Blocks for the MCP4725 single-channel 12-bit I2C DAC.

## Library Info
- **Name**: @aily-project/lib-adafruit-mcp4725
- **Version**: 0.1.0
- **Author**: Adafruit
- **Source**: https://github.com/adafruit/Adafruit_MCP4725
- **License**: BSD-3-Clause

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adafruit_mcp4725_init` | Statement | VAR(field_input), WIRE(field_dropdown), ADDR(field_dropdown) | `adafruit_mcp4725_init(VAR, WIRE, ADDR)` | Dynamic code |
| `adafruit_mcp4725_set` | Statement | VAR(field_variable), SETTING(field_dropdown), VALUE(input_value) | `adafruit_mcp4725_set(VAR, SETTING, VALUE)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| adafruit_mcp4725_init.WIRE | board-provided options | Selects the generated API option. |
| adafruit_mcp4725_init.ADDR | 0x60, 0x61 | Selects the generated API option. |
| adafruit_mcp4725_set.SETTING | volatile, eeprom | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    adafruit_mcp4725_init("mcp4725")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

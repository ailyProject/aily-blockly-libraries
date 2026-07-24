# Adafruit MCP9600

Blocks for the MCP9600/MCP9601 I2C thermocouple EMF converter.

## Library Info
- **Name**: @aily-project/lib-adafruit-mcp9600
- **Version**: 0.1.0
- **Author**: Adafruit
- **Source**: https://github.com/adafruit/Adafruit_MCP9600
- **License**: BSD-3-Clause

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adafruit_mcp9600_init` | Statement | VAR(field_input), WIRE(field_dropdown), ADDR(field_dropdown) | `adafruit_mcp9600_init(VAR, WIRE, ADDR)` | Dynamic code |
| `adafruit_mcp9600_read` | Value | VAR(field_variable), DATA(field_dropdown) | `adafruit_mcp9600_read(VAR, DATA)` | Dynamic code |
| `adafruit_mcp9600_action` | Statement | VAR(field_variable), ACTION(field_dropdown) | `adafruit_mcp9600_action(VAR, ACTION)` | Dynamic code |
| `adafruit_mcp9600_set` | Statement | VAR(field_variable), SETTING(field_dropdown), VALUE(input_value) | `adafruit_mcp9600_set(VAR, SETTING, VALUE)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| adafruit_mcp9600_init.WIRE | board-provided options | Selects the generated API option. |
| adafruit_mcp9600_init.ADDR | 0x67, 0x60, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66 | Selects the generated API option. |
| adafruit_mcp9600_read.DATA | thermocouple, ambient, adc, status | Selects the generated API option. |
| adafruit_mcp9600_action.ACTION | enable, disable | Selects the generated API option. |
| adafruit_mcp9600_set.SETTING | type, filter | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    adafruit_mcp9600_init("mcp9600")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

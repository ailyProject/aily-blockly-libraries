# Adafruit MCP23X17

Blocks for MCP23017 I2C and MCP23S17 SPI 16-bit GPIO expanders; this package exposes the portable I2C path.

## Library Info
- **Name**: @aily-project/lib-adafruit-mcp23x17
- **Version**: 0.1.0
- **Author**: Adafruit
- **Source**: https://github.com/adafruit/Adafruit-MCP23017-Arduino-Library
- **License**: BSD-3-Clause

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adafruit_mcp23x17_init` | Statement | VAR(field_input), WIRE(field_dropdown), ADDR(field_dropdown) | `adafruit_mcp23x17_init(VAR, WIRE, ADDR)` | Dynamic code |
| `adafruit_mcp23x17_read` | Value | VAR(field_variable), DATA(field_dropdown), INDEX(input_value) | `adafruit_mcp23x17_read(VAR, DATA, INDEX)` | Dynamic code |
| `adafruit_mcp23x17_action` | Statement | VAR(field_variable), ACTION(field_dropdown) | `adafruit_mcp23x17_action(VAR, ACTION)` | Dynamic code |
| `adafruit_mcp23x17_write` | Statement | VAR(field_variable), INDEX(input_value), VALUE(input_value) | `adafruit_mcp23x17_write(VAR, INDEX, VALUE)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| adafruit_mcp23x17_init.WIRE | board-provided options | Selects the generated API option. |
| adafruit_mcp23x17_init.ADDR | 0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27 | Selects the generated API option. |
| adafruit_mcp23x17_read.DATA | pin, all | Selects the generated API option. |
| adafruit_mcp23x17_action.ACTION | clear | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    adafruit_mcp23x17_init("mcp23x17")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

# Adafruit INA260

Blocks for the INA260 integrated-shunt current, voltage and power monitor.

## Library Info
- **Name**: @aily-project/lib-adafruit-ina260
- **Version**: 0.1.0
- **Author**: Adafruit
- **Source**: https://github.com/adafruit/Adafruit_INA260
- **License**: BSD-3-Clause

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adafruit_ina260_init` | Statement | VAR(field_input), WIRE(field_dropdown), ADDR(field_dropdown) | `adafruit_ina260_init(VAR, WIRE, ADDR)` | Dynamic code |
| `adafruit_ina260_read` | Value | VAR(field_variable), DATA(field_dropdown) | `adafruit_ina260_read(VAR, DATA)` | Dynamic code |
| `adafruit_ina260_action` | Statement | VAR(field_variable), ACTION(field_dropdown) | `adafruit_ina260_action(VAR, ACTION)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| adafruit_ina260_init.WIRE | board-provided options | Selects the generated API option. |
| adafruit_ina260_init.ADDR | 0x40, 0x41, 0x44, 0x45 | Selects the generated API option. |
| adafruit_ina260_read.DATA | current, voltage, power | Selects the generated API option. |
| adafruit_ina260_action.ACTION | reset | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    adafruit_ina260_init("ina260")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

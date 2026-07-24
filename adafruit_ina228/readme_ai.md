# Adafruit INA228

Blocks for the INA228 high-precision current, voltage, power, energy and charge monitor.

## Library Info
- **Name**: @aily-project/lib-adafruit-ina228
- **Version**: 0.1.0
- **Author**: Adafruit
- **Source**: https://github.com/adafruit/Adafruit_INA228
- **License**: BSD-3-Clause

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adafruit_ina228_init` | Statement | VAR(field_input), WIRE(field_dropdown), ADDR(field_dropdown) | `adafruit_ina228_init(VAR, WIRE, ADDR)` | Dynamic code |
| `adafruit_ina228_read` | Value | VAR(field_variable), DATA(field_dropdown) | `adafruit_ina228_read(VAR, DATA)` | Dynamic code |
| `adafruit_ina228_adjust` | Statement | VAR(field_variable), VALUE1(input_value), VALUE2(input_value) | `adafruit_ina228_adjust(VAR, VALUE1, VALUE2)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| adafruit_ina228_init.WIRE | board-provided options | Selects the generated API option. |
| adafruit_ina228_init.ADDR | 0x40, 0x41, 0x44, 0x45 | Selects the generated API option. |
| adafruit_ina228_read.DATA | bus_voltage, shunt_voltage, current, power, energy, charge, temperature, ready | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    adafruit_ina228_init("ina228")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

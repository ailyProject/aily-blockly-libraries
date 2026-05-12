# BH1750 light sensor

BH1750 digital light intensity sensor control library, suitable for Arduino, ESP32 and other development boards. Use the I2C interface to read the light intensity value, convert the ambient light into a digital signal...

## Library Info
- **Name**: @aily-project/lib-bh1750
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bh1750_init_with_wire` | Statement | VAR(field_input), MODE(dropdown), ADDRESS(dropdown), WIRE(dropdown) | `bh1750_init_with_wire("lightMeter", CONTINUOUS_HIGH_RES_MODE, "0x23", WIRE)` | Dynamic code |
| `bh1750_read_light_level` | Value | VAR(field_variable) | `bh1750_read_light_level(variables_get($lightMeter))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | CONTINUOUS_HIGH_RES_MODE, CONTINUOUS_HIGH_RES_MODE_2, CONTINUOUS_LOW_RES_MODE, ONE_TIME_HIGH_RES_MODE, ONE_TIME_HIGH_RES_MODE_2, ONE_TIME_LOW_RES_MODE, UNCONFIGURED | bh1750_init_with_wire |
| ADDRESS | 0x23, 0x5C | bh1750_init_with_wire |

## ABS Examples

### Basic Usage
```
arduino_setup()
    bh1750_init_with_wire("lightMeter", CONTINUOUS_HIGH_RES_MODE, "0x23", WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, bh1750_read_light_level(variables_get($lightMeter)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `bh1750_init_with_wire("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Dynamic fields**: `bh1750_init_with_wire` may add fields at runtime through Blockly extensions.

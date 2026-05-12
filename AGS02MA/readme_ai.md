# AGS02MA TVOC sensor

AGS02MA TVOC gas sensor control library is suitable for development boards such as Arduino and ESP32. It uses the I2C interface to read TVOC concentration and output a digital quantity in PPB units.

## Library Info
- **Name**: @aily-project/lib-ags02ma
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ags02ma_init` | Statement | WIRE(dropdown) | `ags02ma_init(WIRE)` | Dynamic code |
| `ags02ma_read_tvoc_ppb` | Value | (none) | `ags02ma_read_tvoc_ppb()` | ags02ma.readPPB() |
| `ags02ma_read_tvoc_ugm3` | Value | (none) | `ags02ma_read_tvoc_ugm3()` | ags02ma_read_ugm3_converted() |
| `ags02ma_reset` | Statement | (none) | `ags02ma_reset()` | ags02ma.reset();\n |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ags02ma_init(WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ags02ma_read_tvoc_ppb())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **Dynamic fields**: `ags02ma_init` may add fields at runtime through Blockly extensions.

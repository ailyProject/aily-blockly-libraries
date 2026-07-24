# Adafruit TMAG5273

Blocks for the TMAG5273 low-power linear 3D Hall-effect sensor.

## Library Info
- **Name**: @aily-project/lib-adafruit-tmag5273
- **Version**: 0.1.0
- **Author**: Adafruit
- **Source**: https://github.com/adafruit/Adafruit_TMAG5273
- **License**: BSD-3-Clause

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adafruit_tmag5273_init` | Statement | VAR(field_input), WIRE(field_dropdown), ADDR(field_dropdown) | `adafruit_tmag5273_init(VAR, WIRE, ADDR)` | Dynamic code |
| `adafruit_tmag5273_read` | Value | VAR(field_variable), DATA(field_dropdown) | `adafruit_tmag5273_read(VAR, DATA)` | Dynamic code |
| `adafruit_tmag5273_set` | Statement | VAR(field_variable), SETTING(field_dropdown), VALUE(input_value) | `adafruit_tmag5273_set(VAR, SETTING, VALUE)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| adafruit_tmag5273_init.WIRE | board-provided options | Selects the generated API option. |
| adafruit_tmag5273_init.ADDR | 0x35, 0x22 | Selects the generated API option. |
| adafruit_tmag5273_read.DATA | x, y, z, magnitude, angle, temperature | Selects the generated API option. |
| adafruit_tmag5273_set.SETTING | xy_range, z_range, low_noise | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    adafruit_tmag5273_init("tmag5273")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

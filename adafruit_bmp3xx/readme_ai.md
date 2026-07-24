# Adafruit BMP3XX

Blocks for BMP388/BMP390 temperature and barometric pressure sensors.

## Library Info
- **Name**: @aily-project/lib-adafruit-bmp3xx
- **Version**: 0.1.0
- **Author**: Adafruit
- **Source**: https://github.com/adafruit/Adafruit_BMP3XX
- **License**: BSD-3-Clause

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adafruit_bmp3xx_init` | Statement | VAR(field_input), WIRE(field_dropdown), ADDR(field_dropdown) | `adafruit_bmp3xx_init(VAR, WIRE, ADDR)` | Dynamic code |
| `adafruit_bmp3xx_read` | Value | VAR(field_variable), DATA(field_dropdown) | `adafruit_bmp3xx_read(VAR, DATA)` | Dynamic code |
| `adafruit_bmp3xx_set` | Statement | VAR(field_variable), SETTING(field_dropdown), VALUE(input_value) | `adafruit_bmp3xx_set(VAR, SETTING, VALUE)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| adafruit_bmp3xx_init.WIRE | board-provided options | Selects the generated API option. |
| adafruit_bmp3xx_init.ADDR | 0x77, 0x76 | Selects the generated API option. |
| adafruit_bmp3xx_read.DATA | temperature, pressure, altitude | Selects the generated API option. |
| adafruit_bmp3xx_set.SETTING | sea_level, temp_oversampling, pressure_oversampling | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    adafruit_bmp3xx_init("bmp3xx")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

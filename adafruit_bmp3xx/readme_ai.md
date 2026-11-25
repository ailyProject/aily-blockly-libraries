# Adafruit BMP3XX

Blocks for BMP388/BMP390 temperature and barometric pressure sensors.

## Library Info
- **Name**: @aily-project/lib-adafruit-bmp3xx
- **Version**: 0.1.1
- **Author**: Adafruit
- **Source**: https://github.com/adafruit/Adafruit_BMP3XX
- **License**: BSD-3-Clause

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adafruit_bmp3xx_init` | Statement | VAR(field_input), WIRE(dropdown), ADDR(dropdown) | `adafruit_bmp3xx_init("bmp3xx", WIRE, "0x77")` | `Wire.begin(); bmp3xx.beginSensor(0x77, Wire);` |
| `adafruit_bmp3xx_read` | Value | VAR(field_variable), DATA(dropdown) | `adafruit_bmp3xx_read($bmp3xx, temperature)` | `bmp3xx.sampleTemperature()` |
| `adafruit_bmp3xx_set` | Statement | VAR(field_variable), SETTING(dropdown), VALUE(input_value) | `adafruit_bmp3xx_set($bmp3xx, sea_level, math_number(900))` | `bmp3xx.setSeaLevelPressure((float)900);` |

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
    adafruit_bmp3xx_init("bmp3xx", WIRE, "0x77")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.
4. Read blocks return NaN when disconnected. Sea-level pressure is per sensor, in hPa. Its default is 1013.25.

# Adafruit MLX90640

Blocks for the MLX90640 32x24 infrared thermal imaging array.

## Library Info
- **Name**: @aily-project/lib-adafruit-mlx90640
- **Version**: 0.1.0
- **Author**: Adafruit
- **Source**: https://github.com/adafruit/Adafruit_MLX90640
- **License**: BSD-3-Clause

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adafruit_mlx90640_init` | Statement | VAR(field_input), WIRE(field_dropdown), ADDR(field_dropdown) | `adafruit_mlx90640_init(VAR, WIRE, ADDR)` | Dynamic code |
| `adafruit_mlx90640_read` | Value | VAR(field_variable), DATA(field_dropdown), INDEX(input_value) | `adafruit_mlx90640_read(VAR, DATA, INDEX)` | Dynamic code |
| `adafruit_mlx90640_set` | Statement | VAR(field_variable), SETTING(field_dropdown), VALUE(input_value) | `adafruit_mlx90640_set(VAR, SETTING, VALUE)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| adafruit_mlx90640_init.WIRE | board-provided options | Selects the generated API option. |
| adafruit_mlx90640_init.ADDR | 0x33 | Selects the generated API option. |
| adafruit_mlx90640_read.DATA | pixel, ambient | Selects the generated API option. |
| adafruit_mlx90640_set.SETTING | refresh_rate, resolution, mode | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    adafruit_mlx90640_init("mlx90640")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

# MLX90614 infrared temperature measurement library

MLX90614 infrared non-contact temperature sensor driver library, which can measure object and ambient temperature

## Library Info
- **Name**: @aily-project/lib-mlx90614
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mlx90614_begin` | Statement | (none) | `mlx90614_begin()` | Dynamic code |
| `mlx90614_read_object_temp` | Value | UNIT(dropdown) | `mlx90614_read_object_temp(C)` | Dynamic code |
| `mlx90614_read_ambient_temp` | Value | UNIT(dropdown) | `mlx90614_read_ambient_temp(C)` | Dynamic code |
| `mlx90614_read_emissivity` | Value | (none) | `mlx90614_read_emissivity()` | mlx.readEmissivity() |
| `mlx90614_write_emissivity` | Statement | EMISSIVITY(input_value) | `mlx90614_write_emissivity(math_number(0))` | mlx.writeEmissivity( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| UNIT | C, F | mlx90614_read_object_temp, mlx90614_read_ambient_temp |

## ABS Examples

### Basic Usage
```
arduino_setup()
    mlx90614_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, mlx90614_read_object_temp(C))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

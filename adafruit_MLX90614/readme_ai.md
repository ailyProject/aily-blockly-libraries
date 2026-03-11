# MLX90614红外测温库

MLX90614红外非接触式温度传感器驱动库，可测量物体和环境温度

## Library Info
- **Name**: @aily-project/lib-mlx90614
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mlx90614_begin` | Statement | (none) | `mlx90614_begin()` | `` |
| `mlx90614_read_object_temp` | Value | UNIT(dropdown) | `mlx90614_read_object_temp(C)` | (dynamic code) |
| `mlx90614_read_ambient_temp` | Value | UNIT(dropdown) | `mlx90614_read_ambient_temp(C)` | (dynamic code) |
| `mlx90614_read_emissivity` | Value | (none) | `mlx90614_read_emissivity()` | `mlx.readEmissivity()` |
| `mlx90614_write_emissivity` | Statement | EMISSIVITY(input_value) | `mlx90614_write_emissivity(math_number(0))` | `mlx.writeEmissivity(` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| UNIT | C, F | 摄氏度 / 华氏度 |

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

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

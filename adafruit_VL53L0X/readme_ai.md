# VL53L0X激光测距传感器

VL53L0X激光测距传感器驱动库，使用I2C通信，支持毫米级距离检测、测量速度快、抗环境光干扰能力强，体积小巧，兼容多种主流开发板。。

## Library Info
- **Name**: @aily-project/lib-adafruit-vl53l0x
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `vl53l0x_config_i2c` | Statement | WIRE_OPTION(dropdown) | `vl53l0x_config_i2c(WIRE1)` | — |
| `vl53l0x_init_with_wire` | Statement | SENSOR(field_variable), WIRE(dropdown) | `vl53l0x_init_with_wire(variables_get($sensor), WIRE)` | (dynamic code) |
| `vl53l0x_begin` | Statement | SENSOR(field_variable) | `vl53l0x_begin(variables_get($sensor))` | — |
| `vl53l0x_ranging_test` | Statement | SENSOR(field_variable), MEASURE(field_variable) | `vl53l0x_ranging_test(variables_get($sensor), variables_get($measure))` | `// 获取距离数据（单位：毫米）\n` |
| `vl53l0x_check_range_valid` | Value | MEASURE(field_variable) | `vl53l0x_check_range_valid(variables_get($measure))` | (dynamic code) |
| `vl53l0x_get_range_mm` | Value | MEASURE(field_variable) | `vl53l0x_get_range_mm(variables_get($measure))` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| WIRE_OPTION | WIRE1, WIRE2 | Wire1 (SDA:8, SCL:9) / Wire2 (SDA:4, SCL:5) |

## ABS Examples

### Basic Usage
```
arduino_setup()
    vl53l0x_init_with_wire(variables_get($sensor), WIRE)
    vl53l0x_begin(variables_get($sensor))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, vl53l0x_check_range_valid(variables_get($measure)))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

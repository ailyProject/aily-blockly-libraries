# BMM150 三轴磁力计

用于读取BMM150三轴磁力数据和罗盘方向角

## Library Info
- **Name**: @aily-project/lib-seeed-bmm150
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bmm150_init` | Statement | (none) | `bmm150_init()` | `bmm150.initialize()` (in setup) |
| `bmm150_read_x` | Value | (none) | `bmm150_read_x()` | `(bmm150.read_mag_data(), bmm150.mag_data.x)` |
| `bmm150_read_y` | Value | (none) | `bmm150_read_y()` | `(bmm150.read_mag_data(), bmm150.mag_data.y)` |
| `bmm150_read_z` | Value | (none) | `bmm150_read_z()` | `(bmm150.read_mag_data(), bmm150.mag_data.z)` |
| `bmm150_read_heading` | Value | (none) | `bmm150_read_heading()` | `bmm150_getHeading()` |
| `bmm150_set_preset_mode` | Statement | MODE(dropdown) | `bmm150_set_preset_mode(BMM150_PRESETMODE_LOWPOWER)` | `bmm150.set_presetmode(mode);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | BMM150_PRESETMODE_LOWPOWER, BMM150_PRESETMODE_REGULAR, BMM150_PRESETMODE_HIGHACCURACY, BMM150_PRESETMODE_ENHANCED | 低功耗 / 常规 / 高精度 / 增强 |

## ABS Examples

### 读取罗盘方向角
```
arduino_setup()
    bmm150_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_print(Serial, text("Heading: "))
    serial_println(Serial, bmm150_read_heading())
    time_delay(math_number(100))
```

### 读取三轴磁力数据
```
arduino_setup()
    bmm150_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_print(Serial, text("X: "))
    serial_println(Serial, bmm150_read_x())
    serial_print(Serial, text("Y: "))
    serial_println(Serial, bmm150_read_y())
    serial_print(Serial, text("Z: "))
    serial_println(Serial, bmm150_read_z())
    time_delay(math_number(100))
```

## Notes

1. **Initialization**: `bmm150_init` 必须放在 `arduino_setup()` 中
2. **I2C连接**: BMM150使用I2C接口，默认地址为0x13，连接SCL和SDA引脚即可
3. **罗盘方向角**: `bmm150_read_heading` 返回0°~360°，其中0°为北
4. **预设模式**: 默认为低功耗模式，可通过 `bmm150_set_preset_mode` 切换

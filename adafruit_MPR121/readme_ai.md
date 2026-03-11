# MPR121触摸传感器

Adafruit MPR121 12通道电容触摸传感器库，支持I2C通信，触摸检测和阈值设置

## Library Info
- **Name**: @aily-project/lib-adafruit-mpr121
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mpr121_init` | Statement | I2C_ADDR(dropdown) | `mpr121_init(0x5A)` | (dynamic code) |
| `mpr121_init_advanced` | Statement | I2C_ADDR(dropdown), TOUCH_THRESHOLD(field_number), RELEASE_THRESHOLD(field_number) | `mpr121_init_advanced(0x5A, 12, 6)` | (dynamic code) |
| `mpr121_is_touched` | Value | CHANNEL(dropdown) | `mpr121_is_touched(0)` | `(cap.touched() & _BV(` |
| `mpr121_get_touched` | Value | (none) | `mpr121_get_touched()` | `cap.touched()` |
| `mpr121_get_filtered_data` | Value | CHANNEL(dropdown) | `mpr121_get_filtered_data(0)` | `cap.filteredData(` |
| `mpr121_get_baseline_data` | Value | CHANNEL(dropdown) | `mpr121_get_baseline_data(0)` | `cap.baselineData(` |
| `mpr121_set_thresholds` | Statement | TOUCH_THRESHOLD(input_value), RELEASE_THRESHOLD(input_value) | `mpr121_set_thresholds(math_number(0), math_number(0))` | `cap.setThresholds(` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| I2C_ADDR | 0x5A, 0x5B, 0x5C, 0x5D | 0x5A / 0x5B / 0x5C / 0x5D |
| CHANNEL | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 | 0 / 1 / 2 / 3 / 4 / 5 / 6 / 7 / 8 / 9 / 10 / 11 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    mpr121_init(0x5A)
    mpr121_init_advanced(0x5A, 12, 6)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, mpr121_is_touched(0))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

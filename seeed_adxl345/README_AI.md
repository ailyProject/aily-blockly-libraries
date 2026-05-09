# ADXL345 三轴加速度计

三轴加速度计，I2C接口，读取XYZ轴加速度。

## Library Info
- **Name**: @aily-project/lib-seeed-adxl345
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adxl345_init` | Statement | — | `adxl345_init()` | `adxl345_accel.powerOn();` |
| `adxl345_read_axis` | Value | AXIS(dropdown) | `adxl345_read_axis(0)` | `adxl345_getAxis(0)` 返回double(g) |
| `adxl345_read_raw` | Value | AXIS(dropdown) | `adxl345_read_raw(0)` | `adxl345_getRaw(0)` 返回int |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| AXIS | 0(X), 1(Y), 2(Z) | 读取的轴 |

## ABS Examples

```
arduino_setup()
    adxl345_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_print(Serial, text("X: "))
    serial_print(Serial, adxl345_read_axis(0))
    serial_print(Serial, text(" Y: "))
    serial_print(Serial, adxl345_read_axis(1))
    serial_print(Serial, text(" Z: "))
    serial_println(Serial, adxl345_read_axis(2))
    time_delay(math_number(500))
```

## Notes

1. **全局对象**: 使用固定名称 `adxl345_accel`
2. **单位**: read_axis返回g值（重力加速度倍数），read_raw返回整数
3. **轴编号**: 0=X, 1=Y, 2=Z

# AS5600磁性角度传感器库

AS5600/AS5600L磁性旋转角度传感器支持库，支持角度读取、角速度测量、累积位置计算等功能

## Library Info
- **Name**: @aily-project/lib-as5600
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `as5600_init` | Statement | ADDRESS(dropdown), DIR_PIN(dropdown) | `as5600_init(0x36, 255)` | `` |
| `as5600_read_angle` | Value | UNIT(dropdown) | `as5600_read_angle(degrees)` | (dynamic code) |
| `as5600_read_raw_angle` | Value | (none) | `as5600_read_raw_angle()` | `as5600.rawAngle()` |
| `as5600_set_direction` | Statement | DIRECTION(dropdown) | `as5600_set_direction(0)` | `as5600.setDirection(` |
| `as5600_set_offset` | Statement | OFFSET(input_value) | `as5600_set_offset(math_number(0))` | `as5600.setOffset(` |
| `as5600_get_offset` | Value | (none) | `as5600_get_offset()` | `as5600.getOffset()` |
| `as5600_detect_magnet` | Value | (none) | `as5600_detect_magnet()` | `as5600.detectMagnet()` |
| `as5600_magnet_status` | Value | STATUS(dropdown) | `as5600_magnet_status(strong)` | (dynamic code) |
| `as5600_read_magnitude` | Value | (none) | `as5600_read_magnitude()` | `as5600.readMagnitude()` |
| `as5600_read_agc` | Value | (none) | `as5600_read_agc()` | `as5600.readAGC()` |
| `as5600_angular_speed` | Value | UNIT(dropdown) | `as5600_angular_speed(degrees)` | `as5600.getAngularSpeed(` |
| `as5600_cumulative_position` | Value | (none) | `as5600_cumulative_position()` | `as5600.getCumulativePosition()` |
| `as5600_revolutions` | Value | (none) | `as5600_revolutions()` | `as5600.getRevolutions()` |
| `as5600_reset_position` | Statement | POSITION(input_value) | `as5600_reset_position(math_number(0))` | `as5600.resetCumulativePosition(` |
| `as5600_set_power_mode` | Statement | MODE(dropdown) | `as5600_set_power_mode(0)` | `as5600.setPowerMode(` |
| `as5600_set_output_mode` | Statement | MODE(dropdown) | `as5600_set_output_mode(0)` | `as5600.setOutputMode(` |
| `as5600_is_connected` | Value | (none) | `as5600_is_connected()` | `as5600.isConnected()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x36, 0x40 | AS5600 (0x36) / AS5600L (0x40) |
| DIR_PIN | 255, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 | 软件控制 / 2 / 3 / 4 / 5 / 6 / 7 / 8 / 9 / 10 / 11 / 12 / 13 |
| UNIT | degrees, radians, raw | 度 / 弧度 / 原始值 |
| DIRECTION | 0, 1 | 顺时针 / 逆时针 |
| STATUS | strong, weak | 过强 / 过弱 |
| MODE | 0, 1, 2, 3 | 正常 / 低功耗1 / 低功耗2 / 低功耗3 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    as5600_init(0x36, 255)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, as5600_read_angle(degrees))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

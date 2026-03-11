# PS3无线接收器

适配openjumper PS3无线接收器（编号ojmoBhp4039 ），通过该库解析IICPS3手柄接收模块的数据，支持获取手柄的按键状态、摇杆位置。

## Library Info
- **Name**: @aily-project/lib-openjumper-iicps3
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `openjumper_iicps3_init` | Statement | PS3_NAME(field_input) | `openjumper_iicps3_init("ps3")` | `` |
| `openjumper_iicps3_run` | Statement | PS3_NAME(field_input) | `openjumper_iicps3_run("ps3")` | `....run();\n` |
| `openjumper_iicps3_butstate` | Value | PS3_NAME(field_input), IICPS3_BTN(dropdown) | `openjumper_iicps3_butstate("ps3", up)` | `....ps3Data....` |
| `openjumper_iicps3_xy` | Value | PS3_NAME(field_input), IICPS3_XY(dropdown) | `openjumper_iicps3_xy("ps3", lx)` | `....ps3Data....` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| IICPS3_BTN | up, down, left, right, triangle, cross, square, circle, l1, l2, l3, r1, r2, r3, select, start | 左手-上 / 左手-下 / 左手-左 / 左手-右 / 右手-上 / 右手-下 / 右手-左 / 右手-右 / 左前-1 / 左前-2 / 左摇杆 / 右前-1 / 右前-2 / 右摇杆 / 选择 / 开始 |
| IICPS3_XY | lx, ly, rx, ry | 左摇杆-X轴 / 左摇杆-Y轴 / 右摇杆-X轴 / 右摇杆-Y轴 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    openjumper_iicps3_init("ps3")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, openjumper_iicps3_xy("ps3", lx))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

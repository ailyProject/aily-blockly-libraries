# PS3 Controller

PS3蓝牙手柄控制库，支持按键检测、摇杆读取、震动反馈

## Library Info
- **Name**: @aily-project/lib-ps3controller
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ps3_init` | Statement | MAC_ADDR(input_value) | `ps3_init(math_number(0))` | `` |
| `ps3_button_pressed` | Value | BUTTON(dropdown) | `ps3_button_pressed(cross)` | `Ps3.data.button....` |
| `ps3_stick_value` | Value | STICK(dropdown), AXIS(dropdown) | `ps3_stick_value(l, x)` | `Ps3.data.analog.stick.......` |
| `ps3_is_connected` | Value | (none) | `ps3_is_connected()` | `Ps3.isConnected()` |
| `ps3_set_rumble` | Statement | INTENSITY(input_value), DURATION(input_value) | `ps3_set_rumble(math_number(0), math_number(0))` | `Ps3.setRumble(..., ...);\n` |
| `ps3_set_player` | Statement | PLAYER(dropdown) | `ps3_set_player(1)` | `Ps3.setPlayer(...);\n` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BUTTON | cross, square, triangle, circle, up, down, left, right, l1, l2, r1, r2, select, start | Cross (×) / Square (□) / Triangle (△) / Circle (○) / Up / Down / Left / Right / L1 / L2 / R1 / R2 / Select / Start |
| STICK | l, r | 左摇杆 / 右摇杆 |
| AXIS | x, y | X轴 / Y轴 |
| PLAYER | 1, 2, 3, 4 | 1 / 2 / 3 / 4 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ps3_init(math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ps3_button_pressed(cross))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

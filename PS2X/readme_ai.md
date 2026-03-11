# PS2控制器库

用于读取PlayStation 2控制器输入的库，支持模拟摇杆、按钮检测、压力感应和震动反馈

## Library Info
- **Name**: @aily-project/lib-ps2x
- **Version**: 1.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ps2x_init` | Statement | CLK(dropdown), CMD(dropdown), ATT(dropdown), DAT(dropdown), PRESSURES(dropdown), RUMBLE(dropdown) | `ps2x_init(CLK, CMD, ATT, DAT, true, true)` | `` |
| `ps2x_read` | Statement | VIBRATE(input_value) | `ps2x_read(math_number(0))` | `if(ps2x_error != 1) {\n` |
| `ps2x_button` | Value | BUTTON(dropdown) | `ps2x_button(PSB_PAD_UP)` | `ps2x.Button(` |
| `ps2x_button_pressed` | Value | BUTTON(dropdown) | `ps2x_button_pressed(PSB_PAD_UP)` | `ps2x.ButtonPressed(` |
| `ps2x_button_released` | Value | BUTTON(dropdown) | `ps2x_button_released(PSB_PAD_UP)` | `ps2x.ButtonReleased(` |
| `ps2x_analog` | Value | ANALOG(dropdown) | `ps2x_analog(PSS_RX)` | `ps2x.Analog(` |
| `ps2x_analog_button` | Value | BUTTON(dropdown) | `ps2x_analog_button(PSAB_PAD_UP)` | `ps2x.Analog(` |
| `ps2x_controller_type` | Value | (none) | `ps2x_controller_type()` | `ps2x_type` |
| `ps2x_new_button_state` | Value | (none) | `ps2x_new_button_state()` | `ps2x.NewButtonState()` |
| `ps2x_new_button_state_specific` | Value | BUTTON(dropdown) | `ps2x_new_button_state_specific(PSB_PAD_UP)` | `ps2x.NewButtonState(` |
| `ps2x_is_connected` | Value | (none) | `ps2x_is_connected()` | `(ps2x_error == 0)` |
| `ps2x_simple_init` | Statement | CLK(dropdown), CMD(dropdown), ATT(dropdown), DAT(dropdown) | `ps2x_simple_init(CLK, CMD, ATT, DAT)` | `` |
| `ps2x_simple_read` | Statement | (none) | `ps2x_simple_read()` | `if(ps2x_error == 0) {\n` |
| `ps2x_joystick_moved` | Value | STICK(dropdown) | `ps2x_joystick_moved(LEFT)` | (dynamic code) |
| `ps2x_joystick_position` | Value | STICK(dropdown), AXIS(dropdown) | `ps2x_joystick_position(LEFT, X)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PRESSURES | true, false | 开启 / 关闭 |
| RUMBLE | true, false | 开启 / 关闭 |
| BUTTON | PSB_PAD_UP, PSB_PAD_DOWN, PSB_PAD_LEFT, PSB_PAD_RIGHT, PSB_TRIANGLE, PSB_CIRCLE, PSB_CROSS, PSB_SQUARE, PSB_L1, PSB_L2, PSB_L3, PSB_R1, PSB_R2, PSB_R3, PSB_SELECT, PSB_START | 上 / 下 / 左 / 右 / 三角形 / 圆形 / 叉号 / 方块 / L1 / L2 / L3 / R1 / R2 / R3 / SELECT / START |
| ANALOG | PSS_RX, PSS_RY, PSS_LX, PSS_LY | 右摇杆X / 右摇杆Y / 左摇杆X / 左摇杆Y |
| STICK | LEFT, RIGHT | 左 / 右 |
| AXIS | X, Y | X / Y |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ps2x_init(CLK, CMD, ATT, DAT, true, true)
    ps2x_simple_init(CLK, CMD, ATT, DAT)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ps2x_button(PSB_PAD_UP))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

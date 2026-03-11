# 2.4G无线遥控器

2.4G无线遥控器库，串口通信，可读取摇杆、按键数据

## Library Info
- **Name**: @aily-project/lib-remotecontrol-2g4
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `RemoteControl2g4_init` | Statement | (none) | `RemoteControl2g4_init()` | `` |
| `RemoteControl2g4_run` | Statement | (none) | `RemoteControl2g4_run()` | `MyCar.OpenJumper_RemoteControl_run();\n` |
| `RemoteControl2g4_RD` | Value | (none) | `RemoteControl2g4_RD()` | `MyCar.SerialState()` |
| `RemoteControl_btn` | Value | BUTTON(dropdown) | `RemoteControl_btn(PAD_UP)` | `MyCar.Button(` |
| `RemoteControl_joy` | Value | JOY(dropdown) | `RemoteControl_joy(PAD_LX)` | `MyCar.Analog(` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BUTTON | PAD_UP, PAD_DOWN, PAD_LEFT, PAD_RIGHT, PAD_A, PAD_B, PAD_C, PAD_D, PAD_J_L, PAD_J_R | 左侧按键上 / 左侧按键下 / 左侧按键左 / 左侧按键右 / 右侧按键A / 右侧按键B / 右侧按键C / 右侧按键D / 摇杆按键左 / 摇杆按键右 |
| JOY | PAD_LX, PAD_LY, PAD_RX, PAD_RY | 左侧摇杆X轴 / 左侧摇杆Y轴 / 右侧摇杆X轴 / 右侧摇杆Y轴 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    RemoteControl2g4_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, RemoteControl2g4_RD())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

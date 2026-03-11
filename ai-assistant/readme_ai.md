# ai-assistant

模块通过UART接口与主板通信，模块自带音频编解码器和麦克风阵列，实现语音识别、自然语言处理和语音合成，可连接云端AI服务实现智能对话和设备控制，支持Arduino UNO、Mega2560、ESP32全系列（硬件串口可自定义引脚）。

## Library Info
- **Name**: @aily-project/lib-ai-assistant
- **Version**: 0.0.8

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ai_assistant_config` | Statement | SERIAL(dropdown), SPEED(dropdown) | `ai_assistant_config(SERIAL, SPEED)` | `` |
| `serial_command_handler` | Value | ACTION(dropdown) | `serial_command_handler(MOVE_FORWARD)` | `false` |
| `serial_custom_command` | Value | CUSTOM_CMD(field_input) | `serial_custom_command("computer")` | `(receivedCommand.indexOf(` |
| `serial_clear_command` | Statement | (none) | `serial_clear_command()` | `receivedCommand =` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ACTION | MOVE_FORWARD, MOVE_BACKWARD, TURN_LEFT, TURN_RIGHT, STOP, LED_ON, LED_OFF, LED_BLINK, SERVO_ROTATE, FAN_SPEED, FAN_ON, FAN_OFF, RGB_ON, RGB_OFF, RGB_BRIGHTNESS, RGB_GRADIENT, ARM_GRAB, ARM_RELEASE, ARM_DOWN, RELAY_ON, RELAY_OFF | 小车前进 / 小车后退 / 小车左转 / 小车右转 / 小车急停 / 打开LED / 关闭LED / LED闪烁 / 舵机旋转 / 修改风扇速度 / 打开风扇 / 关闭风扇 / 打开彩灯 / 关闭彩灯 / 设置彩灯亮度 / 设置彩灯渐变色差 / 机械臂抓取 / 机械臂松开 / 机械臂回归初始位置 / 打开继电器 / 关闭继电器 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, serial_command_handler(MOVE_FORWARD))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

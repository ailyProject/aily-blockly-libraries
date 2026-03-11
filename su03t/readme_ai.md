# SU-03T语音识别

SU-03T语音识别模块库，支持语音指令识别和语音播报功能

## Library Info
- **Name**: @aily-project/lib-su03t
- **Version**: 1.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `su03t_init` | Statement | MODE(dropdown), RX_PIN(input_value), TX_PIN(input_value) | `su03t_init(software, math_number(2), math_number(2))` | `` |
| `su03t_refresh` | Statement | MODE(dropdown) | `su03t_refresh(software)` | (dynamic code) |
| `su03t_clear_result` | Statement | (none) | `su03t_clear_result()` | `su03tResult = 0;\n` |
| `su03t_recognized` | Value | COMMAND(input_value) | `su03t_recognized(math_number(0))` | `su03tResult ==` |
| `su03t_command` | Value | COMMAND(dropdown) | `su03t_command(1)` | (dynamic code) |
| `su03t_speak_integer` | Statement | VALUE(input_value) | `su03t_speak_integer(math_number(0))` | `su03t_speak_integer(` |
| `su03t_speak_decimal` | Statement | VALUE(input_value) | `su03t_speak_decimal(math_number(0))` | `su03t_speak_decimal(` |
| `su03t_speak_text` | Statement | TEXT(dropdown) | `su03t_speak_text(1)` | `su03t_speak_text_` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | software, hardware | 软串口 / 硬串口 |
| COMMAND | 1, 2, 3, 4, 5, 6, 7, 8, 9, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 48, 49, 50, 51, 52, 53, 54, 55, 56 | 开灯 / 关灯 / 调为红色 / 调为蓝色 / 调为绿色 / 调为彩色 / 打开空调 / 关闭空调 / 打开风扇 / 关闭风扇 / 1档风 / 2档风 / 3档风 / 自动模式 / 制冷模式 / 制热模式 / 升高温度 / 降低温度 / 打开台灯 / 关闭台灯 / 调到最亮 / 调到最暗 / 调亮一点 / 调暗一点 / 查询温度 / 查询湿度 / 查询天气 / 前进 / 后退 / 左转 / 右转 / 停止 / 查询时间 / 播放音乐 / 上一首 / 下一首 / 开始 / 暂停 |
| TEXT | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34 | 现在的温度是 / 度 / 现在的湿度是百分之 / 一 / 二 / 三 / 四 / 五 / 六 / 七 / 八 / 九 / 十 / 个 / 百 / 千 / 万 / 亿 / 点 / 负 / 零 / 现在的时间是 / 年 / 月 / 日 / 点 / 分 / 秒 / 百分之 / 现在的距离是 / 毫米 / 厘米 / 米 / 千米 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    su03t_init(software, math_number(2), math_number(2))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, su03t_recognized(math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

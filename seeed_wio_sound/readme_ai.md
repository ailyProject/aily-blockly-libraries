# Wio Terminal 麦克风与蜂鸣器

Wio Terminal 内置麦克风（WIO_MIC）和无源蜂鸣器（WIO_BUZZER）控制库，支持声音检测与音调播放。

## 库信息
- **Name**: @aily-project/lib-seeed-wio-sound
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `wio_mic_read` | Value | *(无参数)* | `wio_mic_read()` | `analogRead(WIO_MIC)` |
| `wio_mic_is_loud` | Value | THRESHOLD(input_value/Number) | `wio_mic_is_loud(math_number(512))` | `analogRead(WIO_MIC) > 512` |
| `wio_buzzer_on` | Statement | DUTY(input_value/Number) | `wio_buzzer_on(math_number(128))` | `analogWrite(WIO_BUZZER, 128);` |
| `wio_buzzer_off` | Statement | *(无参数)* | `wio_buzzer_off()` | `analogWrite(WIO_BUZZER, 0);` |
| `wio_buzzer_tone` | Statement | FREQUENCY(input_value/Number) | `wio_buzzer_tone(math_number(440))` | `tone(WIO_BUZZER, 440);` |
| `wio_buzzer_tone_duration` | Statement | FREQUENCY(input_value/Number), DURATION(input_value/Number) | `wio_buzzer_tone_duration(math_number(440), math_number(500))` | `tone(WIO_BUZZER, 440, 500); delay(500);` |
| `wio_buzzer_no_tone` | Statement | *(无参数)* | `wio_buzzer_no_tone()` | `noTone(WIO_BUZZER);` |

## Notes

1. **自动初始化**: 所有块在使用时会自动向 setup 区域注入对应的 `pinMode` 初始化，无需手动添加初始化块。
2. **麦克风返回值**: `wio_mic_read` 返回 0~1023 的整数，值越大表示声音越强。
3. **蜂鸣器两种驱动模式**:
   - **analogWrite 模式** (`wio_buzzer_on` / `wio_buzzer_off`): 直接设置 PWM 占空比，适合简单开关控制；DUTY 范围 0~255，建议值 128。
   - **tone 模式** (`wio_buzzer_tone` / `wio_buzzer_tone_duration` / `wio_buzzer_no_tone`): 使用 `tone()` 生成指定频率方波，适合播放音调和旋律；FREQUENCY 单位为 Hz。
4. **tone_duration 含 delay**: `wio_buzzer_tone_duration` 生成的代码包含 `delay(duration)` 以确保音调完整播放完毕再执行下一步。

## ABS Examples

### 声音检测触发蜂鸣器
```
arduino_setup()
    serial_begin(Serial, 115200)

arduino_loop()
    controls_if()
        @IF0: wio_mic_is_loud(math_number(600))
        @DO0:
            wio_buzzer_tone_duration(math_number(880), math_number(200))
    time_delay(math_number(100))
```

### 读取麦克风并串口输出
```
arduino_setup()
    serial_begin(Serial, 115200)

arduino_loop()
    serial_println(Serial, wio_mic_read())
    time_delay(math_number(200))
```

### 播放旋律片段
```
arduino_setup()

arduino_loop()
    wio_buzzer_tone_duration(math_number(523), math_number(500))
    wio_buzzer_tone_duration(math_number(659), math_number(500))
    wio_buzzer_tone_duration(math_number(784), math_number(500))
    wio_buzzer_no_tone()
    time_delay(math_number(1000))
```

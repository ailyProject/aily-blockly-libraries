# ArduinoTone

发声函数，可用于控制无源蜂鸣器发出指定频率的声音

## Library Info
- **Name**: @aily-project/lib-core-tone
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `io_tone` | Statement | TONEPIN(dropdown), FREQUENCY(input_value) | `io_tone(TONEPIN, math_number(0))` | — |
| `io_tone_duration` | Statement | TONEPIN(dropdown), FREQUENCY(input_value), DURATION(input_value) | `io_tone_duration(TONEPIN, math_number(0), math_number(0))` | — |
| `io_system_sound` | Statement | TONEPIN(dropdown), SOUND_TYPE(dropdown) | `io_system_sound(TONEPIN, startup)` | — |
| `io_note` | Value | NOTE(dropdown) | `io_note(261)` | — |
| `io_music` | Statement | TONEPIN(dropdown), MUSIC_TYPE(dropdown) | `io_music(TONEPIN, twinkle)` | — |
| `io_notone` | Statement | TONEPIN(dropdown) | `io_notone(TONEPIN)` | — |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SOUND_TYPE | startup, success, error, warning, notification, beep, doorbell, alarm, coin, powerdown | 开机音 / 成功提示 / 错误提示 / 警告提示 / 通知提示 / 短嘟声 / 门铃 / 警报 / 金币音效 / 关机音 |
| NOTE | 261, 277, 294, 311, 330, 349, 370, 392, 415, 440, 466, 494, 523, 587, 659, 698, 784, 880, 988, 0 | C4 (261Hz) / C#4 (277Hz) / D4 (294Hz) / D#4 (311Hz) / E4 (330Hz) / F4 (349Hz) / F#4 (370Hz) / G4 (392Hz) / G#4 (415Hz) / A4 (440Hz) / A#4 (466Hz) / B4 (494Hz) / C5 (523Hz) / D5 (587Hz) / E5 (659Hz) / F5 (698Hz) / G5 (784Hz) / A5 (880Hz) / B5 (988Hz) / 静音 |
| MUSIC_TYPE | twinkle, birthday, castle, mary, joy, mother, bee, tiger | 小星星 / 生日快乐 / 天空之城 / 玛丽有只小羊羔 / 欢乐颂 / 世上只有妈妈好 / 小蜜蜂 / 两只老虎 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, io_note(261))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

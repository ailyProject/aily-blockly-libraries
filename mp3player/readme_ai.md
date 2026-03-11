# MP3音频播放

GD3800音频播放模块驱动库，支持串口通信，支持多种音频格式播放、音量调节、曲目切换，操作简单，兼容多平台，适用于语音提示、背景音乐等场景。

## Library Info
- **Name**: @aily-project/lib-mp3player-gd3800
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `gd3800_init` | Statement | PIN_TX(input_value), PIN_RX(input_value) | `gd3800_init(math_number(2), math_number(2))` | `` |
| `gd3800_set` | Statement | GD3800_SETSTATE(dropdown) | `gd3800_set(play)` | `mp3....();\n` |
| `gd3800_play` | Statement | MUSICNUM(input_value) | `gd3800_play(math_number(0))` | `mp3.playFileByIndexNumber(...);\n` |
| `gd3800_cyclemode` | Statement | GD3800_CYMODE(dropdown) | `gd3800_cyclemode(MP3_LOOP_ALL)` | `mp3.setLoopMode(...);\n` |
| `gd3800_equalizer` | Statement | GD3800_EQMODE(dropdown) | `gd3800_equalizer(MP3_EQ_NORMAL)` | `mp3.setEqualizer(...);\n` |
| `gd3800_setvolume` | Statement | SETVOLUME(input_value) | `gd3800_setvolume(math_number(0))` | `mp3.setVolume(...);\n` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| GD3800_SETSTATE | play, pause, next, prev, volumeUp, volumeDn | 播放 / 暂停 / 下一曲 / 上一曲 / 音量加 / 音量减 |
| GD3800_CYMODE | MP3_LOOP_ALL, MP3_LOOP_FOLDER, MP3_LOOP_ONE, MP3_LOOP_RAM | 全部循环 / 文件内循环 / 单曲循环 / 随机播放 |
| GD3800_EQMODE | MP3_EQ_NORMAL, MP3_EQ_POP, MP3_EQ_ROCK, MP3_EQ_JAZZ, MP3_EQ_CLASSIC, MP3_EQ_BASS | 普通 / 流行 / 摇杆 / 爵士 / 古典 / 低音 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    gd3800_init(math_number(2), math_number(2))
    serial_begin(Serial, 9600)

arduino_loop()
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

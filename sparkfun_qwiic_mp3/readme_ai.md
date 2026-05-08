# SparkFun Qwiic MP3 播放器

SparkFun Qwiic MP3 Trigger 的 Blockly 封装库。

## Library Info
- **Name**: @aily-project/lib-sparkfun-qwiic-mp3
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `qwiic_mp3_init` | Statement | VAR(field_input) | `qwiic_mp3_init("mp3")` | `MP3TRIGGER mp3; mp3.begin();` |
| `qwiic_mp3_play_track` | Statement | VAR(field_variable), TRACK(input_value) | `qwiic_mp3_play_track(variables_get($mp3), math_number(1))` | `mp3.playTrack(1);` |
| `qwiic_mp3_play_file` | Statement | VAR(field_variable), FILENUM(input_value) | `qwiic_mp3_play_file(variables_get($mp3), math_number(3))` | `mp3.playFile(3);` |
| `qwiic_mp3_play_next` | Statement | VAR(field_variable) | `qwiic_mp3_play_next(variables_get($mp3))` | `mp3.playNext();` |
| `qwiic_mp3_play_prev` | Statement | VAR(field_variable) | `qwiic_mp3_play_prev(variables_get($mp3))` | `mp3.playPrevious();` |
| `qwiic_mp3_pause` | Statement | VAR(field_variable) | `qwiic_mp3_pause(variables_get($mp3))` | `mp3.pause();` |
| `qwiic_mp3_stop` | Statement | VAR(field_variable) | `qwiic_mp3_stop(variables_get($mp3))` | `mp3.stop();` |
| `qwiic_mp3_set_volume` | Statement | VAR(field_variable), VOLUME(input_value) | `qwiic_mp3_set_volume(variables_get($mp3), math_number(15))` | `mp3.setVolume(15);` |
| `qwiic_mp3_is_playing` | Value→Boolean | VAR(field_variable) | `qwiic_mp3_is_playing(variables_get($mp3))` | `mp3.isPlaying()` |

## Notes

1. `playTrack(n)` 按 SD 卡文件物理顺序播放；`playFile(n)` 按文件名前缀 F00n 播放
2. 音量范围 0-31，0=静音，31=最大
3. `pause()` 暂停/继续切换

## ABS Examples

```
arduino_setup()
    qwiic_mp3_init("mp3")
    qwiic_mp3_set_volume(variables_get($mp3), math_number(20))

arduino_loop()
    controls_if()
        @IF0: logic_boolean(TRUE)
        @DO0:
            qwiic_mp3_play_track(variables_get($mp3), math_number(1))
            time_delay(math_number(5000))
            qwiic_mp3_stop(variables_get($mp3))
```

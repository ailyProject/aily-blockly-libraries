# SparkFun MY1690 MP3 播放器

SparkFun MY1690 串口 MP3 解码器 Blockly 库。

## Library Info
- **Name**: @aily-project/lib-sparkfun-my1690
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `my1690_init` | Statement | VAR(field_input), SERIAL(field_dropdown) | `my1690_init("mp3", Serial)` | `SparkFunMY1690 mp3; Serial.begin(9600); mp3.begin(Serial);` |
| `my1690_play` | Statement | VAR(field_variable) | `my1690_play(variables_get($mp3))` | `mp3.play();` |
| `my1690_pause` | Statement | VAR(field_variable) | `my1690_pause(variables_get($mp3))` | `mp3.pause();` |
| `my1690_stop` | Statement | VAR(field_variable) | `my1690_stop(variables_get($mp3))` | `mp3.stopPlaying();` |
| `my1690_next` | Statement | VAR(field_variable) | `my1690_next(variables_get($mp3))` | `mp3.playNext();` |
| `my1690_previous` | Statement | VAR(field_variable) | `my1690_previous(variables_get($mp3))` | `mp3.playPrevious();` |
| `my1690_play_track` | Statement | VAR(field_variable), TRACK(input_value) | `my1690_play_track(variables_get($mp3), math_number(1))` | `mp3.playTrackNumber(1);` |
| `my1690_set_volume` | Statement | VAR(field_variable), VOLUME(input_value) | `my1690_set_volume(variables_get($mp3), math_number(15))` | `mp3.setVolume(15);` |
| `my1690_volume_up` | Statement | VAR(field_variable) | `my1690_volume_up(variables_get($mp3))` | `mp3.volumeUp();` |
| `my1690_volume_down` | Statement | VAR(field_variable) | `my1690_volume_down(variables_get($mp3))` | `mp3.volumeDown();` |
| `my1690_set_eq` | Statement | VAR(field_variable), EQ(field_dropdown) | `my1690_set_eq(variables_get($mp3), 0)` | `mp3.setEQ(0);` |
| `my1690_set_play_mode` | Statement | VAR(field_variable), MODE(field_dropdown) | `my1690_set_play_mode(variables_get($mp3), 4)` | `mp3.setPlayMode(4);` |
| `my1690_get_status` | Value | VAR(field_variable) | `my1690_get_status(variables_get($mp3))` | `mp3.getPlayStatus()` |
| `my1690_get_volume` | Value | VAR(field_variable) | `my1690_get_volume(variables_get($mp3))` | `mp3.getVolume()` |
| `my1690_get_song_count` | Value | VAR(field_variable) | `my1690_get_song_count(variables_get($mp3))` | `mp3.getSongCount()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SERIAL | Serial, Serial1, Serial2, Serial3 | 硬件串口选择 |
| EQ | 0~5 | 均衡器模式：0=普通, 1=流行, 2=摇滚, 3=爵士, 4=古典, 5=低音 |
| MODE | 0~4 | 播放模式：0=全部循环, 1=文件夹循环, 2=单曲循环, 3=随机, 4=不循环 |

# IBox S31 Audio

IBox S31 ES8389 audio: play MP3/WAV from SD card or USB drive, record, tones and microphone level

## Library Info
- **Name**: @aily-project/lib-iboxs31_audio
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `iboxs31_audio_init` | Statement | (none) | `iboxs31_audio_init()` | `iboxs31_audio.begin(IBoxS31_Audio::DEFAULT_RATE, Wire, 0, 1);` |
| `iboxs31_audio_volume` | Statement | VOLUME(input_value) | `iboxs31_audio_volume(math_number(0))` | `iboxs31_audio.setVolume(constrain((int)(0), 0, 100));` |
| `iboxs31_audio_play` | Statement | SRC(dropdown), PATH(input_value), MODE(dropdown) | `iboxs31_audio_play(SD, text("value"), BACKGROUND)` | `iboxs31_audio_player.play(iboxs31_audio_path(IBOX_AUDIO_SD_ROOT, String("value")).c_str(), false);` |
| `iboxs31_audio_play_folder` | Statement | SRC(dropdown), DIR(input_value), NUMBER(input_value), MODE(dropdown) | `iboxs31_audio_play_folder(SD, text("value"), math_number(0), BACKGROUND)` | `iboxs31_audio_player.playFolder(iboxs31_audio_path(IBOX_AUDIO_SD_ROOT, String("value")).c_str(), (int)(0) - 1, false);` |
| `iboxs31_audio_folder_count` | Value | SRC(dropdown), DIR(input_value) | `iboxs31_audio_folder_count(SD, text("value"))` | `IBoxS31_AudioPlayer::countFiles(iboxs31_audio_path(IBOX_AUDIO_SD_ROOT, String("value")).c_str())` |
| `iboxs31_audio_control` | Statement | ACTION(dropdown) | `iboxs31_audio_control(PAUSE)` | `iboxs31_audio_player.pause();` |
| `iboxs31_audio_loop` | Statement | STATE(dropdown) | `iboxs31_audio_loop(true)` | `iboxs31_audio_player.setLoop(true);` |
| `iboxs31_audio_state` | Value | WHAT(dropdown) | `iboxs31_audio_state(PLAYING)` | `(iboxs31_audio_player.state() == IBoxS31_AudioPlayer::PLAYING)` |
| `iboxs31_audio_info` | Value | WHAT(dropdown) | `iboxs31_audio_info(POS)` | `iboxs31_audio_player.position()` |
| `iboxs31_audio_file_name` | Value | (none) | `iboxs31_audio_file_name()` | `String(iboxs31_audio_player.fileName())` |
| `iboxs31_audio_error` | Value | (none) | `iboxs31_audio_error()` | `String(iboxs31_audio_player.lastError())` |
| `iboxs31_audio_record` | Statement | SRC(dropdown), PATH(input_value), SECONDS(input_value), MODE(dropdown) | `iboxs31_audio_record(SD, text("value"), math_number(0), BACKGROUND)` | `iboxs31_audio_player.record(iboxs31_audio_path(IBOX_AUDIO_SD_ROOT, String("value")).c_str(), (uint32_t)constrain((int)(0), 0, 86400), 16000, false);` |
| `iboxs31_audio_tone` | Statement | HZ(input_value), MS(input_value) | `iboxs31_audio_tone(math_number(0), math_number(1000))` | `iboxs31_audio_player.stop(); ↵ iboxs31_audio.playTone(constrain((float)(0), 50.0f, 7000.0f), (uint32_t)constrain((int)(1000), 10, 10000));` |
| `iboxs31_audio_mic_level` | Value | (none) | `iboxs31_audio_mic_level()` | `iboxs31_audio_mic_level()` |
| `iboxs31_audio_mic_gain` | Statement | DB(input_value) | `iboxs31_audio_mic_gain(math_number(0))` | `iboxs31_audio.setMicGain(constrain((float)(0), 3.5f, 36.5f));` |
| `iboxs31_audio_switch` | Statement | WHAT(dropdown), STATE(dropdown) | `iboxs31_audio_switch(PA, true)` | `iboxs31_audio.setPA(true);` |
| `iboxs31_audio_end` | Statement | (none) | `iboxs31_audio_end()` | `iboxs31_audio_player.stop(); ↵ iboxs31_audio.end();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SRC | SD, USB | iboxs31_audio_play, iboxs31_audio_play_folder, iboxs31_audio_folder_count |
| MODE | BACKGROUND, WAIT | iboxs31_audio_play, iboxs31_audio_play_folder, iboxs31_audio_record |
| ACTION | PAUSE, RESUME, STOP | iboxs31_audio_control |
| STATE | true, false | iboxs31_audio_loop, iboxs31_audio_switch |
| WHAT | PLAYING, PAUSED, RECORDING, IDLE | iboxs31_audio_state |
| WHAT | POS, DUR | iboxs31_audio_info |
| WHAT | PA, MUTE | iboxs31_audio_switch |

## ABS Examples

### Music player: A pauses, RIGHT skips, next track plays when one ends
```abs
arduino_global()
    variable_define("track", int, math_number(1))

arduino_setup()
    serial_begin(Serial, 115200)
    iboxs31_audio_init()
    iboxs31_audio_volume(math_number(60))
    iboxs31_keys_init()
    serial_println(Serial, iboxs31_audio_folder_count(SD, text("/music")))
    iboxs31_audio_play_folder(SD, text("/music"), variables_get($track), BACKGROUND)

arduino_loop()
    controls_if()
        @IF0: iboxs31_keys_key(IBOX_KEY_A, PRESSED)
        @DO0:
            controls_ifelse(iboxs31_audio_state(PAUSED))
                @DO0:
                    iboxs31_audio_control(RESUME)
                @ELSE:
                    iboxs31_audio_control(PAUSE)
    controls_if()
        @IF0: logic_operation(iboxs31_keys_key(IBOX_KEY_RIGHT, PRESSED), OR, iboxs31_audio_state(IDLE))
        @DO0:
            variables_set($track, math_arithmetic(variables_get($track), ADD, math_number(1)))
            iboxs31_audio_play_folder(SD, text("/music"), variables_get($track), BACKGROUND)
            serial_println(Serial, iboxs31_audio_file_name())
    time_delay(math_number(20))
```

### Voice recorder: press B to record 5 seconds, then play it back
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    iboxs31_audio_init()
    iboxs31_keys_init()

arduino_loop()
    controls_if()
        @IF0: iboxs31_keys_key(IBOX_KEY_B, PRESSED)
        @DO0:
            iboxs31_audio_record(SD, text("/rec.wav"), math_number(5), WAIT)
            serial_println(Serial, iboxs31_audio_error())
            iboxs31_audio_play(SD, text("/rec.wav"), WAIT)
    time_delay(math_number(20))
```

## Notes

1. **Board**: IBox S31 only (Aily board IBOX S31, ESP32-S31, Arduino-ESP32 4.0.0). ES8389 at I2C 0x10 (SDA=IO0, SCL=IO1); I2S MCLK=IO2, BCK=IO3, WS=IO4, DOUT=IO5, DIN=IO6; amplifier IO7.
2. **Files**: WAV (8/16/24/32-bit PCM or float, mono/stereo) and MP3 (libhelix in the core). SD paths start at the card root and the card (FAT32, 1-bit SD_MMC, power IO39) is mounted on first use; USB drive paths need IBoxS31_USB started. Rates other than 8/16/44.1/48/96 kHz are resampled.
3. **Player**: play, folder and record run in a background task; a new one, the tone block or close audio stops the current one. Folder tracks are sorted by file name, counted from 1 and wrap around. Recording is 16 kHz mono WAV from the left (microphone) channel.

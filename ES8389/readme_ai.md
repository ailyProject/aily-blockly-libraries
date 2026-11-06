# ES8389 Audio

ES8389 audio: play MP3/WAV from SD card or USB drive, record, tones and microphone; pins from the board

## Library Info
- **Name**: @aily-project/lib-es8389
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `es8389_init` | Statement | (none) | `es8389_init()` | `es8389.begin(ES8389::DEFAULT_RATE, Wire);` |
| `es8389_volume` | Statement | VOLUME(input_value) | `es8389_volume(math_number(0))` | `es8389.setVolume(constrain((int)(0), 0, 100));` |
| `es8389_play` | Statement | SRC(dropdown), PATH(input_value), MODE(dropdown) | `es8389_play(SD, text("value"), BACKGROUND)` | `es8389_player.play(es8389_path(ES8389_SD_ROOT, String("value")).c_str(), false);` |
| `es8389_play_folder` | Statement | SRC(dropdown), DIR(input_value), NUMBER(input_value), MODE(dropdown) | `es8389_play_folder(SD, text("value"), math_number(0), BACKGROUND)` | `es8389_player.playFolder(es8389_path(ES8389_SD_ROOT, String("value")).c_str(), (int)(0) - 1, false);` |
| `es8389_folder_count` | Value | SRC(dropdown), DIR(input_value) | `es8389_folder_count(SD, text("value"))` | `ES8389Player::countFiles(es8389_path(ES8389_SD_ROOT, String("value")).c_str())` |
| `es8389_control` | Statement | ACTION(dropdown) | `es8389_control(PAUSE)` | `es8389_player.pause();` |
| `es8389_loop` | Statement | STATE(dropdown) | `es8389_loop(true)` | `es8389_player.setLoop(true);` |
| `es8389_state` | Value | WHAT(dropdown) | `es8389_state(PLAYING)` | `(es8389_player.state() == ES8389Player::PLAYING)` |
| `es8389_info` | Value | WHAT(dropdown) | `es8389_info(POS)` | `es8389_player.position()` |
| `es8389_file_name` | Value | (none) | `es8389_file_name()` | `String(es8389_player.fileName())` |
| `es8389_error` | Value | (none) | `es8389_error()` | `String(es8389_player.lastError())` |
| `es8389_record` | Statement | SRC(dropdown), PATH(input_value), SECONDS(input_value), MODE(dropdown) | `es8389_record(SD, text("value"), math_number(0), BACKGROUND)` | `es8389_player.record(es8389_path(ES8389_SD_ROOT, String("value")).c_str(), (uint32_t)constrain((int)(0), 0, 86400), 16000, false);` |
| `es8389_tone` | Statement | HZ(input_value), MS(input_value) | `es8389_tone(math_number(0), math_number(1000))` | `es8389_player.stop(); ↵ es8389.playTone(constrain((float)(0), 50.0f, 7000.0f), (uint32_t)constrain((int)(1000), 10, 10000));` |
| `es8389_mic_level` | Value | (none) | `es8389_mic_level()` | `es8389_mic_level()` |
| `es8389_mic_gain` | Statement | DB(input_value) | `es8389_mic_gain(math_number(0))` | `es8389.setMicGain(constrain((float)(0), 3.5f, 36.5f));` |
| `es8389_switch` | Statement | WHAT(dropdown), STATE(dropdown) | `es8389_switch(PA, true)` | `es8389.setPA(true);` |
| `es8389_end` | Statement | (none) | `es8389_end()` | `es8389_player.stop(); ↵ es8389.end();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SRC | SD, USB | es8389_play, es8389_play_folder, es8389_folder_count |
| MODE | BACKGROUND, WAIT | es8389_play, es8389_play_folder, es8389_record |
| ACTION | PAUSE, RESUME, STOP | es8389_control |
| STATE | true, false | es8389_loop, es8389_switch |
| WHAT | PLAYING, PAUSED, RECORDING, IDLE | es8389_state |
| WHAT | POS, DUR | es8389_info |
| WHAT | PA, MUTE | es8389_switch |

## ABS Examples

### IBox S31 music player: A pauses, RIGHT skips, next track plays when one ends
```abs
arduino_global()
    variable_define("track", int, math_number(1))

arduino_setup()
    serial_begin(Serial, 115200)
    io_digitalwrite(math_number(39), io_state(HIGH))
    time_delay(math_number(200))
    io_digitalwrite(math_number(39), io_state(LOW))
    time_delay(math_number(250))
    es8389_init()
    es8389_volume(math_number(60))
    xl9555_init(0x27)
    xl9555_name_pin(5, "a_key", KEY_LOW)
    xl9555_name_pin(2, "right_key", KEY_LOW)
    serial_println(Serial, es8389_folder_count(SD, text("/music")))
    es8389_play_folder(SD, text("/music"), variables_get($track), BACKGROUND)

arduino_loop()
    controls_if()
        @IF0: xl9555_key($a_key, PRESSED)
        @DO0:
            controls_ifelse(es8389_state(PAUSED))
                @DO0:
                    es8389_control(RESUME)
                @ELSE:
                    es8389_control(PAUSE)
    controls_if()
        @IF0: logic_operation(xl9555_key($right_key, PRESSED), OR, es8389_state(IDLE))
        @DO0:
            variables_set($track, math_arithmetic(variables_get($track), ADD, math_number(1)))
            es8389_play_folder(SD, text("/music"), variables_get($track), BACKGROUND)
            serial_println(Serial, es8389_file_name())
    time_delay(math_number(20))
```

### IBox S31 voice recorder: press B to record 5 seconds, then play it back
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    io_digitalwrite(math_number(39), io_state(HIGH))
    time_delay(math_number(200))
    io_digitalwrite(math_number(39), io_state(LOW))
    time_delay(math_number(250))
    es8389_init()
    xl9555_init(0x27)
    xl9555_name_pin(6, "b_key", KEY_LOW)

arduino_loop()
    controls_if()
        @IF0: xl9555_key($b_key, PRESSED)
        @DO0:
            es8389_record(SD, text("/rec.wav"), math_number(5), WAIT)
            serial_println(Serial, es8389_error())
            es8389_play(SD, text("/rec.wav"), WAIT)
    time_delay(math_number(20))
```

## Notes

1. **Boards**: ESP32 boards with an ES8389. `es8389_init` takes MCLK, BCK, WS, data pins, amplifier pin and I2C address from the board’s `audioConfig` and starts `Wire` on its SDA/SCL (IBox S31: MCLK=IO2, BCK=IO3, WS=IO4, MCU→codec IO5, codec→MCU IO6, amplifier IO7, 0x10 on SDA=IO0, SCL=IO1). A board whose `audioConfig` names another codec (ES8311 on Korvo S3) fails to compile with an `#error`; a board without `audioConfig` uses the library defaults, which are the IBox S31 wiring.
2. **Files**: WAV (8/16/24/32-bit PCM or float, mono/stereo) and MP3 (libhelix in the core). SD paths start at the card root: an already mounted card (SD_MMC at /sdcard, e.g. from esp32_sd_mmc) is used as is, otherwise it is mounted on the board’s `sdCardPins` in 1-bit mode. The library never powers the card; on the IBox S31 drive IO39 high for 200 ms, then low for 250 ms before the first access, as in the examples. USB drive paths need the ESP32 USB host started. Rates other than 8/16/44.1/48/96 kHz are resampled.
3. **Player**: play, folder and record run in a background task; a new one, the tone block or close audio stops the current one. Folder tracks are sorted by file name, counted from 1 and wrap around. Recording is 16 kHz mono WAV from the left (microphone) channel.
4. **Storage capabilities**: the built-in SD source requires `SOC_SDMMC_HOST_SUPPORTED`. Chips without SDMMC (for example ESP32-C3) return `false` from `mountSD()` and cannot use SD playback/recording. I2S audio, tones, microphone access and files on other supported, already mounted filesystems remain available. A USB drive requires a USB-host-capable chip and an initialized host driver.


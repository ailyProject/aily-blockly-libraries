# NES模拟器 (Nofrendo)

基于arduino-nofrendo的NES红白机模拟器，支持ESP32 + ST7789屏幕 + SD卡ROM加载

## Library Info
- **Name**: @aily-project/lib-nofrendo
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `nofrendo_start` | Statement | ROM_PATH(input_value) | `nofrendo_start(text("/sdcard/game.nes"))` | WiFi off, SD mount, nofrendo_main(1, argv) |
| `nofrendo_find_rom` | Value | (none) | `nofrendo_find_rom()` | Searches SD root for first .nes file, returns path String |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ROM_PATH | Any String | Full path to .nes file on SD card, e.g. "/sdcard/game.nes" |

## ABS Examples

### Basic Usage
```
arduino_setup()
    tftscr_init()
    serial_begin(Serial, 115200)
    nofrendo_start(text("/sdcard/game.nes"))

arduino_loop()
```

### Auto-find ROM
```
arduino_setup()
    tftscr_init()
    serial_begin(Serial, 115200)
    nofrendo_start(nofrendo_find_rom())

arduino_loop()
```

## Notes

1. **Prerequisites**: Must call `tftscr_init()` before `nofrendo_start`. Screen must be ST7789 320x240 landscape.
2. **ROM placement**: Place .nes files on TF card root directory.
3. **WiFi**: Emulator automatically disables WiFi to free memory.
4. **Blocking**: `nofrendo_start` blocks forever (emulator runs its own loop). Code after it will not execute.
5. **Audio**: Currently no audio output (hardware has no I2S/DAC connected).
6. **Buttons**: 6 buttons mapped — Up/Down/Left/Right/A/B. Select/Start not available on this board.
7. **PSRAM**: Requires PSRAM enabled in board config for ROM loading.

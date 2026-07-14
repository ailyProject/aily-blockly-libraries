# Seeed GFX

Seeed graphics display library supports the drawing functions of various TFT and e-paper displays such as Seeed XIAO Round Display/reTerminal E series.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-seeed-gfx |
| Version | 1.0.6 |
| Author | SeeedStudio |
| Source | https://github.com/Seeed-Studio/Seeed_GFX |
| License | Original license |

## Supported Boards

ESP32, Seeeduino SAMD (Wio Terminal)

## Description

Seeed graphics display library supports the drawing functions of various TFT and e-paper displays such as Seeed XIAO Round Display/reTerminal E series.

## Quick Start

1. Enable `@aily-project/lib-seeed-gfx` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

## GIF and MP4 Animation

Upload GIF/MP4 and choose RGB565 for higher colour fidelity or RGB332 for roughly twice the frame capacity. The generated `PROGMEM` frames use the matching `pushImage()` overload automatically. TFT supports blocking, non-blocking, looping, and selected-frame playback. Keep clips short; audio is ignored.

## SD AILY Video Playback

Use `seeed_gfx_play_sd_video` for `.rgb565v`, `.rgb332v`, or `.monov` files exported by the AILY video converter. Pass the file name through a text block and set the payload buffer size in KB (15 KB is the default). Playback validates the 40-byte AILY header, allocates only the requested payload buffer, and immediately draws each group of rows or horizontal segment before reading the next chunk. The complete file and even a complete frame never need to fit in RAM.

On Wio Terminal, the generated player follows the Seeed file-system API and includes the public `Seeed_Arduino_FS.h` header (which provides `Seeed_FS.h` and `SD/Seeed_SD.h`). If the file cannot be opened, it first checks whether the SD root is already mounted. Only when it is not mounted does the player clear any failed mount, initialize the onboard `SDCARD_SPI` interface at 24 MHz, and fall back to 16 MHz and then 4 MHz if needed before retrying the file. Do not add a separate custom-pin SD initialization block for onboard video; omitting it also prevents an early `setup()` return from skipping later display configuration. On ESP32, the SD card must still be initialized separately because the CS pin depends on the board and wiring. File names are normalized automatically for each platform.

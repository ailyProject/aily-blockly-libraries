# OV3660 Camera

OV3660 camera (ESP32-S31): photos, live video stream, picture colour and BMP saving; pins from the board

## Library Info
- **Name**: @aily-project/lib-ov3660
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ov3660_init` | Statement | (none) | `ov3660_init()` | `ov3660.begin(Wire);` |
| `ov3660_ready` | Value | (none) | `ov3660_ready()` | `ov3660.isReady()` |
| `ov3660_error` | Value | (none) | `ov3660_error()` | `String(ov3660.lastError())` |
| `ov3660_flip` | Statement | WHAT(dropdown), STATE(dropdown) | `ov3660_flip(VFLIP, true)` | `ov3660.setVFlip(true);` |
| `ov3660_exposure` | Statement | LEVEL(input_value) | `ov3660_exposure(math_number(0))` | `ov3660.setAELevel(constrain((int)(0), -5, 5));` |
| `ov3660_capture` | Value | (none) | `ov3660_capture()` | `ov3660_capture()` |
| `ov3660_average` | Value | WHAT(dropdown) | `ov3660_average(L)` | `ov3660_avg[0]` |
| `ov3660_pixel` | Value | X(input_value), Y(input_value), WHAT(dropdown) | `ov3660_pixel(math_number(0), math_number(0), L)` | `ov3660_pixel((int)(0), (int)(0), 0)` |
| `ov3660_save_bmp` | Value | PATH(input_value) | `ov3660_save_bmp(text("value"))` | `ov3660_save_bmp(String("value"))` |
| `ov3660_stream_start` | Statement | SIZE(dropdown), ORDER(dropdown) | `ov3660_stream_start(320, BE)` | `ov3660_stream.begin(320, false);` |
| `ov3660_stream_stop` | Statement | (none) | `ov3660_stream_stop()` | `ov3660_stream.end();` |
| `ov3660_stream_new_frame` | Value | (none) | `ov3660_stream_new_frame()` | `ov3660_stream_next()` |
| `ov3660_stream_pixels` | Value | (none) | `ov3660_stream_pixels()` | `ov3660_stream.pixels()` |
| `ov3660_stream_info` | Value | WHAT(dropdown) | `ov3660_stream_info(WIDTH)` | `ov3660_stream.width()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| WHAT | VFLIP, MIRROR | ov3660_flip |
| STATE | true, false | ov3660_flip |
| WHAT | L, R, G, B | ov3660_average, ov3660_pixel |
| SIZE | 320, 640, 160 | ov3660_stream_start |
| ORDER | BE, LE | ov3660_stream_start |
| WHAT | WIDTH, HEIGHT, FPS, FRAMES, BYTES | ov3660_stream_info |

## ABS Examples

### Run the live video stream and report its frame rate
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    ov3660_init()
    ov3660_stream_start(320, BE)

arduino_loop()
    controls_if()
        @IF0: ov3660_stream_new_frame()
        @DO0:
            serial_println(Serial, text_join(ADD0=ov3660_stream_info(WIDTH), ADD1=text("x"), ADD2=ov3660_stream_info(HEIGHT), ADD3=text(" frame")))
    serial_println(Serial, ov3660_stream_info(FPS))
    time_delay(math_number(100))
```

### Report the brightness and the colour in the centre
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    ov3660_init()
    controls_if()
        @IF0: logic_negate(ov3660_ready())
        @DO0:
            serial_println(Serial, ov3660_error())

arduino_loop()
    controls_if()
        @IF0: ov3660_capture()
        @DO0:
            serial_println(Serial, text_join(ADD0=text("brightness "), ADD1=ov3660_average(L), ADD2=text(" centre red "), ADD3=ov3660_pixel(math_number(320), math_number(240), R)))
    time_delay(math_number(500))
```

### IBox S31: power the SD card, mount it and save one photo
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    io_digitalwrite(math_number(39), io_state(HIGH))
    time_delay(math_number(200))
    io_digitalwrite(math_number(39), io_state(LOW))
    time_delay(math_number(250))
    esp32_sd_mmc_begin(true)
    ov3660_init()
    time_delay(math_number(1000))
    controls_ifelse(ov3660_save_bmp(text("/photo.bmp")))
        @DO0:
            serial_println(Serial, text("saved /photo.bmp"))
        @ELSE:
            serial_println(Serial, text("save failed"))
```

## Notes

1. **Boards**: ESP32-S31 boards only (Arduino-ESP32 4.0.0, PSRAM). `ov3660_init` takes D0–D7 (`y2`–`y9`), PCLK, XCLK, VSYNC and HREF from the board’s `cameraConfig` and starts `Wire` (SCCB, address 0x3C) on its SDA/SCL. IBox S31: D0–D7=IO46–IO53, PCLK=IO54, XCLK=IO55, VSYNC=IO56, HREF=IO57, SDA=IO0, SCL=IO1. A board whose `cameraConfig` lists other models fails to compile with an `#error`; without `cameraConfig` the library defaults (IBox S31 wiring) are used.
2. **Frames**: 640×480 RGB565 big-endian at about 10 fps, two 600 KB buffers in PSRAM. The sensor delivers frames upside down; the blocks flip them so (0, 0) is the top left. `ov3660_init` can be called again to retry; `ov3660_error` tells why it failed.
3. **Colours**: `ov3660_capture` keeps an 80×60 thumbnail (one sample per 8×8 pixels) and the whole-picture averages; average and pixel blocks read that last capture, 0–255.
4. **Saving**: `ov3660_save_bmp` writes an uncompressed 24-bit BMP (640×480 is about 900 KB) with `SD_MMC`, so mount the card first, e.g. with `esp32_sd_mmc_begin`. On the IBox S31 power the card first (IO39 high 200 ms, then low), as in the example.
5. **Video stream**: `ov3660_stream_start` runs a background task that keeps the latest upright frame at 640×480, 320×240 or 160×120 in two PSRAM buffers; while it runs, capture, colour and BMP blocks read from it. For a screen library: `if (ov3660_stream_next()) lcd.blit(0, 0, ov3660_stream.width(), ov3660_stream.height(), ov3660_stream.pixels());` (big-endian RGB565 for SPI LCD drivers that push bytes as-is; little-endian for TFT_eSPI/LVGL). The held frame stays unchanged until the next new-picture check.

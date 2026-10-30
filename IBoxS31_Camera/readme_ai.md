# IBox S31 Camera

IBox S31 onboard OV3660 camera: photos, live video stream, picture colour, save BMP to SD card

## Library Info
- **Name**: @aily-project/lib-iboxs31_camera
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `iboxs31_camera_init` | Statement | (none) | `iboxs31_camera_init()` | `iboxs31_camera.begin(Wire, 0, 1);` |
| `iboxs31_camera_ready` | Value | (none) | `iboxs31_camera_ready()` | `iboxs31_camera.isReady()` |
| `iboxs31_camera_error` | Value | (none) | `iboxs31_camera_error()` | `String(iboxs31_camera.lastError())` |
| `iboxs31_camera_flip` | Statement | WHAT(dropdown), STATE(dropdown) | `iboxs31_camera_flip(VFLIP, true)` | `iboxs31_camera.setVFlip(true);` |
| `iboxs31_camera_exposure` | Statement | LEVEL(input_value) | `iboxs31_camera_exposure(math_number(0))` | `iboxs31_camera.setAELevel(constrain((int)(0), -5, 5));` |
| `iboxs31_camera_capture` | Value | (none) | `iboxs31_camera_capture()` | `iboxs31_camera_capture()` |
| `iboxs31_camera_average` | Value | WHAT(dropdown) | `iboxs31_camera_average(L)` | `iboxs31_camera_avg[0]` |
| `iboxs31_camera_pixel` | Value | X(input_value), Y(input_value), WHAT(dropdown) | `iboxs31_camera_pixel(math_number(0), math_number(0), L)` | `iboxs31_camera_pixel((int)(0), (int)(0), 0)` |
| `iboxs31_camera_save_bmp` | Value | PATH(input_value) | `iboxs31_camera_save_bmp(text("value"))` | `iboxs31_camera_save_bmp(String("value"))` |
| `iboxs31_camera_stream_start` | Statement | SIZE(dropdown), ORDER(dropdown) | `iboxs31_camera_stream_start(320, BE)` | `iboxs31_camera_stream.begin(320, false);` |
| `iboxs31_camera_stream_stop` | Statement | (none) | `iboxs31_camera_stream_stop()` | `iboxs31_camera_stream.end();` |
| `iboxs31_camera_stream_new_frame` | Value | (none) | `iboxs31_camera_stream_new_frame()` | `iboxs31_camera_stream_next()` |
| `iboxs31_camera_stream_pixels` | Value | (none) | `iboxs31_camera_stream_pixels()` | `iboxs31_camera_stream.pixels()` |
| `iboxs31_camera_stream_info` | Value | WHAT(dropdown) | `iboxs31_camera_stream_info(WIDTH)` | `iboxs31_camera_stream.width()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| WHAT | VFLIP, MIRROR | iboxs31_camera_flip |
| STATE | true, false | iboxs31_camera_flip |
| WHAT | L, R, G, B | iboxs31_camera_average, iboxs31_camera_pixel |
| SIZE | 320, 640, 160 | iboxs31_camera_stream_start |
| ORDER | BE, LE | iboxs31_camera_stream_start |
| WHAT | WIDTH, HEIGHT, FPS, FRAMES, BYTES | iboxs31_camera_stream_info |

## ABS Examples

### Run the live video stream and report its frame rate
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    iboxs31_camera_init()
    iboxs31_camera_stream_start(320, BE)

arduino_loop()
    controls_if()
        @IF0: iboxs31_camera_stream_new_frame()
        @DO0:
            serial_println(Serial, text_join(ADD0=iboxs31_camera_stream_info(WIDTH), ADD1=text("x"), ADD2=iboxs31_camera_stream_info(HEIGHT), ADD3=text(" frame")))
    serial_println(Serial, iboxs31_camera_stream_info(FPS))
    time_delay(math_number(100))
```

### Report the brightness and the colour in the centre
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    iboxs31_camera_init()
    controls_if()
        @IF0: logic_negate(iboxs31_camera_ready())
        @DO0:
            serial_println(Serial, iboxs31_camera_error())

arduino_loop()
    controls_if()
        @IF0: iboxs31_camera_capture()
        @DO0:
            serial_println(Serial, text_join(ADD0=text("brightness "), ADD1=iboxs31_camera_average(L), ADD2=text(" centre red "), ADD3=iboxs31_camera_pixel(math_number(320), math_number(240), R)))
    time_delay(math_number(500))
```

### Save a photo to the SD card once
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    iboxs31_sdcard_init(false)
    iboxs31_camera_init()
    time_delay(math_number(1000))
    controls_ifelse(iboxs31_camera_save_bmp(text("/photo.bmp")))
        @DO0:
            serial_println(Serial, text("saved /photo.bmp"))
        @ELSE:
            serial_println(Serial, text("save failed"))
```

## Notes

1. **Board**: IBox S31 only (Aily board IBOX S31, ESP32-S31, Arduino-ESP32 4.0.0, which already enables PSRAM). OV3660 on DVP D0–D7=IO46–IO53, PCLK=IO54, XCLK=IO55, VSYNC=IO56, HREF=IO57; SCCB address 0x3C shares SDA=IO0, SCL=IO1 with the onboard sensors.
2. **Frames**: 640×480 RGB565 big-endian at about 10 fps, two 600 KB buffers in PSRAM. The sensor delivers frames upside down; the blocks flip them so (0, 0) is the top left. `iboxs31_camera_init` can be called again to retry; `iboxs31_camera_error` tells why it failed.
3. **Colours**: `iboxs31_camera_capture` keeps an 80×60 thumbnail (one sample per 8×8 pixels) and the whole-picture averages; average and pixel blocks read that last capture, 0–255.
4. **Saving**: `iboxs31_camera_save_bmp` writes an uncompressed 24-bit BMP (640×480 is about 900 KB) with `SD_MMC`, so mount the card first with the `IBoxS31_SDCard` library.
5. **Video stream**: `iboxs31_camera_stream_start` runs a background task that keeps the latest upright frame at 640×480, 320×240 or 160×120 in two PSRAM buffers; while it runs, capture, colour and BMP blocks read from it. For a screen block in another library: `if (iboxs31_camera_stream_next()) lcd.blit(0, 0, iboxs31_camera_stream.width(), iboxs31_camera_stream.height(), iboxs31_camera_stream.pixels());` (big-endian RGB565 = IBoxS31_Display format; little-endian for TFT_eSPI/LVGL). The held frame stays unchanged until the next new-picture check.

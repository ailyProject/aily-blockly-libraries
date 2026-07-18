# ESP32Cam camera

Blockly bindings for the `yoursunny/esp32cam` OV2640 camera library.

## Library Info
- **Name**: @aily-project/lib-esp32cam
- **Version**: 1.0.0
- **Frame variable type**: `Esp32camFrame`
- **Web server variable type**: `WebServer`

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp32cam_init` | Statement | PINS, RESOLUTION, FORMAT, QUALITY, BUFFER_COUNT | `esp32cam_init(AiThinker, "320,240", JPEG, math_number(80), math_number(2))` | `Config`, `Camera.begin` |
| `esp32cam_end` | Statement | none | `esp32cam_end()` | `Camera.end` |
| `esp32cam_is_ready` | Value Boolean | none | `esp32cam_is_ready()` | cached begin result |
| `esp32cam_set_logger` | Statement | SERIAL | `esp32cam_set_logger(Serial)` | `setLogger` |
| `esp32cam_update_resolution` | Statement | RESOLUTION | `esp32cam_update_resolution("640,480")` | `Camera.update` |
| `esp32cam_update_image` | Statement | BRIGHTNESS, CONTRAST, SATURATION | `esp32cam_update_image(math_number(0), math_number(0), math_number(0))` | `Camera.update` |
| `esp32cam_update_gain` | Statement | GAIN | `esp32cam_update_gain(math_number(-2))` | `Camera.update` |
| `esp32cam_update_light_mode` | Statement | MODE | `esp32cam_update_light_mode(AUTO)` | `Camera.update` |
| `esp32cam_update_special_effect` | Statement | EFFECT | `esp32cam_update_special_effect(NONE)` | `Camera.update` |
| `esp32cam_update_flip` | Statement | HMIRROR, VFLIP | `esp32cam_update_flip(FALSE, FALSE)` | `Camera.update` |
| `esp32cam_update_corrections` | Statement | RAW_GMA, LENS_CORRECTION | `esp32cam_update_corrections(TRUE, TRUE)` | `Camera.update` |
| `esp32cam_status_number` | Value Number | PROPERTY | `esp32cam_status_number(WIDTH)` | `Camera.status` |
| `esp32cam_status_boolean` | Value Boolean | PROPERTY | `esp32cam_status_boolean(HMIRROR)` | `Camera.status` |
| `esp32cam_frame_create` | Statement | VAR | `esp32cam_frame_create("frame")` | declares `unique_ptr<Frame>` |
| `esp32cam_frame_capture` | Statement | VAR | `esp32cam_frame_capture(variables_get($frame))` | `capture` |
| `esp32cam_frame_available` | Value Boolean | VAR | `esp32cam_frame_available(variables_get($frame))` | pointer check |
| `esp32cam_frame_info` | Value Number | VAR, PROPERTY | `esp32cam_frame_info(variables_get($frame), WIDTH)` | frame getters |
| `esp32cam_frame_format_is` | Value Boolean | VAR, FORMAT | `esp32cam_frame_format_is(variables_get($frame), JPEG)` | `isJpeg` / `isBmp` |
| `esp32cam_frame_convert` | Statement | VAR, FORMAT, QUALITY | `esp32cam_frame_convert(variables_get($frame), JPEG, math_number(80))` | `toJpeg` / `toBmp` |
| `esp32cam_frame_write_serial` | Value Boolean | VAR, SERIAL, TIMEOUT | `esp32cam_frame_write_serial(variables_get($frame), Serial, math_number(10000))` | `Frame.writeTo` |
| `esp32cam_frame_release` | Statement | VAR | `esp32cam_frame_release(variables_get($frame))` | `unique_ptr.reset` |
| `esp32cam_webserver_send_frame` | Statement | SERVER, VAR, TIMEOUT | `esp32cam_webserver_send_frame(variables_get($server), variables_get($frame), math_number(10000))` | WebServer response |
| `esp32cam_webserver_stream_mjpeg` | Value Number | SERVER, MIN_INTERVAL, MAX_FRAMES, FRAME_TIMEOUT | `esp32cam_webserver_stream_mjpeg(variables_get($server), math_number(0), math_number(-1), math_number(10000))` | `Camera.streamMjpeg` |

## Parameter Options

- `PINS`: `AUTO`, `AiThinker`, `XiaoSense`, `S3N16R8`, `FreeNove`, `M5Camera`, `M5CameraLED`, `TTGO`.
- `FORMAT`: initialization supports `JPEG`, `RGB`, `YUV`, `GRAYSCALE`; frame conversion supports `JPEG`, `BMP`.
- `MODE`: `NONE`, `AUTO`, `SUNNY`, `CLOUDY`, `OFFICE`, `HOME`.
- `EFFECT`: `NONE`, `NEGATIVE`, `BLACKWHITE`, `REDDISH`, `GREENISH`, `BLUISH`, `ANTIQUE`.
- Status and frame-property dropdown values are documented by their visible labels.

## Notes

- JPEG quality: 0 worst to 100 best. Buffer count is clamped to at least 1.
- Runtime brightness, contrast, saturation: -2 to 2.
- Gain: manual 1..31, or AGC ceiling -2, -4, -8, -16, -32, -64, -128. Do not use 0.
- A runtime resolution must not exceed the initialization resolution.
- A captured frame owns scarce camera memory. Release it when no longer needed.
- MJPEG streaming is blocking and returns after the client disconnects or `MAX_FRAMES` is reached; `-1` is unlimited.

## Minimal ABS Example

```text
arduino_setup()
    esp32cam_frame_create("frame")
    esp32cam_init(AiThinker, "320,240", JPEG, math_number(80), math_number(2))

arduino_loop()
    esp32cam_frame_capture(variables_get($frame))
    controls_if(esp32cam_frame_available(variables_get($frame)))
        serial_println(Serial, esp32cam_frame_info(variables_get($frame), SIZE))
        esp32cam_frame_release(variables_get($frame))
```

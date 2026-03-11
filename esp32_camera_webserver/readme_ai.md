# ESP32摄像头网络服务器

ESP32摄像头网络服务器库,支持多种ESP32开发板通过WiFi串流摄像头画面

## Library Info
- **Name**: @aily-project/lib-esp32-camera-webserver
- **Version**: 1.2.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_camera_webserver_init` | Statement | MODEL(dropdown), RESOLUTION(dropdown) | `esp32_camera_webserver_init(CAMERA_MODEL_AI_THINKER, FRAMESIZE_UXGA)` | (dynamic code) |
| `esp32_camera_custom_pins` | Statement | DATA_PINS(input_value), XCLK(input_value), PCLK(input_value), VSYNC(input_value), HREF(input_value), SDA(input_value), SCL(input_value), PWDN(input_value), RESET(input_value) | `esp32_camera_custom_pins(math_number(2), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `esp32_camera_set_quality` | Statement | QUALITY(field_number) | `esp32_camera_set_quality(10)` | `{     sensor_t * s = esp_camera_sensor_get();     s->set_quality(s, ...);   }` |
| `esp32_camera_set_flip` | Statement | VFLIP(field_checkbox), HMIRROR(field_checkbox) | `esp32_camera_set_flip(FALSE, FALSE)` | `{     sensor_t * s = esp_camera_sensor_get();     s->set_vflip(s, ...);   ...` |
| `esp32_camera_set_brightness` | Statement | BRIGHTNESS(field_number), CONTRAST(field_number), SATURATION(field_number) | `esp32_camera_set_brightness(0, 0, 0)` | `{     sensor_t * s = esp_camera_sensor_get();     s->set_brightness(s, ...)...` |
| `esp32_camera_capture` | Value | (none) | `esp32_camera_capture()` | `((unsigned long)esp_camera_fb_get())` |
| `esp32_camera_frame_buffer` | Value | FRAME(input_value) | `esp32_camera_frame_buffer(math_number(0))` | `(... ? ((camera_fb_t*)...)->buf : NULL)` |
| `esp32_camera_frame_len` | Value | FRAME(input_value) | `esp32_camera_frame_len(math_number(0))` | `(... ? ((camera_fb_t*)...)->len : 0)` |
| `esp32_camera_frame_width` | Value | FRAME(input_value) | `esp32_camera_frame_width(math_number(0))` | `(... ? ((camera_fb_t*)...)->width : 0)` |
| `esp32_camera_frame_height` | Value | FRAME(input_value) | `esp32_camera_frame_height(math_number(0))` | `(... ? ((camera_fb_t*)...)->height : 0)` |
| `esp32_camera_release` | Statement | FRAME(input_value) | `esp32_camera_release(math_number(0))` | `if(...) {     camera_fb_t* _fb = (camera_fb_t*)...;     // 额外的安全检查     if(...` |
| `esp32_camera_send_serial` | Statement | FRAME(input_value) | `esp32_camera_send_serial(math_number(0))` | `camera_fb_t* _fb = (camera_fb_t*)...;   if(_fb) {     if(_fb->buf && _fb->l...` |
| `esp32_camera_capture_and_encode_base64` | Value | (none) | `esp32_camera_capture_and_encode_base64()` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODEL | CAMERA_MODEL_AI_THINKER, CAMERA_MODEL_M5STACK_PSRAM, CAMERA_MODEL_M5STACK_WIDE, CAMERA_MODEL_ESP_EYE, CAMERA_MODEL_DFRobot_FireBeetle2_ESP32S3, CAMERA_MODEL_ESP32S3_EYE, CAMERA_MODEL_XIAO_ESP32S3, CAMERA_MODEL_ESP32S3_WROOM_CAM, CUSTOM | AI Thinker / M5Stack PSRAM / M5Stack Wide / ESP Eye / FireBeetle 2 ESP32S3 / NL-ESP32-S3-CAM / XIAO ESP32S3 / ESP32-S3-WROOM-CAM / 自定义引脚 |
| RESOLUTION | FRAMESIZE_UXGA, FRAMESIZE_SXGA, FRAMESIZE_XGA, FRAMESIZE_SVGA, FRAMESIZE_VGA, FRAMESIZE_CIF, FRAMESIZE_QVGA, FRAMESIZE_HQVGA, FRAMESIZE_QQVGA | UXGA (1600x1200) / SXGA (1280x1024) / XGA (1024x768) / SVGA (800x600) / VGA (640x480) / CIF (400x296) / QVGA (320x240) / HQVGA (240x176) / QQVGA (160x120) |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_camera_webserver_init(CAMERA_MODEL_AI_THINKER, FRAMESIZE_UXGA)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_camera_capture())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

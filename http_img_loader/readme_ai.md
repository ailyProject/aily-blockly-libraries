# Network image loader

Use ESP32 HTTP to download JPEG images from the network and display them to the LVGL graphical interface, supporting PSRAM and LittleFS dual modes

## Library Info
- **Name**: @aily-project/lib-lvgl-http-image-loader
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lvgl_http_img_init` | Statement | WIDTH(input_value), HEIGHT(input_value), PSRAM_MODE(dropdown), STORAGE_MODE(dropdown), MAX_SIZE(input_value), TIMEOUT(input_value), DEBUG(dropdown) | `lvgl_http_img_init(math_number(0), math_number(0), AUTO, AUTO, math_number(0), math_number(1000), FALSE)` | HttpImageConfig httpImgConfig;\n |
| `lvgl_http_img_load` | Statement | URL(input_value), VAR(field_variable) | `lvgl_http_img_load(text("value"), variables_get($img))` | http_img_err_t httpImgLastError = httpImageLoader().load(..., ...);\n |
| `lvgl_http_img_get_info` | Value | URL(input_value) | `lvgl_http_img_get_info(text("value"))` | httpImageLoader().getInfo(..., NULL) == HTTP_IMG_OK ? 0 : -1 |
| `lvgl_http_img_check` | Value | URL(input_value) | `lvgl_http_img_check(text("value"))` | httpImageLoader().checkLoadable(...) == HTTP_IMG_OK |
| `lvgl_http_img_has_psram` | Value | (none) | `lvgl_http_img_has_psram()` | httpImageLoader().hasPsram() |
| `lvgl_http_img_get_max_size` | Value | (none) | `lvgl_http_img_get_max_size()` | httpImageLoader().getMaxSize() |
| `lvgl_http_img_get_last_error` | Value | (none) | `lvgl_http_img_get_last_error()` | httpImgLastError |
| `lvgl_http_img_err_to_string` | Value | ERR_CODE(input_value) | `lvgl_http_img_err_to_string(math_number(0))` | httpImageLoader().errToStr((http_img_err_t)...) |
| `lvgl_http_img_cleanup` | Statement | (none) | `lvgl_http_img_cleanup()` | httpImageLoader().cleanup();\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PSRAM_MODE | AUTO, AVAILABLE, NONE | lvgl_http_img_init |
| STORAGE_MODE | AUTO, LITTLEFS, PSRAM | lvgl_http_img_init |
| DEBUG | FALSE, TRUE | lvgl_http_img_init |

## ABS Examples

### Basic Usage
```
arduino_setup()
    lvgl_http_img_init(math_number(0), math_number(0), AUTO, AUTO, math_number(0), math_number(1000), FALSE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, lvgl_http_img_get_info(text("value")))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

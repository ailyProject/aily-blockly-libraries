# Sentry 智能视觉传感器

Sentry1、Sentry2、Sentry3 三型号独立的 Blockly 代码生成库。

## Library Info
- **Name**: @aily-project/lib-tosee-sentry
- **Version**: 2.0.0

## Variable Types

| 初始化积木 | 自动创建变量 | 类型 |
|---|---|---|
| `sentry1_init_i2c` / `sentry1_init_uart` | `$sentry1` | `Sentry1Device` |
| `sentry2_init_i2c` / `sentry2_init_uart` | `$sentry2` | `Sentry2Device` |
| `sentry3_init_i2c` / `sentry3_init_uart` | `$sentry3` | `Sentry3Device` |

不同类型不可互换。初始化的 `VAR` 是引号字符串；后续 `VAR` 参数使用 `$变量名`。

## Common Block Pattern

以下模式中 `N` 为 `1`、`2` 或 `3`。表格同时覆盖三个型号中存在的同名积木。

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `sentryN_init_i2c` | Statement | VAR(field_input), ADDRESS(input_value) | `sentry1_init_i2c("sentry1", math_number(96))` | `Sentry1 sentry1(96);` and `begin(&Wire)` |
| `sentryN_init_uart` | Statement | VAR, SERIAL(dropdown), BAUD(input_value) | `sentry3_init_uart("sentry3", Serial, math_number(115200))` | serial begin and sensor begin |
| `sentryN_set_led` | Statement | VAR, DETECTED, UNDETECTED, LEVEL(input_value) | `sentry1_set_led($sentry1, kLedGreen, kLedClose, math_number(2))` | `LedSetColor(...)` |
| `sentryN_vision_control` | Statement | VAR, ACTION, VISION | `sentry2_vision_control($sentry2, BEGIN, 5)` | `VisionBegin(5)` |
| `sentryN_set_region_param` | Statement | VAR, ID, X, Y, WIDTH, HEIGHT | `sentry1_set_region_param($sentry1, math_number(1), math_number(50), math_number(50), math_number(10), math_number(10))` | color region `SetParam` |
| `sentryN_set_blob_param` | Statement | VAR, ID, WIDTH, HEIGHT, COLOR | `sentry2_set_blob_param($sentry2, math_number(1), math_number(10), math_number(10), 3)` | blob `SetParam` with label |
| `sentryN_camera_awb` | Statement | VAR, AWB | `sentry1_camera_awb($sentry1, kLockWhiteBalance)` | `CameraSetAwb(...)` |
| `sentryN_vision_default` | Statement | VAR, VISION | `sentry3_vision_default($sentry3, 12)` | `VisionSetDefault(12)` |
| `sentryN_restart` | Statement | VAR | `sentry2_restart($sentry2)` | `SensorSetRestart()` |
| `sentryN_sensor_default` | Statement | VAR, VISION_ONLY(input_value) | `sentry1_sensor_default($sentry1, logic_boolean(TRUE))` | `SensorSetDefault(true)` |
| `sentryN_detected_count` | Value(Number) | VAR, VISION | `sentry1_detected_count($sentry1, 3)` | `GetValue(3, kStatus, 1)` |
| `sentryN_get_value` | Value(Number) | VAR, VISION, ID, INFO | `sentry2_get_value($sentry2, 8, math_number(1), kLabel)` | `GetValue(8, kLabel, 1)` |
| `sentryN_detected_label` | Value(Boolean) | VAR, VISION, ID, LABEL | `sentry3_detected_label($sentry3, 8, math_number(1), math_number(1))` | label comparison |
| `sentryN_vision_status` | Value(Boolean) | VAR, VISION | `sentry2_vision_status($sentry2, 9)` | `VisionGetStatus(9)` |
| `sentryN_update_result` | Value(Number) | VAR, VISION | `sentry3_update_result($sentry3, 14)` | `UpdateResult(14)` |

## Sentry1 Blocks

| Block Type | Connection | Purpose |
|---|---|---|
| `sentry1_init_i2c` | Statement | I2C initialization |
| `sentry1_init_uart` | Statement | UART initialization |
| `sentry1_set_led` | Statement | Indicator colors |
| `sentry1_vision_control` | Statement | Start/stop supported algorithm |
| `sentry1_set_region_param` | Statement | Color sampling region |
| `sentry1_set_blob_param` | Statement | Blob size and color |
| `sentry1_camera_awb` | Statement | White balance |
| `sentry1_vision_default` | Statement | Restore algorithm defaults |
| `sentry1_restart` | Statement | Restart sensor |
| `sentry1_sensor_default` | Statement | Restore sensor defaults |
| `sentry1_detected_count` | Value(Number) | Detected target count |
| `sentry1_get_value` | Value(Number) | Numeric result field |
| `sentry1_detected_label` | Value(Boolean) | Label comparison |
| `sentry1_get_qrcode` | Value(String) | QR text |
| `sentry1_vision_status` | Value(Boolean) | Algorithm enabled state |
| `sentry1_update_result` | Value(Number) | Explicit result update |

Sentry1 algorithms: `1` 颜色, `2` 色块, `3` 球体, `4` 线条, `6` 卡片, `7` 人体, `9` 二维码, `11` 运动。Sentry1 只支持单个检测结果。

## Sentry2 Blocks

| Block Type | Connection | Purpose |
|---|---|---|
| `sentry2_init_i2c`, `sentry2_init_uart` | Statement | Initialization |
| `sentry2_set_led`, `sentry2_vision_control` | Statement | Indicator and algorithm control |
| `sentry2_set_param_num` | Statement | Maximum result count |
| `sentry2_set_region_param`, `sentry2_set_blob_param`, `sentry2_set_label_param` | Statement | Color/blob/label parameters |
| `sentry2_set_mode`, `sentry2_set_apriltag_mode`, `sentry2_set_level` | Statement | Algorithm mode and performance |
| `sentry2_camera_zoom`, `sentry2_camera_awb` | Statement | Camera setup |
| `sentry2_set_coordinate` | Statement | Pixel/percentage coordinates |
| `sentry2_vision_default`, `sentry2_restart`, `sentry2_sensor_default` | Statement | Maintenance |
| `sentry2_screen_config`, `sentry2_screen_fill`, `sentry2_snapshot` | Statement | Screen and image capture |
| `sentry2_detected_count`, `sentry2_get_value` | Value(Number) | Numeric results |
| `sentry2_detected_label`, `sentry2_vision_status` | Value(Boolean) | Result/status checks |
| `sentry2_get_qrcode` | Value(String) | QR text |
| `sentry2_update_result`, `sentry2_image_rows`, `sentry2_image_cols` | Value(Number) | Update and image dimensions |

Sentry2 algorithms: `1` 颜色, `2` 色块, `3` 标签, `4` 线条, `5` 深度学习, `6` 卡片, `7` 人脸, `8` 20类物体, `9` 二维码, `10` 自定义功能, `11` 运动。

## Sentry3 Blocks

| Block Type | Connection | Purpose |
|---|---|---|
| `sentry3_init_i2c`, `sentry3_init_uart` | Statement | Initialization |
| `sentry3_set_led`, `sentry3_vision_control` | Statement | Indicator and algorithm control |
| `sentry3_set_param_num` | Statement | Maximum result count |
| `sentry3_set_region_param`, `sentry3_set_blob_param`, `sentry3_set_label_param` | Statement | Color/blob/label parameters |
| `sentry3_set_mode`, `sentry3_set_apriltag_mode`, `sentry3_set_barcode_mode` | Statement | General, tag, and barcode modes |
| `sentry3_set_ocr_mode`, `sentry3_set_face_mode`, `sentry3_set_level` | Statement | OCR, face, and performance modes |
| `sentry3_camera_zoom`, `sentry3_camera_awb`, `sentry3_set_coordinate` | Statement | Camera/result setup |
| `sentry3_vision_default`, `sentry3_restart`, `sentry3_sensor_default` | Statement | Maintenance |
| `sentry3_screen_config`, `sentry3_screen_fill`, `sentry3_snapshot` | Statement | Screen and image capture |
| `sentry3_detected_count`, `sentry3_get_value` | Value(Number) | Numeric results |
| `sentry3_detected_label`, `sentry3_vision_status` | Value(Boolean) | Result/status checks |
| `sentry3_get_string` | Value(String) | Face/QR/barcode/OCR/license text |
| `sentry3_update_result`, `sentry3_image_rows`, `sentry3_image_cols` | Value(Number) | Update and dimensions |
| `sentry3_wifi_connect`, `sentry3_wifi_close` | Statement | Cloud WiFi connection |
| `sentry3_llm_mode`, `sentry3_llm_model`, `sentry3_llm_api_key` | Statement | Large-model access |
| `sentry3_llm_prompt`, `sentry3_llm_voice`, `sentry3_llm_thinking` | Statement | Large-model behavior |
| `sentry3_llm_chat` | Value(String) | Send text and return answer |
| `sentry3_llm_tts` | Statement | Text-to-speech |

Sentry3 algorithms: `1` 颜色, `2` 色块, `3` 标签, `4` 线条, `5` 深度学习, `7` 人脸, `8` 80类物体, `9` 二维码, `10` 条形码, `12` 文字, `13` 手势姿态, `14` 车牌。卡片与人体姿态未加入，因为官方资料标记为待集成。

## Options

| Parameter | Values |
|---|---|
| ACTION | `BEGIN`, `END` |
| INFO | `kXValue`, `kYValue`, `kWidthValue`, `kHeightValue`, `kLabel`, `kRValue`, `kGValue`, `kBValue` |
| COLOR | `1` black, `2` white, `3` red, `4` green, `5` blue, `6` yellow |
| LEVEL | `kLevelDefault`, `kLevelSpeed`, `kLevelBalance`, `kLevelAccuracy` |
| LLM MODE | `kModeClose`, `kModeChat`, `kModeImage`, `kModeTalk`, `kModeASR`, `kModeTTS` |

## Example

```text
arduino_setup()
    sentry3_init_uart("sentry3", Serial, math_number(115200))
    sentry3_vision_control($sentry3, BEGIN, 10)

arduino_loop()
    controls_if()
        @IF0: logic_compare(sentry3_detected_count($sentry3, 10), GT, math_number(0))
        @DO0:
            serial_println(Serial, sentry3_get_string($sentry3, 10, math_number(1)))
```

All `input_value` parameters require nested value blocks such as `math_number`, `text`, or `logic_boolean`; do not use bare literals in value slots.

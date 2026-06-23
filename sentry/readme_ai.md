# Sentry Vision Sensor

Sentry1/Sentry2 AI vision sensor library supporting color, blob, ball, card, face, QR code, and 20-class object detection.

## Library Info
- **Name**: @aily-project/lib-sentry
- **Version**: 2.1.5

## Global Objects

This library uses **global objects** (not variables):
- `sentry` — Sentry2 instance, created by `sentry2_begin`
- `sentry1` — Sentry1 instance, created by `sentry1_begin`

All blocks reference these global objects directly; no variable management needed.

## Block Definitions — Sentry2

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sentry2_begin` | Statement | PORT(dropdown), ADDR(dropdown) | `sentry2_begin(Wire, 0x60)` | `while (SENTRY_OK != sentry.begin(&Wire)) {yield();}` |
| `sentry2_set_default` | Statement | — | `sentry2_set_default()` | `sentry.SensorSetDefault();` |
| `sentry2_set_vision_status` | Statement | STATUS(dropdown), VISION(dropdown) | `sentry2_set_vision_status(Begin, Sentry2::kVisionColor)` | `sentry.VisionBegin(Sentry2::kVisionColor);` |
| `sentry2_set_awb` | Statement | AWB(dropdown) | `sentry2_set_awb(kWhiteLight)` | `sentry.CameraSetAwb(kWhiteLight);` |
| `sentry2_set_param_num` | Statement | VISION(dropdown), NUM(input_value) | `sentry2_set_param_num(Sentry2::kVisionBlob, math_number(1))` | `sentry.SetParamNum(Sentry2::kVisionBlob,1);` |
| `sentry2_set_color_param` | Statement | X(input_value), Y, W, H, INDEX | `sentry2_set_color_param(math_number(50), math_number(50), math_number(3), math_number(4), math_number(1))` | Sets `sentry_object_t param` fields, calls `sentry.SetParam(...)` |
| `sentry2_set_blob_param` | Statement | W(input_value), H, COLOR(dropdown), INDEX | `sentry2_set_blob_param(math_number(3), math_number(4), Sentry2::kColorRed, math_number(1))` | Sets param width/height/label, calls `sentry.SetParam(...)` |
| `sentry2_set_custom_param` | Statement | VISION(dropdown), X, Y, W, H, LABEL, INDEX | `sentry2_set_custom_param(Sentry2::kVisionCustom, 0, 0, 0, 0, 0, 1)` | Sets all param fields, calls `sentry.SetParam(...)` |
| `sentry2_detected_count` | Value(Number) | VISION(dropdown) | `sentry2_detected_count(Sentry2::kVisionColor)` | `sentry.GetValue(Sentry2::kVisionColor, kStatus)` |
| `sentry2_get_value` | Value(Number) | VISION(dropdown), VALUE(dropdown), INDEX(input_value) | `sentry2_get_value(Sentry2::kVisionBlob, kXValue, math_number(1))` | `sentry.GetValue(Sentry2::kVisionBlob,kXValue,1)` |
| `sentry2_get_color_value` | Value(Number) | VALUE(dropdown), INDEX(input_value) | `sentry2_get_color_value(kRValue, math_number(1))` | `sentry.GetValue(Sentry2::kVisionColor,kRValue,1)` |
| `sentry2_get_line_value` | Value(Number) | VALUE(dropdown), INDEX(input_value) | `sentry2_get_line_value(kXValue, math_number(1))` | `sentry.GetValue(Sentry2::kVisionLine,kXValue,1)` |
| `sentry2_get_qr_value` | Value(String) | — | `sentry2_get_qr_value()` | `String(sentry.GetQrCodeValue())` |
| `sentry2_get_qr_position` | Value(Number) | VALUE(dropdown), INDEX(input_value) | `sentry2_get_qr_position(kXValue, math_number(1))` | `sentry.GetValue(Sentry2::kVisionQrCode,kXValue,1)` |
| `sentry2_get_custom_value` | Value(Number) | VALUE(dropdown), INDEX(input_value) | `sentry2_get_custom_value(kXValue, math_number(1))` | `sentry.GetValue(Sentry2::kVisionCustom,kXValue,1)` |
| `sentry2_check_blob_color` | Value(Boolean) | COLOR(dropdown), INDEX(input_value) | `sentry2_check_blob_color(Sentry2::kColorRed, math_number(1))` | `(sentry.GetValue(Sentry2::kVisionBlob,kLabel,1)==Sentry2::kColorRed)` |
| `sentry2_check_card` | Value(Boolean) | CARD(dropdown), INDEX(input_value) | `sentry2_check_card(Sentry2::kCardForward, math_number(1))` | `(sentry.GetValue(Sentry2::kVisionCard,kLabel,1)==Sentry2::kCardForward)` |
| `sentry2_check_20class` | Value(Boolean) | CLASS(dropdown), INDEX(input_value) | `sentry2_check_20class(Sentry2::kCat, math_number(1))` | `(sentry.GetValue(Sentry2::kVision20Classes,kLabel,1)==Sentry2::kCat)` |
| `sentry2_rows` | Value(Number) | — | `sentry2_rows()` | `sentry.rows()` |
| `sentry2_cols` | Value(Number) | — | `sentry2_cols()` | `sentry.cols()` |

## Block Definitions — Sentry1

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sentry1_begin` | Statement | PORT(dropdown), ADDR(dropdown) | `sentry1_begin(Wire, 0x60)` | `while (SENTRY_OK != sentry1.begin(&Wire)) {yield();}` |
| `sentry1_set_default` | Statement | — | `sentry1_set_default()` | `sentry1.SensorSetDefault();` |
| `sentry1_led_set_color` | Statement | COLOR1(dropdown), COLOR2(dropdown), LEVEL(input_value) | `sentry1_led_set_color(kLedRed, kLedClose, math_number(1))` | `sentry1.LedSetColor(kLedRed,kLedClose,1);` |
| `sentry1_set_vision_status` | Statement | STATUS(dropdown), VISION(dropdown) | `sentry1_set_vision_status(Begin, Sentry1::kVisionColor)` | `sentry1.VisionBegin(Sentry1::kVisionColor);` |
| `sentry1_set_awb` | Statement | AWB(dropdown) | `sentry1_set_awb(kWhiteLight)` | `sentry1.CameraSetAwb(kWhiteLight);` |
| `sentry1_set_param_num` | Statement | VISION(dropdown), NUM(input_value) | `sentry1_set_param_num(Sentry1::kVisionBlob, math_number(1))` | `sentry1.SetParamNum(Sentry1::kVisionBlob,1);` |
| `sentry1_set_color_param` | Statement | X, Y, W, H (all input_value) | `sentry1_set_color_param(math_number(50), math_number(50), math_number(3), math_number(4))` | Sets param, calls `sentry1.SetParam(...)` |
| `sentry1_set_blob_param` | Statement | W, H (input_value), COLOR(dropdown) | `sentry1_set_blob_param(math_number(3), math_number(4), Sentry1::kColorRed)` | Sets param, calls `sentry1.SetParam(...)` |
| `sentry1_detected_count` | Value(Number) | VISION(dropdown) | `sentry1_detected_count(Sentry1::kVisionColor)` | `sentry1.GetValue(Sentry1::kVisionColor, kStatus)` |
| `sentry1_get_value` | Value(Number) | VISION(dropdown), VALUE(dropdown), INDEX(input_value) | `sentry1_get_value(Sentry1::kVisionBlob, kXValue, math_number(1))` | `sentry1.GetValue(Sentry1::kVisionBlob,kXValue,1)` |
| `sentry1_get_color_value` | Value(Number) | VALUE(dropdown), INDEX(input_value) | `sentry1_get_color_value(kRValue, math_number(1))` | `sentry1.GetValue(Sentry1::kVisionColor,kRValue,1)` |
| `sentry1_get_line_value` | Value(Number) | VALUE(dropdown), INDEX(input_value) | `sentry1_get_line_value(kXValue, math_number(1))` | `sentry1.GetValue(Sentry1::kVisionLine,kXValue,1)` |
| `sentry1_get_qr_value` | Value(String) | — | `sentry1_get_qr_value()` | `String(sentry1.GetQrCodeValue())` |
| `sentry1_get_qr_position` | Value(Number) | VALUE(dropdown), INDEX(input_value) | `sentry1_get_qr_position(kXValue, math_number(1))` | `sentry1.GetValue(Sentry1::kVisionQrCode,kXValue,1)` |
| `sentry1_check_blob_color` | Value(Boolean) | COLOR(dropdown), INDEX(input_value) | `sentry1_check_blob_color(Sentry1::kColorRed, math_number(1))` | `(sentry1.GetValue(Sentry1::kVisionBlob,kLabel,1)==Sentry1::kColorRed)` |
| `sentry1_check_card` | Value(Boolean) | CARD(dropdown), INDEX(input_value) | `sentry1_check_card(Sentry1::kCardForward, math_number(1))` | `(sentry1.GetValue(Sentry1::kVisionCard,kLabel,1)==Sentry1::kCardForward)` |
| `sentry1_check_ball` | Value(Boolean) | BALL(dropdown), INDEX(input_value) | `sentry1_check_ball(Sentry1::kBallTableTennis, math_number(1))` | `(sentry1.GetValue(Sentry1::kVisionBall,kLabel,1)==Sentry1::kBallTableTennis)` |

## Parameter Options

### VISION (Sentry2)
| Value | Description |
|-------|-------------|
| Sentry2::kVisionColor | Color recognition |
| Sentry2::kVisionBlob | Blob detection |
| Sentry2::kVisionAprilTag | AprilTag recognition |
| Sentry2::kVisionLine | Line detection |
| Sentry2::kVisionLearning | Deep learning |
| Sentry2::kVisionCard | Card recognition |
| Sentry2::kVisionFace | Face recognition |
| Sentry2::kVision20Classes | 20-class object detection |
| Sentry2::kVisionQrCode | QR code |
| Sentry2::kVisionCustom | Custom |
| Sentry2::kVisionMotionDetect | Motion detection |

### VISION (Sentry1)
| Value | Description |
|-------|-------------|
| Sentry1::kVisionColor | Color recognition |
| Sentry1::kVisionBlob | Blob detection |
| Sentry1::kVisionBall | Ball recognition |
| Sentry1::kVisionLine | Line detection |
| Sentry1::kVisionCard | Card recognition |
| Sentry1::kVisionBody | Body detection |

### VALUE (return type)
| Value | Description |
|-------|-------------|
| kXValue | X coordinate |
| kYValue | Y coordinate |
| kWidthValue | Width |
| kHeightValue | Height |
| kLabel | Label |
| kRValue | Red channel |
| kGValue | Green channel |
| kBValue | Blue channel |

### STATUS
| Value | Description |
|-------|-------------|
| Begin | Enable vision |
| End | Disable vision |

### AWB
| Value | Description |
|-------|-------------|
| kAutoWhiteBalance | Auto |
| kLockWhiteBalance | Lock |
| kWhiteLight | White light |
| kYellowLight | Yellow light |

### COLOR (Sentry2/Sentry1)
kColorBlack, kColorWhite, kColorRed, kColorGreen, kColorBlue, kColorYellow

### PORT
Wire (I2C), Serial, Serial1, Serial2

## ABS Examples

### Sentry2 Color Recognition
```
arduino_setup()
    sentry2_begin(Wire, 0x60)
    sentry2_set_vision_status(Begin, Sentry2::kVisionColor)
    serial_begin(Serial, 9600)

arduino_loop()
    variables_set($count, sentry2_detected_count(Sentry2::kVisionColor))
    controls_for($i, math_number(1), variables_get($count), math_number(1))
        serial_println(Serial, sentry2_get_color_value(kRValue, variables_get($i)))
```

### Sentry2 Blob Detection with Color Check
```
arduino_setup()
    sentry2_begin(Wire, 0x60)
    sentry2_set_awb(kWhiteLight)
    sentry2_set_vision_status(Begin, Sentry2::kVisionBlob)
    sentry2_set_param_num(Sentry2::kVisionBlob, math_number(1))
    sentry2_set_blob_param(math_number(3), math_number(4), Sentry2::kColorGreen, math_number(1))

arduino_loop()
    controls_if()
        @IF0: sentry2_check_blob_color(Sentry2::kColorGreen, math_number(1))
        @DO0:
            serial_println(Serial, text("Green detected"))
```

### Sentry1 Ball Recognition
```
arduino_setup()
    sentry1_begin(Wire, 0x60)
    sentry1_set_vision_status(Begin, Sentry1::kVisionBall)

arduino_loop()
    variables_set($count, sentry1_detected_count(Sentry1::kVisionBall))
    controls_for($i, math_number(1), variables_get($count), math_number(1))
        serial_println(Serial, sentry1_get_value(Sentry1::kVisionBall, kXValue, variables_get($i)))
```

## Notes

1. **Initialization**: Call `sentry2_begin` or `sentry1_begin` inside `arduino_setup()` before any other Sentry blocks
2. **Global objects**: `sentry` (Sentry2) and `sentry1` (Sentry1) are auto-created by begin blocks; do not use both simultaneously
3. **I2C Wire init**: When PORT=Wire, `Wire.begin()` is auto-added with dedup key `wire_Wire_begin`
4. **Serial init**: When PORT=Serial/Serial1/Serial2, `ensureSerialBegin()` is called automatically at 9600 baud
5. **Parameter order**: Follows `block.json` args0 order — dropdowns and input_values may interleave

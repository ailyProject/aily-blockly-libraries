# K10 Camera & AI Recognition

UNIHIKER K10 camera and AI recognition library, supports photo, face detection/recognition, pet detection, motion detection, QR code scanning

## Library Info
- **Name**: @aily-project/lib-unihiker-k10-camera-ai
- **Version**: 0.1.6

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `k10_camera_init` | Statement | (none) | `k10_camera_init()` | Dynamic code |
| `k10_camera_show` | Statement | (none) | `k10_camera_show()` | k10.setBgCamerImage(true);\n |
| `k10_camera_hide` | Statement | (none) | `k10_camera_hide()` | k10.setBgCamerImage(false);\n |
| `k10_photo_save` | Statement | FILENAME(input_value) | `k10_photo_save(text("value"))` | k10.photoSaveToTFCard( |
| `k10_photo_base64` | Value | (none) | `k10_photo_base64()` | k10CameraPhotoBase64() |
| `k10_ai_init` | Statement | MODE(dropdown) | `k10_ai_init(Face)` | Dynamic code |
| `k10_ai_switch_mode` | Statement | MODE(dropdown) | `k10_ai_switch_mode(Face)` | ai.switchAiMode(AIRecognition:: |
| `k10_ai_is_detected` | Value | TYPE(dropdown) | `k10_ai_is_detected(Face)` | ai.isDetectContent(AIRecognition:: |
| `k10_ai_get_face_data` | Value | DATA(dropdown) | `k10_ai_get_face_data(CenterX)` | ai.getFaceData(AIRecognition:: |
| `k10_ai_get_cat_data` | Value | DATA(dropdown) | `k10_ai_get_cat_data(CenterX)` | ai.getCatData(AIRecognition:: |
| `k10_ai_get_qrcode` | Value | (none) | `k10_ai_get_qrcode()` | ai.getQrCodeContent() |
| `k10_ai_set_motion_threshold` | Statement | THRESHOLD(input_value) | `k10_ai_set_motion_threshold(math_number(0))` | ai.setMotinoThreshold( |
| `k10_ai_face_recognized` | Value | (none) | `k10_ai_face_recognized()` | ai.isRecognized() |
| `k10_ai_get_face_id` | Value | (none) | `k10_ai_get_face_id()` | ai.getRecognitionID() |
| `k10_ai_face_cmd` | Statement | CMD(dropdown), ID(input_value) | `k10_ai_face_cmd(ENROLL, math_number(0))` | ai.sendFaceCmd( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | Face, Cat, Move, Code, Face | k10_ai_init, k10_ai_switch_mode |
| TYPE | Face, Cat, Move, Code | k10_ai_is_detected |
| DATA | CenterX, CenterY, Length, Width | k10_ai_get_face_data, k10_ai_get_cat_data |
| CMD | ENROLL, DELETE | k10_ai_face_cmd |

## ABS Examples

### Basic Usage
```
arduino_setup()
    k10_camera_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, k10_ai_is_detected(Face))
    time_delay(math_number(1000))
```

### Qwen Vision Usage
```
arduino_setup()
    k10_camera_init()

arduino_loop()
    variables_set(photo_base64, k10_photo_base64())
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. `k10_photo_base64` returns a raw JPEG Base64 string without a `data:image/jpeg;base64,` prefix, so it can connect directly to `qwen_omni_vision_chat`.
4. `k10_photo_base64` temporarily hides the camera preview, drops stale frames, captures a fresh frame, then restores the preview only when it was visible before capture. It prints `[K10-CAM]` diagnostics to `Serial`.
5. Use `k10_camera_hide` before K10 voice playback or cloud voice chat when live camera preview makes audio stutter. It hides the preview and stops LVGL camera-frame refresh; use `k10_camera_show` to resume preview later.

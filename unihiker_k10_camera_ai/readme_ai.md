# K10 Camera & AI Recognition

UNIHIKER K10 camera and AI recognition library, supports photo, face detection/recognition, pet detection, motion detection, QR code scanning

## Library Info
- **Name**: @aily-project/lib-unihiker-k10-camera-ai
- **Version**: 0.1.14

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `k10_camera_init` | Statement | (none) | `k10_camera_init()` | `camPlayState = 0; k10.initBgCamerImage(); k10.setBgCamerImage(false);` (setup) |
| `k10_camera_show` | Statement | (none) | `k10_camera_show()` | k10.setBgCamerImage(true);\n |
| `k10_camera_hide` | Statement | (none) | `k10_camera_hide()` | k10.setBgCamerImage(false);\n |
| `k10_photo_save` | Statement | FILENAME(input_value) | `k10_photo_save(text("value"))` | k10.photoSaveToTFCard( |
| `k10_photo_base64` | Value | (none) | `k10_photo_base64()` | k10CameraPhotoBase64() |
| `k10_ai_init` | Statement | MODE(dropdown) | `k10_ai_init(Face)` | `ai.initAi(); ... k10.initBgCamerImage(); k10.setBgCamerImage(false); k10StartAiModeHidden(...);` (setup) |
| `k10_ai_switch_mode` | Statement | MODE(dropdown) | `k10_ai_switch_mode(Face)` | `k10SwitchAiMode(AIRecognition::Face);` |
| `k10_ai_is_detected` | Value | TYPE(dropdown) | `k10_ai_is_detected(Face)` | ai.isDetectContent(AIRecognition:: |
| `k10_ai_get_face_data` | Value | DATA(dropdown) | `k10_ai_get_face_data(CenterX)` | ai.getFaceData(AIRecognition:: |
| `k10_ai_get_cat_data` | Value | DATA(dropdown) | `k10_ai_get_cat_data(CenterX)` | ai.getCatData(AIRecognition:: |
| `k10_ai_get_qrcode` | Value | (none) | `k10_ai_get_qrcode()` | ai.getQrCodeContent() |
| `k10_ai_set_motion_threshold` | Statement | THRESHOLD(input_value) | `k10_ai_set_motion_threshold(math_number(0))` | ai.setMotinoThreshold( |
| `k10_ai_face_recognized` | Value | (none) | `k10_ai_face_recognized()` | `ai.isRecognized()` |
| `k10_ai_get_face_id` | Value | (none) | `k10_ai_get_face_id()` | ai.getRecognitionID() |
| `k10_ai_face_cmd` | Statement | CMD(dropdown) | `k10_ai_face_cmd(ENROLL)` | `ai.sendFaceCmd(ENROLL);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | Face, Cat, Move, Code | k10_ai_init, k10_ai_switch_mode |
| TYPE | Face, Cat, Move, Code | k10_ai_is_detected |
| DATA (face) | CenterX, CenterY, Length, Width, LeftEyeX, LeftEyeY, RightEyeX, RightEyeY, NoseX, NoseY, LeftMouthX, LeftMouthY, RightMouthX, RightMouthY | k10_ai_get_face_data |
| DATA (cat) | CenterX, CenterY, Length, Width | k10_ai_get_cat_data |
| CMD | ENROLL, RECOGNIZE, DELETEALL | Learn a face, trigger one recognition attempt, or clear all learned faces |

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

### Face Recognition Usage
```
arduino_setup()
    k10_ai_init(Face)
    serial_begin(Serial, 9600)

k10_button_callback(buttonA, pressed)
    @DO:
        k10_ai_face_cmd(ENROLL)

k10_button_callback(buttonB, pressed)
    @DO:
        k10_ai_face_cmd(RECOGNIZE)

arduino_loop()
    controls_if()
        @IF0: k10_ai_face_recognized()
        @DO0:
            serial_println(Serial, k10_ai_get_face_id())
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. `k10_photo_base64` returns a raw JPEG Base64 string without a `data:image/jpeg;base64,` prefix, so it can connect directly to `qwen_omni_vision_chat`.
4. `k10_photo_base64` temporarily hides the camera preview, drops stale frames, captures a fresh frame, then restores the preview only when it was visible before capture. It prints `[K10-CAM]` diagnostics to `Serial`.
5. Use `k10_camera_hide` before K10 voice playback or cloud voice chat when live camera preview makes audio stutter. It hides the preview and stops LVGL camera-frame refresh; use `k10_camera_show` to resume preview later.
6. `k10_camera_hide` does not turn off the LCD backlight. It only hides the live camera layer and reveals the canvas/screen background underneath.
7. When AI and camera blocks are combined, generated setup code always calls `ai.initAi()` before `k10.initBgCamerImage()` so the camera producer, AI task, and display task share the same queues.
8. `k10_camera_init` and `k10_ai_init` never show the live preview automatically. Add `k10_camera_show` explicitly in setup or an event callback when the preview should become visible.
9. Face detection and identity recognition use the same `Face` AI mode. `k10_ai_is_detected(Face)` only reports that a face is present; it does not identify the person.
10. Use `k10_ai_face_cmd(ENROLL)` to learn a face and `k10_ai_face_cmd(RECOGNIZE)` to start one identity-recognition attempt. When `k10_ai_face_recognized()` becomes true, read `k10_ai_get_face_id()` once; it returns `-1` when no unread result exists.
11. Per-ID deletion is intentionally not exposed because K10 SDK 0.0.3 ignores the requested command in its two-argument `sendFaceCmd(cmd, id)` overload. `DELETEALL` is supported and clears every learned face.
12. Initialize AI in setup and keep the current mode on `Face` before sending face commands. Do not place AI initialization or mode switching in a fast loop because switching modes recreates the K10 AI tasks and queues.
13. Version 0.1.9 removes the obsolete face-command ID input. After upgrading an older project, replace existing `k10_ai_face_cmd` blocks if Blockly still displays the old two-parameter shape.
14. Version 0.1.10 starts the selected AI mode directly during initialization. It no longer starts `NoMode` first, avoiding the K10 SDK 0.0.3 task-shutdown wait that can block `setup()`, button callbacks, and voice recognition.
15. Version 0.1.11 warms the camera frame stream while keeping the preview object hidden, then starts the selected AI mode. `k10_ai_switch_mode` now uses a guarded helper and skips repeated switches to the current mode.
16. Version 0.1.12 starts the hidden camera pipeline in `NoMode`, waits 300 ms for frames and the SDK task to settle, then switches to the selected mode. This follows the K10 SDK lifecycle without automatically revealing the preview.
17. Version 0.1.13 exposes every face landmark value supported by K10 SDK 0.0.3, including both eyes, nose, and both mouth corners.
18. Version 0.1.14 waits for the first camera frame and starts the selected AI mode directly. It removes the startup `NoMode -> target mode` transition because K10 SDK 0.0.3 can wait forever while stopping a `NoMode` task that is still blocked on its first frame. Camera preview remains hidden until `k10_camera_show` is used.

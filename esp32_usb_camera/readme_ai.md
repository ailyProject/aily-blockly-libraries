# USB Camera

Captures MJPEG from a Full-Speed UVC camera on ESP32-S3. One global `UsbCamera` owns the native USB host controller.

## Library Info

- **Name**: `@aily-project/lib-esp32-usb-camera`
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp32_usb_camera_init` | Statement | RESOLUTION(dropdown), FPS(dropdown), VBUS_PIN(field_number), ACTIVE_HIGH(dropdown) | `esp32_usb_camera_init(320x240, 15, -1, true)` | `UsbCamera.begin(320, 240, 15, -1, true);` |
| `esp32_usb_camera_is_connected` | Value (Boolean) | (none) | `esp32_usb_camera_is_connected()` | `UsbCamera.isConnected()` |
| `esp32_usb_camera_capture` | Value (Boolean) | TIMEOUT(input_value) | `esp32_usb_camera_capture(math_number(1000))` | `UsbCamera.capture(ailyUsbCameraTimeout((double)(1000)))` |
| `esp32_usb_camera_frame_info` | Value (Number) | PROPERTY(dropdown) | `esp32_usb_camera_frame_info(frameSize)` | `UsbCamera.frameSize()` |
| `esp32_usb_camera_release` | Statement | (none) | `esp32_usb_camera_release()` | `UsbCamera.releaseFrame();` |
| `esp32_usb_camera_last_error` | Value (Number) | (none) | `esp32_usb_camera_last_error()` | `UsbCamera.lastError()` |
| `esp32_usb_camera_save` | Value (Boolean) | FS(dropdown), PATH(input_value) | `esp32_usb_camera_save(SD, text("value"))` | `UsbCamera.saveFrame(SD, String("value").c_str())` |
| `esp32_usb_camera_server_start` | Statement | PORT(input_value) | `esp32_usb_camera_server_start(math_number(0))` | `UsbCamera.startServer(ailyUsbCameraPort((double)(0)));` |
| `esp32_usb_camera_server_url` | Value (String) | (none) | `esp32_usb_camera_server_url()` | `UsbCamera.serverUrl()` |
| `esp32_usb_camera_server_stop` | Statement | (none) | `esp32_usb_camera_server_stop()` | `UsbCamera.stopServer();` |
| `esp32_usb_camera_end` | Statement | (none) | `esp32_usb_camera_end()` | `UsbCamera.end();` |

## Generated Dependencies

Each table row shows the handler's returned C++ expression or statement. The complete generation also includes these deduplicated declarations in global scope.

Every block adds:

```cpp
#include <AilyUsbCamera.h>
```

`esp32_usb_camera_save` additionally includes the selected filesystem's header: `SD.h`, `SD_MMC.h`, `LittleFS.h`, `SPIFFS.h` or `FFat.h`. The table's SD example adds:

```cpp
#include <SD.h>
```

`esp32_usb_camera_capture` additionally defines:

```cpp
static uint32_t ailyUsbCameraTimeout(double value) {
  if (!(value > 0)) return 0;
  return value > 60000 ? 60000 : (uint32_t)value;
}
```

`esp32_usb_camera_server_start` additionally defines:

```cpp
static uint16_t ailyUsbCameraPort(double value) {
  return value >= 1 && value <= 65535 ? (uint16_t)value : 80;
}
```

These handlers add no setup or loop code and create no additional global variables. The table's `PORT=0` example uses the documented fallback port 80. For saving, supply a real absolute path such as `/capture.jpg` after mounting the selected filesystem.

## Parameter Options

| Parameter | Values |
|---|---|
| RESOLUTION | `320x240`, `160x120`, `640x480` |
| FPS | `15`, `5`, `10`, `30` |
| VBUS_PIN | Integer -1 through 48; default -1. GPIO19/20 are reserved for USB data. Select an available board pin controlling an external power switch. |
| ACTIVE_HIGH | `true`, `false` |
| PROPERTY | `frameSize`, `frameWidth`, `frameHeight`, `frameCount` |
| FS | `SD`, `SD_MMC`, `LittleFS`, `SPIFFS`, `FFat` |

## ABS Examples

```abs
arduino_setup()
    serial_begin(Serial, 115200)
    esp32_usb_camera_init(320x240, 15, -1, true)

arduino_loop()
    serial_println(Serial, esp32_usb_camera_capture(math_number(1000)))
    serial_println(Serial, esp32_usb_camera_frame_info(frameSize))
    serial_println(Serial, esp32_usb_camera_last_error())
    time_delay(math_number(100))
```

## Notes

1. Target ESP32-S3 with PSRAM enabled, native USB-OTG, and USB CDC On Boot disabled. Bundles UVC 2.5.2 with a retry-safe shutdown patch; no IDF component installation is needed. Use Arduino-ESP32 3.3.12. Only that SDK version is compile-verified here. Use an independent USB-to-UART bridge for serial debugging. Data pins are GPIO19 (D-) and GPIO20 (D+); supply the camera with external 5V VBUS and a common ground. Never supply VBUS from a GPIO. VBUS_PIN=-1 leaves power control external.
2. Initialize once in setup. Begin starts host services asynchronously; it does not wait for a camera. `is_connected` becomes true only after MJPEG negotiation and stream startup. A second init requires a successful end first. The native host controller must be available exclusively to this library.
3. Camera modes must work at Full-Speed (12 Mbps). Start with 320x240 at 15fps. Each MJPEG frame must fit 64 KiB. A USB camera working on a PC is not sufficient evidence of compatibility. JPEG decoding, audio and vision algorithms are outside this library.
4. Capture waits for a new frame and returns a Boolean. TIMEOUT is constrained to 0..60000 ms; 0 polls an unread frame. On failure the old snapshot is invalidated. Successful captures retain a stable JPEG snapshot until capture, release, disconnect or end. Dimensions and size are zero without a valid snapshot. `frameCount` counts received frames since initialization, independently of capture.
5. Mount FS with its own library before saving. Save writes the captured snapshot and overwrites an existing file; it does not capture or initialize storage. Call it only after a successful capture.
6. Connect WiFi before starting the preview server. PORT defaults to 80; out-of-range values fall back to 80. `/` refreshes JPEG images, `/capture` returns image/jpeg, and server_url includes the actual port. HTTP uses a separate image copy and does not replace the user's snapshot. Server work runs in background tasks; no loop service block is required.
7. last_error is an ESP-IDF error code (0 means ESP_OK). Check it after init, capture, save, start/stop, or failed end. Stop errors retain resources still in use for a later retry. Hardware compatibility, hot-plug behavior and sustained capture still need physical-device validation.

# Korvo Bluetooth Agent

Korvo-2 V3 on the Deotaland platform over Bluetooth: voice chat, photos, TF recording, screen, touch and App controls

## Library Info
- **Name**: @aily-project/lib-deotaland-korvo-ble
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `korvo_ble_init` | Statement | NAME(field_input), SCREEN(dropdown), CAMERA(dropdown), DEBUG(dropdown), OTA(dropdown) | `korvo_ble_init("KORVO", true, true, true, false)` | `Korvo.begin("KORVO", true, true, true, false);` |
| `korvo_ble_is_ready` | Value | (none) | `korvo_ble_is_ready()` | `Korvo.isReady()` |
| `korvo_ble_print_status` | Statement | (none) | `korvo_ble_print_status()` | `Korvo.printStatus();` |
| `korvo_ble_talk_start` | Statement | MODE(dropdown), SECONDS(input_value) | `korvo_ble_talk_start(VOICE, math_number(0))` | `Korvo.startTalk(1);` |
| `korvo_ble_talk_stop` | Statement | (none) | `korvo_ble_talk_stop()` | `Korvo.stopTalk();` |
| `korvo_ble_is_talking` | Value | (none) | `korvo_ble_is_talking()` | `Korvo.isTalking()` |
| `korvo_ble_is_speaking` | Value | (none) | `korvo_ble_is_speaking()` | `Korvo.isSpeaking()` |
| `korvo_ble_test_tone` | Statement | (none) | `korvo_ble_test_tone()` | `Korvo.playTestTone();` |
| `korvo_ble_send_prompt` | Statement | TEXT(input_value) | `korvo_ble_send_prompt(text("value"))` | `Korvo.sendPrompt("value");` |
| `korvo_ble_take_photo` | Statement | (none) | `korvo_ble_take_photo()` | `Korvo.takePhoto();` |
| `korvo_ble_on_text` | Hat | HANDLER(input_statement) | `korvo_ble_on_text()` | `void korvo_ble_on_agent_text() { ↵ } ↵ Korvo.onText(korvo_ble_on_agent_text);` |
| `korvo_ble_agent_text` | Value | (none) | `korvo_ble_agent_text()` | `Korvo.lastText()` |
| `korvo_ble_show_text` | Statement | TEXT(input_value) | `korvo_ble_show_text(text("value"))` | `Korvo.showText("value");` |
| `korvo_ble_backlight` | Statement | STATE(dropdown) | `korvo_ble_backlight(true)` | `Korvo.setBacklight(true);` |
| `korvo_ble_update_sensor` | Statement | ID(field_input), LABEL(field_input), UNIT(field_input), TYPE(dropdown), VALUE(input_value) | `korvo_ble_update_sensor("temp0", "温度", "C", KORVO_NUMBER, math_number(0))` | `Korvo.updateNumber("temp0", 0);` |
| `korvo_ble_on_control` | Hat | ID(field_input), LABEL(field_input), TYPE(dropdown), HANDLER(input_statement) | `korvo_ble_on_control("led0", "灯", KORVO_NUMBER)` | `void korvo_ble_control_led0() { ↵ } ↵ Korvo.addControl("led0", KORVO_NUMBER, "灯", korvo_ble_control_led0);` |
| `korvo_ble_control_value` | Value | KIND(dropdown) | `korvo_ble_control_value(NUMBER)` | `Korvo.controlNumber()` |
| `korvo_ble_camera_preview` | Statement | STATE(dropdown) | `korvo_ble_camera_preview(true)` | `Korvo.setPreview(true);` |
| `korvo_ble_touch_pressed` | Value | (none) | `korvo_ble_touch_pressed()` | `Korvo.touchPressed()` |
| `korvo_ble_touch_point` | Value | AXIS(dropdown) | `korvo_ble_touch_point(X)` | `Korvo.touchX()` |
| `korvo_ble_sd_ready` | Value | (none) | `korvo_ble_sd_ready()` | `Korvo.sdReady()` |
| `korvo_ble_record_start` | Statement | (none) | `korvo_ble_record_start()` | `Korvo.startRecording();` |
| `korvo_ble_record_stop` | Statement | (none) | `korvo_ble_record_stop()` | `Korvo.stopRecording();` |
| `korvo_ble_is_recording` | Value | (none) | `korvo_ble_is_recording()` | `Korvo.isRecording()` |
| `korvo_ble_record_seconds` | Value | (none) | `korvo_ble_record_seconds()` | `Korvo.recordingSeconds()` |
| `korvo_ble_record_file` | Value | (none) | `korvo_ble_record_file()` | `Korvo.lastRecording()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SCREEN | true, false | korvo_ble_init |
| CAMERA | true, false | korvo_ble_init |
| DEBUG | true, false | korvo_ble_init |
| OTA | false, true | korvo_ble_init |
| MODE | VOICE, ASR | korvo_ble_talk_start |
| STATE | true, false | korvo_ble_backlight, korvo_ble_camera_preview |
| TYPE | KORVO_NUMBER, KORVO_SWITCH, KORVO_TEXT | korvo_ble_update_sensor, korvo_ble_on_control |
| KIND | NUMBER, SWITCH, TEXT | korvo_ble_control_value |
| AXIS | X, Y | korvo_ble_touch_point |

## ABS Examples

### Voice, photo and agent text
```abs
arduino_setup()
    korvo_ble_init("KORVO", true, true, true, false)

arduino_loop()
    korvo_ble_update_sensor("temp0", "温度", "C", KORVO_NUMBER, math_number(25))
    time_delay(math_number(1000))

korvo_ble_on_text()
    @HANDLER:
        serial_println(Serial, korvo_ble_agent_text())

korvo_ble_on_control("led0", "灯", KORVO_SWITCH)
    @HANDLER:
        korvo_ble_show_text(korvo_ble_control_value(TEXT))
```

### Touch to record, preview on the screen
```abs
arduino_setup()
    korvo_ble_init("KORVO", true, true, true, false)
    korvo_ble_camera_preview(true)

arduino_loop()
    controls_if()
        @IF0: korvo_ble_touch_pressed()
        @DO0:
            korvo_ble_record_start()
            time_delay(math_number(5000))
            korvo_ble_record_stop()
            serial_println(Serial, korvo_ble_record_file())
```

## Notes

1. **Board**: ESP32-S3-Korvo-2 V3 only (aily board "OJ Korvo S3"). Audio (ES8311 speaker, ES7210 microphones), the DVP camera (OV3660 on current boards; GC2145 fixes apply only to a GC2145), ST7789 screen (hardware SPI 40 MHz), CST816 touch, TF slot (1-bit SDMMC) and the TCA9554 expander use the board wiring; I2C is GPIO17/18. Use 16MB flash, OPI PSRAM, USB CDC On Boot disabled, Arduino-ESP32 3.3.10 or newer (verified 3.3.12) and the default `app3M_fat9M_16MB` (two app slots, needed for App updates).
2. **App**: the device is driven by an Agent Link compatible App over BLE. Voice, photos and prompts only flow after `korvo_ble_is_ready` is true. The device reports firmware 2.0.0 like the IDF reference firmware, so the App sends replies as IMA-ADPCM.
3. **Loop**: `korvo_ble_init` adds `Korvo.poll()` to the start of `loop()`; BLE, audio, photo upload, preview and screen drawing all advance there. Short `delay()` is tolerated, but avoid long waits in loop and in handlers.
4. **Voice**: `korvo_ble_talk_start` with VOICE sends a voice command the agent replies to; with ASR the App transcribes live and needs its audio channel open. VOICE carries raw PCM over GATT notify (about 9 KB/s against 32 KB/s of speech) through a 96 KiB queue, so keep commands to about 4 seconds; longer speech is cut. Agent replies are played on the speaker without extra blocks; `korvo_ble_is_speaking` reports it.
5. **Endpoints**: `korvo_ble_update_sensor` and `korvo_ble_on_control` register their ID at the top of `setup()`, before `Korvo.begin()`. Use unique IDs (letters, digits, underscore), at most 12 sensors and controls together. The built-in endpoints camera0, mic0 and speaker0 are always present.
6. **Screen and touch**: the built-in 5x7 font covers letters, digits and common symbols; Chinese shows as ?. While `korvo_ble_camera_preview` is on, text drawing waits and resumes when it is turned off. Touch coordinates are landscape: X 0–279, Y 0–239.
7. **Recording**: any TF card block mounts the card at `Korvo.begin()` (FAT32; restart after changing cards). Files are `/records/rec-NNNN.wav`, IMA-ADPCM at 16 kHz, numbered after the highest existing file; the App lists them with command 0x04. Stop a recording properly, otherwise its header is not written.
8. **App firmware update**: off by default. When on, the App can replace this program with new firmware over BLE.
9. **Exclusive BLE**: the library brings its own NimBLE stack with its pools in PSRAM. Do not combine it with other BLE libraries or with the Wi-Fi `deotaland_korvo_wifi` library in the same project. The bundled deotaland-arduino 0.8.1 is patched to match the IDF reference firmware: BLE replies default to IMA-ADPCM, audio that arrives before its reply command is kept, and the VOICE uplink queue is 96 KiB.
10. **Serial debug**: with debug on, `Serial.begin(115200)` is added and startup, link and transfer reports are printed (use the USB-UART port with USB CDC On Boot disabled).

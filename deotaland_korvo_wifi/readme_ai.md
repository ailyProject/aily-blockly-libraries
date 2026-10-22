# Korvo Wi-Fi Agent

Korvo-2 V3 on the Deotaland platform over Wi-Fi: realtime voice, sessions, CJK screen, touch and servos

## Library Info
- **Name**: @aily-project/lib-deotaland-korvo-wifi
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `korvo_wifi_init` | Statement | UI(dropdown), SSID(field_input), PASSWORD(field_input), DEBUG(dropdown) | `korvo_wifi_init(false, "SSID", "PASSWORD", true)` | `KorvoWifi.begin("value", "value", true, false, false, false);` |
| `korvo_wifi_cloud` | Statement | ACTION(dropdown) | `korvo_wifi_cloud(connect)` | `DeotalandCloud.connect();` |
| `korvo_wifi_state` | Value | STATE(dropdown) | `korvo_wifi_state(WIFI)` | `DeotalandCloud.wifiConnected()` |
| `korvo_wifi_info` | Value | INFO(dropdown) | `korvo_wifi_info(IP)` | `KorvoWifi.ipAddress()` |
| `korvo_wifi_show_status` | Statement | (none) | `korvo_wifi_show_status()` | `KorvoWifi.showStatus();` |
| `korvo_wifi_reset` | Statement | ACTION(dropdown) | `korvo_wifi_reset(ACTIVATION)` | `KorvoWifi.resetActivation();` |
| `korvo_wifi_ui_page` | Statement | PAGE(dropdown) | `korvo_wifi_ui_page(HOME)` | `KorvoWifi.openScreen(KORVO_WIFI_UI_HOME);` |
| `korvo_wifi_session_new` | Statement | (none) | `korvo_wifi_session_new()` | `KorvoWifi.newSession();` |
| `korvo_wifi_session_refresh` | Statement | PAGE(dropdown) | `korvo_wifi_session_refresh(FIRST)` | `KorvoWifi.refreshSessions(KORVO_WIFI_PAGE_FIRST);` |
| `korvo_wifi_session_has_page` | Value | PAGE(dropdown) | `korvo_wifi_session_has_page(NEXT)` | `KorvoWifi.hasNextPage()` |
| `korvo_wifi_session_count` | Value | (none) | `korvo_wifi_session_count()` | `KorvoWifi.sessionCount()` |
| `korvo_wifi_session_get` | Value | INDEX(input_value), FIELD(dropdown) | `korvo_wifi_session_get(math_number(0), NAME)` | `KorvoWifi.sessionName((int)(0))` |
| `korvo_wifi_session_select` | Statement | INDEX(input_value) | `korvo_wifi_session_select(math_number(0))` | `KorvoWifi.selectSession((int)(0));` |
| `korvo_wifi_session_delete` | Statement | (none) | `korvo_wifi_session_delete()` | `KorvoWifi.deleteSession(0);` |
| `korvo_wifi_session_delete_at` | Statement | INDEX(input_value) | `korvo_wifi_session_delete_at(math_number(0))` | `KorvoWifi.deleteSession(max(1, (int)(0)));` |
| `korvo_wifi_voice_connect` | Statement | (none) | `korvo_wifi_voice_connect()` | `KorvoWifi.startVoice();` |
| `korvo_wifi_listen` | Statement | ACTION(dropdown) | `korvo_wifi_listen(start)` | `KorvoWifi.listen(true);` |
| `korvo_wifi_voice_end` | Statement | (none) | `korvo_wifi_voice_end()` | `KorvoWifi.endVoice();` |
| `korvo_wifi_on_text` | Hat | HANDLER(input_statement) | `korvo_wifi_on_text()` | `void korvo_wifi_on_agent_text() { ↵ } ↵ KorvoWifi.onText(korvo_wifi_on_agent_text);` |
| `korvo_wifi_agent_text` | Value | (none) | `korvo_wifi_agent_text()` | `KorvoWifi.text()` |
| `korvo_wifi_screen_clear` | Statement | COLOR(dropdown) | `korvo_wifi_screen_clear("0xFFFF")` | `DeotalandScreen.clear(0xFFFF);` |
| `korvo_wifi_screen_text` | Statement | X(input_value), Y(input_value), TEXT(input_value), COLOR(dropdown) | `korvo_wifi_screen_text(math_number(0), math_number(0), text("value"), "0xFFFF")` | `KorvoWifi.showText(0, 0, "value", 0xFFFF);` |
| `korvo_wifi_screen_big` | Statement | X(input_value), Y(input_value), TEXT(input_value), COLOR(dropdown), SIZE(input_value) | `korvo_wifi_screen_big(math_number(0), math_number(0), text("value"), "0xFFFF", math_number(0))` | `DeotalandScreen.text(0, 0, "value", 0xFFFF, 0, constrain(0, 1, 8));` |
| `korvo_wifi_screen_rect` | Statement | X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value), COLOR(dropdown), FILL(dropdown) | `korvo_wifi_screen_rect(math_number(0), math_number(0), math_number(0), math_number(0), "0xFFFF", true)` | `DeotalandScreen.rect(0, 0, 0, 0, 0xFFFF, true);` |
| `korvo_wifi_backlight` | Statement | STATE(dropdown) | `korvo_wifi_backlight(true)` | `DeotalandScreen.backlight(true);` |
| `korvo_wifi_camera_preview` | Statement | (none) | `korvo_wifi_camera_preview()` | `DeotalandCamera.drawPreview();` |
| `korvo_wifi_camera_stop` | Statement | (none) | `korvo_wifi_camera_stop()` | `DeotalandCamera.stopPreview();` |
| `korvo_wifi_touch_pressed` | Value | (none) | `korvo_wifi_touch_pressed()` | `DeotalandTouch.pressed()` |
| `korvo_wifi_touch_point` | Value | AXIS(dropdown) | `korvo_wifi_touch_point(X)` | `(int)DeotalandTouch.x()` |
| `korvo_wifi_touch_gesture` | Value | GESTURE(dropdown) | `korvo_wifi_touch_gesture(TAP)` | `KorvoWifi.gesture(KORVO_WIFI_TAP)` |
| `korvo_wifi_volume` | Statement | VOLUME(input_value) | `korvo_wifi_volume(math_number(0))` | `DeotalandSpeaker.volume(constrain((int)(0), 0, 100));` |
| `korvo_wifi_tone` | Statement | FREQUENCY(input_value), DURATION(input_value) | `korvo_wifi_tone(math_number(0), math_number(1000))` | `KorvoWifi.tone((int)(0), (int)(1000));` |
| `korvo_wifi_mic` | Statement | ACTION(dropdown) | `korvo_wifi_mic(start)` | `DeotalandMicrophone.start();` |
| `korvo_wifi_mic_level` | Value | (none) | `korvo_wifi_mic_level()` | `(int)DeotalandMicrophone.level()` |
| `korvo_wifi_servo` | Statement | CHANNEL(dropdown), MODE(dropdown), ANGLE(input_value) | `korvo_wifi_servo(1, KORVO_WIFI_SERVO_180, math_number(90))` | `KorvoWifi.servo(1, KORVO_WIFI_SERVO_180, (int)(90));` |
| `korvo_wifi_servo_speed` | Statement | CHANNEL(dropdown), SPEED(input_value) | `korvo_wifi_servo_speed(1, math_number(9600))` | `KorvoWifi.servo(1, KORVO_WIFI_SERVO_SPEED, (int)(9600));` |
| `korvo_wifi_servo_stop` | Statement | CHANNEL(dropdown), ACTION(dropdown) | `korvo_wifi_servo_stop(1, STOP)` | `KorvoWifi.servo(1, KORVO_WIFI_SERVO_SPEED, 0);` |
| `korvo_wifi_servo_read` | Statement | (none) | `korvo_wifi_servo_read()` | `KorvoWifi.servoRead();` |
| `korvo_wifi_servo_value` | Value | CHANNEL(dropdown), FIELD(dropdown) | `korvo_wifi_servo_value(1, VALUE)` | `KorvoWifi.servoValue(1)` |
| `korvo_wifi_servo_ok` | Value | WHICH(dropdown) | `korvo_wifi_servo_ok(WRITE)` | `KorvoWifi.servoWriteOk()` |
| `korvo_wifi_on_control` | Hat | ID(field_input), LABEL(field_input), TYPE(dropdown), HANDLER(input_statement) | `korvo_wifi_on_control("led0", "灯", KORVO_WIFI_NUMBER)` | `void korvo_wifi_control_led0() { ↵ } ↵ KorvoWifi.addControl("led0", KORVO_WIFI_NUMBER, "灯", korvo_wifi_control_led0);` |
| `korvo_wifi_control_value` | Value | KIND(dropdown) | `korvo_wifi_control_value(NUMBER)` | `KorvoWifi.controlNumber()` |
| `korvo_wifi_report` | Statement | ID(field_input), LABEL(field_input), TYPE(dropdown), VALUE(input_value) | `korvo_wifi_report("temp0", "温度", KORVO_WIFI_NUMBER, math_number(0))` | `KorvoWifi.reportNumber("temp0", (float)(0));` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| UI | false, true | korvo_wifi_init |
| DEBUG | true, false | korvo_wifi_init |
| ACTION | connect, disconnect | korvo_wifi_cloud |
| STATE | WIFI, PLATFORM, SETUP, PAIRING, BLOCKED, AGENT, CONNECTING, VOICE, LISTEN, PLAYING | korvo_wifi_state |
| INFO | IP, CODE, EXPIRES, TITLE, HINT, PHASE, DETAIL, SN, VERSION, AGENT, AGENT_ID, SESSION, SESSION_NAME, VOICE_STATUS | korvo_wifi_info |
| ACTION | ACTIVATION, WIFI | korvo_wifi_reset |
| PAGE | HOME, APPS, CAMERA, VOICE, SERVO, STATUS | korvo_wifi_ui_page |
| PAGE | FIRST, NEXT, PREV | korvo_wifi_session_refresh |
| PAGE | NEXT, PREV | korvo_wifi_session_has_page |
| FIELD | NAME, ID, TIME | korvo_wifi_session_get |
| ACTION | start, stop | korvo_wifi_listen, korvo_wifi_mic |
| COLOR | 0xFFFF, 0x0000, 0xF800, 0x07E0, 0x001F, 0xFFE0, 0x07FF, 0xF81F, 0xFD20, 0x8410 | korvo_wifi_screen_clear, korvo_wifi_screen_text, korvo_wifi_screen_big |
| FILL | true, false | korvo_wifi_screen_rect |
| STATE | true, false | korvo_wifi_backlight |
| AXIS | X, Y | korvo_wifi_touch_point |
| GESTURE | TAP, LEFT, RIGHT, UP, DOWN | korvo_wifi_touch_gesture |
| CHANNEL | 1, 2, 3, 4, 5, 6, 7, 8, 255 | korvo_wifi_servo, korvo_wifi_servo_speed, korvo_wifi_servo_stop |
| MODE | KORVO_WIFI_SERVO_180, KORVO_WIFI_SERVO_360 | korvo_wifi_servo |
| ACTION | STOP, RELEASE | korvo_wifi_servo_stop |
| CHANNEL | 1, 2, 3, 4, 5, 6, 7, 8 | korvo_wifi_servo_value |
| FIELD | VALUE, MODE | korvo_wifi_servo_value |
| WHICH | WRITE, READ | korvo_wifi_servo_ok |
| TYPE | KORVO_WIFI_NUMBER, KORVO_WIFI_SWITCH, KORVO_WIFI_TEXT | korvo_wifi_on_control, korvo_wifi_report |
| KIND | NUMBER, SWITCH, TEXT | korvo_wifi_control_value |

## ABS Examples

### Tap to talk, show the reply
```abs
arduino_setup()
    korvo_wifi_init(false, "", "", true)

arduino_loop()
    controls_if()
        @IF0: logic_negate(korvo_wifi_state(PLATFORM))
        @DO0:
            korvo_wifi_show_status()
    controls_if()
        @IF0: logic_operation(korvo_wifi_touch_gesture(TAP), AND, korvo_wifi_state(AGENT))
        @DO0:
            controls_ifelse(logic_operation(korvo_wifi_state(VOICE), OR, korvo_wifi_state(CONNECTING)))
                @DO0:
                    korvo_wifi_voice_end()
                @ELSE:
                    controls_if()
                        @IF0: logic_compare(text_length(korvo_wifi_info(SESSION)), EQ, math_number(0))
                        @DO0:
                            korvo_wifi_session_new()
                    korvo_wifi_voice_connect()
    time_delay(math_number(20))

korvo_wifi_on_text()
    @HANDLER:
        korvo_wifi_screen_clear(0x0000)
        korvo_wifi_screen_text(math_number(20), math_number(20), korvo_wifi_agent_text(), 0xFFFF)
```

### Page through sessions with swipes, tap to call the first one
```abs
arduino_setup()
    korvo_wifi_init(false, "", "", true)

arduino_loop()
    controls_if()
        @IF0: logic_operation(korvo_wifi_state(PLATFORM), AND, korvo_wifi_touch_gesture(LEFT))
        @DO0:
            controls_ifelse(korvo_wifi_session_has_page(NEXT))
                @DO0:
                    korvo_wifi_session_refresh(NEXT)
                @ELSE:
                    korvo_wifi_session_refresh(FIRST)
            korvo_wifi_screen_clear(0x0000)
            korvo_wifi_screen_text(math_number(20), math_number(20), korvo_wifi_session_get(math_number(1), NAME), 0xFFFF)
    controls_if()
        @IF0: logic_operation(korvo_wifi_touch_gesture(TAP), AND, logic_compare(korvo_wifi_session_count(), GT, math_number(0)))
        @DO0:
            korvo_wifi_session_select(math_number(1))
            korvo_wifi_voice_connect()
    time_delay(math_number(20))
```

### Servo board modes and a platform reading
```abs
arduino_setup()
    korvo_wifi_init(false, "", "", true)

arduino_loop()
    korvo_wifi_servo(1, KORVO_WIFI_SERVO_180, math_number(30))
    time_delay(math_number(1000))
    korvo_wifi_servo(1, KORVO_WIFI_SERVO_180, math_number(150))
    korvo_wifi_servo_speed(2, math_number(50))
    time_delay(math_number(1000))
    korvo_wifi_servo_stop(2, STOP)
    korvo_wifi_servo_read()
    korvo_wifi_report("angle1", "SS1 角度", KORVO_WIFI_NUMBER, korvo_wifi_servo_value(1, VALUE))
    time_delay(math_number(1000))
```

### Platform control of all servos
```abs
arduino_setup()
    korvo_wifi_init(false, "", "", true)

korvo_wifi_on_control("arm0", "机械臂", KORVO_WIFI_NUMBER)
    @HANDLER:
        korvo_wifi_servo(255, KORVO_WIFI_SERVO_180, korvo_wifi_control_value(NUMBER))
```

## Notes

1. **Board**: ESP32-S3-Korvo-2 V3 (aily board "OJ Korvo S3"), 16MB flash, OPI PSRAM, USB CDC On Boot disabled, Arduino-ESP32 3.3.10 or newer (verified 3.3.12). The ~4.4MB firmware needs Partition Scheme Custom with two 7MB app slots (`src/partitions.csv`, table in readme.md). Do not erase the whole flash, or Wi-Fi, activation and the session choice in NVS are lost.
2. **First use**: an empty Wi-Fi name uses the saved network, else the `KorvoCloud-XXXX` hotspot at `http://192.168.4.1/` (`korvo_wifi_state(SETUP)`). Enter the activation code (`korvo_wifi_info(CODE)`, `korvo_wifi_state(PAIRING)`) in the console and bind a realtime-voice agent (`korvo_wifi_state(AGENT)`). Platform `https://bot.deotaland.cn`, product 6 (`korvo-s3`). `korvo_wifi_reset(ACTIVATION)` gets a new code (unbind in the console first); `korvo_wifi_reset(WIFI)` clears Wi-Fi and restarts into the hotspot.
3. **Voice**: as the IDF Voice page. `korvo_wifi_voice_connect` uses the selected session, retries every second (up to 10) while the platform is not ready, gives up after 30 s, then streams the microphone continuously; replies play by themselves and their text arrives in `korvo_wifi_on_text`. `korvo_wifi_listen(stop)` only pauses the microphone. Selecting, creating or deleting the current session during a call reconnects or hangs up. The choice is saved in NVS `kc_voice` for the same bound agent; a rebind ends the call and clears it.
4. **Sessions**: each `korvo_wifi_session_refresh` is one blocking HTTPS read of up to 8; never run it on every loop pass. `korvo_wifi_session_has_page` follows the platform cursor, which has no total. Numbers start at 1 on the current page; deleting reloads the first page.
5. **Loop**: `korvo_wifi_init` adds `KorvoWifi.poll()` to the start of `loop()`: one touch read per pass, at most one gesture per press (swipe over 42 px, tap under 15 px, kept 1 s), the voice call, and the text and control handlers. Keep handlers short.
6. **Screen**: 280×240 landscape; keep 20px from the rounded corners. `korvo_wifi_screen_text` has the 14px CJK font and wraps; `korvo_wifi_screen_big` is ASCII scaled 1–8; `korvo_wifi_show_status` redraws only on change.
7. **Original UI**: `korvo_wifi_init(true, ...)` runs the IDF pages (home, apps, camera, voice, sessions, servo, status); switch with `korvo_wifi_ui_page`. Drawing, touch, gesture and camera blocks do nothing there; voice blocks open or end the Voice page.
8. **Servo board**: HC32L110 on I2C 0x10, GPIO19/20, with the updated firmware of Agent Link dev (four-byte commands, 28-byte status); the old three-byte v2.0 firmware does not work. Modes: 180° position 0–180, 360° position 0–360, speed -100–100 (stop = 0), release; channel 255 drives all. Each command is followed by a status read; values are controller settings, not measured positions. `servo1`, `servo_control`, `servo_refresh` and `servo_status` are registered for the platform. The servo board and camera start only when their blocks are used.
9. **Platform endpoints**: `korvo_wifi_on_control` (at most 12) and `korvo_wifi_report` (at most 8) register before `KorvoWifi.begin()`; IDs are unique letters, digits and underscores; `camera0`, `servo1`, `servo_control`, `servo_refresh`, `servo_status`, `screen0` are reserved. Over Wi-Fi a report keeps the latest value for platform reads (no event push yet); text is 1–16 bytes. Wi-Fi image upload is not supported yet, so the camera is a local preview.
10. **Bundled libraries**: DeotalandCloud 1.4.0 (Agent Link dev, 2026-10-21), KorvoCloudCodecDev 1.6.2, KorvoCloudAudioCodec 2.2.1 (Opus for ESP32-S3), KorvoCloudLVGL 9.2.0, Adafruit GFX/ST7789/BusIO. Do not combine with the BLE `deotaland_korvo_ble` library or another LVGL library.
11. **Serial debug**: adds `Serial.begin(115200)` and prints module, network, voice and control messages; platform errors show the HTTP status, code and message with keys redacted.

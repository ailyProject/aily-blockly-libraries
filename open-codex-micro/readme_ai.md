# OpenCodexMicro Controller

Unofficial Codex Micro BLE HID controller library for ESP32-S3 touch boards and Xueersi XiaoMiao keypads.

## Library Info
- **Name**: @aily-project/lib-open-codex-micro
- **Version**: 1.0.0
- **Runtime**: ESP32/ESP32-S3, BLE HID + ArduinoJson RPC, TFT_eSPI display; S3 needs FT6336 + PSRAM full-frame sprite; XiaoMiao uses six keys + GPIO14 buzzer

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `opencodex_begin` | Statement | BOARD(dropdown) | `opencodex_begin(S3)` | Board macros + `openCodexBegin()` setup + `openCodexUpdate()` loop |
| `opencodex_connected` | Value | (none) | `opencodex_connected()` | `openCodexConnected()` |
| `opencodex_encrypted` | Value | (none) | `opencodex_encrypted()` | `openCodexEncrypted()` |
| `opencodex_host_ready` | Value | (none) | `opencodex_host_ready()` | `openCodexHostReady()` |
| `opencodex_set_page` | Statement | PAGE(dropdown) | `opencodex_set_page(Tasks)` | `openCodexSetPage(UiPage::Tasks);` |
| `opencodex_get_page` | Value | (none) | `opencodex_get_page()` | `static_cast<uint8_t>(openCodexGetPage())` |
| `opencodex_send_key` | Statement | KEY(dropdown), ACTION(dropdown), AGENT(input_value) | `opencodex_send_key(ACT06, 1, math_number(-1))` | `openCodexSendKey("ACT06", 1, -1);` |
| `opencodex_send_joystick` | Statement | ANGLE(input_value), DISTANCE(input_value) | `opencodex_send_joystick(math_number(0), math_number(1))` | `openCodexSendJoystick(0, 1);` |
| `opencodex_set_battery` | Statement | PERCENT(input_value), CHARGING(input_value) | `opencodex_set_battery(math_number(100), logic_boolean(FALSE))` | `openCodexSetBattery(100, false);` |
| `opencodex_play_sound` | Statement | CUE(dropdown) | `opencodex_play_sound(Success)` | `openCodexPlaySound(BoardSoundCue::Success);` |
| `opencodex_stop_sound` | Statement | (none) | `opencodex_stop_sound()` | `openCodexStopSound();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BOARD | S3, XUEERSI | S3=ST7789+FT6336 pins from reference N16R8 kit; XUEERSI=XiaoMiao ST7735+keys |
| PAGE | Tasks, Commands, Navigate | UI page enum |
| KEY | AG00..AG05, ACT06..ACT10, ACT12, ENC, ENC_CW, ENC_CC | Protocol key IDs |
| ACTION | 1, 0, 2 | press / release / encoder step |
| CUE | Success, Attention, Error, HighClick, LowClick | Board sound patterns |

## Notes
1. Always place `opencodex_begin` in `arduino_setup`. It injects board TFT macros, `SET_LOOP_TASK_STACK_SIZE(16*1024)`, Serial 115200, and auto loop update.
2. S3 full UI needs OPI PSRAM (N16R8 class). Without PSRAM, canvas allocation fails.
3. XiaoMiao gestures: A+B short cycles page; A+B long sends ACT12; Navigate maps A single/double to dial CW/CCW.
4. Status path: PAIR → LINK → ENC → LIVE (`host_ready`).
5. This library is independent/unofficial and is not affiliated with OpenAI or hardware vendors.
6. Do not write bare strings for `input_value` slots; use `text("")`, `math_number(n)`, `logic_boolean(TRUE|FALSE)`.

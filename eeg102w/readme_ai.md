# @aily-project/lib-eeg102w

## Library Info

- **Name**: @aily-project/lib-eeg102w
- **Version**: 0.0.1
- **Purpose**: BLE client for the EEG102W dual-channel EEG module (advertised name `KSEEG102`). The ESP32 scans for the module, connects, enables its data streams and exposes the latest focus / relaxation / fatigue / meditation indices, raw EEG CH1/CH2 values, battery level and electrode lead-off state.
- **Protocol**: 脑电模组 BLE 通讯协议 V1.0 (2026-09-24), combined with the module's characteristic set: service `8653000a-43e6-47b7-9cb0-5fc21d4ae340`, EEG data notify `8653000b-…`, control command write + read `8653000c-…`, and an optional feature-value notify `8653000d-…`.

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| --- | --- | --- | --- | --- |
| `eeg102w_connect` | Statement | TIMEOUT(input_value) | `eeg102w_connect(math_number(10))` | `#include "EEG102W.h"` ↵ `EEG102W.connect(10);` |
| `eeg102w_connected` | Value (Boolean) | (none) | `eeg102w_connected()` | `#include "EEG102W.h"` ↵ `EEG102W.isConnected()` |
| `eeg102w_metric` | Value (Number) | METRIC(dropdown) | `eeg102w_metric(FOCUS)` | `#include "EEG102W.h"` ↵ `EEG102W.focus()` |
| `eeg102w_raw` | Value (Number) | CH(dropdown) | `eeg102w_raw(1)` | `#include "EEG102W.h"` ↵ `EEG102W.rawValue(1)` |
| `eeg102w_battery` | Value (Number) | (none) | `eeg102w_battery()` | `#include "EEG102W.h"` ↵ `EEG102W.battery()` |
| `eeg102w_leadoff` | Value (Boolean) | (none) | `eeg102w_leadoff()` | `#include "EEG102W.h"` ↵ `EEG102W.leadOff()` |

## Parameter Options

| Parameter | Values | Description |
| --- | --- | --- |
| METRIC | FOCUS, RELAX, FATIGUE, MEDITATION | `eeg102w_metric`: focus → `EEG102W.focus()`, RELAX → `relax()`, FATIGUE → `fatigue()`, MEDITATION → `meditation()` |
| CH | 1, 2 | `eeg102w_raw`: 1 → `EEG102W.rawValue(1)`, 2 → `EEG102W.rawValue(2)` |

## ABS Examples

Complete program: connect, then print the indices, battery, raw CH1 value and lead-off state every 500 ms.
Required libraries: `@aily-project/lib-eeg102w`, `@aily-project/lib-core-loop`, `@aily-project/lib-core-serial`, `@aily-project/lib-core-logic`, `@aily-project/lib-core-time`.

```abs
arduino_global()
arduino_setup()
    serial_begin(Serial, 115200)
    serial_println(Serial, text("EEG102W：正在搜索并连接脑电模组 KSEEG102 ..."))
    eeg102w_connect(math_number(10))
    controls_ifelse(eeg102w_connected())
        @DO0:
            serial_println(Serial, text("EEG102W 已连接，开始读取数据"))
        @ELSE:
            serial_println(Serial, text("EEG102W 暂未连接，主循环中继续重试"))
arduino_loop()
    controls_ifelse(eeg102w_connected())
        @DO0:
            serial_print(Serial, text("专注度 "))
            serial_print(Serial, eeg102w_metric(FOCUS))
            serial_print(Serial, text("  放松度 "))
            serial_print(Serial, eeg102w_metric(RELAX))
            serial_print(Serial, text("  疲劳度 "))
            serial_print(Serial, eeg102w_metric(FATIGUE))
            serial_print(Serial, text("  冥想值 "))
            serial_print(Serial, eeg102w_metric(MEDITATION))
            serial_print(Serial, text("  电量 "))
            serial_print(Serial, eeg102w_battery())
            serial_print(Serial, text("  原始CH1 "))
            serial_print(Serial, eeg102w_raw(1))
            serial_print(Serial, text("  电极脱落 "))
            serial_println(Serial, eeg102w_leadoff())
        @ELSE:
            serial_println(Serial, text("EEG102W 未连接，正在重新搜索 ..."))
            eeg102w_connect(math_number(5))
    time_delay(math_number(500))
```

## Notes

1. **Initialization / lifetime**: `eeg102w_connect` is the only required initialization. It calls `BLEDevice::init`, scans for the device advertising `KSEEG102` for TIMEOUT seconds, connects, requests MTU 517 (a 69-byte raw notification cannot fit the default MTU 23), writes opcodes `0x07` (feature stream on) and `0x05` (raw stream on) to the control characteristic `8653000c-…` (write + read), then subscribes notifications on `8653000b-…` (EEG data) and, when the module exposes it, on `8653000d-…`. It returns nothing; check `eeg102w_connected` afterwards.
2. **Call location**: the block is a blocking statement and belongs in setup or a loop branch; the value blocks are event/loop-time readers. Every block adds `#include "EEG102W.h"`, emitted once per sketch.
3. **Callback context / data source**: both data characteristics feed one notification callback that routes each payload by its protocol size — 4 bytes is a feature packet, 69 bytes is a raw packet, anything else is ignored — so it does not matter which characteristic carries which kind. Parsed values are stored in the library singleton; the value blocks return the most recent packet and do not read the radio themselves.
4. **Before the first packet**: `eeg102w_metric` and `eeg102w_battery` return 0, `eeg102w_raw` returns 0.0 and `eeg102w_leadoff` returns false. The module has both streams enabled by default, but the command opcodes are written anyway.
5. **Values**: feature indices are 1..100 as sent by the module. `eeg102w_raw` returns the latest sample of the packet divided by 10000 (`rawValue`); the protocol does not state a physical unit, so no unit is published. Battery byte is the module's battery percentage; lead-off byte 1 means the electrode is off.
6. **Failure behaviour**: a scan that finds nothing returns after TIMEOUT seconds and leaves the module disconnected; the library never reconnects on its own, so a loop branch should call the connect block again. Only one module is supported at a time.
7. **Board / dependencies**: ESP32 only (uses the bundled ESP32 BLE library as a BLE central). The SDK BLE library's Bluedroid CCCD source needs the Arduino `Preferences` library, which the library source declares explicitly for build resolution.
8. **Unverified**: real BLE connection, module data and printed output were not measured — no module hardware was available. The packet parsing rules were verified at compile time with the board compiler; the radio path is unverified.

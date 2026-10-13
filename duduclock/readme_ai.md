# DuduClock 2.0 Blockly Library

A block-based reproduction of the Dudu weather clock (QWeather edition): WiFi provisioning, NTP time sync, current weather + air quality + 6-day forecast, 8 pages including a Pomodoro timer (25 min focus / 5 min break with buzzer alerts) and a LAN PC-hardware monitor page, A-button interaction and black/white themes, with 43 built-in images, 11 fonts and a self-contained gzip inflater.

## Library Info
- **Name**: @aily-project/lib-duduclock
- **Version**: 0.0.7
- **Board**: esp32:esp32 (Xueersi XiaoMiao ESP32 + 2-inch ST7789 portrait 240x320)
- **Dependencies**: @aily-project/lib-arduinojson, @aily-project/lib-xueersi-esp32-button

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `dudu_set_api_host` | Statement | HOST(input_value) | `dudu_set_api_host(text("your-host.re.qweatherapi.com"))` | `duduSetApiHost("your-host.re.qweatherapi.com");` |
| `dudu_set_weather_key` | Statement | KEY(input_value) | `dudu_set_weather_key(text("KEY"))` | `duduSetWeatherKey("KEY");` |
| `dudu_init` | Statement | (none) | `dudu_init()` | Injects the TFT macros plus the `TFT_eSPI tft` / `TFT_eSprite clk` globals, then emits `duduInit();` |
| `dudu_has_config` | Value (Boolean) | (none) | `dudu_has_config()` | `duduHasConfig()` |
| `dudu_start_config_portal` | Statement | (none) | `dudu_start_config_portal()` | `duduStartConfigPortal();` |
| `dudu_connect_wifi` | Statement | TIMEOUT(input_value) | `dudu_connect_wifi(math_number(30))` | `duduConnectWifi(30);` |
| `dudu_sync_data` | Statement | (none) | `dudu_sync_data()` | `duduSyncData();` |
| `dudu_start_tasks` | Statement | (none) | `dudu_start_tasks()` | `duduStartTasks();` |
| `dudu_run` | Statement | (none) | `dudu_run()` | `duduRun();` |
| `dudu_click` | Statement | (none) | `dudu_click()` | `duduClick();` |
| `dudu_double_click` | Statement | (none) | `dudu_double_click()` | `duduDoubleClick();` |
| `dudu_long_press` | Statement | (none) | `dudu_long_press()` | `duduLongPress();` |

Every block injects `#include "DuduClock.h"` (idempotent). `dudu_init` additionally injects `#include <TFT_eSPI.h>`, the ST7789 compile macros (ST7789_DRIVER, TFT_FREQUENCY=40000000, TFT_WIDTH=240, TFT_HEIGHT=320, TFT_MISO=19, TFT_MOSI=23, TFT_SCLK=18, TFT_CS=5, TFT_DC=4, TFT_RST=19, TFT_BL=-1, TFT_BACKLIGHT_ON=HIGH, TFT_RGB_ORDER=TFT_BGR, USE_HSPI_PORT) and the globals `TFT_eSPI tft = TFT_eSPI();` and `TFT_eSprite clk = TFT_eSprite(&tft);`.

## Parameter Options
No dropdown parameters. KEY/HOST are text inputs; TIMEOUT is a number input in seconds (30 recommended).

## ABS Examples

Complete program (equivalent to the program built and compiled in the authoring project):

```abs
# ABS Schema: 2
# Project Data Schema: 1 (external-only)

arduino_global()
arduino_setup()
    dudu_set_api_host(text("your-host.re.qweatherapi.com"))
    dudu_set_weather_key(text("your-qweather-key"))
    dudu_init()
    xueersi_esp32_button_set_debounce_ms(A, math_number(10))
    xueersi_esp32_button_set_press_ms(A, math_number(2000))
    controls_if(dudu_has_config())
        dudu_connect_wifi(math_number(30))
        dudu_sync_data()
        dudu_start_tasks()
    controls_if(logic_negate(dudu_has_config()))
        dudu_start_config_portal()

arduino_loop()
    dudu_run()

xueersi_esp32_button_on_event(A, CLICK)
    dudu_click()

xueersi_esp32_button_on_event(A, DOUBLE_CLICK)
    dudu_double_click()

xueersi_esp32_button_on_event(A, LONG_PRESS_START)
    dudu_long_press()
```

## Notes

1. **Initialization order**: `dudu_set_api_host` / `dudu_set_weather_key` must run before `dudu_init`; `dudu_init` must precede every other dudu block (it injects the tft/clk globals; without it linking fails). With a dedicated host, weather APIs use `https://<host>/v7/...` and city lookup uses `https://<host>/geo/v2/city/lookup` (verified live); without one the public devapi/geoapi.qweather.com domains are used.
2. **Models**: this library creates no Blockly variable models; `tft`/`clk` are C++ globals injected by the generator. The injection key matches lib-jinyichen-st7789's `tft`, but do **not** use `tftscr_init` together with this library (its setRotation(3) landscape breaks the portrait layout).
3. **Call sites**: `dudu_run` must be called repeatedly in the main loop (page state machine, periodic tasks, pomodoro tick, PC-monitor fetch scheduling and portal listener). The three button blocks are meant for the A-button events (source project GPIO8 single button, mapped to A = GPIO34). Button semantics: click = start/stop the timer on the timer page, start/pause the pomodoro on the pomodoro page (no effect elsewhere), double-click = cycle pages weather → air → forecast → theme → timer → pomodoro → pcmon → reset, long press = theme toggle / counter reset / pomodoro reset (keeps completed count) / factory reset.
4. **Scheduler**: internal periodic tasks (millis based): astronaut animation 30 ms (weather page only), message rotation 5 s (weather page only), weather + air 60 min (enabled 60 minutes after boot), 7-day forecast 71 min, network check 5 min, NTP sync 58 min. The timer page runs no background tasks (matching the source). The pomodoro countdown runs on every page (advanced once per `dudu_run` frame) and only redraws while its page is visible.
5. **Weather key**: without a key `dudu_sync_data` shows "key not set" and reboots. QWeather always answers gzip; the built-in `duduGunzip` (self-contained DEFLATE, verified against the real source with 9 host test cases) inflates the body before ArduinoJson v7 parses it.
6. **Capacity**: the firmware is about 2.96 MB and **requires the huge_app partition (3 MB APP / 1 MB SPIFFS)**; the default 1.2 MB partition overflows.
7. **Assets**: the 43 images and 11 fonts (const PROGMEM) are aggregated in DuduResource.h; single-TU resources are deduplicated by the linker's --gc-sections, while the two fonts shared by DuduPages.cpp and DuduDraw.cpp (`clock_num_big_64`, `city_wea_24`) are compiled once with external linkage in DuduPages.cpp (`DUDU_RESOURCE_IMPL`) and declared extern elsewhere — without this, the two 837 KB duplicate copies overflow the 3 MB partition.
8. **Pomodoro**: the pure state machine lives in `src/DuduClock/DuduPomo.h` (constexpr, board-compiler `static_assert` verified in `tests/pomo-check.cpp`: start/pause-resume/auto work→break switch/late single transition/reset keeping count). Focus is 25 min, break 5 min (`DUDU_POMO_WORK_MS`/`DUDU_POMO_BREAK_MS` in DuduClock.h). Phase changes beep on the onboard passive buzzer GPIO14 via the core `tone()` API (three rising beeps after focus, two falling beeps after break; the beep sequence blocks the frame for roughly 0.5 s). Page text uses the generated Microsoft YaHei subset fonts `pomo_title_35` / `pomo_text_24` (TFT_eSPI vlw arrays, big-endian header, glyphs listed in the files); the original 11 fonts are subsets of the source project's strings and lack characters like 专注/暂停/复位, so do not switch the pomodoro page back to them. The page draws a 60-tick radial ring (tft.fillTriangle, HSV colors via duduHsv565): focus = rainbow, break = green family, lit ticks shrink clockwise from 12 o'clock with the remaining fraction, idle = full ring; the big MM:SS sprite is drawn before the ring so ticks stay visible. After changing the displayed wording, add the new characters and rerun `tools/gen_pomo_font.py` (needs Pillow + a Windows system font), then rebuild.
9. **PC monitor page** (`PCMON`, new): fetches `DUDU_PCMON_URL` (edit in DuduClock.h, default `http://192.168.1.100:8266/`) every 3 s while visible (10 s backoff on failure), parses with ArduinoJson, and renders CPU/RAM cards, network speeds, uptime, date+weather row (QWeather), TEMP/RH row and a disk-usage bar in a fixed black/green terminal style. The PC runs either the standalone `DuduPCMonitor.exe` (project root, PyInstaller build, no Python needed) or `tools/pc_monitor_server.py` (Python 3 + psutil, port 8266; JSON: cpu, load[3], memPct, memUsed, memTotal, up, down, uptime, disk). Both advertise a UDP beacon (port 8267) so the device auto-follows IP changes. Full chain needs the PC side running; device-side failure path shows a hint page. The exe was smoke-tested on the authoring PC (HTTP JSON + beacon verified); rebuild with `py -m PyInstaller --onefile --console --name DuduPCMonitor tools/pc_monitor_server.py`.
10. **Unverified behavior**: rendering, provisioning flow and weather fetching were validated on one physical board; the provisioning QR code points to 192.168.1.1. The pomodoro page rendering, buzzer audibility and the PC-monitor end-to-end chain are code- and compile-verified only, not yet measured on hardware.

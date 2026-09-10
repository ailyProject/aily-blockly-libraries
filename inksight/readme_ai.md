# InkSight Content

Fetches server-rendered content from an InkSight backend (`/api/render`) and draws it on a GxEPD2 e-paper display (4.2" 400x300, e.g. GDEW042Z15 b/w/yellow).

## Library Info

- **Name**: @aily-project/lib-inksight
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `inksight_wifi` | Statement | SSID(field_input), PASSWORD(field_input) | `inksight_wifi("my-ssid", "my-pass")` | `inksightWifiBegin("value", "value");` |
| `inksight_setup` | Statement | SERVER(field_input), TOKEN(field_input) | `inksight_setup("https://www.inksight.site", "token")` | `inksightBegin("https://www.inksight.site", "value");` |
| `inksight_pair` | Statement | PAIRCODE(field_input) | `inksight_pair("123456")` | `inksightPair("value");` |
| `inksight_mode` | Statement | MODE(dropdown) | `inksight_mode(ACTIVE)` | `inksightSetMode(true);` |
| `inksight_colors` | Statement | MODE(dropdown) | `inksight_colors(BW)` | `inksightSetColorMode(false);` |
| `inksight_red_style` | Statement | STYLE(dropdown) | `inksight_red_style(YELLOW)` | `inksightSetRedStyle(1);` |
| `inksight_fetch` | Value (Boolean) | (none) | `inksight_fetch()` | `inksightFetch(20000)` |
| `inksight_due` | Value (Boolean) | (none) | `inksight_due()` | `inksightDue()` |
| `inksight_changed` | Value (Boolean) | (none) | `inksight_changed()` | `inksightContentChanged()` |
| `inksight_draw` | Statement | VAR(field_variable) | `inksight_draw($display)` | `display.fillScreen(GxEPD_WHITE); ↵ display.drawInvertedBitmap(0, 0, inksightImage(), INKSIGHT_WIDTH, INKSIGHT_HEIGHT, GxEPD_BLACK);` |
| `inksight_draw_color` | Statement | VAR(field_variable) | `inksight_draw_color($display)` | `inksightDrawColor(display);` |
| `inksight_show_cached` | Statement | VAR(field_variable) | `inksight_show_cached($display)` | `if (inksightRestoreCache()) { ↵ display.setFullWindow(); ↵ display.firstPage(); ↵ do { ↵ inksightDrawColor(display); ↵ } while (display.nextPage()); ↵ display.hibernate(); ↵ }` |
| `inksight_led` | Statement | PIN(field_number) | `inksight_led(4)` | `inksightLedBegin(4);` |
| `inksight_ready` | Value (Boolean) | (none) | `inksight_ready()` | `inksightHasImage()` |
| `inksight_refresh_ms` | Value (Number) | (none) | `inksight_refresh_ms()` | `inksightRefreshMs()` |
| `inksight_error` | Value (String) | (none) | `inksight_error()` | `inksightLastError()` |

`$display` in `inksight_draw` / `inksight_draw_color` / `inksight_show_cached` refers to the GxEPD2 variable created by `gxepd2_setup("display", ...)` (field_variable type GxEPD2). In the Generated Code column, `display` is that variable name.

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | ACTIVE, INTERVAL | `inksight_mode`: ACTIVE stays online (5 s polling + heartbeat, instant website push); INTERVAL is the official power-saving default (a 10-minute online window still opens after pairing) |
| MODE | BW, COLOR | `inksight_colors`: BW requests colors=2 (the timetable inverts the whole current-day column); COLOR requests colors=3 (server accents in red/yellow) |
| STYLE | YELLOW, BLACK, RED | `inksight_red_style`: how server red renders: YELLOW uses the third color; BLACK renders an inverted highlight; RED uses GxEPD_RED (same channel as yellow on 3-color panels; real red only on b/w/red panels) |

SERVER/TOKEN/PAIRCODE are text fields: SERVER is the backend base URL (official `https://www.inksight.site` or a self-hosted address; trailing slashes are trimmed). TOKEN may stay empty: the device then obtains and caches a token itself via `POST /api/device/<MAC>/token` (persisted in NVS). PAIRCODE is the website pairing code; empty skips claiming.

## ABS Examples

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    gxepd2_spi_pins(math_number(2), math_number(-1), math_number(3), math_number(7))
    gxepd2_setup("display", C3_GDEW042Z15, math_number(7), math_number(6), math_number(10), math_number(1), 115200, 2, TRUE, FALSE)
    inksight_wifi("my-ssid", "my-pass")
    inksight_setup("https://www.inksight.site", "")
    inksight_pair("")
    inksight_mode(ACTIVE)
    inksight_led(4)

arduino_loop()
    controls_if(inksight_due())
        @DO0:
            controls_ifelse(inksight_fetch())
                @DO0:
                    controls_if(inksight_changed())
                        @DO0:
                            gxepd2_page_update($display, FULL)
                                inksight_draw_color($display)
                            gxepd2_sleep($display, HIBERNATE)
                @ELSE:
                    inksight_show_cached($display)
                    serial_println(Serial, inksight_error())
    time_delay(math_number(100))
```

WiFi must be connected before `inksight_fetch()` (use `inksight_wifi` first); failures can be printed with `serial_println(Serial, inksight_error())`.

## Notes

1. **Dependencies**: `inksight_draw*` references the display object created by lib-gxepd2; both libraries must be installed. The ESP32 network stack (WiFi/Network/HTTPClient/NetworkClientSecure/Preferences sources) is bundled under this library's `src/`.
2. **Protocol**: requests `GET {SERVER}/api/render?v=4.20&mac=<MAC>&rssi=<RSSI>&refresh_min=<N>&w=400&h=300&bpp=2&colors=3` with `Accept-Encoding: identity`, `Connection: close`, and `X-Device-Token` headers; with colors>=3 the backend returns raw 2bpp data (0=black 1=white 2=yellow 3=red, 4 pixels per byte, MSB first), otherwise a 1-bit BMP (8/24-bit BMPs are threshold-converted like the official firmware). Tokens follow the official flow (`POST /api/device/<MAC>/token`, cached in NVS, re-acquired on 401); pair codes are submitted via `POST /api/device/<MAC>/claim-token`; a heartbeat is posted after every successful fetch.
3. **Buffers and scheduling**: a static 15000-byte 1-bit buffer plus a 30000-byte 2bpp buffer; after one successful fetch `inksight_ready()` stays true. Refresh scheduling matches the official firmware: interval defaults to 60 minutes, persisted in NVS, overridden by the `X-Refresh-Minutes` header within 10..1440. `inksight_due()` polls pending actions every 5 s during the post-pairing 10-minute online window; after that it follows the persisted interval. A 100 ms loop tick is recommended.
4. **Drawing**: `inksight_draw_color` draws pixel by pixel: black=0x0000, white=0xFFFF, yellow=0xFFE0, red follows `inksight_red_style`; 1-bit BMP content falls back to black/white. `inksight_changed()` compares checksums (official smartDisplay behavior) so unchanged content skips the refresh.
5. **Offline cache**: every successful fetch is RLE-compressed into NVS; `inksight_show_cached` restores the last image when fetching fails.
6. **Button (GPIO9/BOOT)**: sampled inside `inksight_due()`: a short press (0.1-2 s) fetches the next mode (`&next=1`); holding >= 2 s reopens the 10-minute online window.
7. **Optional status LED**: `inksight_led(pin)` blinks while WiFi is down/connecting and is off otherwise; omit the block if no LED is wired.
8. **Difference from official firmware**: no deep sleep on USB-powered setups; waiting uses `delay` so the serial console stays available.

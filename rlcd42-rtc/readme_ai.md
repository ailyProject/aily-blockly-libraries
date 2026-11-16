# @aily-project/lib-rlcd42-rtc

## Library Info

- **Name**: @aily-project/lib-rlcd42-rtc
- **Version**: 0.0.1
- **Purpose**: On-board PCF85063 real-time clock and SHTC3 temperature/humidity sensor of the Waveshare ESP32-S3-RLCD-4.2. Provides field access, formatted strings, power-loss detection with compile-time calibration, environment readings and NTP synchronisation.
- **Wiring**: on-board I2C (SDA=13, SCL=14), no external wiring.
- **License**: UNLICENSED (see package.json). Author: Bryan.

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| --- | --- | --- | --- | --- |
| `rlcd42_rtc_init` | Statement | CALIBRATE(field_checkbox) | `rlcd42_rtc_init(TRUE)` | `#include "Rtc42.h"`↵`rtc42Begin(true);` |
| `rlcd42_rtc_read` | Statement | (none) | `rlcd42_rtc_read()` | `#include "Rtc42.h"`↵`rtc42Read();` |
| `rlcd42_rtc_get` | Value | FIELD(dropdown) | `rlcd42_rtc_get(hour)` | `#include "Rtc42.h"`↵`rtc42Get(3)` |
| `rlcd42_rtc_format` | Value | FMT(dropdown) | `rlcd42_rtc_format(timeText)` | `#include "Rtc42.h"`↵`rtc42Format(0)` |
| `rlcd42_env_read` | Statement | (none) | `rlcd42_env_read()` | `#include "Rtc42.h"`↵`env42Read();` |
| `rlcd42_env_temp` | Value | (none) | `rlcd42_env_temp()` | `#include "Rtc42.h"`↵`env42Temp()` |
| `rlcd42_env_humi` | Value | (none) | `rlcd42_env_humi()` | `#include "Rtc42.h"`↵`env42Humi()` |
| `rlcd42_rtc_ntp` | Value | (none) | `rlcd42_rtc_ntp()` | `#include "Rtc42.h"`↵`#include <WiFiUdp.h>`↵`rtc42SyncNtp()` |

## Parameter Options

| Parameter | Values | Description |
| --- | --- | --- |
| CALIBRATE | TRUE, FALSE | `TRUE` re-seeds the RTC from the compile timestamp after a power loss, `FALSE` keeps the stored time. |
| FIELD | year, month, day, hour, minute, second, weekday | Field returned by `rlcd42_rtc_get`; maps to `rtc42Get(0..6)` in that order. |
| FMT | timeText, dateText, datetime | Output of `rlcd42_rtc_format`: `HH:MM:SS`, `YYYY-MM-DD` or the combined date and time. |

## ABS Examples

### Show the clock and the environment

```abs
arduino_setup()
    serial_begin(Serial, 9600)
    rlcd42_display_init(LANDSCAPE)
    rlcd42_rtc_init(TRUE)

arduino_loop()
    rlcd42_rtc_read()
    rlcd42_env_read()
    rlcd42_clear(WHITE)
    rlcd42_draw_text(math_number(20), math_number(40), rlcd42_rtc_format(timeText), math_number(2), BLACK)
    rlcd42_draw_text(math_number(20), math_number(100), rlcd42_rtc_format(dateText), math_number(1), BLACK)
    serial_println(Serial, rlcd42_env_temp())
    serial_println(Serial, rlcd42_env_humi())
    rlcd42_display()
    time_delay(math_number(1000))
```

### Read individual time fields

```abs
arduino_setup()
    serial_begin(Serial, 9600)
    rlcd42_rtc_init(FALSE)

arduino_loop()
    rlcd42_rtc_read()
    serial_println(Serial, rlcd42_rtc_get(year))
    serial_println(Serial, rlcd42_rtc_get(month))
    serial_println(Serial, rlcd42_rtc_get(day))
    serial_println(Serial, rlcd42_rtc_get(hour))
    serial_println(Serial, rlcd42_rtc_get(minute))
    serial_println(Serial, rlcd42_rtc_get(second))
    serial_println(Serial, rlcd42_rtc_get(weekday))
    time_delay(math_number(1000))
```

## Notes

- `rlcd42_rtc_read` must be called before any `rlcd42_rtc_get` or `rlcd42_rtc_format` value; the getters return the last sampled snapshot, not a live register read.
- `rlcd42_rtc_init` with `CALIBRATE=TRUE` overwrites the stored time with the compile timestamp whenever power loss was detected. Use `FALSE` when the cell keeps the clock running and the stored time must be preserved.
- `rlcd42_env_read` must be called before `rlcd42_env_temp` and `rlcd42_env_humi`, which return the last SHTC3 sample.
- `rlcd42_rtc_ntp` returns a Boolean and emits `rtc42SyncNtp()`; it also pulls in `WiFiUdp.h`. It performs a blocking NTP request and only succeeds once Wi-Fi is connected, so call it in `arduino_setup()` after the network is up or guard it in `arduino_loop()`.
- NTP synchronisation uses UTC+8 as stated by the block label; it does not follow the host locale.
- `rlcd42_rtc_format` returns `String`, so it can feed text inputs of the display library directly.
- All blocks use the board I2C bus at SDA=13/SCL=14; sharing the bus with other on-board devices is expected and handled by the driver.

# @aily-project/lib-rlcd42-battery

## Library Info

- **Name**: @aily-project/lib-rlcd42-battery
- **Version**: 0.0.1
- **Purpose**: On-board 18650 battery gauge and battery icon for the Waveshare ESP32-S3-RLCD-4.2. Samples ADC1 channel 3 (GPIO4) behind a 3:1 divider and converts voltage to state of charge with a real Li-ion open-circuit-voltage curve, then draws a segmented battery meter.
- **Wiring**: on-board ADC divider, no external wiring.
- **License**: UNLICENSED (see package.json). Author: Bryan.

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| --- | --- | --- | --- | --- |
| `rlcd42_batt_init` | Statement | (none) | `rlcd42_batt_init()` | `#include "Battery42.h"`↵`batt42Begin();` |
| `rlcd42_batt_read` | Statement | (none) | `rlcd42_batt_read()` | `#include "Battery42.h"`↵`batt42Read();` |
| `rlcd42_batt_percent` | Value | (none) | `rlcd42_batt_percent()` | `#include "Battery42.h"`↵`batt42Percent()` |
| `rlcd42_batt_voltage` | Value | (none) | `rlcd42_batt_voltage()` | `#include "Battery42.h"`↵`batt42Voltage()` |
| `rlcd42_batt_draw` | Statement | X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(dropdown), SHOW_PCT(dropdown) | `rlcd42_batt_draw(math_number(300), math_number(7), math_number(36), math_number(16), BLACK, TRUE)` | `#include "Battery42.h"`↵`#include "Rlcd42.h"`↵`batt42DrawMeterWithText(300, 7, 36, 16, true, (300) + (36) + 6, 1);` |

## Parameter Options

| Parameter | Values | Description |
| --- | --- | --- |
| COLOR | BLACK, WHITE | Ink colour of the meter; use `WHITE` on a dark theme and `BLACK` on a light one. |
| SHOW_PCT | TRUE, FALSE | `TRUE` draws the numeric percentage to the right of the gauge body, `FALSE` draws only the segmented gauge. |

## ABS Examples

### Battery level on screen

```abs
arduino_setup()
    serial_begin(Serial, 9600)
    rlcd42_display_init(LANDSCAPE)
    rlcd42_batt_init()

arduino_loop()
    rlcd42_batt_read()
    rlcd42_clear(WHITE)
    rlcd42_batt_draw(math_number(300), math_number(7), math_number(36), math_number(16), BLACK, TRUE)
    rlcd42_display()
    time_delay(math_number(1000))
```

### Read the gauge values

```abs
arduino_setup()
    serial_begin(Serial, 9600)
    rlcd42_batt_init()

arduino_loop()
    rlcd42_batt_read()
    serial_print(Serial, text("percent: "))
    serial_println(Serial, rlcd42_batt_percent())
    serial_print(Serial, text("voltage: "))
    serial_println(Serial, rlcd42_batt_voltage())
    time_delay(math_number(1000))
```

## Notes

- `rlcd42_batt_read` **must be called about once per second**. The smoothing filter (~16 s time constant) and the display rate limiter both assume that cadence; a slower cadence makes the gauge follow instantaneous voltage, and a 120 s cadence disables the filter entirely.
- `rlcd42_batt_init` is optional because `batt42Read()` initialises the ADC on first use, but calling it explicitly in `arduino_setup()` keeps the first reading clean.
- State of charge comes from a Li-ion open-circuit-voltage curve (CALCE / Samsung INR18650-20R), not a two-point linear voltage-to-percent map. A linear map over-reads by 26 points at 3.60 V.
- The percentage is rate limited: a change smaller than 2% is ignored, and afterwards the displayed value moves at most 1% per 30 s. Both 0% and 100% remain reachable; the hysteresis never locks the value at 1% or 99%.
- `rlcd42_batt_draw` needs the display library: it includes `Rlcd42.h` in addition to `Battery42.h`. With `SHOW_PCT=TRUE` it reserves room for `100%` (4 glyphs) to the right of the gauge body, so leave that space free. Call `rlcd42_display()` afterwards to push the frame to the panel.
- Remaining error sources that need measurement to remove: divider resistor tolerance (a 1% ratio error is a 1% reading error), load sag of 50-150 mV during audio playback or Wi-Fi transmit (worth 5-13 points), cell-to-cell variation, and temperature (the curve is a room-temperature dataset).
- The board has no charge-status pin, so the icon uses `HWCDC::isPlugged()` with 3-sample debounce to show a USB bolt. A USB cable that stays connected after full charge still shows the bolt, because the charging state cannot be observed.
- For precise gauging use a dedicated fuel gauge IC (MAX17048, BQ27441) that counts charge instead of inferring it from voltage.

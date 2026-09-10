# TGAM Brainwave

Non-blocking UART driver for a NeuroSky TGAM module. It reads signal quality,
attention, and meditation from validated 32-byte packets.

## Library Info

- **Name**: @aily-project/lib-tgam
- **Version**: 1.2.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `tgam_init` | Statement | VAR(field_variable), SERIAL(dropdown), RX(input_value), TX(input_value), BAUD(dropdown) | `tgam_init($tgam, Serial, math_number(0), math_number(1), 57600)` | `#include "TGAM.h"` plus a global `TGAM tgam(Serial);`; serial initialization is added to setup and `tgam.update();` to the loop. ESP32 Serial1/Serial2 uses `Serial1.begin(57600, SERIAL_8N1, 16, 17);`. |
| `tgam_signal_quality` | Value (Number) | VAR(field_variable) | `tgam_signal_quality($tgam)` | `tgam.signalQuality()` |
| `tgam_attention` | Value (Number) | VAR(field_variable) | `tgam_attention($tgam)` | `tgam.attention()` |
| `tgam_meditation` | Value (Number) | VAR(field_variable) | `tgam_meditation($tgam)` | `tgam.meditation()` |
| `tgam_signal_good` | Value (Boolean) | VAR(field_variable) | `tgam_signal_good($tgam)` | `tgam.signalGood()` |
| `tgam_has_new_data` | Value (Boolean) | VAR(field_variable) | `tgam_has_new_data($tgam)` | `tgam.hasNewData()` |

## Parameter Options

| Parameter | Values | Description |
| --------- | ------ | ----------- |
| SERIAL | Board-provided serial ports, such as `Serial`, `Serial1`, and `Serial2` | UART used by `tgam_init` |
| BAUD | `57600`, `9600`, `115200` | UART speed; TGAM defaults to 57600 |

## ABS Examples

### Arduino UNO or Nano

```abs
arduino_setup()
    tgam_init($tgam, Serial, math_number(0), math_number(1), 57600)

arduino_loop()
    controls_if(tgam_has_new_data($tgam))
        serial_println(Serial, tgam_attention($tgam))
```

### ESP32 With Serial1

```abs
arduino_setup()
    tgam_init($tgam, Serial1, math_number(16), math_number(17), 57600)
    serial_begin(Serial, 9600)

arduino_loop()
    controls_if(tgam_has_new_data($tgam))
        serial_println(Serial, tgam_attention($tgam))
```

## Notes

1. `$tgam` is a `field_variable`; pass it directly to the other TGAM blocks.
2. On ESP32, selecting Serial1 or Serial2 applies the RX and TX inputs. Other
   ports use `begin(baud)` and ignore those inputs.
3. Do not use `serial_begin` for the same port because it can replace the TGAM
   baud rate.
4. `tgam_has_new_data($tgam)` is true only in the loop iteration that finishes a
   valid packet. Signal quality 0 means good contact and 200 means no contact.

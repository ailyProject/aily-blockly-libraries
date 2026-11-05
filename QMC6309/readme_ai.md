# QMC6309 Compass

QMC6309 magnetometer compass: heading, three-axis field and hard-iron calibration; I2C pins from the board

## Library Info
- **Name**: @aily-project/lib-qmc6309
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `qmc6309_init` | Statement | (none) | `qmc6309_init()` | `qmc6309.begin(Wire);` |
| `qmc6309_read` | Value | WHAT(dropdown) | `qmc6309_read(HEADING)` | `qmc6309_get(0)` |
| `qmc6309_calibrate` | Statement | SECONDS(input_value) | `qmc6309_calibrate(math_number(0))` | `qmc6309_calibrate(0);` |
| `qmc6309_declination` | Statement | DEGREES(input_value) | `qmc6309_declination(math_number(90))` | `qmc6309.setDeclination(90);` |
| `qmc6309_set_offsets` | Statement | X(input_value), Y(input_value), Z(input_value) | `qmc6309_set_offsets(math_number(0), math_number(0), math_number(0))` | `qmc6309.setOffsets((int16_t)(0), (int16_t)(0), (int16_t)(0));` |
| `qmc6309_offset` | Value | AXIS(dropdown) | `qmc6309_offset(X)` | `qmc6309_offset(0)` |
| `qmc6309_ok` | Value | (none) | `qmc6309_ok()` | `qmc6309_ok()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| WHAT | HEADING, X, Y, Z | qmc6309_read |
| AXIS | X, Y, Z | qmc6309_offset |

## ABS Examples

### Calibrate, then print the heading
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    qmc6309_init()
    serial_println(Serial, text("Turn the board flat for 10 s"))
    qmc6309_calibrate(math_number(10))
    qmc6309_declination(math_number(-6))
    serial_println(Serial, text_join(ADD0=text("offsets "), ADD1=qmc6309_offset(X), ADD2=text(" "), ADD3=qmc6309_offset(Y)))

arduino_loop()
    controls_if()
        @IF0: qmc6309_ok()
        @DO0:
            serial_println(Serial, text_join(ADD0=text("heading "), ADD1=qmc6309_read(HEADING)))
    time_delay(math_number(200))
```

## Notes

1. **Boards**: any ESP32 board. When the board’s `magnetometerConfig` names a QMC6309, `qmc6309_init` uses its I2C pins (IBox S31: SDA=IO0, SCL=IO1); otherwise the board’s I2C pins. The driver tries 0x7C, then 0x2C, and scans the bus first so a cold start is detected.
2. **Heading**: 0–360°, `atan2(Y, X)` after removing the hard-iron offsets, plus the declination. Keep the board level; tilt and nearby metal or magnets change it. Reads within 10 ms share one sample.
3. **Calibration**: `qmc6309_calibrate` blocks for the given seconds (1–120) while you turn the board flat a few circles, then applies the midpoints as offsets. Save `qmc6309_offset` X/Y/Z and restore them with `qmc6309_set_offsets` to skip it next time.

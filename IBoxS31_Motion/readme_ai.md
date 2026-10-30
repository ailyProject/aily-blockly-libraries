# IBox S31 IMU & Compass

IBox S31 QMI8658 six-axis IMU and QMC6309 compass: acceleration, angular rate, tilt and heading

## Library Info
- **Name**: @aily-project/lib-iboxs31_motion
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `iboxs31_imu_init` | Statement | (none) | `iboxs31_imu_init()` | `iboxs31_imu.begin(Wire, IBoxS31_QMI8658::ADDR_DEFAULT, 0, 1); ↵ iboxs31_imu_mag.begin(Wire, 0, 1);` |
| `iboxs31_imu_range` | Statement | ACC(dropdown), GYRO(dropdown) | `iboxs31_imu_range(0, 4)` | `iboxs31_imu.configure(0x04, 0x44);` |
| `iboxs31_imu_read` | Value | WHAT(dropdown) | `iboxs31_imu_read(AX)` | `iboxs31_imu_get(0)` |
| `iboxs31_imu_ok` | Value | (none) | `iboxs31_imu_ok()` | `iboxs31_imu_ok()` |
| `iboxs31_imu_mag_read` | Value | WHAT(dropdown) | `iboxs31_imu_mag_read(HEADING)` | `iboxs31_imu_mag_get(0)` |
| `iboxs31_imu_mag_calibrate` | Statement | SECONDS(input_value) | `iboxs31_imu_mag_calibrate(math_number(0))` | `iboxs31_imu_mag_calibrate(0);` |
| `iboxs31_imu_mag_declination` | Statement | DEGREES(input_value) | `iboxs31_imu_mag_declination(math_number(90))` | `iboxs31_imu_mag.setDeclination(90);` |
| `iboxs31_imu_mag_set_offsets` | Statement | X(input_value), Y(input_value), Z(input_value) | `iboxs31_imu_mag_set_offsets(math_number(0), math_number(0), math_number(0))` | `iboxs31_imu_mag.setOffsets((int16_t)(0), (int16_t)(0), (int16_t)(0));` |
| `iboxs31_imu_mag_offset` | Value | AXIS(dropdown) | `iboxs31_imu_mag_offset(X)` | `iboxs31_imu_mag_offset(0)` |
| `iboxs31_imu_mag_ok` | Value | (none) | `iboxs31_imu_mag_ok()` | `iboxs31_imu_mag_ok()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ACC | 0, 1, 2, 3 | iboxs31_imu_range |
| GYRO | 4, 5, 6, 7 | iboxs31_imu_range |
| WHAT | AX, AY, AZ, GX, GY, GZ, TEMP, PITCH, ROLL | iboxs31_imu_read |
| WHAT | HEADING, X, Y, Z | iboxs31_imu_mag_read |
| AXIS | X, Y, Z | iboxs31_imu_mag_offset |

## ABS Examples

### Print tilt and heading, warn on a right tilt
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    iboxs31_imu_init()
    iboxs31_imu_range(1, 6)

arduino_loop()
    controls_if()
        @IF0: logic_operation(iboxs31_imu_ok(), AND, iboxs31_imu_mag_ok())
        @DO0:
            serial_println(Serial, text_join(ADD0=text("pitch="), ADD1=iboxs31_imu_read(PITCH), ADD2=text(" roll="), ADD3=iboxs31_imu_read(ROLL)))
            serial_println(Serial, text_join(ADD0=text("heading="), ADD1=iboxs31_imu_mag_read(HEADING)))
            controls_if()
                @IF0: logic_compare(iboxs31_imu_read(ROLL), GT, math_number(30))
                @DO0:
                    serial_println(Serial, text("tilted right"))
    time_delay(math_number(200))
```

### Calibrate the compass and keep the offsets
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    iboxs31_imu_init()
    serial_println(Serial, text("Turn the board flat for 10 s"))
    iboxs31_imu_mag_calibrate(math_number(10))
    iboxs31_imu_mag_declination(math_number(-6))
    serial_println(Serial, text_join(ADD0=text("offsets "), ADD1=iboxs31_imu_mag_offset(X), ADD2=text(" "), ADD3=iboxs31_imu_mag_offset(Y)))
```

## Notes

1. **Board**: IBox S31 only (Aily board IBOX S31, ESP32-S31, Arduino-ESP32 4.0.0). QMI8658 at I2C 0x6B (0x6A fallback) and QMC6309 at 0x7C (0x2C fallback, bus scanned first for a cold start), both on SDA=IO0, SCL=IO1. One `iboxs31_imu_init` starts both; the two ok blocks tell which one answers.
2. **Six-axis**: acceleration in g, angular rate in °/s, chip temperature in °C. Pitch and roll come from the accelerometer, so they are only valid while the board is not accelerating. `iboxs31_imu_range(ACC, GYRO)` takes 0–3 for ±2/4/8/16 g and 4–7 for ±256/512/1024/2048 °/s.
3. **Compass**: heading 0–360° is `atan2(Y, X)` after the hard-iron offsets plus the declination; keep the board level and away from metal. `iboxs31_imu_mag_calibrate` blocks 1–120 s while you turn the board flat; save the offsets and restore them with `iboxs31_imu_mag_set_offsets`. Reads within 10 ms share one sample.

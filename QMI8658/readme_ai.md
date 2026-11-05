# QMI8658 IMU

QMI8658 six-axis IMU: acceleration, angular rate, temperature and tilt; pins and address from the board

## Library Info
- **Name**: @aily-project/lib-qmi8658
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `qmi8658_init` | Statement | (none) | `qmi8658_init()` | `qmi8658.begin(Wire, QMI8658::ADDR_DEFAULT);` |
| `qmi8658_range` | Statement | ACC(dropdown), GYRO(dropdown) | `qmi8658_range(0, 4)` | `qmi8658.configure(0x04, 0x44);` |
| `qmi8658_read` | Value | WHAT(dropdown) | `qmi8658_read(AX)` | `qmi8658_get(0)` |
| `qmi8658_ok` | Value | (none) | `qmi8658_ok()` | `qmi8658_ok()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ACC | 0, 1, 2, 3 | qmi8658_range |
| GYRO | 4, 5, 6, 7 | qmi8658_range |
| WHAT | AX, AY, AZ, GX, GY, GZ, TEMP, PITCH, ROLL | qmi8658_read |

## ABS Examples

### Print tilt angles and detect a right tilt
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    qmi8658_init()
    qmi8658_range(1, 6)

arduino_loop()
    controls_if()
        @IF0: qmi8658_ok()
        @DO0:
            serial_println(Serial, text_join(ADD0=text("pitch="), ADD1=qmi8658_read(PITCH), ADD2=text(" roll="), ADD3=qmi8658_read(ROLL)))
            controls_if()
                @IF0: logic_compare(qmi8658_read(ROLL), GT, math_number(30))
                @DO0:
                    serial_println(Serial, text("tilted right"))
    time_delay(math_number(200))
```

## Notes

1. **Boards**: any ESP32 board. When the board’s `imuConfig` names a QMI8658, `qmi8658_init` uses its I2C pins and address (IBox S31: SDA=IO0, SCL=IO1, 0x6B; Korvo S3: SDA=IO17, SCL=IO18, 0x6B); otherwise the board’s I2C pins and 0x6B. The driver tries 0x6A if the first address does not answer.
2. **Values**: acceleration in g, angular rate in °/s, chip temperature in °C. Pitch and roll are computed from the accelerometer, so they are only valid while the board is not accelerating. Reads within 10 ms share one sample.
3. **Range**: `qmi8658_range(ACC, GYRO)` takes 0–3 for ±2/4/8/16 g and 4–7 for ±256/512/1024/2048 °/s; the default after init is ±2 g and ±1024 °/s.

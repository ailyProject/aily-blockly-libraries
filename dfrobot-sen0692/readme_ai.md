# 6-DOF IMU

Gravity SEN0692 6-DOF IMU with I2C/UART, accel, gyro.

## Library Info
- **Name**: @aily-project/lib-dfrobot-sen0692
- **Version**: 0.1.0

## Block Definitions

Compatibility types: `arduino:avr:uno`, `esp32:esp32:esp32`, `esp32:esp32:esp32c3`, `esp32:esp32:esp32s3`. Nano/Mega and other types are excluded. UNO UART uses SoftwareSerial; ESP32 uses a board hardware port (prefer Serial1; no Serial2 on ESP32-C3).

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sen0692_init_i2c` | Statement | VAR(field_input), WIRE(dropdown), ADDRESS(dropdown) | `sen0692_init_i2c("imu", Wire, "0x4A")` | `while (!imu.begin()) { ↵ delay(1000); ↵ } ↵ imu.setSensorMode(DFRobot_Multi_DOF_IMU::eNormalMode); ↵ imu.setAccelRange(DFRobot_Multi_DOF_IMU::eAccelRange2G); ↵ imu.setGyroRange(DFRobot_Multi_DOF_IMU::eGyroRange250DPS);` |
| `sen0692_init_uart` | Statement | VAR(field_input), SERIAL(dropdown), RX(dropdown), TX(dropdown), ADDRESS(dropdown) | `sen0692_init_uart("imu", Serial1, RX, TX, "0x4A")` | `while (!imu.begin()) { ↵ delay(1000); ↵ } ↵ imu.setSensorMode(DFRobot_Multi_DOF_IMU::eNormalMode); ↵ imu.setAccelRange(DFRobot_Multi_DOF_IMU::eAccelRange2G); ↵ imu.setGyroRange(DFRobot_Multi_DOF_IMU::eGyroRange250DPS);` |
| `sen0692_set_mode` | Statement | VAR(field_variable), MODE(dropdown) | `sen0692_set_mode($imu, eNormalMode)` | `imu.setSensorMode(DFRobot_Multi_DOF_IMU::eNormalMode);` |
| `sen0692_set_accel` | Statement | VAR(field_variable), RANGE(dropdown) | `sen0692_set_accel($imu, eAccelRange2G)` | `imu.setAccelRange(DFRobot_Multi_DOF_IMU::eAccelRange2G);` |
| `sen0692_set_gyro` | Statement | VAR(field_variable), RANGE(dropdown) | `sen0692_set_gyro($imu, eGyroRange125DPS)` | `imu.setGyroRange(DFRobot_Multi_DOF_IMU::eGyroRange125DPS);` |
| `sen0692_read` | Value | VAR(field_variable) | `sen0692_read($imu)` | `imu.get6dofData(&imuAccel, &imuGyro)` |
| `sen0692_get_data` | Value | VAR(field_variable), DATA(dropdown) | `sen0692_get_data($imu, ACC_X)` | `imuAccel.x` |
| `sen0692_reset` | Statement | VAR(field_variable) | `sen0692_reset($imu)` | `imu.reset();` |
| `sen0692_step` | Value | VAR(field_variable) | `sen0692_step($imu)` | `imu.getStepCount()` |
| `sen0692_tap` | Value | VAR(field_variable), TYPE(dropdown) | `sen0692_tap($imu, 1)` | `imu.getTap() == 1` |
| `sen0692_orient` | Value | VAR(field_variable), TYPE(dropdown) | `sen0692_orient($imu, 1)` | `(imu.getOrientation() >> 8) == 1` |
| `sen0692_set_int` | Statement | VAR(field_variable), PIN(dropdown), ITYPE(dropdown) | `sen0692_set_int($imu, eImuIntPin1, eInt1_2DataReady)` | `imu.setInt(DFRobot_Multi_DOF_IMU::eImuIntPin1, DFRobot_Multi_DOF_IMU::eInt1_2DataReady);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x4A, 0x4B, 0x4C, 0x4D | sen0692_init_i2c, sen0692_init_uart |
| SERIAL | Serial1, Serial2, Serial | sen0692_init_uart |
| MODE | eNormalMode, eLowPowerMode, eHighPerformanceMode, eSleepMode | sen0692_set_mode |
| RANGE | eAccelRange2G, eAccelRange4G, eAccelRange8G, eAccelRange16G | sen0692_set_accel |
| RANGE | eGyroRange125DPS, eGyroRange250DPS, eGyroRange500DPS, eGyroRange1000DPS, eGyroRange2000DPS | sen0692_set_gyro |
| DATA | ACC_X, ACC_Y, ACC_Z, GYR_X, GYR_Y, GYR_Z | sen0692_get_data |
| TYPE | 1, 2, 3 | sen0692_tap |
| TYPE | 1, 2, 3, 4 | sen0692_orient |
| PIN | eImuIntPin1, eImuIntPin2 | sen0692_set_int |
| ITYPE | eInt1_2DataReady, eInt1_2AnyMotion, eInt1_2NoMotion, eInt1_2SigMotion, eInt1_2StepCounter, eInt1_2Flat, eInt1_2Orientation, eInt1_2Tap, eInt1_2Tilt, eInt1_2Disable | sen0692_set_int |

## ABS Examples

### Basic Usage
```
arduino_setup()
    sen0692_init_i2c("imu", Wire, "0x4A")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, sen0692_read($imu))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `sen0692_init_i2c` creates a Blockly variable. Use `$varName` only for field_variable slots; input_value slots must use the explicit `variables_get($varName)` block.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(true/false)`, variables, or nested value blocks.

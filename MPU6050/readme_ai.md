# MPU6050

MPU6050六轴(加速度计+陀螺仪)传感器库，适用于Arduino UNO R3

## Library Info
- **Name**: @aily-project/lib-mpu6050
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mpu6050_begin` | Statement | (none) | `mpu6050_begin()` | `` |
| `mpu6050_get_accel` | Value | AXIS(dropdown) | `mpu6050_get_accel(x)` | `mpu.getEvent(&a, &g, &temp); a.acceleration.` |
| `mpu6050_get_gyro` | Value | AXIS(dropdown) | `mpu6050_get_gyro(x)` | `mpu.getEvent(&a, &g, &temp); (g.gyro.` |
| `mpu6050_get_temp` | Value | (none) | `mpu6050_get_temp()` | `mpu.getEvent(&a, &g, &temp); temp.temperature` |
| `mpu6050_set_accel_range` | Statement | RANGE(dropdown) | `mpu6050_set_accel_range(MPU6050_RANGE_2_G)` | `mpu.setAccelerometerRange(` |
| `mpu6050_set_gyro_range` | Statement | RANGE(dropdown) | `mpu6050_set_gyro_range(MPU6050_RANGE_250_DEG)` | `mpu.setGyroRange(` |
| `mpu6050_set_filter_bandwidth` | Statement | BANDWIDTH(dropdown) | `mpu6050_set_filter_bandwidth(MPU6050_BAND_260_HZ)` | `mpu.setFilterBandwidth(` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| AXIS | x, y, z | X / Y / Z |
| RANGE | MPU6050_RANGE_2_G, MPU6050_RANGE_4_G, MPU6050_RANGE_8_G, MPU6050_RANGE_16_G | ±2g / ±4g / ±8g / ±16g |
| BANDWIDTH | MPU6050_BAND_260_HZ, MPU6050_BAND_184_HZ, MPU6050_BAND_94_HZ, MPU6050_BAND_44_HZ, MPU6050_BAND_21_HZ, MPU6050_BAND_10_HZ, MPU6050_BAND_5_HZ | 260Hz / 184Hz / 94Hz / 44Hz / 21Hz / 10Hz / 5Hz |

## ABS Examples

### Basic Usage
```
arduino_setup()
    mpu6050_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, mpu6050_get_accel(x))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

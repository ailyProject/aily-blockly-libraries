# SparkFun MPU-9250 DMP IMU

SparkFun MPU-9250 九轴 IMU Blockly 库。

## Library Info
- **Name**: @aily-project/lib-sparkfun-mpu9250-dmp
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mpu9250_init` | Statement | VAR(field_input) | `mpu9250_init("imu")` | `MPU9250_DMP imu; imu.begin();` |
| `mpu9250_set_sensors` | Statement | VAR(field_variable), ACCEL(dropdown), GYRO(dropdown), COMPASS(dropdown) | `mpu9250_set_sensors(variables_get($imu), 1, 1, 1)` | `imu.setSensors(INV_XYZ_ACCEL \| INV_XYZ_GYRO \| INV_XYZ_COMPASS);` |
| `mpu9250_set_gyro_fsr` | Statement | VAR(field_variable), FSR(field_dropdown) | `mpu9250_set_gyro_fsr(variables_get($imu), 2000)` | `imu.setGyroFSR(2000);` |
| `mpu9250_set_accel_fsr` | Statement | VAR(field_variable), FSR(field_dropdown) | `mpu9250_set_accel_fsr(variables_get($imu), 2)` | `imu.setAccelFSR(2);` |
| `mpu9250_set_lpf` | Statement | VAR(field_variable), LPF(field_dropdown) | `mpu9250_set_lpf(variables_get($imu), 5)` | `imu.setLPF(5);` |
| `mpu9250_set_sample_rate` | Statement | VAR(field_variable), RATE(input_value) | `mpu9250_set_sample_rate(variables_get($imu), math_number(10))` | `imu.setSampleRate(10);` |
| `mpu9250_data_ready` | Value | VAR(field_variable) | `mpu9250_data_ready(variables_get($imu))` | `imu.dataReady()` |
| `mpu9250_update` | Statement | VAR(field_variable) | `mpu9250_update(variables_get($imu))` | `imu.update(UPDATE_ACCEL \| UPDATE_GYRO \| UPDATE_COMPASS);` |
| `mpu9250_get_accel` | Value | VAR(field_variable), AXIS(field_dropdown) | `mpu9250_get_accel(variables_get($imu), ax)` | `imu.ax` |
| `mpu9250_get_gyro` | Value | VAR(field_variable), AXIS(field_dropdown) | `mpu9250_get_gyro(variables_get($imu), gx)` | `imu.gx` |
| `mpu9250_get_compass` | Value | VAR(field_variable), AXIS(field_dropdown) | `mpu9250_get_compass(variables_get($imu), mx)` | `imu.mx` |
| `mpu9250_get_temperature` | Value | VAR(field_variable) | `mpu9250_get_temperature(variables_get($imu))` | `imu.temperature` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ACCEL/GYRO/COMPASS | 1(开), 0(关) | 传感器启用/禁用 |
| FSR (gyro) | 250, 500, 1000, 2000 | 陀螺仪量程（dps） |
| FSR (accel) | 2, 4, 8, 16 | 加速度计量程（g） |
| LPF | 5, 10, 20, 42, 98, 188 | 低通滤波截止频率（Hz） |
| AXIS (accel) | ax, ay, az | 加速度轴 |
| AXIS (gyro) | gx, gy, gz | 陀螺仪轴 |
| AXIS (compass) | mx, my, mz | 磁力计轴 |

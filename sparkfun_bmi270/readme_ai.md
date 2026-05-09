# SparkFun BMI270 六轴 IMU

## Library Info
- **Name**: @aily-project/lib-sparkfun-bmi270
- **Version**: 0.0.1
- **Class**: `BMI270`
- **Include**: `#include <SparkFun_BMI270_Arduino_Library.h>`
- **Variable Type**: `BMI270`

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bmi270_init_i2c` | Statement | VAR(field_input), ADDR(dropdown 0x68/0x69) | `bmi270_init_i2c("imu", "0x68")` | `BMI270 imu; Wire.begin(); while(imu.beginI2C(0x68)!=0){delay(100);}` |
| `bmi270_get_data` | Statement | VAR(field_variable) | `bmi270_get_data(variables_get($imu))` | `imu.getSensorData();` |
| `bmi270_get_accel` | Value→Number | VAR(field_variable), AXIS(dropdown X/Y/Z) | `bmi270_get_accel(variables_get($imu), "accelX")` | `imu.data.accelX` |
| `bmi270_get_gyro` | Value→Number | VAR(field_variable), AXIS(dropdown X/Y/Z) | `bmi270_get_gyro(variables_get($imu), "gyroX")` | `imu.data.gyroX` |
| `bmi270_get_temperature` | Value→Number | VAR(field_variable) | `bmi270_get_temperature(variables_get($imu))` | `(imu.getTemperature(&_temp), _temp)` |
| `bmi270_enable_step_counter` | Statement | VAR(field_variable) | `bmi270_enable_step_counter(variables_get($imu))` | `imu.enableFeature(BMI2_STEP_DETECTOR); imu.enableFeature(BMI2_STEP_COUNTER); imu.enableFeature(BMI2_STEP_ACTIVITY);` |
| `bmi270_get_step_count` | Value→Number | VAR(field_variable) | `bmi270_get_step_count(variables_get($imu))` | `(imu.getStepCount(&_steps), _steps)` |
| `bmi270_reset_step_count` | Statement | VAR(field_variable) | `bmi270_reset_step_count(variables_get($imu))` | `imu.resetStepCount();` |
| `bmi270_get_step_activity` | Value→Number | VAR(field_variable) | `bmi270_get_step_activity(variables_get($imu))` | `(imu.getStepActivity(&_activity), _activity)` |

## Notes
- `bmi270_get_data` 必须在每次读取数据前调用
- 活动状态返回值：0=静止, 1=步行, 2=跑步, 3=未知
- 温度/步数/活动状态积木使用逗号表达式在单行内完成调用和取值

# SparkFun HMC6343 电子罗盘

I2C 接口三轴电子罗盘，先调用读取积木刷新数据，再调用获取积木读取各轴数值。

## Library Info
- **Name**: @aily-project/lib-sparkfun-hmc6343
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `hmc6343_init` | Statement | VAR(field_input) | `hmc6343_init("compass")` | `SFE_HMC6343 compass; Wire.begin(); compass.init();` |
| `hmc6343_read_heading` | Statement | VAR(field_variable) | `hmc6343_read_heading(variables_get($compass))` | `compass.readHeading();` |
| `hmc6343_read_mag` | Statement | VAR(field_variable) | `hmc6343_read_mag(variables_get($compass))` | `compass.readMag();` |
| `hmc6343_read_accel` | Statement | VAR(field_variable) | `hmc6343_read_accel(variables_get($compass))` | `compass.readAccel();` |
| `hmc6343_get_value` | Value | VAR(field_variable), FIELD(field_dropdown) | `hmc6343_get_value(variables_get($compass), HEADING)` | `compass.heading` |
| `hmc6343_set_orientation` | Statement | VAR(field_variable), ORIENT(field_dropdown) | `hmc6343_set_orientation(variables_get($compass), 0)` | `compass.setOrientation(0);` |
| `hmc6343_sleep_control` | Statement | VAR(field_variable), MODE(field_dropdown) | `hmc6343_sleep_control(variables_get($compass), SLEEP)` | `compass.enterSleep();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FIELD | heading, pitch, roll, magX, magY, magZ, accelX, accelY, accelZ, temperature | 读取的数据字段 |
| ORIENT | 0(Level), 1(Sideways), 2(FlatFront) | 传感器安装方向 |
| MODE | sleep, wake | 休眠控制 |

## Notes

1. **读取顺序**: 先调用 `hmc6343_read_heading` / `hmc6343_read_mag` / `hmc6343_read_accel`，再调用 `hmc6343_get_value`
2. **数据单位**: heading/pitch/roll 以 tenths of degrees（十分之一度）为单位（除以 10 得到度数）

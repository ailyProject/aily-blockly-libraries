# SparkFun MMA8452Q 加速度计

SparkFun MMA8452Q 三轴 I2C 加速度计 Blockly 库。

## Library Info
- **Name**: @aily-project/lib-sparkfun-mma8452q
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mma8452q_init` | Statement | VAR(field_input), SCALE(field_dropdown) | `mma8452q_init("accel", SCALE_2G)` | `MMA8452Q accel; Wire.begin(); accel.begin(); accel.init(SCALE_2G);` |
| `mma8452q_available` | Value | VAR(field_variable) | `mma8452q_available(variables_get($accel))` | `accel.available()` |
| `mma8452q_read` | Statement | VAR(field_variable) | `mma8452q_read(variables_get($accel))` | `accel.read();` |
| `mma8452q_get_axis_raw` | Value | VAR(field_variable), AXIS(field_dropdown) | `mma8452q_get_axis_raw(variables_get($accel), X)` | `accel.getX()` |
| `mma8452q_get_axis_g` | Value | VAR(field_variable), AXIS(field_dropdown) | `mma8452q_get_axis_g(variables_get($accel), X)` | `accel.getCalculatedX()` |
| `mma8452q_set_scale` | Statement | VAR(field_variable), SCALE(field_dropdown) | `mma8452q_set_scale(variables_get($accel), SCALE_4G)` | `accel.setScale(SCALE_4G);` |
| `mma8452q_set_odr` | Statement | VAR(field_variable), ODR(field_dropdown) | `mma8452q_set_odr(variables_get($accel), ODR_100)` | `accel.setDataRate(ODR_100);` |
| `mma8452q_read_pl` | Value | VAR(field_variable) | `mma8452q_read_pl(variables_get($accel))` | `accel.readPL()` |
| `mma8452q_orientation` | Value | VAR(field_variable), ORIENT(field_dropdown) | `mma8452q_orientation(variables_get($accel), isRight)` | `accel.isRight()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SCALE | SCALE_2G, SCALE_4G, SCALE_8G | 加速度量程 |
| AXIS | X, Y, Z | 轴方向 |
| ODR | ODR_800, ODR_400, ODR_200, ODR_100, ODR_50, ODR_12, ODR_6, ODR_1 | 输出数据速率 |
| ORIENT | isRight, isLeft, isUp, isDown, isFlat | 方向判断方法 |

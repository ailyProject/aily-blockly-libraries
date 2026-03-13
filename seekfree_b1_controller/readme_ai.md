# 逐飞麦轮车控制

支持控制麦轮车前进、后退、左移、右移、左右旋转、设定行进速度、设定行进距离，也支持输入坐标自动进行目标跟踪。支持按键输入操作、支持蜂鸣器与LED控制、支持灰度传感器数据读取、支持机械臂控制、支持六轴传感器数据读取、支持OpenART mini视觉识别设备通信

## Library Info
- **Name**: @aily-project/lib-seekfree_b1_controller
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `four_driver_init` | Statement | power_index(dropdown) | `four_driver_init(0)` | `` |
| `four_driver_set_speed` | Statement | speed1(input_value), speed2(input_value), speed3(input_value), speed4(input_value) | `four_driver_set_speed(math_number(80), math_number(80), math_number(80), math_number(80))` | `four_driver.set_speed(1, 2,` |
| `four_driver_move` | Statement | DIRECTION(dropdown), SPEED(field_number), DISTANCE(field_number) | `four_driver_move(1, 50, 10)` | `four_driver.move(..., ..., ...);\n` |
| `four_driver_turn` | Statement | DIRECTION(dropdown), ANGLE(input_value), SPEED(input_value) | `four_driver_turn(1, math_number(90), math_number(80))` | `four_driver.turn(... * ..., ...);\n` |
| `four_driver_track` | Value | coord_x(input_value), coord_y(input_value) | `four_driver_track(math_number(0), math_number(0))` | `four_driver.track(` |
| `imu660ma_init` | Statement | power_index(dropdown) | `imu660ma_init(6)` | `` |
| `imu660ma_calibration_acc` | Statement | (none) | `imu660ma_calibration_acc()` | `imu660ma.calibration_acc();\n` |
| `imu660ma_calibration_gyro` | Statement | (none) | `imu660ma_calibration_gyro()` | `imu660ma.calibration_gyro();\n` |
| `imu660ma_calibration_yaw` | Statement | yaw(input_value) | `imu660ma_calibration_yaw(math_number(0))` | `imu660ma.calibration_yaw(` |
| `imu660ma_get_acc` | Value | AXIS(dropdown) | `imu660ma_get_acc(X)` | (dynamic code) |
| `imu660ma_get_gyro` | Value | AXIS(dropdown) | `imu660ma_get_gyro(X)` | (dynamic code) |
| `imu660ma_get_angle` | Value | ANGLE(dropdown) | `imu660ma_get_angle(PITCH)` | (dynamic code) |
| `photoelectricity_init` | Statement | power_index(dropdown) | `photoelectricity_init(6)` | `` |
| `photoelectricity_set_black` | Statement | DEVICE_ID(dropdown) | `photoelectricity_set_black(1)` | `location.set_black(` |
| `photoelectricity_set_white` | Statement | DEVICE_ID(dropdown) | `photoelectricity_set_white(1)` | `location.set_white(` |
| `photoelectricity_get_position` | Value | DEVICE_ID(dropdown) | `photoelectricity_get_position(1)` | (dynamic code) |
| `photoelectricity_get_value` | Value | DEVICE_ID(dropdown), CHANNEL(dropdown) | `photoelectricity_get_value(1, 0)` | (dynamic code) |
| `photoelectricity_get_value_bin` | Value | DEVICE_ID(dropdown), CHANNEL(dropdown) | `photoelectricity_get_value_bin(1, 0)` | (dynamic code) |
| `photoelectricity_get_black_num` | Value | DEVICE_ID(dropdown) | `photoelectricity_get_black_num(1)` | (dynamic code) |
| `photoelectricity_get_white_num` | Value | DEVICE_ID(dropdown) | `photoelectricity_get_white_num(1)` | (dynamic code) |
| `ch422_set_beep` | Statement | STATE(dropdown) | `ch422_set_beep(1)` | `ch422.set_beep(` |
| `ch422_set_led` | Statement | COLOR(dropdown), STATE(dropdown) | `ch422_set_led(red, 1)` | `ch422.set_` |
| `key4_adc1_begin` | Statement | (none) | `key4_adc1_begin()` | `` |
| `key4_adc1_read` | Value | KEY_ID(dropdown), STATE(dropdown) | `key4_adc1_read(0, 0)` | `key4_adc1.read_state(` |
| `openart_mini_begin` | Statement | (none) | `openart_mini_begin()` | `` |
| `openart_mini_detection_object` | Statement | SHAPE(dropdown), VALUE(dropdown) | `openart_mini_detection_object(1, 0xFFF200)` | `openart_mini.detection_object(` |
| `openart_mini_detection_apriltag` | Statement | (none) | `openart_mini_detection_apriltag()` | `openart_mini.detection_apriltag();\n` |
| `openart_mini_detection_stop` | Statement | (none) | `openart_mini_detection_stop()` | `openart_mini.detection_stop();\n` |
| `openart_mini_get_result` | Value | TYPE(dropdown) | `openart_mini_get_result(1)` | `openart_mini.get_result(` |
| `openart_mini_get_coord_x` | Value | TYPE(dropdown) | `openart_mini_get_coord_x(1)` | `openart_mini.get_coord_x(` |
| `openart_mini_get_coord_y` | Value | TYPE(dropdown) | `openart_mini_get_coord_y(1)` | `openart_mini.get_coord_y(` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| power_index | 0, 1 | 1 / 2 |
| DIRECTION | 1, 2, 3, 4 | 前进 / 后退 / 左移 / 右移 |
| AXIS | X, Y, Z | X轴 / Y轴 / Z轴 |
| ANGLE | PITCH, ROLL, YAW | 俯仰角 / 横滚角 / 偏航角 |
| DEVICE_ID | 1, 2, 3, 4 | 传感器1 / 传感器2 / 传感器3 / 传感器4 |
| CHANNEL | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 | 通道1 / 通道2 / 通道3 / 通道4 / 通道5 / 通道6 / 通道7 / 通道8 / 通道9 / 通道10 |
| STATE | 1, 0 | 打开 / 关闭 |
| COLOR | red, green, blue | 红色 / 绿色 / 蓝色 |
| KEY_ID | 0, 1, 2, 3 | 按键1 / 按键2 / 按键3 / 按键4 |
| SHAPE | 1, 2, 3, 4 | 正方体 / 圆柱体 / 圆锥体 / 黑色圆圈 |
| VALUE | 0xFFF200, 0x22B14C, 0xF01450, 0x123456 | 黄色 / 绿色 / 红色 / 黑色 |
| TYPE | 1, 2 | 物品 / Apriltag码 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    four_driver_init(0)
    imu660ma_init(6)
    photoelectricity_init(6)
    key4_adc1_begin()
    openart_mini_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, four_driver_track(math_number(0), math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

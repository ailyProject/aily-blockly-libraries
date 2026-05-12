# Seekfree B1 Controller

Blockly library for Seekfree B1 Controller.

## Library Info
- **Name**: @aily-project/lib-seekfree-b1-controller
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `four_driver_init` | Statement | (none) | `four_driver_init()` | Dynamic code |
| `four_driver_set_speed` | Statement | speed1(input_value), speed2(input_value), speed3(input_value), speed4(input_value) | `four_driver_set_speed(math_number(9600), math_number(9600), math_number(9600), math_number(9600))` | four_driver.set_speed(1, 0, |
| `four_driver_move` | Statement | DIRECTION(dropdown), DISTANCE(input_value), SPEED(input_value) | `four_driver_move("0", math_number(0), math_number(9600))` | four_driver.move(..., ..., ...);\n |
| `four_driver_keep_move` | Statement | DIRECTION(dropdown), SPEED(input_value) | `four_driver_keep_move("0", math_number(9600))` | four_driver.keep_move(..., ...);\n |
| `four_driver_turn` | Statement | DIRECTION(dropdown), ANGLE(input_value), SPEED(input_value) | `four_driver_turn("1", math_number(90), math_number(9600))` | four_driver.turn(... * ... * 10, ...);\n |
| `four_driver_track` | Value | coord_x(input_value), coord_y(input_value) | `four_driver_track(math_number(0), math_number(0))` | four_driver.track( |
| `four_driver_calibration_gyro` | Statement | (none) | `four_driver_calibration_gyro()` | four_driver.calibration_gyro();\n |
| `four_driver_calibration_head` | Statement | ANGLE(input_value) | `four_driver_calibration_head(math_number(90))` | four_driver.calibration_head(...);\n |
| `beep_begin` | Statement | (none) | `beep_begin()` | Dynamic code |
| `beep_set` | Statement | STATE(dropdown) | `beep_set("0")` | digitalWrite(21, ...);\n |
| `led_begin` | Statement | (none) | `led_begin()` | Dynamic code |
| `led_set` | Statement | PIN(dropdown), STATE(dropdown) | `led_set("35", "0")` | digitalWrite(..., ...);\n |
| `key_gpio_begin` | Statement | (none) | `key_gpio_begin()` | Dynamic code |
| `key_gpio_read` | Value | KEY_ID(dropdown), STATE(dropdown) | `key_gpio_read("0", "0")` | key_gpio.read_state( |
| `photoelectricity_init` | Statement | power_index(dropdown) | `photoelectricity_init("0")` | Dynamic code |
| `photoelectricity_set_black` | Statement | DEVICE_ID(dropdown) | `photoelectricity_set_black("1")` | location.set_black( |
| `photoelectricity_set_white` | Statement | DEVICE_ID(dropdown) | `photoelectricity_set_white("1")` | location.set_white( |
| `photoelectricity_get_position` | Value | DEVICE_ID(dropdown) | `photoelectricity_get_position("1")` | Dynamic code |
| `photoelectricity_get_value` | Value | DEVICE_ID(dropdown), CHANNEL(dropdown) | `photoelectricity_get_value("1", "0")` | Dynamic code |
| `photoelectricity_get_value_bin` | Value | DEVICE_ID(dropdown), CHANNEL(dropdown) | `photoelectricity_get_value_bin("1", "0")` | Dynamic code |
| `photoelectricity_get_black_num` | Value | DEVICE_ID(dropdown) | `photoelectricity_get_black_num("1")` | Dynamic code |
| `photoelectricity_get_white_num` | Value | DEVICE_ID(dropdown) | `photoelectricity_get_white_num("1")` | Dynamic code |
| `openart_mini_begin` | Statement | (none) | `openart_mini_begin()` | Dynamic code |
| `openart_mini_detection_object_easy` | Statement | VALUE(dropdown) | `openart_mini_detection_object_easy("1")` | openart_mini.detection_object_easy( |
| `openart_mini_detection_object` | Statement | L_MIN(input_value), L_MAX(input_value), A_MIN(input_value), A_MAX(input_value), B_MIN(input_value), B_MAX(input_value) | `openart_mini_detection_object(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | openart_mini.detection_object( |
| `openart_mini_detection_apriltag` | Statement | (none) | `openart_mini_detection_apriltag()` | openart_mini.detection_apriltag();\n |
| `openart_mini_detection_stop` | Statement | (none) | `openart_mini_detection_stop()` | openart_mini.detection_stop();\n |
| `openart_mini_get_result` | Value | TYPE(dropdown) | `openart_mini_get_result("1")` | openart_mini.get_result( |
| `openart_mini_get_coord_x` | Value | TYPE(dropdown) | `openart_mini_get_coord_x("1")` | openart_mini.get_coord_x( |
| `openart_mini_get_coord_y` | Value | TYPE(dropdown) | `openart_mini_get_coord_y("1")` | openart_mini.get_coord_y( |
| `robotic_arm_init` | Statement | (none) | `robotic_arm_init()` | Dynamic code |
| `robotic_arm_set_servo_motor_angle` | Statement | channel(dropdown), angle(input_value) | `robotic_arm_set_servo_motor_angle("0", math_number(90))` | robot_arm.set_servo_motor_angle(1, ..., ... * 10);\n |
| `robotic_arm_set_servo_motor_offset_angle` | Statement | channel(dropdown), angle(input_value) | `robotic_arm_set_servo_motor_offset_angle("0", math_number(90))` | robot_arm.set_servo_motor_offset_angle(1, ..., ... * 10);\n |
| `robotic_arm_get_servo_motor_angle` | Value | channel(dropdown) | `robotic_arm_get_servo_motor_angle("0")` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DIRECTION | 0, 1, 2, 3 | four_driver_move, four_driver_keep_move |
| DIRECTION | 1, -1 | four_driver_turn |
| STATE | 0, 1 | beep_set, led_set |
| PIN | 35, 36, 37 | led_set |
| KEY_ID | 0, 1, 2, 3 | key_gpio_read |
| STATE | 0, 1, 2, 3 | key_gpio_read |
| power_index | 0, 1, 2, 3 | photoelectricity_init |
| DEVICE_ID | 1, 2, 3, 4 | photoelectricity_set_black, photoelectricity_set_white, photoelectricity_get_position |
| CHANNEL | 0, 1, 2, 3, 4, 5, 6, 7 | photoelectricity_get_value, photoelectricity_get_value_bin |
| VALUE | 1, 2, 3, 4 | openart_mini_detection_object_easy |
| TYPE | 1, 2 | openart_mini_get_result, openart_mini_get_coord_x, openart_mini_get_coord_y |
| channel | 0, 1, 2, 3, 4, 5 | robotic_arm_set_servo_motor_angle, robotic_arm_set_servo_motor_offset_angle, robotic_arm_get_serv... |

## ABS Examples

### Basic Usage
```
arduino_setup()
    four_driver_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, four_driver_track(math_number(0), math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

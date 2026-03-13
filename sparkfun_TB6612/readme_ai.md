# TB6612直流电机驱动

基于TB6612直流电机驱动芯片，通过PWM和方向控制信号实现双路直流电机的正反转与调速，适用于Arduino、ESP32等开发板

## Library Info
- **Name**: @aily-project/lib-sparkfun_tb6612
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tb6612_motor_init` | Statement | MOTOR_A_NAME(field_variable), AIN1(input_value), AIN2(input_value), PWMA(input_value), OFFSET_A(input_value) | `tb6612_motor_init($motor1, math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `tb6612_drive` | Statement | MOTOR_SELECT(dropdown), SPEED(input_value) | `tb6612_drive(A, math_number(100))` | (dynamic code) |
| `tb6612_reverse` | Statement | MOTOR_SELECT(dropdown), SPEED(input_value) | `tb6612_reverse(A, math_number(100))` | (dynamic code) |
| `tb6612_brake` | Statement | MOTOR_SELECT(dropdown) | `tb6612_brake(A)` | (dynamic code) |
| `tb6612_dual_action` | Statement | MODE(dropdown), SPEED(input_value), MOTOR1(field_variable), MOTOR2(field_variable), LEFT_MOTOR(field_variable), RIGHT_MOTOR(field_variable) | `tb6612_dual_action(forward, math_number(100), $motor1, $motor2, $leftMotor, $rightMotor)` | `forward(` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MOTOR_SELECT | A, B | motor1 / motor2 |
| MODE | forward, back, left, right, brake | 前进 / 后退 / 左转 / 右转 / 刹车 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    tb6612_motor_init($motor1, math_number(0), math_number(0), math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

# mBrick DC Motor

Blockly library for mBrick DC Motor.

## Library Info
- **Name**: @aily-project/lib-mbrick-dcmotor
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mbrick_motor_init` | Statement | VAR(field_input), MOTOR(dropdown) | `mbrick_motor_init("motor1", M1)` | Dynamic code |
| `mbrick_motor_forward` | Statement | VAR(field_variable), PWM(input_value) | `mbrick_motor_forward(variables_get($motor1), math_number(0))` | Dynamic code |
| `mbrick_motor_backward` | Statement | VAR(field_variable), PWM(input_value) | `mbrick_motor_backward(variables_get($motor1), math_number(0))` | Dynamic code |
| `mbrick_motor_stop` | Statement | VAR(field_variable), MODE(dropdown) | `mbrick_motor_stop(variables_get($motor1), COAST)` | Dynamic code |
| `mbrick_motor_set_speed` | Statement | VAR(field_variable), PWM(input_value) | `mbrick_motor_set_speed(variables_get($motor1), math_number(0))` | Dynamic code |
| `mbrick_motor_is_running` | Value | VAR(field_variable) | `mbrick_motor_is_running(variables_get($motor1))` | Dynamic code |
| `mbrick_car_init` | Statement | VAR(field_input), LEFT_MOTOR(field_variable), RIGHT_MOTOR(field_variable) | `mbrick_car_init("car", variables_get($motor1), variables_get($motor2))` | Dynamic code |
| `mbrick_car_forward` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car_forward(variables_get($car), math_number(9600))` | Dynamic code |
| `mbrick_car_backward` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car_backward(variables_get($car), math_number(9600))` | Dynamic code |
| `mbrick_car_turn_left` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car_turn_left(variables_get($car), math_number(9600))` | Dynamic code |
| `mbrick_car_turn_right` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car_turn_right(variables_get($car), math_number(9600))` | Dynamic code |
| `mbrick_car_stop` | Statement | VAR(field_variable), MODE(dropdown) | `mbrick_car_stop(variables_get($car), COAST)` | Dynamic code |
| `mbrick_car_set_speed` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car_set_speed(variables_get($car), math_number(9600))` | Dynamic code |
| `mbrick_car_set_min_pwm` | Statement | VAR(field_variable), MIN_PWM(input_value) | `mbrick_car_set_min_pwm(variables_get($car), math_number(0))` | Dynamic code |
| `mbrick_car4wd_init` | Statement | VAR(field_input), LF(field_variable), LR(field_variable), RF(field_variable), RR(field_variable) | `mbrick_car4wd_init("car4wd", variables_get($motor1), variables_get($motor2), variables_get($motor3), variables_get($motor4))` | Dynamic code |
| `mbrick_car4wd_forward` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car4wd_forward(variables_get($car4wd), math_number(9600))` | Dynamic code |
| `mbrick_car4wd_backward` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car4wd_backward(variables_get($car4wd), math_number(9600))` | Dynamic code |
| `mbrick_car4wd_turn_left` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car4wd_turn_left(variables_get($car4wd), math_number(9600))` | Dynamic code |
| `mbrick_car4wd_turn_right` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car4wd_turn_right(variables_get($car4wd), math_number(9600))` | Dynamic code |
| `mbrick_car4wd_stop` | Statement | VAR(field_variable), MODE(dropdown) | `mbrick_car4wd_stop(variables_get($car4wd), COAST)` | Dynamic code |
| `mbrick_car4wd_set_speed` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car4wd_set_speed(variables_get($car4wd), math_number(9600))` | Dynamic code |
| `mbrick_car4wd_set_min_pwm` | Statement | VAR(field_variable), MIN_PWM(input_value) | `mbrick_car4wd_set_min_pwm(variables_get($car4wd), math_number(0))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MOTOR | M1, M2, M3, M4 | mbrick_motor_init |
| MODE | COAST, BRAKE | mbrick_motor_stop, mbrick_car_stop, mbrick_car4wd_stop |

## ABS Examples

### Basic Usage
```
arduino_setup()
    mbrick_motor_init("motor1", M1)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, mbrick_motor_is_running(variables_get($motor1)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `mbrick_motor_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **PWM channels**: the bundled driver binds motors to high LEDC channels first, avoiding ESP32Servo's default low-channel allocation.

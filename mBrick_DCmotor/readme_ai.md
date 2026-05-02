# mBrick DC Motor

直流电机驱动库，支持单电机、两轮差速小车、四轮驱动小车控制。

## Library Info
- **Name**: @aily-project/lib-mbrick-dcmotor
- **Version**: 1.0.0

## Block Definitions

### 单电机控制

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mbrick_motor_init` | Statement | VAR(field_input), MOTOR(field_dropdown) | `mbrick_motor_init("motor1", M1)` | `mBrickMotor motor1(4, 5); motor1.begin();` |
| `mbrick_motor_forward` | Statement | VAR(field_variable), PWM(input_value) | `mbrick_motor_forward(variables_get($motor1), math_number(128))` | `motor1.forward(128);` |
| `mbrick_motor_backward` | Statement | VAR(field_variable), PWM(input_value) | `mbrick_motor_backward(variables_get($motor1), math_number(128))` | `motor1.backward(128);` |
| `mbrick_motor_stop` | Statement | VAR(field_variable), MODE(field_dropdown) | `mbrick_motor_stop(variables_get($motor1), COAST)` | `motor1.stop(COAST);` |
| `mbrick_motor_set_speed` | Statement | VAR(field_variable), PWM(input_value) | `mbrick_motor_set_speed(variables_get($motor1), math_number(128))` | `motor1.setSpeedPWM(128);` |
| `mbrick_motor_is_running` | Value | VAR(field_variable) | `mbrick_motor_is_running(variables_get($motor1))` | `motor1.isRunning()` |

### 两轮车控制

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mbrick_car_init` | Statement | VAR(field_input), LEFT_MOTOR(field_variable), RIGHT_MOTOR(field_variable) | `mbrick_car_init("car", variables_get($motor1), variables_get($motor2))` | `mBrickCar car(motor1, motor2); car.begin();` |
| `mbrick_car_forward` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car_forward(variables_get($car), math_number(50))` | `car.forward(50);` |
| `mbrick_car_backward` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car_backward(variables_get($car), math_number(50))` | `car.backward(50);` |
| `mbrick_car_turn_left` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car_turn_left(variables_get($car), math_number(50))` | `car.turnLeft(50);` |
| `mbrick_car_turn_right` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car_turn_right(variables_get($car), math_number(50))` | `car.turnRight(50);` |
| `mbrick_car_stop` | Statement | VAR(field_variable), MODE(field_dropdown) | `mbrick_car_stop(variables_get($car), COAST)` | `car.stop(COAST);` |
| `mbrick_car_set_speed` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car_set_speed(variables_get($car), math_number(50))` | `car.setSpeed(50);` |
| `mbrick_car_set_min_pwm` | Statement | VAR(field_variable), MIN_PWM(input_value) | `mbrick_car_set_min_pwm(variables_get($car), math_number(50))` | `car.setMinPWM(50);` |

### 四轮车控制

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mbrick_car4wd_init` | Statement | VAR(field_input), LF(field_variable), LR(field_variable), RF(field_variable), RR(field_variable) | `mbrick_car4wd_init("car4wd", variables_get($motor1), variables_get($motor2), variables_get($motor3), variables_get($motor4))` | `mBrickCar4WD car4wd(motor1, motor2, motor3, motor4); car4wd.begin();` |
| `mbrick_car4wd_forward` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car4wd_forward(variables_get($car4wd), math_number(50))` | `car4wd.forward(50);` |
| `mbrick_car4wd_backward` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car4wd_backward(variables_get($car4wd), math_number(50))` | `car4wd.backward(50);` |
| `mbrick_car4wd_turn_left` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car4wd_turn_left(variables_get($car4wd), math_number(50))` | `car4wd.turnLeft(50);` |
| `mbrick_car4wd_turn_right` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car4wd_turn_right(variables_get($car4wd), math_number(50))` | `car4wd.turnRight(50);` |
| `mbrick_car4wd_stop` | Statement | VAR(field_variable), MODE(field_dropdown) | `mbrick_car4wd_stop(variables_get($car4wd), COAST)` | `car4wd.stop(COAST);` |
| `mbrick_car4wd_set_speed` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car4wd_set_speed(variables_get($car4wd), math_number(50))` | `car4wd.setSpeed(50);` |
| `mbrick_car4wd_set_min_pwm` | Statement | VAR(field_variable), MIN_PWM(input_value) | `mbrick_car4wd_set_min_pwm(variables_get($car4wd), math_number(50))` | `car4wd.setMinPWM(50);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MOTOR | M1, M2, M3, M4 | 电机引脚选择：M1(4,5), M2(6,7), M3(9,10), M4(21,20) |
| MODE | COAST, BRAKE | 停止模式：COAST=滑行(断电), BRAKE=刹车(短路) |

## ABS Examples

### 单电机控制
arduino_setup()
    mbrick_motor_init("motor1", M1)

arduino_loop()
    mbrick_motor_forward(variables_get($motor1), math_number(200))
    time_delay(math_number(2000))
    mbrick_motor_stop(variables_get($motor1), BRAKE)

### 两轮车控制
arduino_setup()
    mbrick_motor_init("motor1", M1)
    mbrick_motor_init("motor2", M2)
    mbrick_car_init("car", variables_get($motor1), variables_get($motor2))

arduino_loop()
    mbrick_car_forward(variables_get($car), math_number(60))
    time_delay(math_number(2000))
    mbrick_car_turn_left(variables_get($car), math_number(40))
    time_delay(math_number(1000))
    mbrick_car_stop(variables_get($car), BRAKE)

### 四轮车控制
arduino_setup()
    mbrick_motor_init("motor1", M1)
    mbrick_motor_init("motor2", M2)
    mbrick_motor_init("motor3", M3)
    mbrick_motor_init("motor4", M4)
    mbrick_car4wd_init("car4wd", variables_get($motor1), variables_get($motor2), variables_get($motor3), variables_get($motor4))

arduino_loop()
    mbrick_car4wd_forward(variables_get($car4wd), math_number(70))
    time_delay(math_number(3000))
    mbrick_car4wd_stop(variables_get($car4wd), COAST)

## Notes

1. **初始化顺序**：必须先初始化所有电机，再创建小车/四轮车对象
2. **变量引用**：`mbrick_motor_init("varName", M1)` 创建变量 `$varName`，后续用 `variables_get($varName)` 引用
3. **PWM范围**：单电机控制使用0-255 PWM值；小车控制使用0-100速度百分比
4. **引脚固定**：M1(4,5), M2(6,7), M3(9,10), M4(21,20)，无需手动指定引脚号
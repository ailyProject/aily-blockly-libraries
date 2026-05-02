# mBrick DC Motor

直流电机驱动库，支持单电机、两轮差速小车、四轮驱动小车控制。

## 库信息

| 字段 | 值 |
|------|------|
| 包名 | @aily-project/lib-mbrick-dcmotor |
| 版本 | 1.0.0 |
| 兼容核心 | esp32:esp32 |
| 电压 | 3.3V / 5V |

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|-----------|----------|----------|
| `mbrick_motor_init` | Statement | VAR(field_input), MOTOR(field_dropdown) | `mbrick_motor_init("motor1", M1)` | `mBrickMotor motor1(4, 5); motor1.begin();` |
| `mbrick_motor_forward` | Statement | VAR(field_variable), PWM(input_value) | `mbrick_motor_forward($motor1, math_number(128))` | `motor1.forward(128);` |
| `mbrick_motor_backward` | Statement | VAR(field_variable), PWM(input_value) | `mbrick_motor_backward($motor1, math_number(128))` | `motor1.backward(128);` |
| `mbrick_motor_stop` | Statement | VAR(field_variable), MODE(field_dropdown) | `mbrick_motor_stop($motor1, COAST)` | `motor1.stop(COAST);` |
| `mbrick_motor_set_speed` | Statement | VAR(field_variable), PWM(input_value) | `mbrick_motor_set_speed($motor1, math_number(128))` | `motor1.setSpeedPWM(128);` |
| `mbrick_motor_is_running` | Value(Boolean) | VAR(field_variable) | `mbrick_motor_is_running($motor1)` | `motor1.isRunning()` |
| `mbrick_car_init` | Statement | VAR(field_input), LEFT_MOTOR(field_variable), RIGHT_MOTOR(field_variable) | `mbrick_car_init("car", $motor1, $motor2)` | `mBrickCar car(motor1, motor2); car.begin();` |
| `mbrick_car_forward` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car_forward($car, math_number(50))` | `car.forward(50);` |
| `mbrick_car_backward` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car_backward($car, math_number(50))` | `car.backward(50);` |
| `mbrick_car_turn_left` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car_turn_left($car, math_number(50))` | `car.turnLeft(50);` |
| `mbrick_car_turn_right` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car_turn_right($car, math_number(50))` | `car.turnRight(50);` |
| `mbrick_car_stop` | Statement | VAR(field_variable), MODE(field_dropdown) | `mbrick_car_stop($car, COAST)` | `car.stop(COAST);` |
| `mbrick_car_set_speed` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car_set_speed($car, math_number(50))` | `car.setSpeed(50);` |
| `mbrick_car_set_min_pwm` | Statement | VAR(field_variable), MIN_PWM(input_value) | `mbrick_car_set_min_pwm($car, math_number(50))` | `car.setMinPWM(50);` |
| `mbrick_car4wd_init` | Statement | VAR(field_input), LF/LR/RF/RR(field_variable) | `mbrick_car4wd_init("car4wd", $m1, $m2, $m3, $m4)` | `mBrickCar4WD car4wd(...); car4wd.begin();` |
| `mbrick_car4wd_forward` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car4wd_forward($car4wd, math_number(50))` | `car4wd.forward(50);` |
| `mbrick_car4wd_backward` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car4wd_backward($car4wd, math_number(50))` | `car4wd.backward(50);` |
| `mbrick_car4wd_turn_left` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car4wd_turn_left($car4wd, math_number(50))` | `car4wd.turnLeft(50);` |
| `mbrick_car4wd_turn_right` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car4wd_turn_right($car4wd, math_number(50))` | `car4wd.turnRight(50);` |
| `mbrick_car4wd_stop` | Statement | VAR(field_variable), MODE(field_dropdown) | `mbrick_car4wd_stop($car4wd, COAST)` | `car4wd.stop(COAST);` |
| `mbrick_car4wd_set_speed` | Statement | VAR(field_variable), SPEED(input_value) | `mbrick_car4wd_set_speed($car4wd, math_number(50))` | `car4wd.setSpeed(50);` |
| `mbrick_car4wd_set_min_pwm` | Statement | VAR(field_variable), MIN_PWM(input_value) | `mbrick_car4wd_set_min_pwm($car4wd, math_number(50))` | `car4wd.setMinPWM(50);` |

## 字段类型映射

| 字段类型 | 用途 | 示例 |
|----------|------|------|
| `field_input` | 初始化块的对象命名 | `VAR: "motor1"` |
| `field_variable` | 方法块引用已创建的对象 | `VAR: $motor1` |
| `field_dropdown` | 枚举选项选择 | `MOTOR: M1/M2/M3/M4`, `MODE: COAST/BRAKE` |
| `input_value` | 数值参数输入 | `PWM: math_number(128)`, `SPEED: math_number(50)` |

## 连接规则

| 规则 | 说明 |
|------|------|
| 初始化块 → `field_input` | `_init` 块使用 `field_input` 创建对象名，自动注册变量 |
| 方法块 → `field_variable` | 操作块使用 `field_variable` 引用已创建的对象 |
| Statement 块 | 所有操作块都有 `previousStatement` / `nextStatement`，可纵向连接 |
| Value 块 | `mbrick_motor_is_running` 返回 Boolean，可嵌入条件块 |

## 使用示例

### 单电机控制
```
arduino_setup()
    mbrick_motor_init("motor1", M1)

arduino_loop()
    mbrick_motor_forward($motor1, math_number(200))
    time_delay(math_number(2000))
    mbrick_motor_stop($motor1, BRAKE)
```

### 两轮车控制
```
arduino_setup()
    mbrick_motor_init("motor1", M1)
    mbrick_motor_init("motor2", M2)
    mbrick_car_init("car", $motor1, $motor2)

arduino_loop()
    mbrick_car_forward($car, math_number(60))
    time_delay(math_number(2000))
    mbrick_car_stop($car, BRAKE)
```

### 四轮车控制（前后两组两轮车）
```
arduino_setup()
    mbrick_motor_init("motor1", M1)
    mbrick_motor_init("motor2", M2)
    mbrick_motor_init("motor3", M3)
    mbrick_motor_init("motor4", M4)
    mbrick_car_init("carFront", $motor1, $motor2)
    mbrick_car_init("carRear", $motor3, $motor4)

arduino_loop()
    mbrick_car_forward($carFront, math_number(10))
    mbrick_car_forward($carRear, math_number(10))
    time_delay(math_number(3000))
    mbrick_car_stop($carFront, COAST)
    mbrick_car_stop($carRear, COAST)
```

## 重要规则

1. **初始化顺序**：必须先初始化所有电机（`mbrick_motor_init`），再创建小车对象（`mbrick_car_init`）
2. **变量自动注册**：`_init` 块会自动调用 `registerVariableToBlockly` 注册变量到工作区
3. **变量重命名**：`_init` 块监听 `onFinishEditing_` 事件，修改变量名时自动同步
4. **PWM范围**：单电机控制使用 0-255 PWM 值；小车控制使用 0-100 速度百分比
5. **引脚固定**：M1(4,5), M2(6,7), M3(9,10), M4(21,20)，通过下拉菜单选择
6. **停止模式**：COAST=滑行（断电惯性），BRAKE=刹车（短路制动）
7. **方法块读取**：所有 `field_variable` 字段使用 `getField('VAR').getText()` 获取变量名
8. **对象声明**：使用 `generator.addObject()` 在全局声明对象，避免重复定义
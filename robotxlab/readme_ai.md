# RobotXlab

基于Arduino UNO R3的机器人控制库，支持电机、舵机、传感器和遥控器。

## Library Info
- **Name**: @aily-project/lib-robotxlab
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `robotxlab_motor` | Statement | DIRECTION(dropdown), SPEED(input_value) | `robotxlab_motor(MOTOR_0, math_number(255))` | `run(0, 255);` |
| `robotxlab_servo` | Statement | ANGLE(input_value) | `robotxlab_servo(math_number(90))` | `myservo.write(90);` |
| `robotxlab_servo_pulse` | Statement | ANGLE(input_value) | `robotxlab_servo_pulse(math_number(90))` | `servopulse(90);` |
| `robotxlab_led` | Statement | STATE(dropdown) | `robotxlab_led(HIGH)` | `digitalWrite(led, HIGH);` |
| `robotxlab_buzzer` | Statement | STATE(dropdown) | `robotxlab_buzzer(HIGH)` | `digitalWrite(buzz, HIGH);` |
| `robotxlab_ultrasonic` | Value(Number) | — | `robotxlab_ultrasonic()` | `sr04.Distance()` |
| `robotxlab_button` | Value(Boolean) | STATE(dropdown) | `robotxlab_button(PRESSED)` | `My_click() == 1` |
| `robotxlab_line_tracking` | Value(Boolean) | PORT(dropdown), VALUE(dropdown) | `robotxlab_line_tracking(PORT_2, BLACK)` | `digitalRead(Sensor_2) == 1` |
| `robotxlab_light_analog` | Value(Number) | PORT(dropdown) | `robotxlab_light_analog(PORT_4)` | `analogRead(LightSensor_4)` |
| `robotxlab_light_digital` | Value(Boolean) | PORT(dropdown), VALUE(dropdown) | `robotxlab_light_digital(PORT_4, NO_LIGHT)` | `digitalRead(LightSensor_4) == 1` |
| `robotxlab_ir_obstacle` | Value(Boolean) | PORT(dropdown), VALUE(dropdown) | `robotxlab_ir_obstacle(PORT_4, NO_OBSTACLE)` | `digitalRead(RedSensor_4) == 1` |
| `robotxlab_ir_remote` | Value(Boolean) | KEY(dropdown) | `robotxlab_ir_remote(KEY_1)` | `Get_IRremote() == IR_1` |
| `robotxlab_ps2_button` | Value(Boolean) | KEY(dropdown) | `robotxlab_ps2_button(L1)` | `Get_PS2_key() == SP2Key_1` |
| `robotxlab_ps2_rocker` | Value(Number) | ROCKER(dropdown), DIR(dropdown) | `robotxlab_ps2_rocker(LEFT, FORWARD)` | `Get_PS2_rocker(0, 0)` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DIRECTION | MOTOR_0 ("电机接口0"), MOTOR_1 ("电机接口1") | 电机接口选择 |
| STATE (LED) | HIGH ("亮"), LOW ("灭") | LED状态 |
| STATE (Buzzer) | HIGH ("鸣"), LOW ("嘘") | 蜂鸣器状态 |
| STATE (Button) | 1 ("按下"), 0 ("松开") | 按键状态 |
| PORT (Line) | 2 ("接口2"), 3 ("接口3") | 巡线传感器接口 |
| VALUE (Line) | 1 ("黑"), 0 ("白") | 巡线检测值 |
| PORT (Light/IR) | 4 ("接口4"), 5 ("接口5") | 光敏/红外传感器接口 |
| VALUE (Light) | 0 ("有光"), 1 ("无光") | 光敏检测值 |
| VALUE (IR Obstacle) | 0 ("有障碍"), 1 ("无障碍") | 红外避障检测值 |
| KEY (IR Remote) | 0~9, 10 (*), 11 (#), 12 (▲), 13 (◀), 14 (OK), 15 (▶), 16 (▼) | 红外遥控按键 |
| KEY (PS2) | L1~R2, 十字键, △×○□, SELECT, START, MODE, 摇杆按下 | PS2手柄按键 |
| ROCKER | 0 ("左"), 1 ("右") | PS2摇杆选择 |
| DIR | 0 ("向前"), 1 ("向后"), 2 ("向左"), 3 ("向右"), -1 ("无") | 摇杆方向 |

## ABS Examples

### 避障小车
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    controls_if()
        @IF0: logic_compare(robotxlab_ultrasonic(), LT, math_number(20))
        @DO0:
            robotxlab_motor(MOTOR_0, math_number(0))
            robotxlab_motor(MOTOR_1, math_number(0))
            robotxlab_buzzer(HIGH)
            time_delay(math_number(500))
            robotxlab_buzzer(LOW)
            robotxlab_motor(MOTOR_0, math_number(-200))
            robotxlab_motor(MOTOR_1, math_number(200))
            time_delay(math_number(500))
        @ELSE:
            robotxlab_motor(MOTOR_0, math_number(200))
            robotxlab_motor(MOTOR_1, math_number(200))
```

### 巡线机器人
```
arduino_loop()
    controls_if()
        @IF0: robotxlab_line_tracking(PORT_2, BLACK)
        @DO0:
            robotxlab_motor(MOTOR_0, math_number(200))
            robotxlab_motor(MOTOR_1, math_number(0))
        @IF1: robotxlab_line_tracking(PORT_3, BLACK)
        @DO1:
            robotxlab_motor(MOTOR_0, math_number(0))
            robotxlab_motor(MOTOR_1, math_number(200))
        @ELSE:
            robotxlab_motor(MOTOR_0, math_number(200))
            robotxlab_motor(MOTOR_1, math_number(200))
```

## Notes

1. **硬件固定引脚**: 所有引脚在RobotXlab PCB上已固定，用户无需选择引脚
2. **电机速度范围**: -255~255，正值正转，负值反转，0停止
3. **LED与蜂鸣器共用引脚13**: 二者不可同时使用
4. **超声波**: 使用SR04库，TRIG=A0, ECHO=A1
5. **全局对象**: 本库使用全局函数/对象，无需创建变量

# SparkFun TB6612FNG 双路电机驱动

## Library Info
- **Name**: @aily-project/lib-sparkfun-tb6612fng
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tb6612fng_init` | Statement | VAR(field_input), IN1(value), IN2(value), PWM(value), OFFSET(dropdown:1/-1), STBY(value) | `tb6612fng_init("motor1", 2, 3, 9, 1, 8)` | `Motor motor1(2, 3, 9, 1, 8);` |
| `tb6612fng_drive` | Statement | VAR(field_variable), SPEED(value) | `tb6612fng_drive(variables_get($motor1), 200)` | `motor1.drive(200);` |
| `tb6612fng_brake` | Statement | VAR(field_variable) | `tb6612fng_brake(variables_get($motor1))` | `motor1.brake();` |
| `tb6612fng_standby` | Statement | PIN(value), STATE(dropdown:HIGH/LOW) | `tb6612fng_standby(8, HIGH)` | `digitalWrite(8, HIGH);` |

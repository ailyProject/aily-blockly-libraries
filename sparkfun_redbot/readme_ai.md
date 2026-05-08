# SparkFun RedBot 机器人平台

## Library Info
- **Name**: @aily-project/lib-sparkfun-redbot
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `redbot_motors_init` | Statement | VAR(field_input) | `redbot_motors_init("motors")` | `RedBotMotors motors;` |
| `redbot_motors_drive` | Statement | VAR(field_variable), SPEED(value) | `redbot_motors_drive(variables_get($motors), 200)` | `motors.drive(200);` |
| `redbot_motors_pivot` | Statement | VAR(field_variable), SPEED(value) | `redbot_motors_pivot(variables_get($motors), 150)` | `motors.pivot(150);` |
| `redbot_motors_stop` | Statement | VAR(field_variable) | `redbot_motors_stop(variables_get($motors))` | `motors.stop();` |
| `redbot_motors_brake` | Statement | VAR(field_variable) | `redbot_motors_brake(variables_get($motors))` | `motors.brake();` |
| `redbot_sensor_init` | Statement | VAR(field_input), PIN(value) | `redbot_sensor_init("sensor1", A0)` | `RedBotSensor sensor1(A0);` |
| `redbot_sensor_read` | Value→Number | VAR(field_variable) | `redbot_sensor_read(variables_get($sensor1))` | `sensor1.read()` |
| `redbot_bumper_init` | Statement | VAR(field_input), PIN(value) | `redbot_bumper_init("bumper1", 3)` | `RedBotBumper bumper1(3);` |
| `redbot_bumper_read` | Value→Boolean | VAR(field_variable) | `redbot_bumper_read(variables_get($bumper1))` | `bumper1.read()` |

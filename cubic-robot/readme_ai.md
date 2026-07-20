# Cubic Contest Robot

Uses bundled `em::EncoderMotor` (lib-encoder-motor) + ESP32Servo for Cubic CoreV2/Motor.

## Library Info
- **Name**: @aily-project/lib-cubic-robot
- **Version**: 1.1.1

## Block Definitions

| Block Type | Connection | Parameters | Generated Code |
|------------|------------|------------|----------------|
| `cubic_robot_init` | Statement | VAR | `CubicRobot robot; robot.begin();` |
| `cubic_robot_set_motor_pins` | Statement | VAR,MOTOR,IN1,IN2,ENC_A,ENC_B | set pin fields before begin |
| `cubic_robot_set_pid` | Statement | VAR,MOTOR,P,I,D | `setPid(...)` |
| `cubic_robot_run_pwm` | Statement | VAR,MOTOR,PWM | `runPwm(...)` |
| `cubic_robot_run_speed` | Statement | VAR,MOTOR,SPEED | `runSpeed(...)` |
| `cubic_robot_drive` | Statement | VAR,FORWARD,TURN | `drive(...)` |
| `cubic_robot_move` | Statement | VAR,DIR,SPEED | forward/back/left/right/stop |
| `cubic_robot_stop` | Statement | VAR | `stopAll()` |
| `cubic_robot_get_speed` | Value | VAR,MOTOR | `speedRpm(...)` |
| `cubic_robot_get_pulse` | Value | VAR,MOTOR | `pulse(...)` |
| `cubic_robot_get_revolutions` | Value | VAR,MOTOR | `revolutions(...)` |
| `cubic_robot_reset_pulse` | Statement | VAR,MOTOR | `resetPulse(...)` |
| `cubic_robot_servo` | Statement | VAR,SERVO,ANGLE | `setServoAngle(...)` |
| `cubic_robot_button` | Value | VAR,BTN | `buttonPressed(...)` |
| `cubic_robot_rgb` | Statement | VAR,STATE | `setRgb(...)` |
| `cubic_robot_pin_info` | Statement | none | comment |

## ABS Example
```
arduino_setup()
    cubic_robot_init("robot")

arduino_loop()
    cubic_robot_run_speed(variables_get($robot), MOTOR_A, math_number(100))
    cubic_robot_run_speed(variables_get($robot), MOTOR_B, math_number(100))
```

## Notes
1. PWM range -1023~1023; speed RPM -300~300 (from EncoderMotor).
2. Call pin overrides before `begin` (i.e. before init block effect if split carefully; preferred: set fields then init in same setup order — pin set blocks should be placed before init in setup, because begin() reads fields).
3. ESP32 only.

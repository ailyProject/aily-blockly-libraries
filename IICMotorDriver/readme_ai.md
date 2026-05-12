# IIC motor driver library

Adapted to the openjumper IIC-MS driver board, it realizes 4-channel adjustable speed motor control and 4-channel steering gear control through the I2C protocol. It supports independent control of multiple motors, spe...

## Library Info
- **Name**: @aily-project/lib-iicmotordriver
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `iicmd_init` | Statement | (none) | `iicmd_init()` | Dynamic code |
| `iicmd_dirinit` | Statement | DIR_TYPE_M1(dropdown), DIR_TYPE_M2(dropdown), DIR_TYPE_M3(dropdown), DIR_TYPE_M4(dropdown) | `iicmd_dirinit(DIRP, DIRP, DIRP, DIRP)` | pwm.motorConfig(...,...,...,...);\n |
| `iicmd_stop` | Statement | MOTOR_NUMBER(dropdown) | `iicmd_stop(M1)` | pwm.stopMotor(...);\n |
| `iicmd_runone` | Statement | MOTOR_RUN_NUM(dropdown), RUNONR_SP(input_value) | `iicmd_runone(M1, math_number(0))` | pwm.setMotor(...,...);\n |
| `iicmd_runall` | Statement | RUNALL_SP(input_value) | `iicmd_runall(math_number(0))` | pwm.setAllMotor(...);\n |
| `iicmd_runall2` | Statement | M1_SP(input_value), M2_SP(input_value), M3_SP(input_value), M4_SP(input_value) | `iicmd_runall2(math_number(0), math_number(0), math_number(0), math_number(0))` | pwm.setAllMotor(...,...,...,...);\n |
| `iicmd_digitout` | Statement | IODIGIT(dropdown), OUTSTATE(dropdown) | `iicmd_digitout(S1, HIGH)` | pwm.digitalWrite(...,...);\n |
| `iicmd_servo` | Statement | IOSERVER(dropdown), SERANGLE(input_value) | `iicmd_servo(S1, math_number(90))` | pwm.setServoAngle(...,...);\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DIR_TYPE_M1 | DIRP, DIRN | iicmd_dirinit |
| DIR_TYPE_M2 | DIRP, DIRN | iicmd_dirinit |
| DIR_TYPE_M3 | DIRP, DIRN | iicmd_dirinit |
| DIR_TYPE_M4 | DIRP, DIRN | iicmd_dirinit |
| MOTOR_NUMBER | M1, M2, M3, M4, MALL | iicmd_stop |
| MOTOR_RUN_NUM | M1, M2, M3, M4 | iicmd_runone |
| IODIGIT | S1, S2, S3, S4 | iicmd_digitout |
| OUTSTATE | HIGH, LOW | iicmd_digitout |
| IOSERVER | S1, S2, S3, S4 | iicmd_servo |

## ABS Examples

### Basic Usage
```
arduino_setup()
    iicmd_init()
    serial_begin(Serial, 9600)

arduino_loop()
    iicmd_dirinit(DIRP, DIRP, DIRP, DIRP)
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

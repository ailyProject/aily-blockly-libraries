# IIC电机驱动库

适配openjumper IIC-MS驱动板，通过I2C协议实现4路可调速电机控制、4路舵机控制，支持多路电机独立控制、转速调节、正反转切换、刹车功能，兼容多种主流开发板。

## Library Info
- **Name**: @aily-project/lib-iicmotordriver
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `iicmd_init` | Statement | (none) | `iicmd_init()` | `` |
| `iicmd_dirinit` | Statement | DIR_TYPE_M1(dropdown), DIR_TYPE_M2(dropdown), DIR_TYPE_M3(dropdown), DIR_TYPE_M4(dropdown) | `iicmd_dirinit(DIRP, DIRP, DIRP, DIRP)` | `pwm.motorConfig(...,...,...,...);\n` |
| `iicmd_stop` | Statement | MOTOR_NUMBER(dropdown) | `iicmd_stop(M1)` | `pwm.stopMotor(...);\n` |
| `iicmd_runone` | Statement | MOTOR_RUN_NUM(dropdown), RUNONR_SP(input_value) | `iicmd_runone(M1, math_number(0))` | `pwm.setMotor(...,...);\n` |
| `iicmd_runall` | Statement | RUNALL_SP(input_value) | `iicmd_runall(math_number(0))` | `pwm.setAllMotor(...);\n` |
| `iicmd_runall2` | Statement | M1_SP(input_value), M2_SP(input_value), M3_SP(input_value), M4_SP(input_value) | `iicmd_runall2(math_number(0), math_number(0), math_number(0), math_number(0))` | `pwm.setAllMotor(...,...,...,...);\n` |
| `iicmd_digitout` | Statement | IODIGIT(dropdown), OUTSTATE(dropdown) | `iicmd_digitout(S1, HIGH)` | `pwm.digitalWrite(...,...);\n` |
| `iicmd_servo` | Statement | IOSERVER(dropdown), SERANGLE(input_value) | `iicmd_servo(S1, math_number(0))` | `pwm.setServoAngle(...,...);\n` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DIR_TYPE_M1 | DIRP, DIRN | DIR1 / DIR2 |
| DIR_TYPE_M2 | DIRP, DIRN | DIR1 / DIR2 |
| DIR_TYPE_M3 | DIRP, DIRN | DIR1 / DIR2 |
| DIR_TYPE_M4 | DIRP, DIRN | DIR1 / DIR2 |
| MOTOR_NUMBER | M1, M2, M3, M4, MALL | 电机1 / 电机2 / 电机3 / 电机4 / 全部电机 |
| MOTOR_RUN_NUM | M1, M2, M3, M4 | 电机1 / 电机2 / 电机3 / 电机4 |
| IODIGIT | S1, S2, S3, S4 | S1 / S2 / S3 / S4 |
| OUTSTATE | HIGH, LOW | HIGH / LOW |
| IOSERVER | S1, S2, S3, S4 | S1 / S2 / S3 / S4 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    iicmd_init()
    iicmd_dirinit(DIRP, DIRP, DIRP, DIRP)
    serial_begin(Serial, 9600)

arduino_loop()
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

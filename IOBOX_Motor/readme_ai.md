# IOBOX电机驱动库

IOBOX电机驱动控制库，支持M1和M2两个直流电机，适用于microbit、ESP32等开发板

## Library Info
- **Name**: @aily-project/lib-iobox-motor
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `iobox_motor_init` | Statement | (none) | `iobox_motor_init()` | `` |
| `iobox_motor_run` | Statement | INDEX(dropdown), DIRECTION(dropdown), SPEED(input_value) | `iobox_motor_run(0, 0, math_number(100))` | `motor.motorRun(` |
| `iobox_motor_stop` | Statement | INDEX(dropdown) | `iobox_motor_stop(0)` | `motor.motorStop(` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| INDEX | 0, 1, 2 | M1 / M2 / 全部 |
| DIRECTION | 0, 1 | 顺时针 / 逆时针 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    iobox_motor_init()
    serial_begin(Serial, 9600)

arduino_loop()
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

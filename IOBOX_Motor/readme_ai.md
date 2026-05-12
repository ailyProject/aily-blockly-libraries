# IOBOX motor driver library

IOBOX motor drive control library supports two DC motors, M1 and M2, and is suitable for microbit, ESP32 and other development boards

## Library Info
- **Name**: @aily-project/lib-iobox-motor
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `iobox_motor_init` | Statement | (none) | `iobox_motor_init()` | Dynamic code |
| `iobox_motor_run` | Statement | INDEX(dropdown), DIRECTION(dropdown), SPEED(input_value) | `iobox_motor_run("0", "0", math_number(9600))` | motor.motorRun( |
| `iobox_motor_stop` | Statement | INDEX(dropdown) | `iobox_motor_stop("0")` | motor.motorStop( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| INDEX | 0, 1, 2 | iobox_motor_run, iobox_motor_stop |
| DIRECTION | 0, 1 | iobox_motor_run |

## ABS Examples

### Basic Usage
```
arduino_setup()
    iobox_motor_init()
    serial_begin(Serial, 9600)

arduino_loop()
    iobox_motor_run("0", "0", math_number(9600))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

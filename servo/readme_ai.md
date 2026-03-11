# 舵机驱动

舵机控制支持库，通过PWM信号精准控制舵机的转动角度，支持多通道舵机控制、角度设定、速度调节，适用于Arduino UNO、MEGA、UNO R4等开发板

## Library Info
- **Name**: @aily-project/lib-servo
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `servo_write` | Statement | PIN(dropdown), ANGLE(input_value) | `servo_write(PIN, math_number(0))` | (dynamic code) |
| `servo_read` | Value | PIN(dropdown) | `servo_read(PIN)` | (dynamic code) |
| `servo_angle` | Value | ANGLE(field_angle180) | `servo_angle()` | (dynamic code) |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, servo_read(PIN))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

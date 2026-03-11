# 360舵机驱动

360舵机控制支持库，过PWM信号实现对360度连续旋转舵机的速度和方向控制，支持正反转、速度调节、停止控制，适用于Arduino UNO、MEGA、UNO R4等开发板

## Library Info
- **Name**: @aily-project/lib-servo360
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `servo360_write` | Statement | PIN(dropdown), SPEED(input_value), DIRECTION(dropdown) | `servo360_write(PIN, math_number(9600), true)` | (dynamic code) |
| `servo360_speed` | Value | SPEED(field_slider) | `servo360_speed()` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DIRECTION | true, false | 正转 / 反转 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, servo360_speed())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

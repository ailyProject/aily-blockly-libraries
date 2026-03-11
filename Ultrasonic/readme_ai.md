# 超声波传感器

超声波传感器，驱动库支持SR04，通过发射和接收超声波信号实现非接触式距离测量，适配多种开发板。

## Library Info
- **Name**: @aily-project/lib-ultrasonic
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ultrasonic_ranging` | Value | PIN1(input_value), PIN2(input_value) | `ultrasonic_ranging(math_number(2), math_number(2))` | — |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ultrasonic_ranging(math_number(2), math_number(2)))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

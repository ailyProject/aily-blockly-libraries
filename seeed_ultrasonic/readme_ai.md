# Grove超声波测距

SeeedStudio超声波测距传感器库，支持厘米、毫米、英寸三种单位测量

## Library Info
- **Name**: @aily-project/lib-seeed-ultrasonic
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ultrasonic_create` | Statement | VAR(field_input), PIN(dropdown) | `ultrasonic_create("ultrasonic", PIN)` | `` |
| `ultrasonic_measure_cm` | Value | VAR(field_variable) | `ultrasonic_measure_cm($ultrasonic)` | (dynamic code) |
| `ultrasonic_measure_mm` | Value | VAR(field_variable) | `ultrasonic_measure_mm($ultrasonic)` | (dynamic code) |
| `ultrasonic_measure_inch` | Value | VAR(field_variable) | `ultrasonic_measure_inch($ultrasonic)` | (dynamic code) |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ultrasonic_create("ultrasonic", PIN)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ultrasonic_measure_cm($ultrasonic))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `ultrasonic_create("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

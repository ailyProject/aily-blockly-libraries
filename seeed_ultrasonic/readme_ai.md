# Grove ultrasonic ranging

SeeedStudio ultrasonic distance sensor library supports measurement in centimeters, millimeters, and inches.

## Library Info
- **Name**: @aily-project/lib-seeed-ultrasonic
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ultrasonic_create` | Statement | VAR(field_input), PIN(dropdown) | `ultrasonic_create("ultrasonic", PIN)` | Dynamic code |
| `ultrasonic_measure_cm` | Value | VAR(field_variable) | `ultrasonic_measure_cm(variables_get($ultrasonic))` | Dynamic code |
| `ultrasonic_measure_mm` | Value | VAR(field_variable) | `ultrasonic_measure_mm(variables_get($ultrasonic))` | Dynamic code |
| `ultrasonic_measure_inch` | Value | VAR(field_variable) | `ultrasonic_measure_inch(variables_get($ultrasonic))` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ultrasonic_create("ultrasonic", PIN)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ultrasonic_measure_cm(variables_get($ultrasonic)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `ultrasonic_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

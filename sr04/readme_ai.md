# SR04 Ultrasound

SR04 ultrasonic distance sensor library, supports 2-400cm distance measurement

## Library Info
- **Name**: @aily-project/lib-sr04
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sr04_setup` | Statement | VAR(field_input), TRIG_PIN(input_value), ECHO_PIN(input_value), MAX_DISTANCE(field_number) | `sr04_setup("sr04", math_number(2), math_number(2), 400)` | Dynamic code |
| `sr04_measure_distance` | Value | VAR(field_variable) | `sr04_measure_distance(variables_get($sr04))` | Dynamic code |
| `sr04_measure_distance_with_temp` | Value | VAR(field_variable), TEMPERATURE(input_value) | `sr04_measure_distance_with_temp(variables_get($sr04), math_number(0))` | Dynamic code |
| `sr04_measure_quick` | Value | TRIG_PIN(input_value), ECHO_PIN(input_value) | `sr04_measure_quick(math_number(2), math_number(2))` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    sr04_setup("sr04", math_number(2), math_number(2), 400)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, sr04_measure_distance(variables_get($sr04)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `sr04_setup("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

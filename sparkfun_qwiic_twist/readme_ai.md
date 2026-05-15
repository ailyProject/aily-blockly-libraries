# SparkFun Qwiic Twist RGB Rotary Encoder

Blockly wrapper for SparkFun Qwiic Twist RGB rotary encoder.

## Library Info
- **Name**: @aily-project/lib-sparkfun-qwiic-twist
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `qwiic_twist_init` | Statement | VAR(field_input) | `qwiic_twist_init("twist")` | Dynamic code |
| `qwiic_twist_get_count` | Value | VAR(field_variable) | `qwiic_twist_get_count(variables_get($twist))` | Dynamic code |
| `qwiic_twist_set_count` | Statement | VAR(field_variable), COUNT(input_value) | `qwiic_twist_set_count(variables_get($twist), math_number(0))` | Dynamic code |
| `qwiic_twist_is_moved` | Value | VAR(field_variable) | `qwiic_twist_is_moved(variables_get($twist))` | Dynamic code |
| `qwiic_twist_is_clicked` | Value | VAR(field_variable) | `qwiic_twist_is_clicked(variables_get($twist))` | Dynamic code |
| `qwiic_twist_is_pressed` | Value | VAR(field_variable) | `qwiic_twist_is_pressed(variables_get($twist))` | Dynamic code |
| `qwiic_twist_set_color` | Statement | VAR(field_variable), RED(input_value), GREEN(input_value), BLUE(input_value) | `qwiic_twist_set_color(variables_get($twist), math_number(0), math_number(0), math_number(0))` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    qwiic_twist_init("twist")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, qwiic_twist_get_count(variables_get($twist)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `qwiic_twist_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

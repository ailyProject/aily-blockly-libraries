# SparkFun RV1805 RTC Module

Blockly wrapper for the SparkFun RV-1805 ultra-low-power I2C RTC.

## Library Info
- **Name**: @aily-project/lib-sparkfun-rv1805
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `rv1805_init` | Statement | VAR(field_input) | `rv1805_init("rtc")` | Wire.begin();\n |
| `rv1805_set_time` | Statement | VAR(field_variable), YEAR(input_value), MONTH(input_value), DATE(input_value), HOUR(input_value), MINUTE(input_value), SECOND(input_value) | `rv1805_set_time(variables_get($rtc), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `rv1805_update_time` | Statement | VAR(field_variable) | `rv1805_update_time(variables_get($rtc))` | Dynamic code |
| `rv1805_get_time_field` | Value | VAR(field_variable), FIELD(dropdown) | `rv1805_get_time_field(variables_get($rtc), Seconds)` | Dynamic code |
| `rv1805_string_time` | Value | VAR(field_variable) | `rv1805_string_time(variables_get($rtc))` | Dynamic code |
| `rv1805_string_date` | Value | VAR(field_variable) | `rv1805_string_date(variables_get($rtc))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FIELD | Seconds, Minutes, Hours, Date, Month, Year | rv1805_get_time_field |

## ABS Examples

### Basic Usage
```
arduino_setup()
    rv1805_init("rtc")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, rv1805_get_time_field(variables_get($rtc), Seconds))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `rv1805_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

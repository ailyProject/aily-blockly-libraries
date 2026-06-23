# TCA8418 keyboard matrix

TCA8418 I2C keyboard matrix and GPIO expander driver library, supports keyboard matrix scanning and GPIO control

## Library Info
- **Name**: @aily-project/lib-adafruit-tca8418
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tca8418_create` | Statement | VAR(field_input) | `tca8418_create("keypad")` | Dynamic code |
| `tca8418_begin` | Statement | VAR(field_variable), ADDRESS(input_value) | `tca8418_begin(variables_get($keypad), math_number(0))` | if (! |
| `tca8418_matrix` | Statement | VAR(field_variable), ROWS(input_value), COLUMNS(input_value) | `tca8418_matrix(variables_get($keypad), math_number(0), math_number(0))` | Dynamic code |
| `tca8418_available` | Value | VAR(field_variable) | `tca8418_available(variables_get($keypad))` | Dynamic code |
| `tca8418_get_event` | Value | VAR(field_variable) | `tca8418_get_event(variables_get($keypad))` | Dynamic code |
| `tca8418_flush` | Statement | VAR(field_variable) | `tca8418_flush(variables_get($keypad))` | Dynamic code |
| `tca8418_pin_mode` | Statement | VAR(field_variable), PIN(input_value), MODE(dropdown) | `tca8418_pin_mode(variables_get($keypad), math_number(2), INPUT)` | Dynamic code |
| `tca8418_digital_read` | Value | VAR(field_variable), PIN(input_value) | `tca8418_digital_read(variables_get($keypad), math_number(2))` | Dynamic code |
| `tca8418_digital_write` | Statement | VAR(field_variable), PIN(input_value), LEVEL(dropdown) | `tca8418_digital_write(variables_get($keypad), math_number(2), HIGH)` | Dynamic code |
| `tca8418_enable_interrupts` | Statement | VAR(field_variable) | `tca8418_enable_interrupts(variables_get($keypad))` | Dynamic code |
| `tca8418_disable_interrupts` | Statement | VAR(field_variable) | `tca8418_disable_interrupts(variables_get($keypad))` | Dynamic code |
| `tca8418_enable_debounce` | Statement | VAR(field_variable) | `tca8418_enable_debounce(variables_get($keypad))` | Dynamic code |
| `tca8418_disable_debounce` | Statement | VAR(field_variable) | `tca8418_disable_debounce(variables_get($keypad))` | Dynamic code |
| `tca8418_when_key_event` | Hat | VAR(field_variable), HANDLER(input_statement) | `tca8418_when_key_event(variables_get($keypad)) @HANDLER: child_block()` | Dynamic code |
| `tca8418_current_event` | Value | VAR(field_variable) | `tca8418_current_event(variables_get($keypad))` | Dynamic code |
| `tca8418_get_event_row` | Value | EVENT(input_value) | `tca8418_get_event_row(math_number(0))` | Dynamic code |
| `tca8418_get_event_col` | Value | EVENT(input_value) | `tca8418_get_event_col(math_number(0))` | Dynamic code |
| `tca8418_get_event_pressed` | Value | EVENT(input_value) | `tca8418_get_event_pressed(math_number(0))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | INPUT, OUTPUT, INPUT_PULLUP | tca8418_pin_mode |
| LEVEL | HIGH, LOW | tca8418_digital_write |

## ABS Examples

### Basic Usage
```
arduino_setup()
    tca8418_create("keypad")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, tca8418_available(variables_get($keypad)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `tca8418_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

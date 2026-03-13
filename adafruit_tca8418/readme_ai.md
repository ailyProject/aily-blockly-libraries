# TCA8418键盘矩阵

TCA8418 I2C键盘矩阵和GPIO扩展器驱动库，支持键盘矩阵扫描和GPIO控制

## Library Info
- **Name**: @aily-project/adafruit-tca8418
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tca8418_create` | Statement | VAR(field_input) | `tca8418_create("keypad")` | `` |
| `tca8418_begin` | Statement | VAR(field_variable), ADDRESS(input_value) | `tca8418_begin($keypad, math_number(0))` | `if (!` |
| `tca8418_matrix` | Statement | VAR(field_variable), ROWS(input_value), COLUMNS(input_value) | `tca8418_matrix($keypad, math_number(0), math_number(0))` | (dynamic code) |
| `tca8418_available` | Value | VAR(field_variable) | `tca8418_available($keypad)` | (dynamic code) |
| `tca8418_get_event` | Value | VAR(field_variable) | `tca8418_get_event($keypad)` | (dynamic code) |
| `tca8418_flush` | Statement | VAR(field_variable) | `tca8418_flush($keypad)` | (dynamic code) |
| `tca8418_pin_mode` | Statement | VAR(field_variable), PIN(input_value), MODE(dropdown) | `tca8418_pin_mode($keypad, math_number(2), INPUT)` | (dynamic code) |
| `tca8418_digital_read` | Value | VAR(field_variable), PIN(input_value) | `tca8418_digital_read($keypad, math_number(2))` | (dynamic code) |
| `tca8418_digital_write` | Statement | VAR(field_variable), PIN(input_value), LEVEL(dropdown) | `tca8418_digital_write($keypad, math_number(2), HIGH)` | (dynamic code) |
| `tca8418_enable_interrupts` | Statement | VAR(field_variable) | `tca8418_enable_interrupts($keypad)` | (dynamic code) |
| `tca8418_disable_interrupts` | Statement | VAR(field_variable) | `tca8418_disable_interrupts($keypad)` | (dynamic code) |
| `tca8418_enable_debounce` | Statement | VAR(field_variable) | `tca8418_enable_debounce($keypad)` | (dynamic code) |
| `tca8418_disable_debounce` | Statement | VAR(field_variable) | `tca8418_disable_debounce($keypad)` | (dynamic code) |
| `tca8418_when_key_event` | Statement | VAR(field_variable) | `tca8418_when_key_event($keypad)` | `` |
| `tca8418_current_event` | Value | VAR(field_variable) | `tca8418_current_event($keypad)` | (dynamic code) |
| `tca8418_get_event_row` | Value | EVENT(input_value) | `tca8418_get_event_row(math_number(0))` | `(((` |
| `tca8418_get_event_col` | Value | EVENT(input_value) | `tca8418_get_event_col(math_number(0))` | `(((` |
| `tca8418_get_event_pressed` | Value | EVENT(input_value) | `tca8418_get_event_pressed(math_number(0))` | `(!(` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | INPUT, OUTPUT, INPUT_PULLUP | 输入 / 输出 / 输入上拉 |
| LEVEL | HIGH, LOW | 高电平 / 低电平 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    tca8418_create("keypad")
    tca8418_begin($keypad, math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, tca8418_available($keypad))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `tca8418_create("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

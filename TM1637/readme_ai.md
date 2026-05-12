# TM1637 four-digit digital tube

TM1637 four-digit seven-segment display driver library supports functions such as displaying numbers, text, and setting brightness.

## Library Info
- **Name**: @aily-project/lib-tm1637
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tm1637_init` | Statement | CLK_PIN(dropdown), DIO_PIN(dropdown) | `tm1637_init(CLK_PIN, DIO_PIN)` | Dynamic code |
| `tm1637_print_number` | Statement | NUMBER(input_value) | `tm1637_print_number(math_number(0))` | display.print(...);\n |
| `tm1637_print_text` | Statement | TEXT(input_value) | `tm1637_print_text(text("value"))` | display.print(...);\n |
| `tm1637_clear` | Statement | (none) | `tm1637_clear()` | display.clear();\n |
| `tm1637_set_brightness` | Statement | BRIGHTNESS(dropdown) | `tm1637_set_brightness("0")` | display.setBacklight(...);\n |
| `tm1637_set_colon` | Statement | COLON_STATE(dropdown) | `tm1637_set_colon(true)` | display.setColonOn(...);\n |
| `tm1637_print_time` | Statement | HOUR(input_value), MINUTE(input_value) | `tm1637_print_time(math_number(0), math_number(0))` | display.setColonOn(true);\n |
| `tm1637_blink` | Statement | DELAY(field_number), REPEATS(field_number) | `tm1637_blink(500, 5)` | display.blink(..., ...);\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BRIGHTNESS | 0, 12, 25, 37, 50, 62, 75, 87, 100 | tm1637_set_brightness |
| COLON_STATE | true, false | tm1637_set_colon |

## ABS Examples

### Basic Usage
```
arduino_setup()
    tm1637_init(CLK_PIN, DIO_PIN)
    serial_begin(Serial, 9600)

arduino_loop()
    tm1637_print_number(math_number(0))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

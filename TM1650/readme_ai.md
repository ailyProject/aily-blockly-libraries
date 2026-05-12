# TM1650 four-digit digital tube driver library

TM1650 four-digit digital tube driver library controls the display of four-digit seven-segment digital tubes through the I2C interface and supports the display of numbers and some characters.

## Library Info
- **Name**: @aily-project/lib-tm1650
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tm1650_init` | Statement | (none) | `tm1650_init()` | Dynamic code |
| `tm1650_set` | Statement | TM1650PWRSWITCH(dropdown), TM1650BRIGHTNESS(dropdown) | `tm1650_set("1", "0")` | module.setupDisplay( |
| `tm1650_displaystring` | Statement | TMSTR(input_value) | `tm1650_displaystring(text("value"))` | module.setDisplayToString(...);\n |
| `tm1650_displayNumber` | Statement | TMNUM(input_value) | `tm1650_displayNumber(math_number(0))` | module.setDisplayToDecNumber( |
| `tm1650_clearDisplay` | Statement | (none) | `tm1650_clearDisplay()` | module.clearDisplay();\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TM1650PWRSWITCH | 1, 0 | tm1650_set |
| TM1650BRIGHTNESS | 0, 1, 2, 3, 4, 5, 6, 7 | tm1650_set |

## ABS Examples

### Basic Usage
```
arduino_setup()
    tm1650_init()
    serial_begin(Serial, 9600)

arduino_loop()
    tm1650_set("1", "0")
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

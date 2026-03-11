# TM1637四位数码管

TM1637四位七段数码管显示驱动库，支持显示数字、文本、设置亮度等功能

## Library Info
- **Name**: @aily-project/lib-tm1637
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tm1637_init` | Statement | CLK_PIN(dropdown), DIO_PIN(dropdown) | `tm1637_init(CLK_PIN, DIO_PIN)` | `` |
| `tm1637_print_number` | Statement | NUMBER(input_value) | `tm1637_print_number(math_number(0))` | `display.print(...);\n` |
| `tm1637_print_text` | Statement | TEXT(input_value) | `tm1637_print_text(text("hello"))` | `display.print(...);\n` |
| `tm1637_clear` | Statement | (none) | `tm1637_clear()` | `display.clear();\n` |
| `tm1637_set_brightness` | Statement | BRIGHTNESS(dropdown) | `tm1637_set_brightness(0)` | `display.setBacklight(...);\n` |
| `tm1637_set_colon` | Statement | COLON_STATE(dropdown) | `tm1637_set_colon(true)` | `display.setColonOn(...);\n` |
| `tm1637_print_time` | Statement | HOUR(input_value), MINUTE(input_value) | `tm1637_print_time(math_number(0), math_number(0))` | `display.setColonOn(true);\n` |
| `tm1637_blink` | Statement | DELAY(field_number), REPEATS(field_number) | `tm1637_blink(500, 5)` | `display.blink(..., ...);\n` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BRIGHTNESS | 0, 12, 25, 37, 50, 62, 75, 87, 100 | 0% / 12.5% / 25% / 37.5% / 50% / 62.5% / 75% / 87.5% / 100% |
| COLON_STATE | true, false | 开启 / 关闭 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    tm1637_init(CLK_PIN, DIO_PIN)
    serial_begin(Serial, 9600)

arduino_loop()
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

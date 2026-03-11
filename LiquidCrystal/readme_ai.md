# 液晶显示屏

LCD1602/2004 显示屏控制支持库，使用4线并行通信，支持Arduino UNO、MEGA、ESP8266、ESP32等开发板

## Library Info
- **Name**: @aily-project/lib-liquidcrystal
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lcd_init` | Statement | COLS(input_value), ROWS(input_value), RS_PIN(input_value), E_PIN(input_value), D4_PIN(input_value), D5_PIN(input_value), D6_PIN(input_value), D7_PIN(input_value), LIGHT_PIN(input_value) | `lcd_init(math_number(0), math_number(0), math_number(2), math_number(2), math_number(2), math_number(2), math_number(2), math_number(2), math_number(2))` | `` |
| `lcd_clear` | Statement | (none) | `lcd_clear()` | `lcd.clear();\n` |
| `lcd_set_cursor` | Statement | COL(input_value), ROW(input_value) | `lcd_set_cursor(math_number(0), math_number(0))` | `lcd.setCursor(..., ...);\n` |
| `lcd_print` | Statement | TEXT(input_value) | `lcd_print(text("hello"))` | `lcd.write(...);\n` |
| `lcd_print_position` | Statement | COL(input_value), ROW(input_value), TEXT(input_value) | `lcd_print_position(math_number(0), math_number(0), text("hello"))` | `lcd.setCursor(..., ...);\n` |
| `lcd_backlight_on` | Statement | (none) | `lcd_backlight_on()` | `digitalWrite(LCD_BACKLIGHT_PIN, LOW);\n` |
| `lcd_backlight_off` | Statement | (none) | `lcd_backlight_off()` | `digitalWrite(LCD_BACKLIGHT_PIN, HIGH);\n` |
| `lcd_custom_char` | Value | CUSTOM_CHAR(field_bitmap), CHAR_INDEX(dropdown) | `lcd_custom_char(0)` | `0` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| CHAR_INDEX | 0, 1, 2, 3, 4, 5, 6, 7 | 0 / 1 / 2 / 3 / 4 / 5 / 6 / 7 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    lcd_init(math_number(0), math_number(0), math_number(2), math_number(2), math_number(2), math_number(2), math_number(2), math_number(2), math_number(2))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, lcd_custom_char(0))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

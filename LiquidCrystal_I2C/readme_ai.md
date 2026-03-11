# 液晶显示屏(I2C)

LCD1602/2004 I2C显示屏控制支持库，支持Arduino UNO、MEGA、ESP8266、ESP32等开发板

## Library Info
- **Name**: @aily-project/lib-liquidcrystal_i2c
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lcd_i2c_init` | Statement | ADDRESS(dropdown), COLS(field_number), ROWS(field_number) | `lcd_i2c_init(0x27, 16, 2)` | `lcd.init();\n` |
| `lcd_i2c_clear` | Statement | (none) | `lcd_i2c_clear()` | `lcd.clear();\n` |
| `lcd_i2c_set_cursor` | Statement | COL(input_value), ROW(input_value) | `lcd_i2c_set_cursor(math_number(0), math_number(0))` | `lcd.setCursor(` |
| `lcd_i2c_print` | Statement | TEXT(input_value) | `lcd_i2c_print(text("hello"))` | `lcd.write(...);\n` |
| `lcd_i2c_print_position` | Statement | COL(input_value), ROW(input_value), TEXT(input_value) | `lcd_i2c_print_position(math_number(0), math_number(0), text("hello"))` | `lcd.setCursor(` |
| `lcd_i2c_backlight_on` | Statement | (none) | `lcd_i2c_backlight_on()` | `lcd.backlight();\n` |
| `lcd_i2c_backlight_off` | Statement | (none) | `lcd_i2c_backlight_off()` | `lcd.noBacklight();\n` |
| `lcd_i2c_custom_char` | Value | CUSTOM_CHAR(field_bitmap), CHAR_INDEX(dropdown) | `lcd_i2c_custom_char(0)` | `0` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x27, 0x26, 0x25, 0x24, 0x23, 0x22, 0x21, 0x20 | 0x27 / 0x26 / 0x25 / 0x24 / 0x23 / 0x22 / 0x21 / 0x20 |
| CHAR_INDEX | 0, 1, 2, 3, 4, 5, 6, 7 | 0 / 1 / 2 / 3 / 4 / 5 / 6 / 7 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    lcd_i2c_init(0x27, 16, 2)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, lcd_i2c_custom_char(0))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

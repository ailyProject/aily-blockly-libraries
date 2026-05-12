# SparkFun SSD1320 OLED Display

Blockly wrapper for the SparkFun SSD1320 SPI monochrome OLED display.

## Library Info
- **Name**: @aily-project/lib-sparkfun-ssd1320
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ssd1320_init` | Statement | VAR(field_input), RST(input_value), DC(input_value), CS(input_value) | `ssd1320_init("oled", math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `ssd1320_clear` | Statement | VAR(field_variable) | `ssd1320_clear(variables_get($oled))` | Dynamic code |
| `ssd1320_print` | Statement | VAR(field_variable), X(input_value), Y(input_value), TEXT(input_value) | `ssd1320_print(variables_get($oled), math_number(0), math_number(0), text("value"))` | Dynamic code |
| `ssd1320_draw_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value) | `ssd1320_draw_rect(variables_get($oled), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ssd1320_init("oled", math_number(0), math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    ssd1320_clear(variables_get($oled))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `ssd1320_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

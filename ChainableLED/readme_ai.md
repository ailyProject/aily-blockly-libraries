# 链式RGB LED

控制基于P9813协议的链式RGB LED，支持RGB和HSL颜色模式，适用于SeeedStudio Grove接口。

## Library Info
- **Name**: @aily-project/lib-chainableled
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `chainableled_setup` | Statement | VAR(field_input), CLK_PIN(input_value), DATA_PIN(input_value), NUM_LEDS(input_value) | `chainableled_setup("leds", math_number(2), math_number(2), math_number(0))` | (dynamic code) |
| `chainableled_init` | Statement | VAR(field_variable) | `chainableled_init($leds)` | (dynamic code) |
| `chainableled_set_color_rgb` | Statement | VAR(field_variable), LED_INDEX(input_value), RED(input_value), GREEN(input_value), BLUE(input_value) | `chainableled_set_color_rgb($leds, math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `chainableled_set_color_hsl` | Statement | VAR(field_variable), LED_INDEX(input_value), HUE(input_value), SATURATION(input_value), LIGHTNESS(input_value) | `chainableled_set_color_hsl($leds, math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `chainableled_set_color` | Statement | VAR(field_variable), LED_INDEX(input_value), COLOR(field_colour_hsv_sliders) | `chainableled_set_color($leds, math_number(0))` | (dynamic code) |

## ABS Examples

### Basic Usage
```
arduino_setup()
    chainableled_setup("leds", math_number(2), math_number(2), math_number(0))
    chainableled_init($leds)
    serial_begin(Serial, 9600)

arduino_loop()
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `chainableled_setup("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

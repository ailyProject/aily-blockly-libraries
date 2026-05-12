# Chain RGB LED

Controls chained RGB LEDs based on P9813 protocol, supports RGB and HSL color modes, and is suitable for SeeedStudio Grove interface.

## Library Info
- **Name**: @aily-project/lib-chainableled
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `chainableled_setup` | Statement | VAR(field_input), CLK_PIN(input_value), DATA_PIN(input_value), NUM_LEDS(input_value) | `chainableled_setup("leds", math_number(2), math_number(2), math_number(0))` | Dynamic code |
| `chainableled_init` | Statement | VAR(field_variable) | `chainableled_init(variables_get($leds))` | Dynamic code |
| `chainableled_set_color_rgb` | Statement | VAR(field_variable), LED_INDEX(input_value), RED(input_value), GREEN(input_value), BLUE(input_value) | `chainableled_set_color_rgb(variables_get($leds), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `chainableled_set_color_hsl` | Statement | VAR(field_variable), LED_INDEX(input_value), HUE(input_value), SATURATION(input_value), LIGHTNESS(input_value) | `chainableled_set_color_hsl(variables_get($leds), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `chainableled_set_color` | Statement | VAR(field_variable), LED_INDEX(input_value), COLOR(field_colour_hsv_sliders) | `chainableled_set_color(variables_get($leds), math_number(0))` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    chainableled_setup("leds", math_number(2), math_number(2), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    chainableled_init(variables_get($leds))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `chainableled_setup("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

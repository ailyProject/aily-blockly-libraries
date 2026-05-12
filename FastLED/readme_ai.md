# RGB light strip driver library

The GRB light strip driver library based on FastLed supports the control of various RGB light strips such as WS2812B/WS2811/NEOPIXEL, provides a variety of preset special effects such as color, brightness, and rainbow...

## Library Info
- **Name**: @aily-project/lib-fastled
- **Version**: 1.0.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `fastled_init` | Statement | DATA_PIN(dropdown), TYPE(dropdown), NUM_LEDS(field_number) | `fastled_init(DATA_PIN, WS2812B, 30)` | Dynamic code |
| `fastled_draw_bar` | Statement | DATA_PIN(dropdown), START(input_value), END(input_value), LEVEL(input_value), FOREGROUND(input_value), BACKGROUND(input_value) | `fastled_draw_bar(DATA_PIN, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | int ... = (int)(...) - (int)(...) + 1;\n |
| `fastled_set_pixel` | Statement | DATA_PIN(dropdown), PIXEL(input_value), COLOR(input_value) | `fastled_set_pixel(DATA_PIN, math_number(0), math_number(0))` | leds_...[...] = ...;\n |
| `fastled_set_range` | Statement | DATA_PIN(dropdown), START(input_value), END(input_value), COLOR(input_value) | `fastled_set_range(DATA_PIN, math_number(0), math_number(0), math_number(0))` | for (int ... = (int)(...); ... <= (int)(...); ...++) {\n |
| `fastled_refresh` | Statement | (none) | `fastled_refresh()` | FastLED.show();\n |
| `fastled_show` | Statement | (none) | `fastled_show()` | FastLED.show();\n |
| `fastled_clear` | Statement | DATA_PIN(dropdown) | `fastled_clear(DATA_PIN)` | fill_solid(leds_..., NUM_LEDS_..., CRGB::Black);\n |
| `fastled_brightness` | Statement | BRIGHTNESS(input_value) | `fastled_brightness(math_number(0))` | FastLED.setBrightness(...);\n |
| `fastled_rgb` | Value | RED(input_value), GREEN(input_value), BLUE(input_value) | `fastled_rgb(math_number(0), math_number(0), math_number(0))` | CRGB(..., ..., ...) |
| `fastled_preset_color` | Value | COLOR(field_colour_hsv_sliders) | `fastled_preset_color()` | CHSV(..., ..., ...) |
| `fastled_fill_solid` | Statement | DATA_PIN(dropdown), COLOR(input_value) | `fastled_fill_solid(DATA_PIN, math_number(0))` | fill_solid(leds_..., NUM_LEDS_..., ...);\n |
| `fastled_hsv` | Value | HUE(input_value), SATURATION(input_value), VALUE(input_value) | `fastled_hsv(math_number(0), math_number(0), math_number(0))` | CHSV(..., ..., ...) |
| `fastled_rainbow` | Statement | DATA_PIN(dropdown), INITIAL_HUE(input_value), DELTA_HUE(input_value) | `fastled_rainbow(DATA_PIN, math_number(0), math_number(0))` | fill_rainbow(leds_..., NUM_LEDS_..., ..., ...);\n |
| `fastled_fire_effect` | Statement | DATA_PIN(dropdown), HEAT(input_value), COOLING(input_value) | `fastled_fire_effect(DATA_PIN, math_number(0), math_number(0))` | Fire2012_...(leds_..., ..., ...);\n |
| `fastled_meteor` | Statement | DATA_PIN(dropdown), COLOR(input_value), SIZE(input_value), DECAY(input_value), SPEED(input_value) | `fastled_meteor(DATA_PIN, math_number(0), math_number(0), math_number(0), math_number(9600))` | meteorEffect_...(leds_..., ..., ..., ..., ...);\n |
| `fastled_palette_cycle` | Statement | DATA_PIN(dropdown), PALETTE(dropdown), SPEED(input_value) | `fastled_palette_cycle(DATA_PIN, RainbowColors_p, math_number(9600))` | cyclePalette_...(leds_..., ..., ..., paletteIndex_...);\n |
| `fastled_breathing` | Statement | DATA_PIN(dropdown), COLOR(input_value), SPEED(input_value) | `fastled_breathing(DATA_PIN, math_number(0), math_number(9600))` | breathingEffect_...(leds_..., ..., ..., breathBrightness_..., breathDirection_...);\n |
| `fastled_twinkle` | Statement | DATA_PIN(dropdown), COUNT(input_value), BACKGROUND(input_value), COLOR(input_value) | `fastled_twinkle(DATA_PIN, math_number(0), math_number(0), math_number(0))` | twinkleEffect_...(leds_..., ..., ..., ...);\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | WS2812B, WS2812, WS2811, NEOPIXEL, WS2801, LPD8806, APA102 | fastled_init |
| PALETTE | RainbowColors_p, LavaColors_p, CloudColors_p, OceanColors_p, ForestColors_p, PartyColors_p, HeatColors_p | fastled_palette_cycle |

## ABS Examples

### Basic Usage
```
arduino_setup()
    fastled_init(DATA_PIN, WS2812B, 30)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, fastled_rgb(math_number(0), math_number(0), math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

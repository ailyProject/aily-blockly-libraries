# RGB灯带驱动库

基于FastLed的GRB灯带驱动库，支持WS2812B/WS2811/NEOPIXEL等多种RGB灯带的控制，提供颜色、亮度、彩虹效果等多种预置特效，支持链式连接和独立控制。

## Library Info
- **Name**: @aily-project/lib-fastled
- **Version**: 1.0.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `fastled_init` | Statement | DATA_PIN(dropdown), TYPE(dropdown), NUM_LEDS(field_number) | `fastled_init(DATA_PIN, WS2812B, 30)` | — |
| `fastled_draw_bar` | Statement | DATA_PIN(dropdown), START(input_value), END(input_value), LEVEL(input_value), FOREGROUND(input_value), BACKGROUND(input_value) | `fastled_draw_bar(DATA_PIN, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | — |
| `fastled_set_pixel` | Statement | DATA_PIN(dropdown), PIXEL(input_value), COLOR(input_value) | `fastled_set_pixel(DATA_PIN, math_number(0), math_number(0))` | — |
| `fastled_set_range` | Statement | DATA_PIN(dropdown), START(input_value), END(input_value), COLOR(input_value) | `fastled_set_range(DATA_PIN, math_number(0), math_number(0), math_number(0))` | — |
| `fastled_refresh` | Statement | (none) | `fastled_refresh()` | — |
| `fastled_show` | Statement | (none) | `fastled_show()` | — |
| `fastled_clear` | Statement | DATA_PIN(dropdown) | `fastled_clear(DATA_PIN)` | — |
| `fastled_brightness` | Statement | BRIGHTNESS(input_value) | `fastled_brightness(math_number(0))` | — |
| `fastled_rgb` | Value | RED(input_value), GREEN(input_value), BLUE(input_value) | `fastled_rgb(math_number(0), math_number(0), math_number(0))` | — |
| `fastled_preset_color` | Value | COLOR(field_colour_hsv_sliders) | `fastled_preset_color()` | — |
| `fastled_fill_solid` | Statement | DATA_PIN(dropdown), COLOR(input_value) | `fastled_fill_solid(DATA_PIN, math_number(0))` | — |
| `fastled_hsv` | Value | HUE(input_value), SATURATION(input_value), VALUE(input_value) | `fastled_hsv(math_number(0), math_number(0), math_number(0))` | — |
| `fastled_rainbow` | Statement | DATA_PIN(dropdown), INITIAL_HUE(input_value), DELTA_HUE(input_value) | `fastled_rainbow(DATA_PIN, math_number(0), math_number(0))` | — |
| `fastled_fire_effect` | Statement | DATA_PIN(dropdown), HEAT(input_value), COOLING(input_value) | `fastled_fire_effect(DATA_PIN, math_number(0), math_number(0))` | — |
| `fastled_meteor` | Statement | DATA_PIN(dropdown), COLOR(input_value), SIZE(input_value), DECAY(input_value), SPEED(input_value) | `fastled_meteor(DATA_PIN, math_number(0), math_number(0), math_number(0), math_number(5))` | — |
| `fastled_palette_cycle` | Statement | DATA_PIN(dropdown), PALETTE(dropdown), SPEED(input_value) | `fastled_palette_cycle(DATA_PIN, RainbowColors_p, math_number(10))` | — |
| `fastled_breathing` | Statement | DATA_PIN(dropdown), COLOR(input_value), SPEED(input_value) | `fastled_breathing(DATA_PIN, math_number(0), math_number(10))` | — |
| `fastled_twinkle` | Statement | DATA_PIN(dropdown), COUNT(input_value), BACKGROUND(input_value), COLOR(input_value) | `fastled_twinkle(DATA_PIN, math_number(0), math_number(0), math_number(0))` | — |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | WS2812B, WS2812, WS2811, NEOPIXEL, WS2801, LPD8806, APA102 | WS2812B / WS2812 / WS2811 / NEOPIXEL / WS2801 / LPD8806 / APA102 |
| PALETTE | RainbowColors_p, LavaColors_p, CloudColors_p, OceanColors_p, ForestColors_p, PartyColors_p, HeatColors_p | 彩虹 / 熔岩 / 云彩 / 海洋 / 森林 / 派对 / 热量 |

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

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

# NeoPixel LED strip

Control programmable RGB LED strips, supporting various colors and animation effects

## Library Info
- **Name**: @aily-project/lib-neopixel
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `neopixel_init` | Statement | PIN(dropdown), NUM(field_number), TYPE(dropdown) | `neopixel_init(PIN, 16, "NEO_GRB + NEO_KHZ800")` | Dynamic code |
| `neopixel_begin` | Statement | (none) | `neopixel_begin()` | strip.begin();\n |
| `neopixel_show` | Statement | (none) | `neopixel_show()` | strip.show();\n |
| `neopixel_set_brightness` | Statement | BRIGHTNESS(field_number) | `neopixel_set_brightness(50)` | strip.setBrightness( |
| `neopixel_set_pixel_color` | Statement | PIXEL(field_number), RED(field_number), GREEN(field_number), BLUE(field_number) | `neopixel_set_pixel_color(0, 255, 0, 0)` | strip.setPixelColor( |
| `neopixel_fill` | Statement | RED(field_number), GREEN(field_number), BLUE(field_number) | `neopixel_fill(255, 0, 0)` | strip.fill(strip.Color( |
| `neopixel_clear` | Statement | (none) | `neopixel_clear()` | strip.clear();\n |
| `neopixel_rainbow` | Statement | DELAY(field_number) | `neopixel_rainbow(20)` | rainbow( |
| `neopixel_color_wipe` | Statement | RED(field_number), GREEN(field_number), BLUE(field_number), DELAY(field_number) | `neopixel_color_wipe(255, 0, 0, 50)` | colorWipe(strip.Color( |
| `neopixel_theater_chase` | Statement | RED(field_number), GREEN(field_number), BLUE(field_number), DELAY(field_number) | `neopixel_theater_chase(255, 0, 0, 50)` | theaterChase(strip.Color( |
| `neopixel_theater_chase_rainbow` | Statement | DELAY(field_number) | `neopixel_theater_chase_rainbow(50)` | theaterChaseRainbow( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | NEO_GRB + NEO_KHZ800, NEO_RGB + NEO_KHZ800, NEO_RGBW + NEO_KHZ800, NEO_GRB + NEO_KHZ400 | neopixel_init |

## ABS Examples

### Basic Usage
```
arduino_setup()
    neopixel_init(PIN, 16, "NEO_GRB + NEO_KHZ800")
    serial_begin(Serial, 9600)

arduino_loop()
    neopixel_begin()
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

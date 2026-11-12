# FastLED RGB Light Strip

Controls addressable RGB/GRB light strips by pin, including static drawing and stateful animation effects.

## Library Info
- **Name**: @aily-project/lib-fastled
- **Version**: 1.0.5

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `fastled_init` | Statement | DATA_PIN(dropdown), TYPE(dropdown), NUM_LEDS(field_number) | `fastled_init(DATA_PIN, WS2812B, 30)` | `FastLED.addLeds<WS2812B, DATA_PIN_DATA_PIN, GRB>(leds_DATA_PIN, NUM_LEDS_DATA_PIN);` |
| `fastled_draw_bar` | Statement | DATA_PIN(dropdown), START(input_value), END(input_value), LEVEL(input_value), FOREGROUND(input_value), BACKGROUND(input_value) | `fastled_draw_bar(DATA_PIN, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `int _band_size_DATA_PIN_generator_coverage_fastled_draw_bar = (int)(1) - (int)(1) + 1; ↵ if (_band_size_DATA_PIN_generator_coverage_fastled_draw_bar < 0) { _band_size_DATA_PIN_generator_coverage_fastled_draw_bar = 0; } ↵ int _active_DATA_PIN_generator_coverage_fastled_draw_bar = constrain((int)(1), 0, _band_size_DATA_PIN_generator_coverage_fastled_draw_bar); ↵ for (int _led_bar_DATA_PIN_generator_coverage_fastled_draw_bar = 0; _led_bar_DATA_PIN_generator_coverage_fastled_draw_bar < _band_size_DATA_PIN_generator_coverage_fastled_draw_bar; _led_bar_DATA_PIN_generator_coverage_fastled_draw_bar++) { ↵ int __idx = (int)(1) + _led_bar_DATA_PIN_generator_coverage_fastled_draw_bar; ↵ if (__idx >= 0 && __idx < NUM_LEDS_DATA_PIN) { ↵ leds_DATA_PIN[__idx] = (_led_bar_DATA_PIN_generator_coverage_fastled_draw_bar < _active_DATA_PIN_generator_coverage_fastled_draw_bar) ? 1 : 1; ↵ } ↵ } ↵ FastLED.show();` |
| `fastled_set_pixel` | Statement | DATA_PIN(dropdown), PIXEL(input_value), COLOR(input_value) | `fastled_set_pixel(DATA_PIN, math_number(0), math_number(0))` | `leds_DATA_PIN[1] = 1; ↵ FastLED.show();` |
| `fastled_set_range` | Statement | DATA_PIN(dropdown), START(input_value), END(input_value), COLOR(input_value) | `fastled_set_range(DATA_PIN, math_number(0), math_number(0), math_number(0))` | `for (int _led_idx_DATA_PIN = (int)(1); _led_idx_DATA_PIN <= (int)(1); _led_idx_DATA_PIN++) { ↵ if (_led_idx_DATA_PIN >= 0 && _led_idx_DATA_PIN < NUM_LEDS_DATA_PIN) { ↵ leds_DATA_PIN[_led_idx_DATA_PIN] = 1; ↵ } ↵ } ↵ FastLED.show();` |
| `fastled_refresh` | Statement | (none) | `fastled_refresh()` | `FastLED.show();` |
| `fastled_show` | Statement | (none) | `fastled_show()` | `FastLED.show();` |
| `fastled_clear` | Statement | DATA_PIN(dropdown) | `fastled_clear(DATA_PIN)` | `fill_solid(leds_DATA_PIN, NUM_LEDS_DATA_PIN, CRGB::Black);` |
| `fastled_brightness` | Statement | BRIGHTNESS(input_value) | `fastled_brightness(math_number(0))` | `FastLED.setBrightness(1); ↵ FastLED.show();` |
| `fastled_rgb` | Value | RED(input_value), GREEN(input_value), BLUE(input_value) | `fastled_rgb(math_number(0), math_number(0), math_number(0))` | `CRGB(1, 1, 1)` |
| `fastled_preset_color` | Value | COLOR(field_colour_hsv_sliders) | `fastled_preset_color("#ffffff")` | `CHSV(0, 0, 255)` |
| `fastled_fill_solid` | Statement | DATA_PIN(dropdown), COLOR(input_value) | `fastled_fill_solid(DATA_PIN, math_number(0))` | `fill_solid(leds_DATA_PIN, NUM_LEDS_DATA_PIN, 1); ↵ FastLED.show();` |
| `fastled_hsv` | Value | HUE(input_value), SATURATION(input_value), VALUE(input_value) | `fastled_hsv(math_number(0), math_number(0), math_number(0))` | `CHSV(1, 1, 1)` |
| `fastled_rainbow` | Statement | DATA_PIN(dropdown), INITIAL_HUE(input_value), DELTA_HUE(input_value) | `fastled_rainbow(DATA_PIN, math_number(0), math_number(0))` | `fill_rainbow(leds_DATA_PIN, NUM_LEDS_DATA_PIN, 1, 1); ↵ FastLED.show();` |
| `fastled_fire_effect` | Statement | DATA_PIN(dropdown), HEAT(input_value), COOLING(input_value) | `fastled_fire_effect(DATA_PIN, math_number(0), math_number(0))` | `Fire2012_DATA_PIN(leds_DATA_PIN, 1, 1); ↵ FastLED.show();` |
| `fastled_meteor` | Statement | DATA_PIN(dropdown), COLOR(input_value), SIZE(input_value), DECAY(input_value), SPEED(input_value) | `fastled_meteor(DATA_PIN, math_number(0), math_number(0), math_number(0), math_number(1))` | `meteorEffect_DATA_PIN(leds_DATA_PIN, 1, 1, 1, 1); ↵ FastLED.show();` |
| `fastled_palette_cycle` | Statement | DATA_PIN(dropdown), PALETTE(dropdown), SPEED(input_value) | `fastled_palette_cycle(DATA_PIN, RainbowColors_p, math_number(1))` | `cyclePalette_DATA_PIN(leds_DATA_PIN, RainbowColors_p, 1, paletteIndex_DATA_PIN); ↵ FastLED.show();` |
| `fastled_breathing` | Statement | DATA_PIN(dropdown), COLOR(input_value), SPEED(input_value) | `fastled_breathing(DATA_PIN, math_number(0), math_number(1))` | `breathingEffect_DATA_PIN(leds_DATA_PIN, 1, 1, breathBrightness_DATA_PIN, breathDirection_DATA_PIN); ↵ FastLED.show();` |
| `fastled_twinkle` | Statement | DATA_PIN(dropdown), COUNT(input_value), BACKGROUND(input_value), COLOR(input_value) | `fastled_twinkle(DATA_PIN, math_number(0), math_number(0), math_number(0))` | `twinkleEffect_DATA_PIN(leds_DATA_PIN, 1, 1, 1); ↵ FastLED.show();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DATA_PIN | Current board's digital-pin values, for example `2` | All pin-scoped blocks; use the same concrete value as `fastled_init` |
| TYPE | WS2812B, WS2812, WS2811, NEOPIXEL, WS2801, LPD8806, APA102 | fastled_init |
| PALETTE | RainbowColors_p, LavaColors_p, CloudColors_p, OceanColors_p, ForestColors_p, PartyColors_p, HeatColors_p | fastled_palette_cycle |

## Parameter Semantics

- `NUM_LEDS` is the allocated strip length. Pixel indexes are zero-based; keep `PIXEL`, `START` and `END` between `0` and `NUM_LEDS - 1`. `END` is inclusive. `fastled_set_range` and `fastled_draw_bar` check bounds, while `fastled_set_pixel` writes the index directly.
- `LEVEL` is the number of foreground LEDs inside the inclusive bar range and is clamped to that range's length.
- RGB and HSV channels use FastLED's 0–255 scale. `BRIGHTNESS` is passed directly to `FastLED.setBrightness`.
- `HEAT` is the fire sparking intensity and `COOLING` is the per-frame cooling coefficient. Both are consumed as byte-sized values by the generated helper.
- Meteor `SIZE` is the trail length, `DECAY` controls random fading, and `SPEED` advances the meteor position by that many LEDs per invocation.
- Palette `SPEED` advances the palette index per invocation. Breathing `SPEED` changes brightness per invocation. `COUNT` is the number of random twinkle positions drawn per invocation.

## ABS Examples

### Batched Static Frame
```abs
arduino_setup()
    fastled_init(2, WS2812B, 30)
    fastled_brightness(math_number(128))
    fastled_clear(2)
    fastled_set_range(2, math_number(0), math_number(9), fastled_preset_color("#0000ff"))
    fastled_set_pixel(2, math_number(10), fastled_rgb(math_number(255), math_number(0), math_number(0)))
    fastled_refresh()
```

### Animated Meteor
```abs
arduino_setup()
    fastled_init(2, WS2812B, 30)

arduino_loop()
    fastled_meteor(2, fastled_preset_color("#ff0000"), math_number(5), math_number(128), math_number(1))
    time_delay(math_number(30))
```

## Notes

1. `DATA_PIN` is populated from the current board's `digitalPins` list. In executable ABS, replace the schema-level `DATA_PIN` shown in table signatures with an actual dropdown value such as `2`; never emit the literal identifier `DATA_PIN`.
2. Call `fastled_init` before every operation for that pin. It creates `leds_<pin>`, `NUM_LEDS_<pin>` and `DATA_PIN_<pin>`; using a different pin selects different generated storage that also needs its own initialization.
3. `fastled_set_pixel`, `fastled_set_range`, `fastled_draw_bar`, `fastled_brightness`, `fastled_fill_solid` and all effect blocks call `FastLED.show()` automatically unless a later `fastled_refresh` exists in the same statement chain. A trailing refresh therefore batches earlier changes. `fastled_clear` never refreshes by itself. `fastled_show` and `fastled_refresh` both emit `FastLED.show()`.
4. Fire, meteor, palette, breathing and twinkle update one frame per call and generate no delay. Invoke them repeatedly in `arduino_loop()` and use `time_delay` to set the frame interval.
5. The interface exposes only `DATA_PIN`; no separate clock-pin argument exists for clocked chipset selections such as APA102, WS2801 or LPD8806.
6. Board defaults: blocks taken from the toolbox start with the board’s onboard WS2812 settings. Every block with a `DATA_PIN` dropdown (`fastled_init` and all drawing/effect blocks) selects the same pin, so they address the same `leds_<pin>`; `fastled_init` also sets `NUM_LEDS`. Sources, highest first: pin from `board.json` `ws2812Config.pins.din`, then `ws2812Pin`; count from `ws2812Config.count` (e.g. `"ws2812Config": { "count": 4, "pins": { "din": "38" } }`); missing values fall back to the library’s built-in table (IBox S31: pin 38, 4 LEDs). Boards without these keep the first listed pin and 30 LEDs. Saved programs keep their saved values. In ABS, always write the pin and count explicitly, e.g. `fastled_init(38, WS2812B, 4)` on the IBox S31.

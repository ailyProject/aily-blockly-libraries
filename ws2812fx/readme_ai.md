# WS2812 LED strip library

A library that supports WS2812 LED strip control, integrates the WS2812FX library, and is suitable for Arduino development boards

## Library Info
- **Name**: @aily-project/lib-ws2812fx
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ws2812_set_color` | Statement | LED_STRIP(field_variable), COLOR(field_colour) | `ws2812_set_color(variables_get($ledStrip), "#ff0000")` | See generator |
| `ws2812_set_effect` | Statement | LED_STRIP(field_variable), EFFECT(dropdown) | `ws2812_set_effect(variables_get($ledStrip), RAINBOW)` | See generator |
| `ws2812_init` | Statement | LED_STRIP(field_variable), PIN(field_number) | `ws2812_init(variables_get($ledStrip), 6)` | See generator |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| EFFECT | RAINBOW, BLINK, BREATHING, RUNNING, WAVE | ws2812_set_effect |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ws2812_init(variables_get($ledStrip), 6)
    serial_begin(Serial, 9600)

arduino_loop()
    ws2812_set_color(variables_get($ledStrip), "#ff0000")
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

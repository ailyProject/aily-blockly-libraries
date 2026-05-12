# GIF animation player

A GIF animation player based on the AnimatedGIF library, which supports playing GIF animations from memory or SD card to the TFT display. It usually needs to be used in conjunction with the GFX library.

## Library Info
- **Name**: @aily-project/lib-animated-gif
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `gif_init` | Statement | VAR(field_input) | `gif_init("gif")` | Dynamic code |
| `gif_open_memory` | Statement | VAR(field_variable), HEADER(field_input), ARRAY(field_input), X(input_value), Y(input_value) | `gif_open_memory(variables_get($gif), "image.h", "ucImage", math_number(0), math_number(0))` | _gif_xOffset = |
| `gif_open_sd` | Statement | VAR(field_variable), FILENAME(input_value), X(input_value), Y(input_value) | `gif_open_sd(variables_get($gif), text("value"), math_number(0), math_number(0))` | _gif_xOffset = |
| `gif_play_frame` | Value | VAR(field_variable), SYNC(dropdown) | `gif_play_frame(variables_get($gif), true)` | Dynamic code |
| `gif_play_all` | Statement | VAR(field_variable) | `gif_play_all(variables_get($gif))` | while ( |
| `gif_close` | Statement | VAR(field_variable) | `gif_close(variables_get($gif))` | Dynamic code |
| `gif_get_width` | Value | VAR(field_variable) | `gif_get_width(variables_get($gif))` | Dynamic code |
| `gif_get_height` | Value | VAR(field_variable) | `gif_get_height(variables_get($gif))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SYNC | true, false | gif_play_frame |

## ABS Examples

### Basic Usage
```
arduino_setup()
    gif_init("gif")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, gif_play_frame(variables_get($gif), true))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `gif_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

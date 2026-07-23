# FluxGarage RoboEyes

Smooth animated robot eyes for Adafruit GFX compatible OLED displays.

## Library Info
- **Name**: @aily-project/lib-fluxgarage-roboeyes
- **Version**: 1.2.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `fluxgarage_roboeyes_i2c_init` | Statement | VAR(field_input), SCREEN(dropdown), DISPLAY(field_input), ADDRESS(input_value), RST(input_value), FPS(input_value) | `fluxgarage_roboeyes_i2c_init("roboEyes", SSD1306_128X64, "display", math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `fluxgarage_roboeyes_spi_init` | Statement | VAR(field_input), SCREEN(dropdown), DISPLAY(field_input), DC(input_value), CS(input_value), RST(input_value), FPS(input_value) | `fluxgarage_roboeyes_spi_init("roboEyes", SSD1306_128X64, "display", math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `fluxgarage_roboeyes_init` | Statement | VAR(field_input), DISPLAY(field_input), WIDTH(input_value), HEIGHT(input_value), FPS(input_value) | `fluxgarage_roboeyes_init("roboEyes", "display", math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `fluxgarage_roboeyes_set_framerate` | Statement | VAR(field_variable), FPS(input_value) | `fluxgarage_roboeyes_set_framerate(variables_get($roboEyes), math_number(0))` | Dynamic code |
| `fluxgarage_roboeyes_set_colors` | Statement | VAR(field_variable), BACKGROUND(input_value), MAIN(input_value) | `fluxgarage_roboeyes_set_colors(variables_get($roboEyes), math_number(0), math_number(0))` | Dynamic code |
| `fluxgarage_roboeyes_set_dimensions` | Statement | VAR(field_variable), LEFT_WIDTH(input_value), RIGHT_WIDTH(input_value), LEFT_HEIGHT(input_value), RIGHT_HEIGHT(input_value) | `fluxgarage_roboeyes_set_dimensions(variables_get($roboEyes), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `fluxgarage_roboeyes_set_border_radius` | Statement | VAR(field_variable), LEFT(input_value), RIGHT(input_value) | `fluxgarage_roboeyes_set_border_radius(variables_get($roboEyes), math_number(0), math_number(0))` | Dynamic code |
| `fluxgarage_roboeyes_set_spacing` | Statement | VAR(field_variable), SPACE(input_value) | `fluxgarage_roboeyes_set_spacing(variables_get($roboEyes), math_number(0))` | Dynamic code |
| `fluxgarage_roboeyes_set_mood` | Statement | VAR(field_variable), MOOD(dropdown) | `fluxgarage_roboeyes_set_mood(variables_get($roboEyes), DEFAULT)` | Dynamic code |
| `fluxgarage_roboeyes_set_position` | Statement | VAR(field_variable), POSITION(dropdown) | `fluxgarage_roboeyes_set_position(variables_get($roboEyes), DEFAULT)` | Dynamic code |
| `fluxgarage_roboeyes_set_feature` | Statement | VAR(field_variable), FEATURE(dropdown), ENABLED(input_value) | `fluxgarage_roboeyes_set_feature(variables_get($roboEyes), CURIOSITY, logic_boolean(TRUE))` | Dynamic code |
| `fluxgarage_roboeyes_set_flicker` | Statement | VAR(field_variable), AXIS(dropdown), ENABLED(input_value), AMPLITUDE(input_value) | `fluxgarage_roboeyes_set_flicker(variables_get($roboEyes), HORIZONTAL, logic_boolean(TRUE), math_number(0))` | Dynamic code |
| `fluxgarage_roboeyes_set_autoblinker` | Statement | VAR(field_variable), ENABLED(input_value), INTERVAL(input_value), VARIATION(input_value) | `fluxgarage_roboeyes_set_autoblinker(variables_get($roboEyes), logic_boolean(TRUE), math_number(1000), math_number(0))` | Dynamic code |
| `fluxgarage_roboeyes_set_idle_mode` | Statement | VAR(field_variable), ENABLED(input_value), INTERVAL(input_value), VARIATION(input_value) | `fluxgarage_roboeyes_set_idle_mode(variables_get($roboEyes), logic_boolean(TRUE), math_number(1000), math_number(0))` | Dynamic code |
| `fluxgarage_roboeyes_eye_action` | Statement | VAR(field_variable), ACTION(dropdown), TARGET(dropdown) | `fluxgarage_roboeyes_eye_action(variables_get($roboEyes), OPEN, BOTH)` | Dynamic code |
| `fluxgarage_roboeyes_play_animation` | Statement | VAR(field_variable), ANIMATION(dropdown) | `fluxgarage_roboeyes_play_animation(variables_get($roboEyes), CONFUSED)` | Dynamic code |
| `fluxgarage_roboeyes_refresh` | Statement | VAR(field_variable), MODE(dropdown) | `fluxgarage_roboeyes_refresh(variables_get($roboEyes), UPDATE)` | Dynamic code |
| `fluxgarage_roboeyes_get_constraint` | Value | VAR(field_variable), AXIS(dropdown) | `fluxgarage_roboeyes_get_constraint(variables_get($roboEyes), X)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SCREEN | SSD1306_128X64, SSD1306_128X32, SH1106G_128X64 | fluxgarage_roboeyes_i2c_init, fluxgarage_roboeyes_spi_init |
| MOOD | DEFAULT, TIRED, ANGRY, HAPPY | fluxgarage_roboeyes_set_mood |
| POSITION | DEFAULT, N, NE, E, SE, S, SW, W, NW | fluxgarage_roboeyes_set_position |
| FEATURE | CURIOSITY, CYCLOPS, SWEAT | fluxgarage_roboeyes_set_feature |
| AXIS | HORIZONTAL, VERTICAL | fluxgarage_roboeyes_set_flicker |
| ACTION | OPEN, CLOSE, BLINK | fluxgarage_roboeyes_eye_action |
| TARGET | BOTH, LEFT, RIGHT | fluxgarage_roboeyes_eye_action |
| ANIMATION | CONFUSED, LAUGH | fluxgarage_roboeyes_play_animation |
| MODE | UPDATE, DRAW | fluxgarage_roboeyes_refresh |
| AXIS | X, Y | fluxgarage_roboeyes_get_constraint |

## ABS Examples

### Basic Usage
```
arduino_setup()
    fluxgarage_roboeyes_i2c_init("roboEyes", SSD1306_128X64, "display", math_number(0), math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, fluxgarage_roboeyes_get_constraint(variables_get($roboEyes), X))
    time_delay(math_number(1000))
```

## Notes

1. **Bundled display stack**: Adafruit GFX, Adafruit BusIO, Adafruit SSD1306, and Adafruit SH110X are included in `src.7z`.
2. **I2C address**: use decimal `60` for `0x3C` or `61` for `0x3D`.
3. **Hardware SPI**: MOSI and SCLK use the selected board's hardware SPI pins; DC, CS, and RST are configurable.
4. **Existing displays**: the advanced init block accepts a previously initialized object that implements `clearDisplay()`, `display()`, `fillRoundRect()`, and `fillTriangle()`.
5. **Variable**: any init block creates `$varName`; reference it later with `variables_get($varName)`.
6. **Automatic update**: every init block adds `roboEyes.update()` to the main loop.
7. **Parameter order**: ABS parameters follow `block.json` args order.

# FluxGarage RoboEyes

Smoothly animated robot eyes for Adafruit GFX compatible OLED displays.

## Library Info
- **Name**: `@aily-project/lib-fluxgarage-roboeyes`
- **Version**: 1.1.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `fluxgarage_roboeyes_init` | Statement | VAR(field_input), DISPLAY(field_input), WIDTH(input_value), HEIGHT(input_value), FPS(input_value) | `fluxgarage_roboeyes_init("roboEyes", "display", math_number(128), math_number(64), math_number(60))` | `RoboEyes<decltype(display)> roboEyes(display); roboEyes.begin(128, 64, 60);` |
| `fluxgarage_roboeyes_set_framerate` | Statement | VAR(field_variable), FPS(input_value) | `fluxgarage_roboeyes_set_framerate($roboEyes, math_number(60))` | `roboEyes.setFramerate(60);` |
| `fluxgarage_roboeyes_set_colors` | Statement | VAR(field_variable), BACKGROUND(input_value), MAIN(input_value) | `fluxgarage_roboeyes_set_colors($roboEyes, math_number(0), math_number(1))` | `roboEyes.setDisplayColors(0, 1);` |
| `fluxgarage_roboeyes_set_dimensions` | Statement | VAR(field_variable), LEFT_WIDTH(input_value), RIGHT_WIDTH(input_value), LEFT_HEIGHT(input_value), RIGHT_HEIGHT(input_value) | `fluxgarage_roboeyes_set_dimensions($roboEyes, math_number(36), math_number(36), math_number(36), math_number(36))` | `roboEyes.setWidth(...); roboEyes.setHeight(...);` |
| `fluxgarage_roboeyes_set_border_radius` | Statement | VAR(field_variable), LEFT(input_value), RIGHT(input_value) | `fluxgarage_roboeyes_set_border_radius($roboEyes, math_number(8), math_number(8))` | `roboEyes.setBorderradius(8, 8);` |
| `fluxgarage_roboeyes_set_spacing` | Statement | VAR(field_variable), SPACE(input_value) | `fluxgarage_roboeyes_set_spacing($roboEyes, math_number(10))` | `roboEyes.setSpacebetween(10);` |
| `fluxgarage_roboeyes_set_mood` | Statement | VAR(field_variable), MOOD(dropdown) | `fluxgarage_roboeyes_set_mood($roboEyes, HAPPY)` | `roboEyes.setMood(HAPPY);` |
| `fluxgarage_roboeyes_set_position` | Statement | VAR(field_variable), POSITION(dropdown) | `fluxgarage_roboeyes_set_position($roboEyes, E)` | `roboEyes.setPosition(E);` |
| `fluxgarage_roboeyes_set_feature` | Statement | VAR(field_variable), FEATURE(dropdown), ENABLED(input_value) | `fluxgarage_roboeyes_set_feature($roboEyes, CURIOSITY, logic_boolean(TRUE))` | `roboEyes.setCuriosity(true);` |
| `fluxgarage_roboeyes_set_flicker` | Statement | VAR(field_variable), AXIS(dropdown), ENABLED(input_value), AMPLITUDE(input_value) | `fluxgarage_roboeyes_set_flicker($roboEyes, HORIZONTAL, logic_boolean(TRUE), math_number(2))` | `roboEyes.setHFlicker(true, 2);` |
| `fluxgarage_roboeyes_set_autoblinker` | Statement | VAR(field_variable), ENABLED(input_value), INTERVAL(input_value), VARIATION(input_value) | `fluxgarage_roboeyes_set_autoblinker($roboEyes, logic_boolean(TRUE), math_number(3), math_number(2))` | `roboEyes.setAutoblinker(true, 3, 2);` |
| `fluxgarage_roboeyes_set_idle_mode` | Statement | VAR(field_variable), ENABLED(input_value), INTERVAL(input_value), VARIATION(input_value) | `fluxgarage_roboeyes_set_idle_mode($roboEyes, logic_boolean(TRUE), math_number(2), math_number(2))` | `roboEyes.setIdleMode(true, 2, 2);` |
| `fluxgarage_roboeyes_eye_action` | Statement | VAR(field_variable), ACTION(dropdown), TARGET(dropdown) | `fluxgarage_roboeyes_eye_action($roboEyes, BLINK, BOTH)` | `roboEyes.blink();` |
| `fluxgarage_roboeyes_play_animation` | Statement | VAR(field_variable), ANIMATION(dropdown) | `fluxgarage_roboeyes_play_animation($roboEyes, LAUGH)` | `roboEyes.anim_laugh();` |
| `fluxgarage_roboeyes_refresh` | Statement | VAR(field_variable), MODE(dropdown) | `fluxgarage_roboeyes_refresh($roboEyes, DRAW)` | `roboEyes.drawEyes();` |
| `fluxgarage_roboeyes_get_constraint` | Value | VAR(field_variable), AXIS(dropdown) | `fluxgarage_roboeyes_get_constraint($roboEyes, X)` | `roboEyes.getScreenConstraint_X()` |

**Variable**: `fluxgarage_roboeyes_init("name", ...)` creates `$name`. Reference it later as `$name`/`variables_get($name)`.

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MOOD | `DEFAULT`, `TIRED`, `ANGRY`, `HAPPY` | Neutral, tired, angry, or happy expression |
| POSITION | `DEFAULT`, `N`, `NE`, `E`, `SE`, `S`, `SW`, `W`, `NW` | Center or eight gaze directions |
| FEATURE | `CURIOSITY`, `CYCLOPS`, `SWEAT` | Boolean visual feature selected by the block |
| AXIS (flicker) | `HORIZONTAL`, `VERTICAL` | Flicker direction |
| ACTION | `OPEN`, `CLOSE`, `BLINK` | Eye action |
| TARGET | `BOTH`, `LEFT`, `RIGHT` | Eyes affected by an action |
| ANIMATION | `CONFUSED`, `LAUGH` | One-shot animation |
| MODE | `UPDATE`, `DRAW` | Frame-limited update or immediate draw |
| AXIS (constraint) | `X`, `Y` | Constraint axis |

## ABS Examples

### Basic Animated Eyes

```abs
arduino_setup()
    fluxgarage_roboeyes_init("roboEyes", "display", math_number(128), math_number(64), math_number(60))
    fluxgarage_roboeyes_set_mood($roboEyes, HAPPY)
    fluxgarage_roboeyes_set_autoblinker($roboEyes, logic_boolean(TRUE), math_number(3), math_number(2))
    fluxgarage_roboeyes_set_idle_mode($roboEyes, logic_boolean(TRUE), math_number(2), math_number(2))
```

## Notes

1. **Display prerequisite**: create and initialize an Adafruit GFX compatible display object before `fluxgarage_roboeyes_init`; pass its C++ object name in DISPLAY.
2. **Declaration order**: the display initialization block must precede the RoboEyes initialization block so the generated global display object is declared first.
3. **Automatic update**: the init block adds `roboEyes.update()` to the main loop; do not add the refresh block for normal use.
4. **Smooth animation**: avoid long blocking delays in the main loop.
5. **Colors**: monochrome displays normally use background `0`, main `1`; 4-bit grayscale displays may use `0x00`, `0x0F`.
6. **Parameter order**: ABS parameters follow `block.json` args0 order.

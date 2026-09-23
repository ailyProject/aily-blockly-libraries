# grokEyes

TFT_eSPI eye animations with 25 expressions, 21 Xiaozhi aliases, 18 shapes and 39 states.

## Library Info
- **Name**: @aily-project/lib-grok-eyes
- **Version**: 2.2.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `grok_eyes_init` | Statement | VAR(field_input), DISPLAY(field_variable), FPS(input_value), WIDTH(input_value), HEIGHT(input_value), AUTO_UPDATE(field_checkbox) | `grok_eyes_init("eyes", $tft, math_number(50), math_number(0), math_number(0), TRUE)` | `#include <grokEyes.h> ↵ bool grok_eyes_ready_eyes = false; ↵ grokEyes eyes(tft); ↵ grok_eyes_ready_eyes = eyes.begin(50, 0, 0); ↵  ↵ // loop begin ↵ if (grok_eyes_ready_eyes) eyes.update();` |
| `grok_eyes_set_expression` | Statement | VAR(field_variable), EXPRESSION(dropdown), DURATION(input_value) | `grok_eyes_set_expression($eyes, GROK_EXPRESSION_NEUTRAL, math_number(65535))` | `#include <grokEyes.h> ↵ eyes.setGrokExpression(grokEyes::GROK_EXPRESSION_NEUTRAL, 65535);` |
| `grok_eyes_set_alias` | Statement | VAR(field_variable), EXPRESSION(dropdown), DURATION(input_value) | `grok_eyes_set_alias($eyes, XIAOZHI_NEUTRAL, math_number(65535))` | `#include <grokEyes.h> ↵ eyes.setXiaozhiExpression(grokEyes::XIAOZHI_NEUTRAL, 65535);` |
| `grok_eyes_set_expression_name` | Value (Boolean) | VAR(field_variable), NAME(input_value), DURATION(input_value) | `grok_eyes_set_expression_name($eyes, text("happy"), math_number(65535))` | `#include <grokEyes.h> ↵ eyes.setExpression(String("happy").c_str(), 65535)` |
| `grok_eyes_set_shape` | Statement | VAR(field_variable), SHAPE(dropdown), DURATION(input_value) | `grok_eyes_set_shape($eyes, SHAPE_BLOB, math_number(300))` | `#include <grokEyes.h> ↵ eyes.setShape(grokEyes::SHAPE_BLOB, 300);` |
| `grok_eyes_set_state` | Statement | VAR(field_variable), STATE(dropdown), AUTO_EXPRESSION(input_value), DURATION(input_value) | `grok_eyes_set_state($eyes, STATE_SLEEPING, logic_boolean(true), math_number(65535))` | `#include <grokEyes.h> ↵ eyes.setState(grokEyes::STATE_SLEEPING, true, 65535);` |
| `grok_eyes_blink` | Statement | VAR(field_variable), EYE(dropdown), DURATION(input_value) | `grok_eyes_blink($eyes, BOTH, math_number(0))` | `#include <grokEyes.h> ↵ eyes.blinkEye(grokEyes::BOTH, 0);` |
| `grok_eyes_set_blink_timing` | Statement | VAR(field_variable), CLOSE(input_value), HOLD(input_value), OPEN(input_value), SCALE(input_value) | `grok_eyes_set_blink_timing($eyes, math_number(90), math_number(40), math_number(190), math_number(0.035))` | `#include <grokEyes.h> ↵ { ↵   grokEyes::BlinkConfig config; ↵   config.closeMs = 90; ↵   config.holdMs = 40; ↵   config.openMs = 190; ↵   config.closedScale = 0.035; ↵   eyes.setBlinkConfig(config); ↵ }` |
| `grok_eyes_set_gaze` | Statement | VAR(field_variable), X(input_value), Y(input_value), DURATION(input_value) | `grok_eyes_set_gaze($eyes, math_number(0), math_number(0), math_number(220))` | `#include <grokEyes.h> ↵ eyes.setGaze(0, 0, 220);` |
| `grok_eyes_center_gaze` | Statement | VAR(field_variable), DURATION(input_value) | `grok_eyes_center_gaze($eyes, math_number(220))` | `#include <grokEyes.h> ↵ eyes.centerGaze(220);` |
| `grok_eyes_set_turn` | Statement | VAR(field_variable), DEGREES(input_value), DURATION(input_value) | `grok_eyes_set_turn($eyes, math_number(45), math_number(300))` | `#include <grokEyes.h> ↵ eyes.setTurn(45, 300);` |
| `grok_eyes_spin` | Statement | VAR(field_variable), TURNS(input_value), DURATION(input_value) | `grok_eyes_spin($eyes, math_number(1), math_number(1200))` | `#include <grokEyes.h> ↵ eyes.spin(1, 1200);` |
| `grok_eyes_set_position` | Statement | VAR(field_variable), X(input_value), Y(input_value), DURATION(input_value) | `grok_eyes_set_position($eyes, math_number(120), math_number(120), math_number(300))` | `#include <grokEyes.h> ↵ eyes.setPosition(120, 120, 300);` |
| `grok_eyes_set_spacing` | Statement | VAR(field_variable), PERCENT(input_value), DURATION(input_value) | `grok_eyes_set_spacing($eyes, math_number(100), math_number(300))` | `#include <grokEyes.h> ↵ eyes.setEyeSpacing(100, 300);` |
| `grok_eyes_set_eye_offset` | Statement | VAR(field_variable), EYE(dropdown), X(input_value), Y(input_value), DURATION(input_value) | `grok_eyes_set_eye_offset($eyes, BOTH, math_number(0), math_number(0), math_number(300))` | `#include <grokEyes.h> ↵ eyes.setEyeOffset(grokEyes::BOTH, 0, 0, 300);` |
| `grok_eyes_set_eye_size` | Statement | VAR(field_variable), EYE(dropdown), WIDTH(input_value), HEIGHT(input_value), DURATION(input_value) | `grok_eyes_set_eye_size($eyes, BOTH, math_number(100), math_number(100), math_number(300))` | `#include <grokEyes.h> ↵ eyes.setEyeSize(grokEyes::BOTH, 100, 100, 300);` |
| `grok_eyes_set_eye_scale` | Statement | VAR(field_variable), PERCENT(input_value), DURATION(input_value) | `grok_eyes_set_eye_scale($eyes, math_number(100), math_number(300))` | `#include <grokEyes.h> ↵ eyes.setEyeScale(100, 300);` |
| `grok_eyes_reset_layout` | Statement | VAR(field_variable), DURATION(input_value) | `grok_eyes_reset_layout($eyes, math_number(300))` | `#include <grokEyes.h> ↵ eyes.resetLayout(300);` |
| `grok_eyes_set_feature` | Statement | VAR(field_variable), FEATURE(dropdown), ENABLED(input_value) | `grok_eyes_set_feature($eyes, MOTION, logic_boolean(true))` | `#include <grokEyes.h> ↵ eyes.setMotionEnabled(true);` |
| `grok_eyes_set_spring_frequency` | Statement | VAR(field_variable), FREQUENCY(input_value) | `grok_eyes_set_spring_frequency($eyes, math_number(18))` | `#include <grokEyes.h> ↵ eyes.setSpringFrequency(18);` |
| `grok_eyes_set_auto_blink` | Statement | VAR(field_variable), ENABLED(input_value), INTERVAL(input_value), VARIATION(input_value) | `grok_eyes_set_auto_blink($eyes, logic_boolean(true), math_number(0), math_number(0))` | `#include <grokEyes.h> ↵ eyes.setAutoBlink(true, 0, 0);` |
| `grok_eyes_use_state_blink` | Statement | VAR(field_variable) | `grok_eyes_use_state_blink($eyes)` | `#include <grokEyes.h> ↵ eyes.useStateBlinkCadence();` |
| `grok_eyes_set_idle` | Statement | VAR(field_variable), ENABLED(input_value), INTERVAL(input_value) | `grok_eyes_set_idle($eyes, logic_boolean(true), math_number(1800))` | `#include <grokEyes.h> ↵ eyes.setIdle(true, 1800);` |
| `grok_eyes_set_framerate` | Statement | VAR(field_variable), FPS(input_value) | `grok_eyes_set_framerate($eyes, math_number(50))` | `#include <grokEyes.h> ↵ eyes.setFrameRate(50);` |
| `grok_eyes_set_fit` | Statement | VAR(field_variable), MODE(dropdown) | `grok_eyes_set_fit($eyes, FIT_CONTAIN)` | `#include <grokEyes.h> ↵ eyes.setFitMode(grokEyes::FIT_CONTAIN);` |
| `grok_eyes_set_theme` | Statement | VAR(field_variable), THEME(dropdown) | `grok_eyes_set_theme($eyes, DARK)` | `#include <grokEyes.h> ↵ eyes.setTheme(grokEyes::darkTheme());` |
| `grok_eyes_set_colors` | Statement | VAR(field_variable), BACKGROUND(input_value), EYE_COLOR(input_value), ACCENT(input_value) | `grok_eyes_set_colors($eyes, math_number(0), math_number(65535), math_number(0))` | `#include <grokEyes.h> ↵ eyes.setColors(0, 65535, 0);` |
| `grok_eyes_render` | Statement | VAR(field_variable), MODE(dropdown) | `grok_eyes_render($eyes, UPDATE)` | `#include <grokEyes.h> ↵ eyes.update();` |
| `grok_eyes_reset` | Statement | VAR(field_variable) | `grok_eyes_reset($eyes)` | `#include <grokEyes.h> ↵ eyes.reset();` |
| `grok_eyes_end` | Statement | VAR(field_variable) | `grok_eyes_end($eyes)` | `#include <grokEyes.h> ↵ eyes.end(); ↵ grok_eyes_ready_eyes = false;` |
| `grok_eyes_is_ready` | Value (Boolean) | VAR(field_variable) | `grok_eyes_is_ready($eyes)` | `grok_eyes_ready_eyes` |
| `grok_eyes_is_animating` | Value (Boolean) | VAR(field_variable), MODE(dropdown) | `grok_eyes_is_animating($eyes, ANY)` | `#include <grokEyes.h> ↵ eyes.isAnimating()` |
| `grok_eyes_get_number` | Value (Number) | VAR(field_variable), PROPERTY(dropdown) | `grok_eyes_get_number($eyes, EXPRESSION)` | `#include <grokEyes.h> ↵ eyes.grokExpression()` |
| `grok_eyes_get_name` | Value (String) | VAR(field_variable), PROPERTY(dropdown) | `grok_eyes_get_name($eyes, EXPRESSION)` | `#include <grokEyes.h> ↵ String(grokEyes::expressionName(eyes.grokExpression()))` |
| `grok_eyes_wait` | Statement | VAR(field_variable), DURATION(input_value) | `grok_eyes_wait($eyes, math_number(1000))` | `#include <grokEyes.h> ↵ void grok_eyes_wait(grokEyes &eyes, uint32_t duration) { ↵   const uint32_t start = millis(); ↵   while ((uint32_t)(millis() - start) < duration) { ↵     eyes.update(); ↵     delay(1); ↵   } ↵ } ↵ grok_eyes_wait(eyes, 1000);` |

## Parameter Options

- grok_eyes_set_expression.EXPRESSION: `GROK_EXPRESSION_NEUTRAL`, `GROK_EXPRESSION_SUSPICIOUS`, `GROK_EXPRESSION_HAPPY`, `GROK_EXPRESSION_SURPRISED`, `GROK_EXPRESSION_SAD`, `GROK_EXPRESSION_WINKING`, `GROK_EXPRESSION_THINKING`, `GROK_EXPRESSION_ANGRY`, `GROK_EXPRESSION_CONFIDENT`, `GROK_EXPRESSION_SILLY`, `GROK_EXPRESSION_SLEEPY`, `GROK_EXPRESSION_LAUGHING`, `GROK_EXPRESSION_CURIOUS`, `GROK_EXPRESSION_CRYING`, `GROK_EXPRESSION_CONFUSED`, `GROK_EXPRESSION_COOL`, `GROK_EXPRESSION_FUNNY`, `GROK_EXPRESSION_EXCITED`, `GROK_EXPRESSION_EVIL`, `GROK_EXPRESSION_DELICIOUS`, `GROK_EXPRESSION_LOVING`, `GROK_EXPRESSION_SHOCKED`, `GROK_EXPRESSION_RELAXED`, `GROK_EXPRESSION_KISSY`, `GROK_EXPRESSION_EMBARRASSED`.
- grok_eyes_set_alias.EXPRESSION: `XIAOZHI_NEUTRAL`, `XIAOZHI_HAPPY`, `XIAOZHI_LAUGHING`, `XIAOZHI_FUNNY`, `XIAOZHI_SAD`, `XIAOZHI_ANGRY`, `XIAOZHI_CRYING`, `XIAOZHI_LOVING`, `XIAOZHI_EMBARRASSED`, `XIAOZHI_SURPRISED`, `XIAOZHI_SHOCKED`, `XIAOZHI_THINKING`, `XIAOZHI_WINKING`, `XIAOZHI_COOL`, `XIAOZHI_RELAXED`, `XIAOZHI_DELICIOUS`, `XIAOZHI_KISSY`, `XIAOZHI_CONFIDENT`, `XIAOZHI_SLEEPY`, `XIAOZHI_SILLY`, `XIAOZHI_CONFUSED`.
- grok_eyes_set_shape.SHAPE: `SHAPE_BLOB`, `SHAPE_PEBBLE`, `SHAPE_BEAN`, `SHAPE_EGG`, `SHAPE_SQUIRCLE`, `SHAPE_TABLET`, `SHAPE_CAPSULE`, `SHAPE_CYLINDER`, `SHAPE_HEX`, `SHAPE_GEM`, `SHAPE_CRYSTAL`, `SHAPE_WEDGE`, `SHAPE_SHIELD`, `SHAPE_DOME`, `SHAPE_ARCH`, `SHAPE_CLOUD`, `SHAPE_TEARDROP`, `SHAPE_LEAF`.
- grok_eyes_set_state.STATE: `STATE_SLEEPING`, `STATE_WAKING`, `STATE_IDLE`, `STATE_LISTENING`, `STATE_THINKING`, `STATE_SEARCHING`, `STATE_WORKING`, `STATE_EXCITED`, `STATE_SURPRISED`, `STATE_SUSPICIOUS`, `STATE_ANGRY`, `STATE_DROWSY`, `STATE_HAPPY`, `STATE_CURIOUS`, `STATE_CONFUSED`, `STATE_BORED`, `STATE_PROUD`, `STATE_SHY`, `STATE_SAD`, `STATE_LAUGHING`, `STATE_SCARED`, `STATE_PLAYFUL`, `STATE_CELEBRATE`, `STATE_ORBIT`, `STATE_RADAR`, `STATE_PROGRESS`, `STATE_SPAWNING`, `STATE_HUMMING`, `STATE_LOADING`, `STATE_DICTATING`, `STATE_WRITING`, `STATE_SENDING`, `STATE_RECEIVING`, `STATE_UPLOADING`, `STATE_NOTIFYING`, `STATE_ALERTING`, `STATE_DRAGGING`, `STATE_BOUNCING`, `STATE_POWERING_DOWN`.
- grok_eyes_blink.EYE: `BOTH`, `LEFT`, `RIGHT`.
- grok_eyes_set_eye_offset.EYE: `BOTH`, `LEFT`, `RIGHT`.
- grok_eyes_set_eye_size.EYE: `BOTH`, `LEFT`, `RIGHT`.
- grok_eyes_set_feature.FEATURE: `MOTION`, `LIVELY`, `AUTO_EXPRESSION`, `SPRING`, `FLIP_X`, `ANTIALIASING`, `EMPHASIS`.
- grok_eyes_set_fit.MODE: `FIT_CONTAIN`, `FIT_COVER`, `FIT_STRETCH`.
- grok_eyes_set_theme.THEME: `DARK`, `LIGHT`.
- grok_eyes_render.MODE: `UPDATE`, `DRAW`, `DRAW_TO_SPRITE`.
- grok_eyes_is_animating.MODE: `ANY`, `TRANSITION`.
- grok_eyes_get_number.PROPERTY: `EXPRESSION`, `SHAPE`, `STATE`, `WIDTH`, `HEIGHT`, `FRAMES`, `SPRING_FREQUENCY`.
- grok_eyes_get_name.PROPERTY: `EXPRESSION`, `SHAPE`, `STATE`.
- AUTO_UPDATE: `TRUE`, `FALSE`.

Boolean value blocks use `logic_boolean(true)` / `logic_boolean(false)` (lowercase core-logic dropdown values). Only the AUTO_UPDATE checkbox uses uppercase `TRUE` / `FALSE`.

## ABS Examples

### Automatic state animation

The ST7789 240x240 example uses MOSI=47, SCLK=21, CS=44, DC=43, with no reset/backlight GPIO. GPIO48 is reserved as the unconnected MISO input. These are the upstream ESP32-S3 example pins; adapt them to your board. Hidden QSPI fields remain -1.

```abs
arduino_setup()
    tftespi_setup("tft", ST7789_DRIVER, "240", "240", "48", "47", "21", "44", "43", "-1", "-1", HIGH, TFT_RGB, 40000000, "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1")
    grok_eyes_init("eyes", $tft, math_number(50), math_number(0), math_number(0), TRUE)
    grok_eyes_set_shape($eyes, SHAPE_BLOB, math_number(300))
    grok_eyes_set_feature($eyes, LIVELY, logic_boolean(true))
    grok_eyes_set_state($eyes, STATE_LISTENING, logic_boolean(true), math_number(65535))
    grok_eyes_set_auto_blink($eyes, logic_boolean(true), math_number(0), math_number(0))

arduino_loop()
```

### Sequential expressions and a wink

```abs
arduino_setup()
    tftespi_setup("tft", ST7789_DRIVER, "240", "240", "48", "47", "21", "44", "43", "-1", "-1", HIGH, TFT_RGB, 40000000, "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1")
    grok_eyes_init("eyes", $tft, math_number(50), math_number(0), math_number(0), FALSE)
    grok_eyes_set_auto_blink($eyes, logic_boolean(false), math_number(0), math_number(0))
    grok_eyes_set_feature($eyes, MOTION, logic_boolean(false))

arduino_loop()
    grok_eyes_set_expression($eyes, GROK_EXPRESSION_HAPPY, math_number(450))
    grok_eyes_wait($eyes, math_number(1500))
    grok_eyes_blink($eyes, LEFT, math_number(650))
    grok_eyes_wait($eyes, math_number(1000))
    grok_eyes_set_alias($eyes, XIAOZHI_SURPRISED, math_number(450))
    grok_eyes_wait($eyes, math_number(1500))
```

## Notes

1. Initialize TFT_eSPI first and set screen rotation before grok_eyes_init. DISPLAY is a TFT_eSPI field_variable and uses `$tft`; VAR is a field_input that creates `$eyes` of type grokEyes. Use unique C++ identifier names for objects. The screen is declared by lib-tft-espi, not by this library.
2. The source is bundled in src.7z as src/grokEyes, from grokEyes 2.2.0, snapshot ab4dde909c75e68321412108457ef4bf9d211da2 (named expression API, CH13613 aligned updates and a pure-black dark theme). Preserve the included MIT/BSD notices. Only ESP32 and RP2040 are advertised; hardware verification of this Blockly wrapper is pending.
3. grok_eyes_init returns a statement and stores begin() success in grok_eyes_ready_eyes. grok_eyes_is_ready reads this flag; grok_eyes_end clears it. A 240x240 RGB565 sprite alone uses 115200 bytes, plus coverage and object memory. Canvas width/height 0 use the display dimensions; nonzero values are capped at the display size and reserve a region starting at (0,0).
4. AUTO_UPDATE=TRUE inserts one guarded update() call at loop start. Put initialization in setup. For manual rendering set FALSE and call grok_eyes_render(UPDATE) frequently. Repeated setup may allocate a new sprite. A screen rotation or resolution change requires reinitialization.
5. Expression/state duration 65535 is DEFAULT_TRANSITION_MS: use the configured spring, or 350 ms smooth mode when SPRING is disabled. 0 snaps immediately; 1–65534 selects a timed transition. Shape/layout durations are ordinary milliseconds, with 0 applying immediately. Repeated same-target expression commands do not restart a morph.
6. grok_eyes_set_expression_name is a Boolean VALUE block with a side effect. It accepts the 25 lowercase English expression names listed below, including happy, curious, suspicious and evil; false means the name was invalid. Connect it to a condition or a value consumer to execute it. String(...) handles both text literals and Arduino String values.
7. Selecting an expression disables automatic expression changes. Enable AUTO_EXPRESSION again to resume the current state pool. MOTION controls holding motion; LIVELY controls extra gaze/blink behavior; setIdle controls random gaze. Automatic blink interval 0 selects the state cadence. useStateBlinkCadence alone does not enable auto-blink.
8. Gaze uses -100..100 (left/up negative). Positions use the 240x240 design canvas, default center (120,120), with coordinates clamped to -240..480. Eye offsets use -240..240; spacing 0..250%; eye width/height 10..250%; overall scale 50..160%. Pass percentages within those ranges before conversion to the underlying integer types.
9. FPS is clamped to 15..60; spring natural frequency to 0.5..40 rad/s. Blink phase times are milliseconds, closed scale 0..1. Blink duration 0 uses the configured phases. Other duration inputs are uint16_t (0..65535). Spin turns are int8_t; negative values reverse direction. Turning to 180 degrees intentionally hides eyes on the back of the projected head.
10. UPDATE respects FPS; DRAW renders and pushes immediately; DRAW_TO_SPRITE updates the internal sprite only. The latter is for custom C++ composition via eyes.sprite(); it does not send pixels to the screen. Automatic updates redraw the eye canvas and can overwrite other drawings in that region.
11. grok_eyes_wait keeps the selected eye object refreshing but blocks other sketch logic until it finishes. For responsive input/network tasks, use elapsed-time checks in loop and automatic updates instead. Long time_delay calls freeze eye animation. Wait uses unsigned elapsed time to handle millis() rollover.
12. reset cancels transient animations while retaining shape/layout/configuration; resetLayout restores group/eye transforms without changing the shape preset. isAnimating checks transient animations; isTransitioning checks only expression morphing. Neither indicates that future automatic state/blink activity is disabled.
13. get_number EXPRESSION is the target canonical ID (0..24), SHAPE is 0..17 and STATE is 0..38. get_name returns Arduino String names. COLORS are RGB565; TFT_eSPI color value blocks can connect directly.
14. TFT_eSPI configuration must reach every compilation unit. In aily, use tftespi_setup, which writes project build macros. For a standalone Arduino build, supply a project-wide TFT setup header through compiler -include flags for both C and C++, or configure the installed TFT_eSPI User_Setup. Defining pins only in the sketch is insufficient.

## Named expressions and migration

`neutral`, `suspicious`, `happy`, `surprised`, `sad`, `winking`, `thinking`, `angry`, `confident`, `silly`, `sleepy`, `laughing`, `curious`, `crying`, `confused`, `cool`, `funny`, `excited`, `evil`, `delicious`, `loving`, `shocked`, `relaxed`, `kissy`, `embarrassed`. Names are case-sensitive.

The dropdown labels and generated enums use semantic names, for example `happy` / `GROK_EXPRESSION_HAPPY`. Existing JSON/XML Blockly projects with numbered dropdown values are migrated when loaded, preserving the selected expression. Numbered strings such as `expression02` are no longer accepted by the C++ string API; update text inputs and server messages to `happy`. The 21 Xiaozhi aliases remain valid; suspicious, curious, excited and evil are canonical names without a Xiaozhi alias.

The DARK theme uses RGB565 `0x0000` (pure black), including the default theme applied by initialization. For CH13613, configure the QSPI screen through lib-tft-espi and enable the correct PSRAM type; a 480×480 RGB565 sprite requires about 450 KiB. The source sends full-width bands aligned to two pixels; custom canvas dimensions are rounded down to even values.

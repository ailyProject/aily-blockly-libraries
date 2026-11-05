# Otto Robot

Otto DIY V9 blocks for a four-servo walking robot, ultrasonic distance, sound and LED matrix control.

## Library Info
- **Name**: @aily-project/lib-otto
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `otto_init` | Statement | NAME(field_input), YL(dropdown), YR(dropdown), RL(dropdown), RR(dropdown), CALIB(dropdown), NOISE(dropdown), BUZZER(dropdown), TRIG(dropdown), ECHO(dropdown) | `otto_init("otto", YL, YR, RL, RR, true, NOISE, BUZZER, TRIG, ECHO)` | `otto.init(YL, YR, RL, RR, true, NOISE, BUZZER, TRIG, ECHO);` |
| `otto_init_matrix` | Statement | NAME(field_variable), DIN(dropdown), CS(dropdown), CLK(dropdown), ROTATE(dropdown) | `otto_init_matrix($name, DIN, CS, CLK, 1)` | `name.initMATRIX(DIN, CS, CLK, 1);` |
| `otto_attach_servos` | Statement | NAME(field_variable) | `otto_attach_servos($name)` | `name.attachServos();` |
| `otto_detach_servos` | Statement | NAME(field_variable) | `otto_detach_servos($name)` | `name.detachServos();` |
| `otto_set_trims` | Statement | NAME(field_variable), YL(input_value), YR(input_value), RL(input_value), RR(input_value) | `otto_set_trims($name, math_number(0), math_number(0), math_number(0), math_number(0))` | `name.setTrims(0, 0, 0, 0);` |
| `otto_save_trims` | Statement | NAME(field_variable) | `otto_save_trims($name)` | `name.saveTrimsOnEEPROM();` |
| `otto_home` | Statement | NAME(field_variable) | `otto_home($name)` | `name.home();` |
| `otto_get_rest_state` | Value | NAME(field_variable) | `otto_get_rest_state($name)` | `name.getRestState()` |
| `otto_set_rest_state` | Statement | NAME(field_variable), STATE(dropdown) | `otto_set_rest_state($name, true)` | `name.setRestState(true);` |
| `otto_jump` | Statement | NAME(field_variable), STEPS(input_value), T(input_value) | `otto_jump($name, math_number(0), math_number(0))` | `name.jump(0, 0);` |
| `otto_walk` | Statement | NAME(field_variable), STEPS(input_value), T(input_value), DIR(dropdown) | `otto_walk($name, math_number(0), math_number(0), FORWARD)` | `name.walk(0, 0, FORWARD);` |
| `otto_turn` | Statement | NAME(field_variable), STEPS(input_value), T(input_value), DIR(dropdown) | `otto_turn($name, math_number(0), math_number(0), LEFT)` | `name.turn(0, 0, LEFT);` |
| `otto_bend` | Statement | NAME(field_variable), STEPS(input_value), T(input_value), DIR(dropdown) | `otto_bend($name, math_number(0), math_number(0), LEFT)` | `name.bend(0, 0, LEFT);` |
| `otto_shake_leg` | Statement | NAME(field_variable), STEPS(input_value), T(input_value), DIR(dropdown) | `otto_shake_leg($name, math_number(0), math_number(0), RIGHT)` | `name.shakeLeg(0, 0, RIGHT);` |
| `otto_updown` | Statement | NAME(field_variable), STEPS(input_value), T(input_value), H(input_value) | `otto_updown($name, math_number(0), math_number(0), math_number(0))` | `name.updown(0, 0, 0);` |
| `otto_swing` | Statement | NAME(field_variable), STEPS(input_value), T(input_value), H(input_value) | `otto_swing($name, math_number(0), math_number(0), math_number(0))` | `name.swing(0, 0, 0);` |
| `otto_tiptoe_swing` | Statement | NAME(field_variable), STEPS(input_value), T(input_value), H(input_value) | `otto_tiptoe_swing($name, math_number(0), math_number(0), math_number(0))` | `name.tiptoeSwing(0, 0, 0);` |
| `otto_jitter` | Statement | NAME(field_variable), STEPS(input_value), T(input_value), H(input_value) | `otto_jitter($name, math_number(0), math_number(0), math_number(0))` | `name.jitter(0, 0, 0);` |
| `otto_ascending_turn` | Statement | NAME(field_variable), STEPS(input_value), T(input_value), H(input_value) | `otto_ascending_turn($name, math_number(0), math_number(0), math_number(0))` | `name.ascendingTurn(0, 0, 0);` |
| `otto_moonwalker` | Statement | NAME(field_variable), STEPS(input_value), T(input_value), H(input_value), DIR(dropdown) | `otto_moonwalker($name, math_number(0), math_number(0), math_number(0), LEFT)` | `name.moonwalker(0, 0, 0, LEFT);` |
| `otto_crusaito` | Statement | NAME(field_variable), STEPS(input_value), T(input_value), H(input_value), DIR(dropdown) | `otto_crusaito($name, math_number(0), math_number(0), math_number(0), FORWARD)` | `name.crusaito(0, 0, 0, FORWARD);` |
| `otto_flapping` | Statement | NAME(field_variable), STEPS(input_value), T(input_value), H(input_value), DIR(dropdown) | `otto_flapping($name, math_number(0), math_number(0), math_number(0), FORWARD)` | `name.flapping(0, 0, 0, FORWARD);` |
| `otto_get_distance` | Value | NAME(field_variable) | `otto_get_distance($name)` | `name.getDistance()` |
| `otto_touch_pressed` | Value | PIN(dropdown) | `otto_touch_pressed(PIN)` | `(digitalRead(PIN) == HIGH)` |
| `otto_sound_triggered` | Value | PIN(dropdown), THRESHOLD(input_value) | `otto_sound_triggered(PIN, math_number(0))` | `(analogRead(PIN) > 0)` |
| `otto_matrix_intensity` | Statement | NAME(field_variable), INTENSITY(input_value) | `otto_matrix_intensity($name, math_number(0))` | `name.matrixIntensity(0);` |
| `otto_put_mouth` | Statement | NAME(field_variable), MOUTH(dropdown) | `otto_put_mouth($name, zero)` | `name.putMouth(zero);` |
| `otto_put_mouth_bitmap` | Statement | NAME(field_variable), CODE(input_value) | `otto_put_mouth_bitmap($name, math_number(0))` | `name.putMouth((unsigned long int)(0), false);` |
| `otto_put_animation_mouth` | Statement | NAME(field_variable), ANIM(dropdown), INDEX(input_value) | `otto_put_animation_mouth($name, littleUuh, math_number(0))` | `name.putAnimationMouth(littleUuh, 0);` |
| `otto_clear_mouth` | Statement | NAME(field_variable) | `otto_clear_mouth($name)` | `name.clearMouth();` |
| `otto_set_led` | Statement | NAME(field_variable), X(input_value), Y(input_value), VALUE(input_value) | `otto_set_led($name, math_number(0), math_number(0), math_number(0))` | `name.setLed(0, 0, 0);` |
| `otto_write_text` | Statement | NAME(field_variable), TEXT(input_value), SPEED(input_value) | `otto_write_text($name, text("value"), math_number(9600))` | `name.writeText("value", 9600);` |
| `otto_tone` | Statement | NAME(field_variable), FREQ(input_value), DURATION(input_value), SILENT(input_value) | `otto_tone($name, math_number(0), math_number(1000), math_number(0))` | `name._tone(0, 1000, 0);` |
| `otto_bend_tones` | Statement | NAME(field_variable), INITF(input_value), FINALF(input_value), PROP(input_value), DUR(input_value), SILENT(input_value) | `otto_bend_tones($name, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `name.bendTones(0, 0, 0, 0, 0);` |
| `otto_sing` | Statement | NAME(field_variable), SONG(dropdown) | `otto_sing($name, S_connection)` | `name.sing(S_connection);` |
| `otto_move_single` | Statement | NAME(field_variable), POSITION(input_value), SERVO(dropdown) | `otto_move_single($name, math_number(0), 0)` | `name._moveSingle(0, 0);` |
| `otto_move_servos` | Statement | NAME(field_variable), TIME(input_value), YL(input_value), YR(input_value), RL(input_value), RR(input_value) | `otto_move_servos($name, math_number(1000), math_number(0), math_number(0), math_number(0), math_number(0))` | `{ ↵ int ottoTarget[4] = {0, 0, 0, 0}; ↵ name._moveServos(1000, ottoTarget); ↵ }` |
| `otto_oscillate_servos` | Statement | NAME(field_variable), AYL(input_value), AYR(input_value), ARL(input_value), ARR(input_value), OYL(input_value), OYR(input_value), ORL(input_value), ORR(input_value), T(input_value), PYL(dropdown), PYR(dropdown), PRL(dropdown), PRR(dropdown), CYCLE(input_value) | `otto_oscillate_servos($name, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), 0, 0, 0, 0, math_number(0))` | `{ ↵ int ottoAmp[4] = {0, 0, 0, 0}; ↵ int ottoOff[4] = {0, 0, 0, 0}; ↵ double ottoPhase[4] = {0, 0, 0, 0}; ↵ name.oscillateServos(ottoAmp, ottoOff, 0, ottoPhase, 0); ↵ }` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| CALIB | true, false | otto_init |
| ROTATE | 1, 2, 3, 4 | otto_init_matrix |
| STATE | true, false | otto_set_rest_state |
| DIR | FORWARD, BACKWARD | otto_walk, otto_crusaito, otto_flapping |
| DIR | LEFT, RIGHT | otto_turn, otto_bend, otto_moonwalker |
| DIR | RIGHT, LEFT | otto_shake_leg |
| MOUTH | zero, one, two, three, four, five, six, seven, eight, nine, smile, happyOpen, happyClosed, heart, bigSurprise, smallSurprise, tongueOut, vamp1, vamp2, lineMouth, ... | otto_put_mouth |
| ANIM | littleUuh, dreamMouth, adivinawi, wave | otto_put_animation_mouth |
| SONG | S_connection, S_disconnection, S_buttonPushed, S_mode1, S_mode2, S_mode3, S_surprise, S_OhOoh, S_OhOoh2, S_cuddly, S_sleeping, S_happy, S_superHappy, S_happy_short, S_sad, S_confused, S_fart1, S_fart2, S_fart3 | otto_sing |
| SERVO | 0, 1, 2, 3 | otto_move_single |
| PYL | 0, 0.5235987755982988, 0.7853981633974483, 1.0471975511965976, 1.5707963267948966, 2.0943951023931953, 2.356194490192345, 2.6179938779914944, 3.141592653589793, 3.665191429188092, 3.9269908169872414, 4.188790204786390... | otto_oscillate_servos |
| PYR | 0, 0.5235987755982988, 0.7853981633974483, 1.0471975511965976, 1.5707963267948966, 2.0943951023931953, 2.356194490192345, 2.6179938779914944, 3.141592653589793, 3.665191429188092, 3.9269908169872414, 4.188790204786390... | otto_oscillate_servos |
| PRL | 0, 0.5235987755982988, 0.7853981633974483, 1.0471975511965976, 1.5707963267948966, 2.0943951023931953, 2.356194490192345, 2.6179938779914944, 3.141592653589793, 3.665191429188092, 3.9269908169872414, 4.188790204786390... | otto_oscillate_servos |
| PRR | 0, 0.5235987755982988, 0.7853981633974483, 1.0471975511965976, 1.5707963267948966, 2.0943951023931953, 2.356194490192345, 2.6179938779914944, 3.141592653589793, 3.665191429188092, 3.9269908169872414, 4.188790204786390... | otto_oscillate_servos |

## ABS Examples

### Basic Usage
```abs
# ABS Schema: 2

arduino_setup()
    otto_init("otto", "2", "3", "4", "5", true, "A6", "13", "8", "9")
    otto_init_matrix($otto, "A3", "A2", "A1", 1)
    serial_begin(Serial, 9600)

arduino_loop()
    otto_walk($otto, math_number(4), math_number(1000), FORWARD)
    serial_println(Serial, otto_get_distance($otto))
    otto_home($otto)
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(true/false)`, variables, or nested value blocks.

3. Initialize one Otto9 object before its consumer blocks; use the same typed variable in each consumer. Initialize the matrix before matrix operations.
4. Standard wiring: servos D2/D3/D4/D5, buzzer D13, ultrasonic Trig D8 and Echo D9, noise A6, touch A0, matrix DIN=A3/CS=A2/CLK=A1. Change pins to match the hardware.
5. Motion, sound and scrolling operations block until they finish. The bundled Servo library uses Timer1; avoid other Timer1 users.
6. Avoid upstream macro names such as `wave`, `smile` and `zero` for user variables. The unused lowercase `otto` macro is removed from the bundled source.
7. Source licenses and notices remain in the bundled archive.
8. Nine added locale files (zh_hk, ja, ko, de, fr, es, pt, ru, ar) use the English strings as an explicit fallback.

9. Table entries use `$name` as a typed-object placeholder; choose the object created by `otto_init`, such as `$otto`. Numeric zero values in generated-code probes describe the output shape; use positive action periods and the practical values in the example.

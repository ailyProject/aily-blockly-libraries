# ServoEasing

Smooth servo movement with easing, speed control, callbacks, and synchronized multi-servo moves.

## Library Info
- **Name**: @aily-project/lib-servoeasing
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `servoeasing_pin_write` | Statement | PIN(dropdown), TARGET(input_value) | `servoeasing_pin_write(PIN, math_number(0))` | `aily_servoeasing_move(aily_servoeasing_pin_PIN, PIN, 0, 0, true);` |
| `servoeasing_pin_ease_to_duration` | Statement | PIN(dropdown), DURATION(input_value), TARGET(input_value) | `servoeasing_pin_ease_to_duration(PIN, math_number(1000), math_number(0))` | `aily_servoeasing_move(aily_servoeasing_pin_PIN, PIN, 0, 1000, true);` |
| `servoeasing_pin_start_ease_to_duration` | Statement | PIN(dropdown), DURATION(input_value), TARGET(input_value) | `servoeasing_pin_start_ease_to_duration(PIN, math_number(1000), math_number(0))` | `aily_servoeasing_move(aily_servoeasing_pin_PIN, PIN, 0, 1000, false);` |
| `servoeasing_create` | Statement | VAR(field_input), PIN(dropdown), INITIAL(input_value) | `servoeasing_create("servoEase", PIN, math_number(0))` | `servoEase.attach(PIN, 0);` |
| `servoeasing_create_custom` | Statement | VAR(field_input), PIN(dropdown), INITIAL(input_value), LOW_US(input_value), HIGH_US(input_value), LOW_DEGREE(input_value), HIGH_DEGREE(input_value) | `servoeasing_create_custom("servoEase", PIN, math_number(0), math_number(0), math_number(0), math_number(90), math_number(90))` | `servoEase.attach(PIN, 0, 0, 0, 90, 90);` |
| `servoeasing_set_easing` | Statement | VAR(field_variable), EASING(dropdown) | `servoeasing_set_easing($servoEase, EASE_LINEAR)` | `servoEase.setEasingType(EASE_LINEAR);` |
| `servoeasing_set_speed` | Statement | VAR(field_variable), SPEED(input_value) | `servoeasing_set_speed($servoEase, math_number(9600))` | `servoEase.setSpeed(9600);` |
| `servoeasing_write` | Statement | VAR(field_variable), TARGET(input_value) | `servoeasing_write($servoEase, math_number(0))` | `servoEase.write(0);` |
| `servoeasing_ease_to` | Statement | VAR(field_variable), TARGET(input_value), SPEED(input_value) | `servoeasing_ease_to($servoEase, math_number(0), math_number(9600))` | `servoEase.easeTo(0, 9600);` |
| `servoeasing_ease_to_duration` | Statement | VAR(field_variable), TARGET(input_value), DURATION(input_value) | `servoeasing_ease_to_duration($servoEase, math_number(0), math_number(1000))` | `servoEase.easeToD(0, 1000);` |
| `servoeasing_start_ease_to` | Statement | VAR(field_variable), TARGET(input_value), SPEED(input_value), UPDATE(dropdown) | `servoeasing_start_ease_to($servoEase, math_number(0), math_number(9600), START_UPDATE_BY_INTERRUPT)` | `servoEase.startEaseTo(0, 9600, START_UPDATE_BY_INTERRUPT);` |
| `servoeasing_start_ease_to_duration` | Statement | VAR(field_variable), TARGET(input_value), DURATION(input_value), UPDATE(dropdown) | `servoeasing_start_ease_to_duration($servoEase, math_number(0), math_number(1000), START_UPDATE_BY_INTERRUPT)` | `servoEase.startEaseToD(0, 1000, START_UPDATE_BY_INTERRUPT);` |
| `servoeasing_update` | Value | VAR(field_variable) | `servoeasing_update($servoEase)` | `servoEase.update()` |
| `servoeasing_is_moving` | Value | VAR(field_variable) | `servoeasing_is_moving($servoEase)` | `servoEase.isMoving()` |
| `servoeasing_read` | Value | VAR(field_variable) | `servoeasing_read($servoEase)` | `servoEase.read()` |
| `servoeasing_current_microseconds` | Value | VAR(field_variable) | `servoeasing_current_microseconds($servoEase)` | `servoEase.getCurrentMicroseconds()` |
| `servoeasing_get_speed` | Value | VAR(field_variable) | `servoeasing_get_speed($servoEase)` | `servoEase.getSpeed()` |
| `servoeasing_get_move_duration` | Value | VAR(field_variable) | `servoeasing_get_move_duration($servoEase)` | `servoEase.getMillisForCompleteMove()` |
| `servoeasing_stop` | Statement | VAR(field_variable) | `servoeasing_stop($servoEase)` | `servoEase.stop();` |
| `servoeasing_pause` | Statement | VAR(field_variable) | `servoeasing_pause($servoEase)` | `servoEase.pause();` |
| `servoeasing_resume` | Statement | VAR(field_variable), MODE(dropdown) | `servoeasing_resume($servoEase, INTERRUPTS)` | `servoEase.resumeWithInterrupts();` |
| `servoeasing_detach` | Statement | VAR(field_variable) | `servoeasing_detach($servoEase)` | `servoEase.detach();` |
| `servoeasing_reattach` | Statement | VAR(field_variable) | `servoeasing_reattach($servoEase)` | `servoEase.reattach();` |
| `servoeasing_set_trim` | Statement | VAR(field_variable), TRIM(input_value), WRITE_NOW(dropdown) | `servoeasing_set_trim($servoEase, math_number(0), TRUE)` | `servoEase.setTrim(0, true);` |
| `servoeasing_set_reverse` | Statement | VAR(field_variable), ENABLE(dropdown) | `servoeasing_set_reverse($servoEase, TRUE)` | `servoEase.setReverseOperation(true);` |
| `servoeasing_set_min_max` | Statement | VAR(field_variable), MINIMUM(input_value), MAXIMUM(input_value) | `servoeasing_set_min_max($servoEase, math_number(0), math_number(0))` | `servoEase.setMinMaxConstraint(0, 0);` |
| `servoeasing_on_reached` | Hat | VAR(field_variable), HANDLER(input_statement) | `servoeasing_on_reached($servoEase)` | `ServoEasing servoEase; ↵ void servoeasing_reached_servoEase(ServoEasing *servo) { ↵ } ↵ servoEase.setTargetPositionReachedHandler(servoeasing_reached_servoEase);` |
| `servoeasing_all_set_easing` | Statement | EASING(dropdown) | `servoeasing_all_set_easing(EASE_LINEAR)` | `setEasingTypeForAllServos(EASE_LINEAR);` |
| `servoeasing_all_set_speed` | Statement | SPEED(input_value) | `servoeasing_all_set_speed(math_number(9600))` | `setSpeedForAllServos(9600);` |
| `servoeasing_all_set_targets_2` | Statement | TARGET1(input_value), TARGET2(input_value) | `servoeasing_all_set_targets_2(math_number(0), math_number(0))` | `setFloatDegreeForAllServos(2, 0, 0);` |
| `servoeasing_all_set_targets_3` | Statement | TARGET1(input_value), TARGET2(input_value), TARGET3(input_value) | `servoeasing_all_set_targets_3(math_number(0), math_number(0), math_number(0))` | `setFloatDegreeForAllServos(3, 0, 0, 0);` |
| `servoeasing_all_set_targets_4` | Statement | TARGET1(input_value), TARGET2(input_value), TARGET3(input_value), TARGET4(input_value) | `servoeasing_all_set_targets_4(math_number(0), math_number(0), math_number(0), math_number(0))` | `setFloatDegreeForAllServos(4, 0, 0, 0, 0);` |
| `servoeasing_all_start_synchronized` | Statement | SPEED(input_value) | `servoeasing_all_start_synchronized(math_number(9600))` | `setEaseToForAllServosSynchronizeAndStartInterrupt(9600);` |
| `servoeasing_all_wait_synchronized` | Statement | SPEED(input_value) | `servoeasing_all_wait_synchronized(math_number(9600))` | `setEaseToForAllServosSynchronizeAndWaitForAllServosToStop(9600);` |
| `servoeasing_all_update` | Value | (none) | `servoeasing_all_update()` | `updateAllServos()` |
| `servoeasing_all_is_moving` | Value | (none) | `servoeasing_all_is_moving()` | `isOneServoMoving()` |
| `servoeasing_all_stop` | Statement | (none) | `servoeasing_all_stop()` | `stopAllServos();` |

### Shared generated support for pin blocks

Each pin block emits its table call plus one object per pin and one shared helper. For pin 4, the object is `ServoEasing aily_servoeasing_pin_4;`. Board pin symbols replace `PIN` in the table; non-alphanumeric characters become underscores in object names. No setup attachment or Blockly variable is generated. On ESP32 the generator also adds `#include <ESP32Servo.h>` before this shared support:

```cpp
#define ENABLE_MIN_AND_MAX_CONSTRAINTS
#include <ServoEasing.hpp>
ServoEasing aily_servoeasing_pin_4;

void aily_servoeasing_move(ServoEasing &servo, int pin, float target, long duration, bool wait) {
  if (!servo.attached()) {
    servo.attach(pin);
  }
  if (!servo.attached()) {
    return;
  }
  servo.stop();
  if (duration <= 0) {
    servo.write(target);
    return;
  }
  const uint_fast16_t moveDuration = duration > 65535L ? 65535 : duration;
  if (wait) {
    servo.easeToD(target, moveDuration);
  } else {
    servo.startEaseToD(target, moveDuration);
  }
}
```

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| EASING | EASE_LINEAR, EASE_QUADRATIC_IN_OUT, EASE_QUADRATIC_IN, EASE_QUADRATIC_OUT, EASE_CUBIC_IN_OUT, EASE_CUBIC_IN, EASE_CUBIC_OUT, EASE_QUARTIC_IN_OUT, EASE_SINE_IN_OUT, EASE_CIRCULAR_IN_OUT, EASE_BACK_OUT, EASE_ELASTIC_OUT, EASE_BOUNCE_OUT, EASE_PRECISION_IN, EASE_PRECISION_OUT | servoeasing_set_easing |
| UPDATE | START_UPDATE_BY_INTERRUPT, DO_NOT_START_UPDATE_BY_INTERRUPT | servoeasing_start_ease_to, servoeasing_start_ease_to_duration |
| MODE | INTERRUPTS, MANUAL | servoeasing_resume |
| WRITE_NOW | TRUE, FALSE | servoeasing_set_trim |
| ENABLE | TRUE, FALSE | servoeasing_set_reverse |
| EASING | EASE_LINEAR, EASE_QUADRATIC_IN_OUT, EASE_CUBIC_IN_OUT, EASE_SINE_IN_OUT, EASE_BOUNCE_OUT, EASE_PRECISION_OUT | servoeasing_all_set_easing |

## ABS Examples

### Pin control: immediate and blocking timed movement

```abs
arduino_setup()
    servoeasing_pin_write(4, math_number(30))
    time_delay(math_number(1000))

arduino_loop()
    servoeasing_pin_ease_to_duration(4, math_number(1000), math_number(120))
    servoeasing_pin_ease_to_duration(4, math_number(1000), math_number(30))
```

### Pin control: background timed movement

```abs
arduino_setup()
    serial_begin(Serial, 9600)
    servoeasing_pin_write(4, math_number(30))
    time_delay(math_number(1000))

arduino_loop()
    servoeasing_pin_start_ease_to_duration(4, math_number(1000), math_number(120))
    serial_println(Serial, text("moving"))
    time_delay(math_number(1500))
    servoeasing_pin_start_ease_to_duration(4, math_number(1000), math_number(30))
    time_delay(math_number(1500))
```

### Named servo control (existing blocks)

```abs
arduino_setup()
    servoeasing_create("servoEase", 4, math_number(30))
    time_delay(math_number(1000))

arduino_loop()
    servoeasing_ease_to_duration($servoEase, math_number(120), math_number(1000))
    servoeasing_ease_to_duration($servoEase, math_number(30), math_number(1000))
```

## Notes

1. **Variable**: `servoeasing_create("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Pin control**: the three `servoeasing_pin_*` blocks share one hidden ServoEasing object per pin. They attach the pin on its first executed command, without an explicit initialization block or initial-angle input. Unexecuted branches do not attach their pins. Immediate write stops an earlier movement before writing; a timed command replaces an earlier movement on that pin.
5. **Blocking and duration**: `servoeasing_pin_ease_to_duration(PIN, DURATION, TARGET)` waits for the commanded move. `servoeasing_pin_start_ease_to_duration(PIN, DURATION, TARGET)` returns immediately and updates in the background; no manual update block is required. The default easing is linear. Durations are integer milliseconds: zero or negative values write immediately; positive values are limited to 1–65535 ms, with larger values capped at 65535 ms.
6. **One library**: use pin write for ordinary angle control and pin timed blocks for timed control. Installing `aily_servo` is unnecessary. Pin mode and named-servo mode use independent objects; do not mix them, or another servo library, on the same physical pin. Existing named-servo blocks remain compatible; create/attach them before movement, and call `update` repeatedly only when selecting manual non-blocking updates. All-servo blocks also affect hidden pin objects after their first attachment.
7. **Startup and timing**: a fresh pin object uses the library's default software position (1500 microseconds), not a measured physical angle. The first move cannot guarantee a slow move from an unknown power-on position. Immediate positioning plus adequate settling time can establish a known commanded start. Timed movement schedules control pulses; load, power, and servo speed limit actual motion. `read` reports the stored command, not position feedback.

# Beginner A1 Car

**This library works ONLY on the Beginner A1 board (ESP32-C3)** — it relies on the board's fixed pins and the paired remote, and is not portable to other boards.

Blocks for the Beginner A1 car (main controller). `beginner_a1_init` creates a car object (variable); other blocks reference it. ESP-NOW remote, drive-by-remote, LED state machine and battery are handled automatically.

## Library Info
- **Name**: @aily-project/lib-beginner_a1
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `beginner_a1_init` | Statement | VAR(field_input) | `beginner_a1_init("car")` | `BeginnerA1Class car;` + setup `car.begin();` + loop `car.driveByRemote(); car.update();` |
| `beginner_a1_button` | Value | VAR(field_variable), INDEX(dropdown) | `beginner_a1_button(variables_get($car), "0")` | `car.remoteButton(0)` |
| `beginner_a1_servo` | Statement | VAR(field_variable), WHICH(dropdown), ANGLE(field_angle 0-360) | `beginner_a1_servo(variables_get($car), "0", 90)` | `car.setServo(0, 90);` |
| `beginner_a1_servo_rotate` | Statement | VAR(field_variable), WHICH(dropdown), DIR(dropdown), SPEED(field_slider 0-100), SECONDS(field_slider 0-10) | `beginner_a1_servo_rotate(variables_get($car), "0", "1", 50, 1)` | `car.rotate(0, (1)*(50), (unsigned long)((1)*1000));` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| INDEX | "0", "1", "2", "3" | remote buttons A, B, C, D |
| WHICH (servo) | "0", "1" | 0=SERVO_20 (GPIO20), 1=SERVO_21 (GPIO21) |
| ANGLE | 0..360 | positional servo angle (field) |
| DIR | "1", "-1" | rotate direction: 1=forward, -1=reverse |
| SPEED | 0..100 | continuous-rotation servo speed |
| SECONDS | 0..10 | spin duration in seconds (non-blocking) |

## ABS Examples

### Map buttons to servos
```
arduino_setup()
    beginner_a1_init("car")

arduino_loop()
    controls_if()
        @IF0: beginner_a1_button(variables_get($car), "0")
        @DO0:
            beginner_a1_servo(variables_get($car), "0", 0)
```

## Notes

1. **Variable**: `beginner_a1_init("car")` creates variable `$car` (type `BeginnerA1Car`); reference it later with `variables_get($car)`.
2. **Init**: place `beginner_a1_init` in `arduino_setup()`; it injects setup + loop (drive-by-remote then update). Only one car instance (ESP-NOW receive is a singleton).
3. **Auto behavior**: the car drives by remote and the LED indicates status automatically; users only script button-to-servo logic.
4. **Loop order**: `driveByRemote()` runs before `update()` so the safety stop zeroes motors when the remote disconnects.
5. **Ranges**: servo angle 0..360, speed 0..100, seconds 0..10.
6. **Field reads**: ANGLE/SPEED/SECONDS are fields (not input_value) — passed as bare numbers in ABS.

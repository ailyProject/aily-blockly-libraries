# Beginner A1 Car

**This library works ONLY on the Beginner A1 board (ESP32-C3)** — it relies on the board's fixed pins and the paired remote, and is not portable to other boards.

Blocks for the Beginner A1 car (main controller). `beginner_a1_init` creates a car object (variable); other blocks reference it. ESP-NOW remote, LED state machine and battery are handled automatically.

## Library Info
- **Name**: @aily-project/lib-beginner_a1
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `beginner_a1_init` | Statement | VAR(field_input), MAXSPEED(field_slider 0-255) | `beginner_a1_init("car", 120)` | `BeginnerA1Class car;` + setup `car.begin(120);` + loop `car.update();` |
| `beginner_a1_button` | Value | VAR(field_variable), INDEX(dropdown) | `beginner_a1_button(variables_get($car), "0")` | `car.remoteButton(0)` |
| `beginner_a1_joystick` | Value | VAR(field_variable), CHANNEL(dropdown) | `beginner_a1_joystick(variables_get($car), "0")` | `car.joystick(0)` |
| `beginner_a1_drive` | Statement | VAR(field_variable), FORWARD(input_value), TURN(input_value) | `beginner_a1_drive(variables_get($car), math_number(0), math_number(0))` | `car.drive(f, t);` |
| `beginner_a1_motor` | Statement | VAR(field_variable), WHICH(dropdown), SPEED(input_value) | `beginner_a1_motor(variables_get($car), "0", math_number(0))` | `car.setMotor(0, s);` |
| `beginner_a1_stop` | Statement | VAR(field_variable) | `beginner_a1_stop(variables_get($car))` | `car.stop();` |
| `beginner_a1_servo` | Statement | VAR(field_variable), WHICH(dropdown), ANGLE(field_angle 0-360) | `beginner_a1_servo(variables_get($car), "0", 90)` | `car.setServo(0, 90);` |
| `beginner_a1_servo_rotate` | Statement | VAR(field_variable), WHICH(dropdown), DIR(dropdown), SPEED(field_slider 0-100), SECONDS(field_slider 0-10) | `beginner_a1_servo_rotate(variables_get($car), "0", "1", 50, 1)` | `car.rotate(0, (1)*(50), (unsigned long)((1)*1000));` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MAXSPEED | 0..255 | max motor PWM speed (default 120), set in init |
| INDEX | "0", "1", "2", "3" | remote buttons A, B, C, D |
| CHANNEL | "0", "1", "2", "3" | joystick: Left X / Left Y / Right X / Right Y (returns -127..127) |
| WHICH (motor) | "0", "1" | 0=left, 1=right (speed -maxSpeed..maxSpeed) |
| WHICH (servo) | "0", "1" | 0=SERVO_20 (GPIO20), 1=SERVO_21 (GPIO21) |
| ANGLE | 0..360 | positional servo angle (field) |
| DIR | "1", "-1" | rotate direction: 1=forward, -1=reverse |
| SPEED | 0..100 | continuous-rotation servo speed |
| SECONDS | 0..10 | spin duration in seconds (non-blocking) |

## ABS Examples

### Drive from joystick (arcade mix)
```
arduino_setup()
    beginner_a1_init("car", 120)

arduino_loop()
    beginner_a1_motor(variables_get($car), "0", math_arithmetic(beginner_a1_joystick(variables_get($car), "1"), ADD, beginner_a1_joystick(variables_get($car), "0")))
    beginner_a1_motor(variables_get($car), "1", math_arithmetic(beginner_a1_joystick(variables_get($car), "1"), MINUS, beginner_a1_joystick(variables_get($car), "0")))
```

### Buttons to servos
```
arduino_loop()
    controls_if()
        @IF0: beginner_a1_button(variables_get($car), "0")
        @DO0:
            beginner_a1_servo(variables_get($car), "0", 0)
```

## Notes

1. **Variable**: `beginner_a1_init("car", 120)` creates variable `$car` (type `BeginnerA1Car`); reference it later with `variables_get($car)`. The 2nd arg is max speed (field slider 0-255).
2. **Init**: place `beginner_a1_init` in `arduino_setup()`; it injects `car.begin(maxSpeed)` + `car.update()` (loop refresh). It does NOT auto-drive.
3. **Driving**: use `beginner_a1_drive` (forward + turn) or `beginner_a1_motor` (per wheel). For arcade steering, mix joystick Y (forward) and X (turn).
4. **Safety**: `update()` stops motors when the remote disconnects.
5. **Only one car instance** (ESP-NOW receive is a singleton).
6. **Ranges**: joystick -127..127, motor speed bounded by MAXSPEED, servo angle 0..360, rotate speed 0..100, seconds 0..10.

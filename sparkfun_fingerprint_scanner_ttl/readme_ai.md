# SparkFun TTL Fingerprint Scanner

Blockly wrapper for GT-511C3/GT-521F TTL fingerprint scanners.

## Library Info
- **Name**: @aily-project/lib-sparkfun-fingerprint-scanner-ttl
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `fps_init` | Statement | VAR(field_input), RX(field_number), TX(field_number) | `fps_init("fps", 4, 5)` | Dynamic code |
| `fps_led` | Statement | VAR(field_variable), STATE(dropdown) | `fps_led(variables_get($fps), true)` | Dynamic code |
| `fps_enroll_count` | Value | VAR(field_variable) | `fps_enroll_count(variables_get($fps))` | Dynamic code |
| `fps_is_pressed` | Value | VAR(field_variable) | `fps_is_pressed(variables_get($fps))` | Dynamic code |
| `fps_capture` | Value | VAR(field_variable), QUALITY(dropdown) | `fps_capture(variables_get($fps), true)` | Dynamic code |
| `fps_identify` | Value | VAR(field_variable) | `fps_identify(variables_get($fps))` | Dynamic code |
| `fps_verify` | Value | VAR(field_variable), ID(input_value) | `fps_verify(variables_get($fps), math_number(0))` | Dynamic code |
| `fps_check_enrolled` | Value | VAR(field_variable), ID(input_value) | `fps_check_enrolled(variables_get($fps), math_number(0))` | Dynamic code |
| `fps_enroll_start` | Value | VAR(field_variable), ID(input_value) | `fps_enroll_start(variables_get($fps), math_number(0))` | Dynamic code |
| `fps_enroll_step` | Value | VAR(field_variable), STEP(dropdown) | `fps_enroll_step(variables_get($fps), Enroll1)` | Dynamic code |
| `fps_delete_id` | Statement | VAR(field_variable), ID(input_value) | `fps_delete_id(variables_get($fps), math_number(0))` | Dynamic code |
| `fps_delete_all` | Statement | VAR(field_variable) | `fps_delete_all(variables_get($fps))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| STATE | true, false | fps_led |
| QUALITY | true, false | fps_capture |
| STEP | Enroll1, Enroll2, Enroll3 | fps_enroll_step |

## ABS Examples

### Basic Usage
```
arduino_setup()
    fps_init("fps", 4, 5)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, fps_enroll_count(variables_get($fps)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `fps_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

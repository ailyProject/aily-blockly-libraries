# SparkFun TTL Fingerprint Scanner

GT-511C3/GT-521F TTL 指纹模块 ABS 参考。

## Library Info
- **Name**: @aily-project/lib-sparkfun-fingerprint-scanner-ttl
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `fps_init` | Statement | VAR(field_input), RX(field_number), TX(field_number) | `fps_init("fps", 4, 5)` | `FPS_GT511C3 fps(4, 5); fps.Open();` |
| `fps_led` | Statement | VAR(field_variable), STATE(dropdown) | `fps_led($fps, true)` | `fps.SetLED(true);` |
| `fps_enroll_count` | Value(Number) | VAR(field_variable) | `fps_enroll_count($fps)` | `fps.GetEnrollCount()` |
| `fps_is_pressed` | Value(Boolean) | VAR(field_variable) | `fps_is_pressed($fps)` | `fps.IsPressFinger()` |
| `fps_capture` | Value(Boolean) | VAR(field_variable), QUALITY(dropdown) | `fps_capture($fps, true)` | `fps.CaptureFinger(true)` |
| `fps_identify` | Value(Number) | VAR(field_variable) | `fps_identify($fps)` | `fps.Identify1_N()` |
| `fps_verify` | Value(Number) | VAR(field_variable), ID(input_value) | `fps_verify($fps, math_number(0))` | `fps.Verify1_1(id)` |
| `fps_check_enrolled` | Value(Boolean) | VAR(field_variable), ID(input_value) | `fps_check_enrolled($fps, math_number(0))` | `fps.CheckEnrolled(id)` |
| `fps_enroll_start` | Value(Number) | VAR(field_variable), ID(input_value) | `fps_enroll_start($fps, math_number(0))` | `fps.EnrollStart(id)` |
| `fps_enroll_step` | Value(Number) | VAR(field_variable), STEP(dropdown) | `fps_enroll_step($fps, Enroll1)` | `fps.Enroll1()` |
| `fps_delete_id` | Statement | VAR(field_variable), ID(input_value) | `fps_delete_id($fps, math_number(0))` | `fps.DeleteID(id);` |
| `fps_delete_all` | Statement | VAR(field_variable) | `fps_delete_all($fps)` | `fps.DeleteAll();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| STATE | true, false | LED 开/关 |
| QUALITY | true, false | 高质量采集或快速采集 |
| STEP | Enroll1, Enroll2, Enroll3 | 三次录入扫描步骤 |

## ABS Examples

```text
arduino_setup()
    fps_init("fps", 4, 5)
    fps_led($fps, true)
    serial_begin(Serial, 9600)

arduino_loop()
    controls_if()
        @IF0: fps_is_pressed($fps)
        @DO0:
            fps_capture($fps, false)
            serial_println(Serial, fps_identify($fps))
```

## Notes

1. `fps_init("name", rx, tx)` creates variable `$name`.
2. Identification normally requires `fps_capture` first.
3. Enroll flow is `fps_enroll_start` then `fps_enroll_step` for Enroll1, Enroll2, Enroll3.
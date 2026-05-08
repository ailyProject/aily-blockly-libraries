# SparkFun SevSeg

七段数码管 ABS 参考。

## Library Info
- **Name**: @aily-project/lib-sparkfun-sevseg
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sevseg_init` | Statement | VAR(field_input), MODE(dropdown), DIGITS(input_value), D1-D4(input_value), A-DP(input_value), BRIGHTNESS(input_value) | `sevseg_init("display", COMMON_CATHODE, math_number(4), ...)` | `SevSeg display; display.Begin(...); display.SetBrightness(...);` |
| `sevseg_display_text` | Statement | VAR(field_variable), TEXT(input_value), DECIMAL(input_value) | `sevseg_display_text($display, text("1234"), math_number(0))` | `sevsegDisplayText(display, String(text), decimal);` |
| `sevseg_set_brightness` | Statement | VAR(field_variable), BRIGHTNESS(input_value) | `sevseg_set_brightness($display, math_number(80))` | `display.SetBrightness(80);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | COMMON_CATHODE, COMMON_ANODE | 数码管公共端类型 |

## ABS Examples

```text
arduino_setup()
    sevseg_init("display", COMMON_CATHODE, math_number(4), math_number(2), math_number(3), math_number(4), math_number(5), math_number(6), math_number(7), math_number(8), math_number(9), math_number(10), math_number(11), math_number(12), math_number(13), math_number(100))

arduino_loop()
    sevseg_display_text($display, text("1234"), math_number(0))
    time_delay(math_number(5))
```

## Notes

1. `sevseg_init("name", ...)` creates variable `$name`.
2. Display refresh is multiplexed; call `sevseg_display_text` repeatedly in `arduino_loop()`.
3. `DECIMAL` uses the original library decimal-place convention.
# Color recognition library

Color recognition sensor library, supports Arduino UNO, MEGA and other development boards

## Library Info
- **Name**: @aily-project/lib-tcs34725
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tcs34725_init` | Statement | TCS34725NAME(field_variable) | `tcs34725_init(variables_get($tcs))` | Dynamic code |
| `tcs34725_led_ctrl` | Statement | TCS34725NAME(field_variable), TCSLEDSTATE(dropdown) | `tcs34725_led_ctrl(variables_get($tcs), false)` | Dynamic code |
| `tcs34725_get_rgb` | Statement | TCS34725NAME(field_variable) | `tcs34725_get_rgb(variables_get($tcs))` | Dynamic code |
| `tcs34725_rgb_value` | Value | TCSRGBVALUE(dropdown) | `tcs34725_rgb_value(red)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TCSLEDSTATE | false, true | tcs34725_led_ctrl |
| TCSRGBVALUE | red, green, blue | tcs34725_rgb_value |

## ABS Examples

### Basic Usage
```
arduino_setup()
    tcs34725_init(variables_get($tcs))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, tcs34725_rgb_value(red))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

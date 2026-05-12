# GPIO expansion board

Emakefun GPIO expansion board library supports 8-channel GPIO, ADC, PWM and servo control

## Library Info
- **Name**: @aily-project/lib-emakefun-gpio-expansion
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `gpio_expansion_board_init` | Statement | VAR(field_input), I2C_ADDR(field_input) | `gpio_expansion_board_init("gpioBoard", "0x24")` | Dynamic code |
| `gpio_expansion_board_set_mode` | Statement | VAR(field_variable), PIN(dropdown), MODE(dropdown) | `gpio_expansion_board_set_mode(variables_get($gpioBoard), "0", "1")` | Dynamic code |
| `gpio_expansion_board_set_level` | Statement | VAR(field_variable), PIN(dropdown), LEVEL(dropdown) | `gpio_expansion_board_set_level(variables_get($gpioBoard), "0", "0")` | Dynamic code |
| `gpio_expansion_board_get_level` | Value | VAR(field_variable), PIN(dropdown) | `gpio_expansion_board_get_level(variables_get($gpioBoard), "0")` | Dynamic code |
| `gpio_expansion_board_get_adc` | Value | VAR(field_variable), PIN(dropdown) | `gpio_expansion_board_get_adc(variables_get($gpioBoard), "0")` | Dynamic code |
| `gpio_expansion_board_set_pwm_frequency` | Statement | VAR(field_variable), FREQUENCY(input_value) | `gpio_expansion_board_set_pwm_frequency(variables_get($gpioBoard), math_number(0))` | Dynamic code |
| `gpio_expansion_board_set_pwm_duty` | Statement | VAR(field_variable), PIN(dropdown), DUTY(input_value) | `gpio_expansion_board_set_pwm_duty(variables_get($gpioBoard), "1", math_number(0))` | Dynamic code |
| `gpio_expansion_board_set_servo_angle` | Statement | VAR(field_variable), PIN(dropdown), ANGLE(input_value) | `gpio_expansion_board_set_servo_angle(variables_get($gpioBoard), "1", math_number(90))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PIN | 0, 1, 2, 3, 4, 5, 6, 7 | gpio_expansion_board_set_mode, gpio_expansion_board_set_level, gpio_expansion_board_get_level |
| MODE | 1, 2, 4, 8, 16, 32 | gpio_expansion_board_set_mode |
| LEVEL | 0, 1 | gpio_expansion_board_set_level |
| PIN | 1, 2 | gpio_expansion_board_set_pwm_duty, gpio_expansion_board_set_servo_angle |

## ABS Examples

### Basic Usage
```
arduino_setup()
    gpio_expansion_board_init("gpioBoard", "0x24")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, gpio_expansion_board_get_level(variables_get($gpioBoard), "0"))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `gpio_expansion_board_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

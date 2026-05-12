# Yahboom four-way motor driver

Yahboom four-way motor drive module supports I2C and serial communication methods, and can control 520/310/TT code/TT DC motors

## Library Info
- **Name**: @aily-project/lib-yahboom-quad-motor-driver
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `yahboom_md_iic_init` | Statement | VAR(field_input), ADDR(dropdown), MOTOR_TYPE(dropdown) | `yahboom_md_iic_init("motor", "0x26", MOTOR_520)` | Dynamic code |
| `yahboom_md_iic_set_deadzone` | Statement | VAR(field_variable), DEADZONE(input_value) | `yahboom_md_iic_set_deadzone(variables_get($motor), math_number(0))` | Dynamic code |
| `yahboom_md_iic_set_pulse_line` | Statement | VAR(field_variable), LINE(input_value) | `yahboom_md_iic_set_pulse_line(variables_get($motor), math_number(0))` | Dynamic code |
| `yahboom_md_iic_set_pulse_phase` | Statement | VAR(field_variable), PHASE(input_value) | `yahboom_md_iic_set_pulse_phase(variables_get($motor), math_number(0))` | Dynamic code |
| `yahboom_md_iic_set_wheel_diameter` | Statement | VAR(field_variable), DIAMETER(input_value) | `yahboom_md_iic_set_wheel_diameter(variables_get($motor), math_number(0))` | Dynamic code |
| `yahboom_md_iic_control_speed` | Statement | VAR(field_variable), M1(input_value), M2(input_value), M3(input_value), M4(input_value) | `yahboom_md_iic_control_speed(variables_get($motor), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `yahboom_md_iic_control_pwm` | Statement | VAR(field_variable), M1(input_value), M2(input_value), M3(input_value), M4(input_value) | `yahboom_md_iic_control_pwm(variables_get($motor), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `yahboom_md_iic_encoder_offset` | Value | VAR(field_variable), MOTOR(dropdown) | `yahboom_md_iic_encoder_offset(variables_get($motor), "0")` | + varName + |
| `yahboom_md_iic_encoder_total` | Value | VAR(field_variable), MOTOR(dropdown) | `yahboom_md_iic_encoder_total(variables_get($motor), "0")` | + varName + |
| `yahboom_md_usart_init` | Statement | VAR(field_input), SERIAL(dropdown), MOTOR_TYPE(dropdown) | `yahboom_md_usart_init("motor", SERIAL, MOTOR_520)` | Dynamic code |
| `yahboom_md_usart_set_deadzone` | Statement | VAR(field_variable), DEADZONE(input_value) | `yahboom_md_usart_set_deadzone(variables_get($motor), math_number(0))` | Dynamic code |
| `yahboom_md_usart_set_pulse_line` | Statement | VAR(field_variable), LINE(input_value) | `yahboom_md_usart_set_pulse_line(variables_get($motor), math_number(0))` | Dynamic code |
| `yahboom_md_usart_set_pulse_phase` | Statement | VAR(field_variable), PHASE(input_value) | `yahboom_md_usart_set_pulse_phase(variables_get($motor), math_number(0))` | Dynamic code |
| `yahboom_md_usart_set_wheel_diameter` | Statement | VAR(field_variable), DIAMETER(input_value) | `yahboom_md_usart_set_wheel_diameter(variables_get($motor), math_number(0))` | Dynamic code |
| `yahboom_md_usart_set_pid` | Statement | VAR(field_variable), P(input_value), I(input_value), D(input_value) | `yahboom_md_usart_set_pid(variables_get($motor), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `yahboom_md_usart_set_upload_data` | Statement | VAR(field_variable), ALL_ENCODER(dropdown), TEN_ENCODER(dropdown), SPEED(dropdown) | `yahboom_md_usart_set_upload_data(variables_get($motor), false, false, false)` | Dynamic code |
| `yahboom_md_usart_control_speed` | Statement | VAR(field_variable), M1(input_value), M2(input_value), M3(input_value), M4(input_value) | `yahboom_md_usart_control_speed(variables_get($motor), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `yahboom_md_usart_control_pwm` | Statement | VAR(field_variable), M1(input_value), M2(input_value), M3(input_value), M4(input_value) | `yahboom_md_usart_control_pwm(variables_get($motor), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `yahboom_md_usart_data_available` | Value | VAR(field_variable) | `yahboom_md_usart_data_available(variables_get($motor))` | Dynamic code |
| `yahboom_md_usart_parse_data` | Statement | VAR(field_variable) | `yahboom_md_usart_parse_data(variables_get($motor))` | Dynamic code |
| `yahboom_md_usart_encoder_offset` | Value | VAR(field_variable), MOTOR(dropdown) | `yahboom_md_usart_encoder_offset(variables_get($motor), "0")` | Dynamic code |
| `yahboom_md_usart_encoder_total` | Value | VAR(field_variable), MOTOR(dropdown) | `yahboom_md_usart_encoder_total(variables_get($motor), "0")` | Dynamic code |
| `yahboom_md_usart_speed` | Value | VAR(field_variable), MOTOR(dropdown) | `yahboom_md_usart_speed(variables_get($motor), "0")` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDR | 0x26, 0x27, 0x28, 0x29 | yahboom_md_iic_init |
| MOTOR_TYPE | MOTOR_520, MOTOR_310, MOTOR_TT_ENCODER, MOTOR_TT, MOTOR_520_L | yahboom_md_iic_init, yahboom_md_usart_init |
| MOTOR | 0, 1, 2, 3 | yahboom_md_iic_encoder_offset, yahboom_md_iic_encoder_total, yahboom_md_usart_encoder_offset |
| ALL_ENCODER | false, true | yahboom_md_usart_set_upload_data |
| TEN_ENCODER | false, true | yahboom_md_usart_set_upload_data |
| SPEED | false, true | yahboom_md_usart_set_upload_data |

## ABS Examples

### Basic Usage
```
arduino_setup()
    yahboom_md_iic_init("motor", "0x26", MOTOR_520)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, yahboom_md_iic_encoder_offset(variables_get($motor), "0"))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `yahboom_md_iic_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# Emakefun remote control handle

Emakefun remote controller library supports buttons, joysticks, gyroscopes and 2.4G/BLE wireless communication

## Library Info
- **Name**: @aily-project/lib-emakefun-gamepad
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `emakefun_gamepad_initialize` | Statement | VAR(field_input), ENABLE_GYRO(dropdown) | `emakefun_gamepad_initialize("gamepad", true)` | Dynamic code |
| `emakefun_gamepad_model_create` | Statement | VAR(field_input) | `emakefun_gamepad_model_create("gamepadModel")` | Dynamic code |
| `emakefun_gamepad_attach_model` | Statement | GAMEPAD(field_variable), MODEL(field_variable) | `emakefun_gamepad_attach_model(variables_get($gamepad), variables_get($gamepadModel))` | Dynamic code |
| `emakefun_gamepad_model_add_observer` | Statement | MODEL(field_variable), OBSERVER(field_variable) | `emakefun_gamepad_model_add_observer(variables_get($gamepadModel), variables_get($publisher))` | Dynamic code |
| `emakefun_gamepad_button_pressed` | Statement | MODEL(field_variable), BUTTON(dropdown), HANDLER(input_statement) | `emakefun_gamepad_button_pressed(variables_get($gamepadModel), "0") @HANDLER: child_block()` | Dynamic code |
| `emakefun_gamepad_button_released` | Statement | MODEL(field_variable), BUTTON(dropdown), HANDLER(input_statement) | `emakefun_gamepad_button_released(variables_get($gamepadModel), "0") @HANDLER: child_block()` | Dynamic code |
| `emakefun_gamepad_get_button_state` | Value | MODEL(field_variable), BUTTON(dropdown) | `emakefun_gamepad_get_button_state(variables_get($gamepadModel), "0")` | Dynamic code |
| `emakefun_gamepad_get_joystick_x` | Value | MODEL(field_variable) | `emakefun_gamepad_get_joystick_x(variables_get($gamepadModel))` | Dynamic code |
| `emakefun_gamepad_get_joystick_y` | Value | MODEL(field_variable) | `emakefun_gamepad_get_joystick_y(variables_get($gamepadModel))` | Dynamic code |
| `emakefun_gamepad_get_gravity_x` | Value | MODEL(field_variable) | `emakefun_gamepad_get_gravity_x(variables_get($gamepadModel))` | Dynamic code |
| `emakefun_gamepad_get_gravity_y` | Value | MODEL(field_variable) | `emakefun_gamepad_get_gravity_y(variables_get($gamepadModel))` | Dynamic code |
| `emakefun_gamepad_get_gravity_z` | Value | MODEL(field_variable) | `emakefun_gamepad_get_gravity_z(variables_get($gamepadModel))` | Dynamic code |
| `emakefun_gamepad_new_joystick_coordinate` | Value | MODEL(field_variable) | `emakefun_gamepad_new_joystick_coordinate(variables_get($gamepadModel))` | Dynamic code |
| `emakefun_gamepad_new_gravity_acceleration` | Value | MODEL(field_variable) | `emakefun_gamepad_new_gravity_acceleration(variables_get($gamepadModel))` | Dynamic code |
| `emakefun_gamepad_publisher_rf24_create` | Statement | VAR(field_input), CE_PIN(input_value), CS_PIN(input_value), CHANNEL(input_value), ADDR_WIDTH(input_value), ADDRESS(input_value) | `emakefun_gamepad_publisher_rf24_create("publisher", math_number(2), math_number(2), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `emakefun_gamepad_subscriber_rf24_create` | Statement | VAR(field_input), CE_PIN(input_value), CS_PIN(input_value), CHANNEL(input_value), ADDR_WIDTH(input_value), ADDRESS(input_value) | `emakefun_gamepad_subscriber_rf24_create("subscriber", math_number(2), math_number(2), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `emakefun_gamepad_subscriber_rf24_attach_model` | Statement | SUBSCRIBER(field_variable), MODEL(field_variable) | `emakefun_gamepad_subscriber_rf24_attach_model(variables_get($subscriber), variables_get($gamepadModel))` | Dynamic code |
| `emakefun_gamepad_publisher_ble_create` | Statement | VAR(field_input), SERIAL(dropdown) | `emakefun_gamepad_publisher_ble_create("publisher", SERIAL)` | Dynamic code |
| `emakefun_gamepad_subscriber_ble_create` | Statement | VAR(field_input), SERIAL(dropdown) | `emakefun_gamepad_subscriber_ble_create("subscriber", SERIAL)` | Dynamic code |
| `emakefun_gamepad_subscriber_ble_attach_model` | Statement | SUBSCRIBER(field_variable), MODEL(field_variable) | `emakefun_gamepad_subscriber_ble_attach_model(variables_get($subscriber), variables_get($gamepadModel))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ENABLE_GYRO | true, false | emakefun_gamepad_initialize |
| BUTTON | 0, 1, 2, 3, 4, 5, 6, 7, 8 | emakefun_gamepad_button_pressed, emakefun_gamepad_button_released, emakefun_gamepad_get_button_state |

## ABS Examples

### Basic Usage
```
arduino_setup()
    emakefun_gamepad_model_create("gamepadModel")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, emakefun_gamepad_get_button_state(variables_get($gamepadModel), "0"))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `emakefun_gamepad_initialize("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

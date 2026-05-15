# Arduino Rotary Encoder Library

The Arduino rotary encoder driver library supports I2C communication, rotation direction recognition, step counting, and key detection (with key encoder). It has fast response speed and is compatible with a variety of...

## Library Info
- **Name**: @aily-project/lib-encoder
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `encoder_init` | Statement | ENCODER(field_variable), PIN_A(dropdown), PIN_B(dropdown) | `encoder_init(variables_get($encoder1), PIN_A, PIN_B)` | Dynamic code |
| `encoder_set_property` | Statement | ENCODER(field_variable), PROPERTY(dropdown), VALUE(input_value) | `encoder_set_property(variables_get($encoder1), position, math_number(0))` | Dynamic code |
| `encoder_value_changed` | Value | (none) | `encoder_value_changed()` | encoderDirection != 0 |
| `encoder_state_change` | Statement | STATE(dropdown), DO(input_statement) | `encoder_state_change(LEFT) @DO: child_block()` | Dynamic code |
| `encoder_get_property` | Value | ENCODER(field_variable), PROPERTY(dropdown) | `encoder_get_property(variables_get($encoder1), POSITION)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PROPERTY | position, upper_limit, lower_limit | encoder_set_property |
| STATE | LEFT, RIGHT, ABOVE_LIMIT, BELOW_LIMIT | encoder_state_change |
| PROPERTY | POSITION, DIRECTION, UPPER_LIMIT, LOWER_LIMIT | encoder_get_property |

## ABS Examples

### Basic Usage
```
arduino_setup()
    encoder_init(variables_get($encoder1), PIN_A, PIN_B)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, encoder_value_changed())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

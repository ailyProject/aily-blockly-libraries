# ESP32 Rotary Encoder Library

The ESP32 rotary encoder driver library is suitable for esp32. Through I2C communication, it can realize efficient collection and processing of rotary encoder signals and simplify the encoder application development p...

## Library Info
- **Name**: @aily-project/lib-esp32-encoder
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `rotary_encoder_init` | Statement | CLK_PIN(field_number), DT_PIN(field_number), SW_PIN(field_number) | `rotary_encoder_init(6, 7, 8)` | Dynamic code |
| `rotary_encoder_read` | Value | (none) | `rotary_encoder_read()` | displayPos |
| `rotary_encoder_value_changed` | Value | (none) | `rotary_encoder_value_changed()` | positionChanged |
| `rotary_encoder_state_change` | Statement | STATE(dropdown), DO(input_statement) | `rotary_encoder_state_change(CHANGED) @DO: child_block()` | Dynamic code |
| `rotary_encoder_get_property` | Value | PROPERTY(dropdown) | `rotary_encoder_get_property(POSITION)` | Dynamic code |
| `rotary_encoder_set_property` | Statement | PROPERTY(dropdown), VALUE(input_value) | `rotary_encoder_set_property(POSITION, math_number(0))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| STATE | CHANGED, LEFT, RIGHT, ABOVE_LIMIT, BELOW_LIMIT | rotary_encoder_state_change |
| PROPERTY | POSITION, DIRECTION, INCREMENT, UPPER_LIMIT, LOWER_LIMIT | rotary_encoder_get_property |
| PROPERTY | POSITION, INCREMENT, UPPER_LIMIT, LOWER_LIMIT | rotary_encoder_set_property |

## ABS Examples

### Basic Usage
```
arduino_setup()
    rotary_encoder_init(6, 7, 8)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, rotary_encoder_read())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

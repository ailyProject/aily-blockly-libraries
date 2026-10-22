# Non-contact Level

SEN0715 miniature non-contact liquid level sensor with digital output.

## Library Info
- **Name**: @aily-project/lib-dfrobot-sen0715
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sen0715_init` | Statement | VAR(field_input), PIN(dropdown) | `sen0715_init("liquid", 4)` | `pinMode(liquid_pin, INPUT);` |
| `sen0715_detected` | Value | VAR(field_variable) | `sen0715_detected($liquid)` | `digitalRead(liquid_pin) == HIGH` |
| `sen0715_read` | Value | VAR(field_variable) | `sen0715_read($liquid)` | `digitalRead(liquid_pin)` |

## ABS Examples

### Basic Usage
```
arduino_setup()
    sen0715_init("liquid", 4)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, sen0715_detected($liquid))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `sen0715_init` creates a Blockly variable. Use `$varName` only for field_variable slots; input_value slots must use the explicit `variables_get($varName)` block.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(true/false)`, variables, or nested value blocks.
4. **Pin**: the example uses digital pin 4. Select a valid pin for your board and connect the sensor OUT wire to that pin.

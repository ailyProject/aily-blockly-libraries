# SparkFun Qwiic Relay

Blockly wrapper for SparkFun Qwiic Relay (single and quad relay modules).

## Library Info
- **Name**: @aily-project/lib-sparkfun-qwiic-relay
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `qwiic_relay_init` | Statement | VAR(field_input), ADDR(dropdown) | `qwiic_relay_init("relay", SINGLE_RELAY_DEFAULT_ADDRESS)` | Dynamic code |
| `qwiic_relay_on` | Statement | VAR(field_variable) | `qwiic_relay_on(variables_get($relay))` | Dynamic code |
| `qwiic_relay_off` | Statement | VAR(field_variable) | `qwiic_relay_off(variables_get($relay))` | Dynamic code |
| `qwiic_relay_toggle` | Statement | VAR(field_variable) | `qwiic_relay_toggle(variables_get($relay))` | Dynamic code |
| `qwiic_relay_on_num` | Statement | VAR(field_variable), NUM(input_value) | `qwiic_relay_on_num(variables_get($relay), math_number(0))` | Dynamic code |
| `qwiic_relay_off_num` | Statement | VAR(field_variable), NUM(input_value) | `qwiic_relay_off_num(variables_get($relay), math_number(0))` | Dynamic code |
| `qwiic_relay_all_on` | Statement | VAR(field_variable) | `qwiic_relay_all_on(variables_get($relay))` | Dynamic code |
| `qwiic_relay_all_off` | Statement | VAR(field_variable) | `qwiic_relay_all_off(variables_get($relay))` | Dynamic code |
| `qwiic_relay_get_state` | Value | VAR(field_variable) | `qwiic_relay_get_state(variables_get($relay))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDR | SINGLE_RELAY_DEFAULT_ADDRESS, QUAD_RELAY_DEFAULT_ADDRESS | qwiic_relay_init |

## ABS Examples

### Basic Usage
```
arduino_setup()
    qwiic_relay_init("relay", SINGLE_RELAY_DEFAULT_ADDRESS)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, qwiic_relay_get_state(variables_get($relay)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `qwiic_relay_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

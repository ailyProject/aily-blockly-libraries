# CapacitiveSensor

Capacitive touch sensor library providing touch sensing readouts and auto-calibration configuration blocks

## Library Info
- **Name**: @aily-project/lib-capacitive-sensor
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `capacitivesensor_create` | Statement | VAR(field_input), SEND(dropdown), RECV(dropdown) | `capacitivesensor_create("sensor", SEND, RECV)` | Dynamic code |
| `capacitivesensor_read` | Value | VAR(field_variable), SAMPLES(input_value) | `capacitivesensor_read(variables_get($sensor), math_number(0))` | Dynamic code |
| `capacitivesensor_read_raw` | Value | VAR(field_variable), SAMPLES(input_value) | `capacitivesensor_read_raw(variables_get($sensor), math_number(0))` | Dynamic code |
| `capacitivesensor_set_timeout` | Statement | VAR(field_variable), TIMEOUT(input_value) | `capacitivesensor_set_timeout(variables_get($sensor), math_number(1000))` | Dynamic code |
| `capacitivesensor_set_autocal` | Statement | VAR(field_variable), INTERVAL(input_value) | `capacitivesensor_set_autocal(variables_get($sensor), math_number(1000))` | Dynamic code |
| `capacitivesensor_reset_autocal` | Statement | VAR(field_variable) | `capacitivesensor_reset_autocal(variables_get($sensor))` | Dynamic code |
| `capacitivesensor_wiring_hint` | Statement | (none) | `capacitivesensor_wiring_hint()` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    capacitivesensor_create("sensor", SEND, RECV)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, capacitivesensor_read(variables_get($sensor), math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `capacitivesensor_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Dynamic fields**: `capacitivesensor_wiring_hint` may add fields at runtime through Blockly extensions.

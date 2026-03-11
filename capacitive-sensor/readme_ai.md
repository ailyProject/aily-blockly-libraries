# CapacitiveSensor

电容触摸传感器库，提供触摸感应读数和自动校准配置块

## Library Info
- **Name**: @aily-project/lib-capacitive_sensor
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `capacitivesensor_create` | Statement | VAR(field_input), SEND(dropdown), RECV(dropdown) | `capacitivesensor_create("sensor", SEND, RECV)` | — |
| `capacitivesensor_read` | Value | VAR(field_variable), SAMPLES(input_value) | `capacitivesensor_read(variables_get($sensor), math_number(0))` | — |
| `capacitivesensor_read_raw` | Value | VAR(field_variable), SAMPLES(input_value) | `capacitivesensor_read_raw(variables_get($sensor), math_number(0))` | — |
| `capacitivesensor_set_timeout` | Statement | VAR(field_variable), TIMEOUT(input_value) | `capacitivesensor_set_timeout(variables_get($sensor), math_number(1000))` | — |
| `capacitivesensor_set_autocal` | Statement | VAR(field_variable), INTERVAL(input_value) | `capacitivesensor_set_autocal(variables_get($sensor), math_number(1000))` | — |
| `capacitivesensor_reset_autocal` | Statement | VAR(field_variable) | `capacitivesensor_reset_autocal(variables_get($sensor))` | — |
| `capacitivesensor_wiring_hint` | Statement |  | `capacitivesensor_wiring_hint()` | — |

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

1. **Variable Creation**: `capacitivesensor_create("varName", ...)` creates variable `$varName`; reference with `variables_get($varName)`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

# 24GHz millimeter wave radar

Seeed 24GHz millimeter wave radar sensor library supports human presence detection, moving/stationary target recognition and distance measurement

## Library Info
- **Name**: @aily-project/lib-seeed-mmwave
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mmwave_init` | Statement | VAR(field_input), SERIAL_TYPE(dropdown) | `mmwave_init("radar", SOFTWARE)` | Dynamic code |
| `mmwave_update_status` | Statement | VAR(field_variable) | `mmwave_update_status(variables_get($radar))` | Dynamic code |
| `mmwave_target_is` | Value | VAR(field_variable), STATUS(dropdown) | `mmwave_target_is(variables_get($radar), NoTarget)` | Dynamic code |
| `mmwave_target_status` | Value | VAR(field_variable) | `mmwave_target_status(variables_get($radar))` | String(mmwave_targetStatusToString( |
| `mmwave_distance` | Value | VAR(field_variable) | `mmwave_distance(variables_get($radar))` | Dynamic code |
| `mmwave_set_detection` | Statement | VAR(field_variable), DISTANCE(input_value), DURATION(input_value) | `mmwave_set_detection(variables_get($radar), math_number(0), math_number(1000))` | Dynamic code |
| `mmwave_set_gate_sensitivity` | Statement | VAR(field_variable), GATE(input_value), MOVE_POWER(input_value), STATIC_POWER(input_value) | `mmwave_set_gate_sensitivity(variables_get($radar), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `mmwave_set_resolution` | Statement | VAR(field_variable), RESOLUTION(dropdown) | `mmwave_set_resolution(variables_get($radar), "0")` | Dynamic code |
| `mmwave_get_version` | Value | VAR(field_variable) | `mmwave_get_version(variables_get($radar))` | Dynamic code |
| `mmwave_reboot` | Statement | VAR(field_variable) | `mmwave_reboot(variables_get($radar))` | Dynamic code |
| `mmwave_factory_reset` | Statement | VAR(field_variable) | `mmwave_factory_reset(variables_get($radar))` | Dynamic code |
| `mmwave_engineering_mode` | Statement | VAR(field_variable), MODE(dropdown) | `mmwave_engineering_mode(variables_get($radar), ENABLE)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SERIAL_TYPE | SOFTWARE, SERIAL1, SERIAL2 | mmwave_init |
| STATUS | NoTarget, MovingTarget, StaticTarget, BothTargets | mmwave_target_is |
| RESOLUTION | 0, 1 | mmwave_set_resolution |
| MODE | ENABLE, DISABLE | mmwave_engineering_mode |

## ABS Examples

### Basic Usage
```
arduino_setup()
    mmwave_init("radar", SOFTWARE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, mmwave_target_is(variables_get($radar), NoTarget))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `mmwave_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Dynamic fields**: `mmwave_init` may add fields at runtime through Blockly extensions.

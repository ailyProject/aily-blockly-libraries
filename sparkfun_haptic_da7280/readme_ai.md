# SparkFun Haptic Driver DA7280

Blockly wrapper for SparkFun DA7280 Haptic Driver (LRA/ERM motor control via I2C).

## Library Info
- **Name**: @aily-project/lib-sparkfun-haptic-da7280
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `haptic_da7280_init` | Statement | VAR(field_input), MOTOR_TYPE(dropdown) | `haptic_da7280_init("haptic", "0")` | Dynamic code |
| `haptic_da7280_set_mode` | Statement | VAR(field_variable), MODE(dropdown) | `haptic_da7280_set_mode(variables_get($haptic), "1")` | Dynamic code |
| `haptic_da7280_enable_accel` | Statement | VAR(field_variable), STATE(dropdown) | `haptic_da7280_enable_accel(variables_get($haptic), true)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MOTOR_TYPE | 0, 1 | haptic_da7280_init |
| MODE | 1, 3, 4, 0 | haptic_da7280_set_mode |
| STATE | true, false | haptic_da7280_enable_accel |

## ABS Examples

### Basic Usage
```
arduino_setup()
    haptic_da7280_init("haptic", "0")
    serial_begin(Serial, 9600)

arduino_loop()
    haptic_da7280_set_mode(variables_get($haptic), "1")
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `haptic_da7280_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

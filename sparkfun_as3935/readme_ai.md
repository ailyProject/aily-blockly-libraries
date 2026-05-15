# SparkFun AS3935 lightning detector

Blockly wrapper for the SparkFun AS3935 lightning detector.

## Library Info
- **Name**: @aily-project/lib-sparkfun-as3935
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `as3935_init_i2c` | Statement | VAR(field_input), ADDRESS(dropdown) | `as3935_init_i2c("as3935", "0x03")` | Wire.begin();\n |
| `as3935_init_spi` | Statement | VAR(field_input), CS(field_number) | `as3935_init_spi("as3935", 10)` | SPI.begin();\n |
| `as3935_is_ready` | Value | VAR(field_variable) | `as3935_is_ready(variables_get($as3935))` | Dynamic code |
| `as3935_set_environment` | Statement | VAR(field_variable), ENV(dropdown) | `as3935_set_environment(variables_get($as3935), INDOOR)` | Dynamic code |
| `as3935_read_interrupt` | Value | VAR(field_variable) | `as3935_read_interrupt(variables_get($as3935))` | Dynamic code |
| `as3935_distance` | Value | VAR(field_variable) | `as3935_distance(variables_get($as3935))` | Dynamic code |
| `as3935_energy` | Value | VAR(field_variable) | `as3935_energy(variables_get($as3935))` | Dynamic code |
| `as3935_set_watchdog` | Statement | VAR(field_variable), VALUE(input_value) | `as3935_set_watchdog(variables_get($as3935), math_number(0))` | Dynamic code |
| `as3935_set_noise` | Statement | VAR(field_variable), VALUE(input_value) | `as3935_set_noise(variables_get($as3935), math_number(0))` | Dynamic code |
| `as3935_set_spike` | Statement | VAR(field_variable), VALUE(input_value) | `as3935_set_spike(variables_get($as3935), math_number(0))` | Dynamic code |
| `as3935_set_lightning_threshold` | Statement | VAR(field_variable), STRIKES(dropdown) | `as3935_set_lightning_threshold(variables_get($as3935), "1")` | Dynamic code |
| `as3935_mask_disturber` | Statement | VAR(field_variable), STATE(dropdown) | `as3935_mask_disturber(variables_get($as3935), true)` | Dynamic code |
| `as3935_calibrate` | Statement | VAR(field_variable) | `as3935_calibrate(variables_get($as3935))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x03, 0x02, 0x01 | as3935_init_i2c |
| ENV | INDOOR, OUTDOOR | as3935_set_environment |
| STRIKES | 1, 5, 9, 16 | as3935_set_lightning_threshold |
| STATE | true, false | as3935_mask_disturber |

## ABS Examples

### Basic Usage
```
arduino_setup()
    as3935_init_i2c("as3935", "0x03")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, as3935_is_ready(variables_get($as3935)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `as3935_init_i2c("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

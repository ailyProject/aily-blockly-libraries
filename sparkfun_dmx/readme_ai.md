# SparkFun ESP32 DMX

Blockly wrapper for SparkFun ESP32 DMX Shield.

## Library Info
- **Name**: @aily-project/lib-sparkfun-dmx
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `dmx_init` | Statement | VAR(field_input), UART(field_number), EN(input_value), CHANNELS(input_value), DIR(dropdown) | `dmx_init("dmx", 2, math_number(0), math_number(0), DMX_WRITE_DIR)` | Dynamic code |
| `dmx_set_dir` | Statement | VAR(field_variable), DIR(dropdown) | `dmx_set_dir(variables_get($dmx), DMX_WRITE_DIR)` | Dynamic code |
| `dmx_write_byte` | Statement | VAR(field_variable), CHANNEL(input_value), VALUE(input_value) | `dmx_write_byte(variables_get($dmx), math_number(0), math_number(0))` | Dynamic code |
| `dmx_read_byte` | Value | VAR(field_variable), CHANNEL(input_value) | `dmx_read_byte(variables_get($dmx), math_number(0))` | Dynamic code |
| `dmx_data_available` | Value | VAR(field_variable) | `dmx_data_available(variables_get($dmx))` | Dynamic code |
| `dmx_update` | Statement | VAR(field_variable) | `dmx_update(variables_get($dmx))` | Dynamic code |
| `dmx_update_ok` | Value | VAR(field_variable) | `dmx_update_ok(variables_get($dmx))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DIR | DMX_WRITE_DIR, DMX_READ_DIR | dmx_init, dmx_set_dir |

## ABS Examples

### Basic Usage
```
arduino_setup()
    dmx_init("dmx", 2, math_number(0), math_number(0), DMX_WRITE_DIR)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, dmx_read_byte(variables_get($dmx), math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `dmx_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

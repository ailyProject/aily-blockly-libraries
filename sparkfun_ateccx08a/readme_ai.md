# SparkFun ATECCX08A Crypto Co-processor

Blockly wrapper for the SparkFun ATECCX08A cryptographic co-processor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-ateccx08a
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ateccx08a_init` | Statement | VAR(field_input), ADDRESS(dropdown) | `ateccx08a_init("atecc", ATECC508A_ADDRESS_DEFAULT)` | Wire.begin();\n |
| `ateccx08a_is_ready` | Value | VAR(field_variable) | `ateccx08a_is_ready(variables_get($atecc))` | Dynamic code |
| `ateccx08a_wakeup` | Value | VAR(field_variable) | `ateccx08a_wakeup(variables_get($atecc))` | Dynamic code |
| `ateccx08a_sleep` | Statement | VAR(field_variable) | `ateccx08a_sleep(variables_get($atecc))` | Dynamic code |
| `ateccx08a_read_config` | Statement | VAR(field_variable) | `ateccx08a_read_config(variables_get($atecc))` | Dynamic code |
| `ateccx08a_lock_status` | Value | VAR(field_variable), FIELD(dropdown) | `ateccx08a_lock_status(variables_get($atecc), CONFIG)` | Dynamic code |
| `ateccx08a_random` | Value | VAR(field_variable), TYPE(dropdown) | `ateccx08a_random(variables_get($atecc), BYTE)` | Dynamic code |
| `ateccx08a_update_random` | Statement | VAR(field_variable) | `ateccx08a_update_random(variables_get($atecc))` | Dynamic code |
| `ateccx08a_create_key_pair` | Value | VAR(field_variable), SLOT(input_value) | `ateccx08a_create_key_pair(variables_get($atecc), math_number(0))` | Dynamic code |
| `ateccx08a_generate_public_key` | Value | VAR(field_variable), SLOT(input_value) | `ateccx08a_generate_public_key(variables_get($atecc), math_number(0))` | Dynamic code |
| `ateccx08a_write_config_sparkfun` | Statement | VAR(field_variable) | `ateccx08a_write_config_sparkfun(variables_get($atecc))` | Dynamic code |
| `ateccx08a_lock_zone` | Statement | VAR(field_variable), ZONE(dropdown) | `ateccx08a_lock_zone(variables_get($atecc), CONFIG)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | ATECC508A_ADDRESS_DEFAULT, 0x60 | ateccx08a_init |
| FIELD | CONFIG, DATA_OTP, SLOT0 | ateccx08a_lock_status |
| TYPE | BYTE, INT, LONG | ateccx08a_random |
| ZONE | CONFIG, DATA_OTP, SLOT0 | ateccx08a_lock_zone |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ateccx08a_init("atecc", ATECC508A_ADDRESS_DEFAULT)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ateccx08a_is_ready(variables_get($atecc)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `ateccx08a_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

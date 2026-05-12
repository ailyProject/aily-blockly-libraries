# ESP32 hash calculation

ESP32 hash calculation library, supports SHA1/SHA2/SHA3 and PBKDF2 key derivation

## Library Info
- **Name**: @aily-project/lib-esp32-hash
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_hash_compute` | Value | ALGO(dropdown), DATA(input_value) | `esp32_hash_compute(SHA1, text("value"))` | Dynamic code |
| `esp32_hash_create` | Statement | VAR(field_input), ALGO(dropdown) | `esp32_hash_create("hashBuilder", SHA1)` | Dynamic code |
| `esp32_hash_begin` | Statement | VAR(field_variable) | `esp32_hash_begin(variables_get($hashBuilder))` | Dynamic code |
| `esp32_hash_add` | Statement | VAR(field_variable), DATA(input_value) | `esp32_hash_add(variables_get($hashBuilder), text("value"))` | {\n String _hashData = |
| `esp32_hash_calculate` | Statement | VAR(field_variable) | `esp32_hash_calculate(variables_get($hashBuilder))` | Dynamic code |
| `esp32_hash_result` | Value | VAR(field_variable) | `esp32_hash_result(variables_get($hashBuilder))` | Dynamic code |
| `esp32_hash_pbkdf2` | Value | ALGO(dropdown), PASSWORD(input_value), SALT(input_value), ITERATIONS(input_value) | `esp32_hash_pbkdf2(SHA256, text("value"), text("value"), math_number(0))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ALGO | SHA1, SHA224, SHA256, SHA384, SHA512, SHA3_256, SHA3_512 | esp32_hash_compute |
| ALGO | SHA1, SHA256, SHA512, SHA3_256, SHA3_512 | esp32_hash_create |
| ALGO | SHA256, SHA512 | esp32_hash_pbkdf2 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_hash_create("hashBuilder", SHA1)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_hash_compute(SHA1, text("value")))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `esp32_hash_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

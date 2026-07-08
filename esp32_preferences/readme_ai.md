# ESP32 Preferences storage

ESP32 NVS non-volatile storage library aligned with the ESP32 Arduino Preferences API, including namespaces, partitions, typed key-value data, byte blobs, type queries, and free-entry checks.

## Library Info
- **Name**: @aily-project/lib-esp32-preferences
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_preferences_begin` | Statement | NAMESPACE(input_value), READONLY(dropdown) | `esp32_preferences_begin(text("value"), false)` | Dynamic code |
| `esp32_preferences_begin_partition` | Statement | NAMESPACE(input_value), READONLY(dropdown), PARTITION(input_value) | `esp32_preferences_begin_partition(text("value"), false, text("value"))` | Dynamic code |
| `esp32_preferences_end` | Statement | (none) | `esp32_preferences_end()` | Dynamic code |
| `esp32_preferences_clear` | Statement | (none) | `esp32_preferences_clear()` | Dynamic code |
| `esp32_preferences_remove` | Statement | KEY(input_value) | `esp32_preferences_remove(text("value"))` | Dynamic code |
| `esp32_preferences_put_char` | Statement | KEY(input_value), VALUE(input_value) | `esp32_preferences_put_char(text("value"), math_number(0))` | Dynamic code |
| `esp32_preferences_put_uchar` | Statement | KEY(input_value), VALUE(input_value) | `esp32_preferences_put_uchar(text("value"), math_number(0))` | Dynamic code |
| `esp32_preferences_put_short` | Statement | KEY(input_value), VALUE(input_value) | `esp32_preferences_put_short(text("value"), math_number(0))` | Dynamic code |
| `esp32_preferences_put_ushort` | Statement | KEY(input_value), VALUE(input_value) | `esp32_preferences_put_ushort(text("value"), math_number(0))` | Dynamic code |
| `esp32_preferences_put_int` | Statement | KEY(input_value), VALUE(input_value) | `esp32_preferences_put_int(text("value"), math_number(0))` | Dynamic code |
| `esp32_preferences_put_uint` | Statement | KEY(input_value), VALUE(input_value) | `esp32_preferences_put_uint(text("value"), math_number(0))` | Dynamic code |
| `esp32_preferences_put_long` | Statement | KEY(input_value), VALUE(input_value) | `esp32_preferences_put_long(text("value"), math_number(0))` | Dynamic code |
| `esp32_preferences_put_ulong` | Statement | KEY(input_value), VALUE(input_value) | `esp32_preferences_put_ulong(text("value"), math_number(0))` | Dynamic code |
| `esp32_preferences_put_long64` | Statement | KEY(input_value), VALUE(input_value) | `esp32_preferences_put_long64(text("value"), math_number(0))` | Dynamic code |
| `esp32_preferences_put_ulong64` | Statement | KEY(input_value), VALUE(input_value) | `esp32_preferences_put_ulong64(text("value"), math_number(0))` | Dynamic code |
| `esp32_preferences_put_float` | Statement | KEY(input_value), VALUE(input_value) | `esp32_preferences_put_float(text("value"), math_number(0))` | Dynamic code |
| `esp32_preferences_put_double` | Statement | KEY(input_value), VALUE(input_value) | `esp32_preferences_put_double(text("value"), math_number(0))` | Dynamic code |
| `esp32_preferences_put_bool` | Statement | KEY(input_value), VALUE(input_value) | `esp32_preferences_put_bool(text("value"), logic_boolean(TRUE))` | Dynamic code |
| `esp32_preferences_put_string` | Statement | KEY(input_value), VALUE(input_value) | `esp32_preferences_put_string(text("value"), text("value"))` | Dynamic code |
| `esp32_preferences_put_bytes` | Statement | KEY(input_value), BUFFER(field_input), LENGTH(input_value) | `esp32_preferences_put_bytes(text("value"), "buffer", math_number(0))` | Dynamic code |
| `esp32_preferences_get_char` | Value | KEY(input_value), DEFAULT(input_value) | `esp32_preferences_get_char(text("value"), math_number(0))` | Dynamic code |
| `esp32_preferences_get_uchar` | Value | KEY(input_value), DEFAULT(input_value) | `esp32_preferences_get_uchar(text("value"), math_number(0))` | Dynamic code |
| `esp32_preferences_get_short` | Value | KEY(input_value), DEFAULT(input_value) | `esp32_preferences_get_short(text("value"), math_number(0))` | Dynamic code |
| `esp32_preferences_get_ushort` | Value | KEY(input_value), DEFAULT(input_value) | `esp32_preferences_get_ushort(text("value"), math_number(0))` | Dynamic code |
| `esp32_preferences_get_int` | Value | KEY(input_value), DEFAULT(input_value) | `esp32_preferences_get_int(text("value"), math_number(0))` | Dynamic code |
| `esp32_preferences_get_uint` | Value | KEY(input_value), DEFAULT(input_value) | `esp32_preferences_get_uint(text("value"), math_number(0))` | Dynamic code |
| `esp32_preferences_get_long` | Value | KEY(input_value), DEFAULT(input_value) | `esp32_preferences_get_long(text("value"), math_number(0))` | Dynamic code |
| `esp32_preferences_get_ulong` | Value | KEY(input_value), DEFAULT(input_value) | `esp32_preferences_get_ulong(text("value"), math_number(0))` | Dynamic code |
| `esp32_preferences_get_long64` | Value | KEY(input_value), DEFAULT(input_value) | `esp32_preferences_get_long64(text("value"), math_number(0))` | Dynamic code |
| `esp32_preferences_get_ulong64` | Value | KEY(input_value), DEFAULT(input_value) | `esp32_preferences_get_ulong64(text("value"), math_number(0))` | Dynamic code |
| `esp32_preferences_get_float` | Value | KEY(input_value), DEFAULT(input_value) | `esp32_preferences_get_float(text("value"), math_number(0))` | Dynamic code |
| `esp32_preferences_get_double` | Value | KEY(input_value), DEFAULT(input_value) | `esp32_preferences_get_double(text("value"), math_number(0))` | Dynamic code |
| `esp32_preferences_get_bool` | Value | KEY(input_value), DEFAULT(input_value) | `esp32_preferences_get_bool(text("value"), logic_boolean(TRUE))` | Dynamic code |
| `esp32_preferences_get_string` | Value | KEY(input_value), DEFAULT(input_value) | `esp32_preferences_get_string(text("value"), text("value"))` | Dynamic code |
| `esp32_preferences_get_bytes` | Value | KEY(input_value), BUFFER(field_input), MAX_LENGTH(input_value) | `esp32_preferences_get_bytes(text("value"), "buffer", math_number(0))` | Dynamic code |
| `esp32_preferences_get_string_length` | Value | KEY(input_value) | `esp32_preferences_get_string_length(text("value"))` | Dynamic code |
| `esp32_preferences_get_bytes_length` | Value | KEY(input_value) | `esp32_preferences_get_bytes_length(text("value"))` | Dynamic code |
| `esp32_preferences_is_key` | Value | KEY(input_value) | `esp32_preferences_is_key(text("value"))` | Dynamic code |
| `esp32_preferences_get_type` | Value | KEY(input_value) | `esp32_preferences_get_type(text("value"))` | Dynamic code |
| `esp32_preferences_type_constant` | Value | TYPE(dropdown) | `esp32_preferences_type_constant(PT_I8)` | Dynamic code |
| `esp32_preferences_free_entries` | Value | (none) | `esp32_preferences_free_entries()` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| READONLY | false, true | esp32_preferences_begin, esp32_preferences_begin_partition |
| TYPE | PT_I8, PT_U8, PT_I16, PT_U16, PT_I32, PT_U32, PT_I64, PT_U64, PT_STR, PT_BLOB, PT_INVALID | esp32_preferences_type_constant |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_preferences_begin(text("value"), false)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_preferences_get_char(text("value"), math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

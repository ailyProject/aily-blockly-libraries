# ESP32 Preferences storage

ESP32 NVS non-volatile memory library supports access to integers, floats, booleans and strings

## Library Info
- **Name**: @aily-project/lib-esp32-preferences
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_preferences_begin` | Statement | NAMESPACE(input_value), READONLY(dropdown) | `esp32_preferences_begin(text("value"), false)` | preferences.begin( |
| `esp32_preferences_end` | Statement | (none) | `esp32_preferences_end()` | preferences.end();\n |
| `esp32_preferences_clear` | Statement | (none) | `esp32_preferences_clear()` | preferences.clear();\n |
| `esp32_preferences_remove` | Statement | KEY(input_value) | `esp32_preferences_remove(text("value"))` | preferences.remove( |
| `esp32_preferences_put_int` | Statement | KEY(input_value), VALUE(input_value) | `esp32_preferences_put_int(text("value"), math_number(0))` | preferences.putInt( |
| `esp32_preferences_put_float` | Statement | KEY(input_value), VALUE(input_value) | `esp32_preferences_put_float(text("value"), math_number(0))` | preferences.putFloat( |
| `esp32_preferences_put_bool` | Statement | KEY(input_value), VALUE(input_value) | `esp32_preferences_put_bool(text("value"), logic_boolean(TRUE))` | preferences.putBool( |
| `esp32_preferences_put_string` | Statement | KEY(input_value), VALUE(input_value) | `esp32_preferences_put_string(text("value"), text("value"))` | preferences.putString( |
| `esp32_preferences_get_int` | Value | KEY(input_value), DEFAULT(input_value) | `esp32_preferences_get_int(text("value"), math_number(0))` | preferences.getInt( |
| `esp32_preferences_get_float` | Value | KEY(input_value), DEFAULT(input_value) | `esp32_preferences_get_float(text("value"), math_number(0))` | preferences.getFloat( |
| `esp32_preferences_get_bool` | Value | KEY(input_value), DEFAULT(input_value) | `esp32_preferences_get_bool(text("value"), logic_boolean(TRUE))` | preferences.getBool( |
| `esp32_preferences_get_string` | Value | KEY(input_value), DEFAULT(input_value) | `esp32_preferences_get_string(text("value"), text("value"))` | preferences.getString( |
| `esp32_preferences_is_key` | Value | KEY(input_value) | `esp32_preferences_is_key(text("value"))` | preferences.isKey( |
| `esp32_preferences_free_entries` | Value | (none) | `esp32_preferences_free_entries()` | preferences.freeEntries() |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| READONLY | false, true | esp32_preferences_begin |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_preferences_begin(text("value"), false)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_preferences_get_int(text("value"), math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

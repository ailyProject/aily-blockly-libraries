# Preferences

ESP32 NVS (Non-Volatile Storage) key-value data storage library.

## Library Info
- **Name**: @aily-project/lib-preferences
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `preferences_begin` | Statement | VAR(field_input), NAMESPACE(input_value), READONLY(field_dropdown) | `preferences_begin("prefs", text("myapp"), false)` | `Preferences prefs;` + `prefs.begin("myapp", false);` |
| `preferences_end` | Statement | VAR(field_variable) | `preferences_end($prefs)` | `prefs.end();` |
| `preferences_clear` | Statement | VAR(field_variable) | `preferences_clear($prefs)` | `prefs.clear();` |
| `preferences_remove` | Statement | VAR(field_variable), KEY(input_value) | `preferences_remove($prefs, text("key"))` | `prefs.remove("key");` |
| `preferences_put` | Statement | VAR(field_variable), TYPE(field_dropdown), KEY(input_value), VALUE(input_value) | `preferences_put($prefs, int, text("count"), math_number(42))` | `prefs.putInt("count", 42);` |
| `preferences_get` | Value | VAR(field_variable), TYPE(field_dropdown), KEY(input_value), DEFAULT(input_value) | `preferences_get($prefs, int, text("count"), math_number(0))` | `prefs.getInt("count", 0)` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | int, float, bool, string | Data type for put/get operations |
| READONLY | false, true | Open namespace in read-only mode |

## Notes

1. **Variable**: `preferences_begin("varName", ...)` creates variable `$varName` of type `Preferences`; reference it later with `variables_get($varName)`.
2. **Initialization**: Call `preferences_begin` inside `arduino_setup()` before any put/get operations.
3. **Namespace**: Each namespace is an isolated key-value store. Use different names to separate app data.
4. **NVS Limit**: Keys max 15 chars; namespace max 15 chars. Values persist across reboots.

## ABS Examples

### Basic Save and Read
```
arduino_setup()
    serial_begin(Serial, 115200)
    preferences_begin("prefs", text("myapp"), false)
    preferences_put($prefs, int, text("bootCount"), math_number(0))
    serial_println(Serial, preferences_get($prefs, int, text("bootCount"), math_number(0)))
    preferences_end($prefs)

arduino_loop()
    time_delay(math_number(1000))
```

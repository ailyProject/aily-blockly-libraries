# String operations

Core library, usually already integrated into the initial template

## Library Info
- **Name**: @aily-project/lib-core-string
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `string_create` | Statement | VAR(field_variable), VALUE(input_value) | `string_create(variables_get($myStr), text("value"))` | ... = ...;\n |
| `string_char_create` | Statement | VAR(field_variable), VALUE(input_value) | `string_char_create(variables_get($myChar), text("value"))` | ... = ...[0];\n |
| `string_get` | Value | VAR(field_variable) | `string_get(variables_get($myStr))` | Dynamic code |
| `string_length` | Value | STRING(input_value) | `string_length(text("value"))` | ....length() |
| `string_concat` | Value | STRING1(input_value), STRING2(input_value) | `string_concat(text("value"), text("value"))` | String(...) + String(...) |
| `string_char_at` | Value | STRING(input_value), INDEX(input_value) | `string_char_at(text("value"), math_number(0))` | ....charAt(...) |
| `string_substring` | Value | STRING(input_value), START(input_value), END(input_value) | `string_substring(text("value"), math_number(0), math_number(0))` | ....substring(..., ...) |
| `string_index_of` | Value | STRING(input_value), SEARCH(input_value) | `string_index_of(text("value"), text("value"))` | ....indexOf(...) |
| `string_equals` | Value | STRING1(input_value), STRING2(input_value) | `string_equals(text("value"), text("value"))` | ....equals(...) |
| `string_to_int` | Value | STRING(input_value) | `string_to_int(text("value"))` | ....toInt() |
| `string_to_float` | Value | STRING(input_value) | `string_to_float(text("value"))` | ....toFloat() |
| `string_replace` | Value | STRING(input_value), FIND(input_value), REPLACE(input_value) | `string_replace(text("value"), text("value"), text("value"))` | ....replace(..., ...) |
| `string_to_upper` | Value | STRING(input_value) | `string_to_upper(text("value"))` | ....toUpperCase() |
| `string_to_lower` | Value | STRING(input_value) | `string_to_lower(text("value"))` | ....toLowerCase() |
| `string_trim` | Value | STRING(input_value) | `string_trim(text("value"))` | ....trim() |
| `string_starts_with` | Value | STRING(input_value), PREFIX(input_value) | `string_starts_with(text("value"), text("value"))` | ....startsWith(...) |
| `string_ends_with` | Value | STRING(input_value), SUFFIX(input_value) | `string_ends_with(text("value"), text("value"))` | ....endsWith(...) |
| `string_literal` | Value | TEXT(field_input) | `string_literal("Hello")` | Dynamic code |
| `string_char_literal` | Value | CHAR(field_input) | `string_char_literal("A")` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    string_create(variables_get($myStr), text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, string_get(variables_get($myStr)))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

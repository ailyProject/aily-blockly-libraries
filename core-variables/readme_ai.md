# variable

Core library, usually already integrated into the initial template

## Library Info
- **Name**: @aily-project/lib-core-variables
- **Version**: 1.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `variable_define` | Statement | VAR(field_input), TYPE(dropdown), VALUE(input_value) | `variable_define("variable", int8_t, math_number(0))` | `int8_t variable = 1;` |
| `variable_define_scoped` | Statement | SCOPE(dropdown), VAR(field_input), TYPE(dropdown), VALUE(input_value) | `variable_define_scoped(global, "variable", int8_t, math_number(0))` | `int8_t variable = 1;` |
| `variable_define_advanced` | Statement | STORAGE(dropdown), QUALIFIER(dropdown), VAR(field_input), TYPE(dropdown), VALUE(input_value) | `variable_define_advanced("", "", "variable", int8_t, math_number(0))` | `int8_t variable = 1;` |
| `variable_define_advanced_scoped` | Statement | SCOPE(dropdown), STORAGE(dropdown), QUALIFIER(dropdown), VAR(field_input), TYPE(dropdown), VALUE(input_value) | `variable_define_advanced_scoped(global, "", "", "variable", int8_t, math_number(0))` | `int8_t variable = 1;` |
| `variables_get` | Value | VAR(field_variable) | `variables_get($variable)` | `variable` |
| `variables_set` | Statement | VAR(field_variable), VALUE(input_value) | `variables_set($variable, math_number(0))` | `variable = 1;` |
| `type_cast` | Value | VALUE(input_value), TYPE(dropdown) | `type_cast(math_number(0), int8_t)` | `(int8_t)1` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | int8_t, int16_t, int32_t, int64_t, uint8_t, uint16_t, uint32_t, uint64_t, ---, int, long, float, double, unsigned int, unsigned long, ---, bool, char, byte, String, ... | variable_define, variable_define_scoped, variable_define_advanced |
| SCOPE | global, local | variable_define_scoped, variable_define_advanced_scoped |
| STORAGE | , static, extern | variable_define_advanced, variable_define_advanced_scoped |
| QUALIFIER | , const, volatile, const volatile | variable_define_advanced, variable_define_advanced_scoped |

## ABS Examples

### Basic Usage
```
arduino_setup()
    variable_define("variable", int8_t, math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, variables_get($variable))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `variable_define("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **UI-only extensions**: `variables_get` and `variables_set` attach variable-context behavior only; their ABS signatures stay static.

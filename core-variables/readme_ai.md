# variable

Core library, usually already integrated into the initial template

## Library Info
- **Name**: @aily-project/lib-core-variables
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `variable_define` | Statement | VAR(field_input), TYPE(dropdown), VALUE(input_value) | `variable_define("variable", int8_t, math_number(0))` | ... ... = ...;\n |
| `variable_define_scoped` | Statement | SCOPE(dropdown), VAR(field_input), TYPE(dropdown), VALUE(input_value) | `variable_define_scoped(global, "variable", int8_t, math_number(0))` | ... ... = ...;\n |
| `variable_define_advanced` | Statement | STORAGE(dropdown), QUALIFIER(dropdown), VAR(field_input), TYPE(dropdown), VALUE(input_value) | `variable_define_advanced(STORAGE, QUALIFIER, "variable", int8_t, math_number(0))` | Dynamic code |
| `variable_define_advanced_scoped` | Statement | SCOPE(dropdown), STORAGE(dropdown), QUALIFIER(dropdown), VAR(field_input), TYPE(dropdown), VALUE(input_value) | `variable_define_advanced_scoped(global, STORAGE, QUALIFIER, "variable", int8_t, math_number(0))` | Dynamic code |
| `variables_get` | Value | VAR(field_variable) | `variables_get(variables_get($variable))` | Dynamic code |
| `variables_set` | Statement | VAR(field_variable), VALUE(input_value) | `variables_set(variables_get($variable), math_number(0))` | ... = ...;\n |
| `type_cast` | Value | VALUE(input_value), TYPE(dropdown) | `type_cast(math_number(0), int8_t)` | Dynamic code |

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
    serial_println(Serial, variables_get(variables_get($variable)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `variable_define("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Dynamic fields**: `variables_get`, `variables_set` may add fields at runtime through Blockly extensions.

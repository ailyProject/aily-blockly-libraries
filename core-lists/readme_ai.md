# array

Core library, usually already integrated into the initial template

## Library Info
- **Name**: @aily-project/lib-core-lists
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `list_create_empty` | Statement | VAR(field_input), TYPE(dropdown), LENGTH(input_value) | `list_create_empty("myList", int, math_number(0))` | Dynamic code |
| `list_create_with_values` | Statement | VAR(field_input), TYPE(dropdown), VALUES(input_value) | `list_create_with_values("myList", int, math_number(0))` | Dynamic code |
| `list_values` | Value | INPUT0(input_value) | `list_values(math_number(0))` | Dynamic code |
| `list_values_simple` | Value | LIST(field_input) | `list_values_simple("1, 2, 3")` | Dynamic code |
| `list_get` | Value | VAR(field_variable), INDEX(input_value) | `list_get(variables_get($myList), math_number(0))` | Dynamic code |
| `list_set` | Statement | VAR(field_variable), INDEX(input_value), VALUE(input_value) | `list_set(variables_get($myList), math_number(0), math_number(0))` | ...[...] = ...;\n |
| `list_length` | Value | VAR(field_variable) | `list_length(variables_get($myList))` | (sizeof(...) / sizeof(...[0])) |
| `list_find` | Value | VAR(field_variable), VALUE(input_value) | `list_find(variables_get($myList), math_number(0))` | Dynamic code |
| `list_contains` | Value | VAR(field_variable), VALUE(input_value) | `list_contains(variables_get($myList), math_number(0))` | Dynamic code |
| `list_min_max` | Value | VAR(field_variable), MODE(dropdown) | `list_min_max(variables_get($myList), min)` | Dynamic code |
| `list_sort` | Statement | VAR(field_variable), ORDER(dropdown) | `list_sort(variables_get($myList), asc)` | ...();\n |
| `list_reverse` | Statement | VAR(field_variable) | `list_reverse(variables_get($myList))` | ...();\n |
| `list_fill` | Statement | VAR(field_variable), VALUE(input_value) | `list_fill(variables_get($myList), math_number(0))` | ...(...);\n |
| `list_copy` | Statement | FROM(field_variable), TO(field_variable) | `list_copy(variables_get($myList), variables_get($copyList))` | ...();\n |
| `list_foreach` | Statement | VAR(field_variable), ITEM(field_input), DO(input_statement) | `list_foreach(variables_get($myList), "item") @DO: child_block()` | for (int _i = 0; _i < (sizeof(...) / sizeof(...[0])); _i++) { auto ... = ...[_i]; ...}\n |
| `list_foreach_index` | Statement | VAR(field_variable), INDEX(field_input), ITEM(field_input), DO(input_statement) | `list_foreach_index(variables_get($myList), "i", "item") @DO: child_block()` | for (int ... = 0; ... < (sizeof(...) / sizeof(...[0])); ...++) { auto ... = ...[...]; ...} |
| `list2d_create` | Statement | VAR(field_input), TYPE(dropdown), ROWS(input_value), COLS(input_value) | `list2d_create("matrix", int, math_number(0), math_number(0))` | Dynamic code |
| `list2d_create_with_values` | Statement | VAR(field_input), TYPE(dropdown), INPUT0(input_value) | `list2d_create_with_values("matrix", int, math_number(0))` | Dynamic code |
| `list2d_get` | Value | VAR(field_variable), ROW(input_value), COL(input_value) | `list2d_get(variables_get($matrix), math_number(0), math_number(0))` | Dynamic code |
| `list2d_set` | Statement | VAR(field_variable), ROW(input_value), COL(input_value), VALUE(input_value) | `list2d_set(variables_get($matrix), math_number(0), math_number(0), math_number(0))` | ...[...][...] = ...;\n |
| `list2d_size` | Value | VAR(field_variable), DIMENSION(dropdown) | `list2d_size(variables_get($matrix), rows)` | (sizeof(...) / sizeof(...[0])) |
| `list_shift` | Statement | VAR(field_variable), DIRECTION(dropdown) | `list_shift(variables_get($myList), left)` | ...();\n |
| `list_from_string` | Statement | VAR(field_input), TEXT(input_value) | `list_from_string("text", text("value"))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | int, unsigned int, long, unsigned long, short, unsigned short, float, double, char, unsigned char, String, byte | list_create_empty, list2d_create_with_values |
| TYPE | int, float, char, String, byte, long, double | list_create_with_values |
| MODE | min, max, sum, avg | list_min_max |
| ORDER | asc, desc | list_sort |
| TYPE | int, float, char, byte, long, double | list2d_create |
| DIMENSION | rows, cols | list2d_size |
| DIRECTION | left, right | list_shift |

## ABS Examples

### Basic Usage
```
arduino_setup()
    list_create_empty("myList", int, math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, list_values(math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `list_create_empty("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

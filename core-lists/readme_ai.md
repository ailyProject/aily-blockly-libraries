# 数组

核心库，通常已经集成到初始模板中

## Library Info
- **Name**: @aily-project/lib-core-lists
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `list_create_empty` | Statement | VAR(field_input), TYPE(dropdown), LENGTH(input_value) | `list_create_empty("myList", int, math_number(0))` | — |
| `list_create_with_values` | Statement | VAR(field_input), TYPE(dropdown), VALUES(input_value) | `list_create_with_values("myList", int, math_number(0))` | — |
| `list_values` | Value | INPUT0(input_value) | `list_values(math_number(0))` | — |
| `list_values_simple` | Value | LIST(field_input) | `list_values_simple("1, 2, 3")` | — |
| `list_get` | Value | VAR(field_variable), INDEX(input_value) | `list_get(variables_get($myList), math_number(0))` | — |
| `list_set` | Statement | VAR(field_variable), INDEX(input_value), VALUE(input_value) | `list_set(variables_get($myList), math_number(0), math_number(0))` | — |
| `list_length` | Value | VAR(field_variable) | `list_length(variables_get($myList))` | — |
| `list_find` | Value | VAR(field_variable), VALUE(input_value) | `list_find(variables_get($myList), math_number(0))` | — |
| `list_contains` | Value | VAR(field_variable), VALUE(input_value) | `list_contains(variables_get($myList), math_number(0))` | — |
| `list_min_max` | Value | VAR(field_variable), MODE(dropdown) | `list_min_max(variables_get($myList), min)` | — |
| `list_sort` | Statement | VAR(field_variable), ORDER(dropdown) | `list_sort(variables_get($myList), asc)` | — |
| `list_reverse` | Statement | VAR(field_variable) | `list_reverse(variables_get($myList))` | — |
| `list_fill` | Statement | VAR(field_variable), VALUE(input_value) | `list_fill(variables_get($myList), math_number(0))` | — |
| `list_copy` | Statement | FROM(field_variable), TO(field_variable) | `list_copy(variables_get($myList), variables_get($copyList))` | — |
| `list_foreach` | Statement | VAR(field_variable), ITEM(field_input), DO(input_statement) | `list_foreach(variables_get($myList), "item")` @DO: ... | — |
| `list_foreach_index` | Statement | VAR(field_variable), INDEX(field_input), ITEM(field_input), DO(input_statement) | `list_foreach_index(variables_get($myList), "i", "item")` @DO: ... | — |
| `list2d_create` | Statement | VAR(field_input), TYPE(dropdown), ROWS(input_value), COLS(input_value) | `list2d_create("matrix", int, math_number(0), math_number(0))` | — |
| `list2d_create_with_values` | Statement | VAR(field_input), TYPE(dropdown), INPUT0(input_value) | `list2d_create_with_values("matrix", int, math_number(0))` | — |
| `list2d_get` | Value | VAR(field_variable), ROW(input_value), COL(input_value) | `list2d_get(variables_get($matrix), math_number(0), math_number(0))` | — |
| `list2d_set` | Statement | VAR(field_variable), ROW(input_value), COL(input_value), VALUE(input_value) | `list2d_set(variables_get($matrix), math_number(0), math_number(0), math_number(0))` | — |
| `list2d_size` | Value | VAR(field_variable), DIMENSION(dropdown) | `list2d_size(variables_get($matrix), rows)` | — |
| `list_shift` | Statement | VAR(field_variable), DIRECTION(dropdown) | `list_shift(variables_get($myList), left)` | — |
| `list_from_string` | Statement | VAR(field_input), TEXT(input_value) | `list_from_string("text", text("hello"))` | — |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | int, unsigned int, long, unsigned long, short, unsigned short, float, double, char, unsigned char, String, byte | 整数 / 无符号整数 / 长整数 / 无符号长整数 / 短整数 / 无符号短整数 / 浮点数 / 双精度浮点数 / 字符 / 无符号字符 / 字符串 / 字节 |
| MODE | min, max, sum, avg | 最小值 / 最大值 / 求和 / 平均值 |
| ORDER | asc, desc | 升序 / 降序 |
| DIMENSION | rows, cols | 行数 / 列数 |
| DIRECTION | left, right | 左移 / 右移 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    list_create_empty("myList", int, math_number(0))
    list_create_with_values("myList", int, math_number(0))
    list2d_create("matrix", int, math_number(0), math_number(0))
    list2d_create_with_values("matrix", int, math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, list_values(math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `list_create_empty("varName", ...)` creates variable `$varName`; reference with `variables_get($varName)`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

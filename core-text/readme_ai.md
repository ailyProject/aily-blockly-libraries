# text manipulation

Text related functions

## Library Info
- **Name**: @aily-project/lib-core-text
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `string_add_string` | Value | STRING1(input_value), STRING2(input_value) | `string_add_string(text("value"), text("value"))` | Dynamic code |
| `array_get_dataAt` | Value | ARRAY(input_value), INDEX(input_value) | `array_get_dataAt(math_number(0), math_number(0))` | Dynamic code |
| `number_to` | Value | NUM(input_value) | `number_to(math_number(0))` | char(...) |
| `toascii` | Value | CHAR(input_value) | `toascii(text("value"))` | (int)(...) |
| `number_to_string` | Value | NUM(input_value) | `number_to_string(math_number(0))` | Dynamic code |
| `char` | Value | CHAR(field_input) | `char("CHAR")` | Dynamic code |
| `text` | Value | TEXT(field_input) | `text("TEXT")` | Dynamic code |
| `text_join` | Value | (none) | `text_join()` | Dynamic code |
| `text_create_join_container` | Hat | STACK(input_statement) | `text_create_join_container() @STACK: child_block()` | See generator |
| `text_create_join_item` | Statement | (none) | `text_create_join_item()` | See generator |
| `text_length` | Value | VALUE(input_value) | `text_length(text("value"))` | String( |
| `text_isEmpty` | Value | VALUE(input_value) | `text_isEmpty(text("value"))` | String( |
| `text_indexOf` | Value | VALUE(input_value), END(dropdown), FIND(input_value) | `text_indexOf(text("value"), FIRST, text("value"))` | String( |
| `string_endsWith` | Value | TEXT(input_value), SUFFIX(input_value) | `string_endsWith(text("value"), text("value"))` | String( |
| `string_startsWith` | Value | TEXT(input_value), PREFIX(input_value) | `string_startsWith(text("value"), text("value"))` | String( |
| `text_charAt` | Value | VALUE(input_value), WHERE(dropdown) | `text_charAt(text("value"), FROM_START)` | textRandomLetter( |
| `tt_getSubstring` | Value | STRING(input_value), WHERE1(dropdown), WHERE2(dropdown) | `tt_getSubstring(text("value"), FROM_START, FROM_START)` | Dynamic code |
| `text_changeCase` | Value | CASE(dropdown), TEXT(input_value) | `text_changeCase(UPPERCASE, text("value"))` | Dynamic code |
| `text_trim` | Value | MODE(dropdown), TEXT(input_value) | `text_trim(BOTH, text("value"))` | Dynamic code |
| `text_count` | Value | SUB(input_value), TEXT(input_value) | `text_count(text("value"), text("value"))` | textCount( |
| `text_replace` | Value | TEXT(input_value), FROM(input_value), TO(input_value) | `text_replace(text("value"), math_number(0), math_number(0))` | textReplaceAll( |
| `text_reverse` | Value | TEXT(input_value) | `text_reverse(text("value"))` | textReverse( |
| `string_to_something` | Value | TEXT(input_value), TYPE(dropdown) | `string_to_something(text("value"), toInt)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| END | FIRST, LAST | text_indexOf |
| WHERE | FROM_START, FROM_END, FIRST, LAST, RANDOM | text_charAt |
| WHERE1 | FROM_START, FROM_END, FIRST | tt_getSubstring |
| WHERE2 | FROM_START, FROM_END, LAST | tt_getSubstring |
| CASE | UPPERCASE, LOWERCASE, TITLECASE | text_changeCase |
| MODE | BOTH, LEFT, RIGHT | text_trim |
| TYPE | toInt, toLong, toFloat, toDouble, c_str, charAt0, toUpper, toLower | string_to_something |

## ABS Examples

### Basic Usage
```
arduino_setup()
    text_create_join_container() @STACK: child_block()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, string_add_string(text("value"), text("value")))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **Dynamic fields**: `char`, `text` may add fields at runtime through Blockly extensions.

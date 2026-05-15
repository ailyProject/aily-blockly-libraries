# Custom code

Supplementary tools to the standard Blockly library: advanced functions such as code insertion, macro definition, conditional compilation, function definition, pointer manipulation, etc.

## Library Info
- **Name**: @aily-project/lib-core-custom
- **Version**: 1.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `custom_code` | Statement | CODE(field_multilinetext) | `custom_code()` | Dynamic code |
| `custom_code2` | Value | CODE(field_multilinetext) | `custom_code2()` | Dynamic code |
| `custom_macro` | Statement | NAME(field_input), VALUE(field_input) | `custom_macro("LED_PIN", "13")` | #define |
| `custom_library` | Statement | LIB_NAME(field_input) | `custom_library("Wire.h")` | Dynamic code |
| `custom_function` | Hat | NAME(field_input), RETURN(dropdown), PARAMS(field_input), BODY(input_statement) | `custom_function("myFunction", void, "PARAMS") @BODY: child_block()` | Dynamic code |
| `custom_function_text` | Statement | NAME(field_input), RETURN(dropdown), PARAMS(field_input), BODY(field_multilinetext) | `custom_function_text("myFunction", void, "int x, int y")` | Dynamic code |
| `custom_function_call` | Statement | NAME(field_input), ARGS(field_input) | `custom_function_call("myFunction", "ARGS")` | Dynamic code |
| `custom_function_call_return` | Value | NAME(field_input), ARGS(field_input) | `custom_function_call_return("myFunction", "ARGS")` | Dynamic code |
| `custom_return` | Statement | VALUE(input_value) | `custom_return(math_number(0))` | return |
| `custom_return_void` | Statement | (none) | `custom_return_void()` | return;\n |
| `custom_insert_code` | Statement | POSITION(dropdown), CODE(field_multilinetext) | `custom_insert_code(macro)` | Dynamic code |
| `custom_ifdef` | Statement | MACRO(field_input), CODE(input_statement) | `custom_ifdef("DEBUG") @CODE: child_block()` | #ifdef |
| `custom_ifndef` | Statement | MACRO(field_input), CODE(input_statement) | `custom_ifndef("RELEASE") @CODE: child_block()` | #ifndef |
| `custom_ifdef_else` | Statement | MACRO(field_input), IF_CODE(input_statement), ELSE_CODE(input_statement) | `custom_ifdef_else("DEBUG") @IF_CODE: child_block() @ELSE_CODE: child_block()` | #ifdef |
| `comment` | Statement | TEXT(field_input) | `comment("注释内容")` | Dynamic code |
| `comment_multiline` | Statement | TEXT(field_multilinetext) | `comment_multiline()` | /*\n |
| `comment_wrapper` | Statement | TEXT(field_input), STATEMENTS(input_statement) | `comment_wrapper("代码区域") @STATEMENTS: child_block()` | sizeof( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| RETURN | void, int, long, float, double, bool, char, String, int*, char*, void*, uint8_t, uint16_t, uint32_t | custom_function, custom_function_text |
| POSITION | macro, library, variable, object, function | custom_insert_code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    custom_code()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, custom_code2())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

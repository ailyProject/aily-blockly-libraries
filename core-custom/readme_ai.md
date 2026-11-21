# Custom code

Supplementary tools to the standard Blockly library: advanced functions such as code insertion, macro definition, conditional compilation, function definition, pointer manipulation, etc.

## Library Info
- **Name**: @aily-project/lib-core-custom
- **Version**: 1.1.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `custom_code` | Statement | CODE(field_multilinetext) | `custom_code("// your code here")` | `// your code here` |
| `custom_code2` | Value | CODE(field_multilinetext) | `custom_code2("expression")` | `expression` |
| `custom_declaration_group` | Hat | DECLARATIONS(input_statement) | `custom_declaration_group()` | No direct code emitted when the DECLARATIONS statement input is empty. |
| `custom_macro` | Statement | NAME(field_input), VALUE(field_input) | `custom_macro("LED_PIN", "13")` | `#define LED_PIN 13` |
| `custom_library` | Statement | LIB_NAME(field_input) | `custom_library("Wire.h")` | `#include <Wire.h>` |
| `custom_function` | Hat | NAME(field_input), RETURN(dropdown), PARAMS(field_input), BODY(input_statement) | `custom_function("myFunction", void, "PARAMS")` | `void myFunction(value) { ↵ }` |
| `custom_function_text` | Statement | NAME(field_input), RETURN(dropdown), PARAMS(field_input), BODY(field_multilinetext) | `custom_function_text("myFunction", void, "int x, int y", "// function body")` | `void myFunction(int x, int y) { ↵ // function body ↵ }` |
| `custom_function_call` | Statement | NAME(field_input), ARGS(field_input) | `custom_function_call("myFunction", "ARGS")` | `myFunction(value);` |
| `custom_function_call_return` | Value | NAME(field_input), ARGS(field_input) | `custom_function_call_return("myFunction", "ARGS")` | `myFunction(value)` |
| `custom_return` | Statement | VALUE(input_value) | `custom_return(math_number(0))` | `return 0;` |
| `custom_return_void` | Statement | (none) | `custom_return_void()` | `return;` |
| `custom_insert_code` | Statement | POSITION(dropdown), CODE(field_multilinetext) | `custom_insert_code(macro, "// your code")` | `// your code` |
| `custom_ifdef` | Statement | MACRO(field_input), CODE(input_statement) | `custom_ifdef("DEBUG")` | `#ifdef DEBUG ↵ #endif // DEBUG` |
| `custom_ifndef` | Statement | MACRO(field_input), CODE(input_statement) | `custom_ifndef("RELEASE")` | `#ifndef RELEASE ↵ #endif // !RELEASE` |
| `custom_ifdef_else` | Statement | MACRO(field_input), IF_CODE(input_statement), ELSE_CODE(input_statement) | `custom_ifdef_else("DEBUG")` | `#ifdef DEBUG ↵ #else ↵ #endif // DEBUG` |
| `comment` | Statement | TEXT(field_input) | `comment("注释内容")` | `// 注释内容` |
| `comment_multiline` | Statement | TEXT(field_multilinetext) | `comment_multiline("这是一段\n多行注释")` | `/* ↵ * 这是一段 ↵ * 多行注释 ↵ */` |
| `comment_wrapper` | Statement | TEXT(field_input), STATEMENTS(input_statement) | `comment_wrapper("代码区域")` | `// ===== [BEGIN] 代码区域 ===== ↵ // ===== [END] 代码区域 =====` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| RETURN | void, int, long, float, double, bool, char, String, int*, char*, void*, uint8_t, uint16_t, uint32_t | custom_function, custom_function_text |
| POSITION | macro, library, variable, object, function | custom_insert_code |

## ABS Examples

### Group Global Declarations
```
custom_declaration_group()
    custom_macro("LED_PIN", "13")
    custom_library("Wire.h")
    custom_insert_code(variable, "int counter = 0;")
```

The macro, include, and code insertion blocks can be stacked and moved as one group.
They keep their existing generation regions and also remain valid as standalone
top-level blocks. Use the group for declarations; executable statements belong in
`arduino_setup()`, `arduino_loop()`, or a function body.

### Basic Usage
```
arduino_setup()
    custom_code("// your code here")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, custom_code2("expression"))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# 自定义代码

标准Blockly库的补充工具：代码插入、宏定义、条件编译、函数定义、指针操作等高级功能

## Library Info
- **Name**: @aily-project/lib-core-custom
- **Version**: 1.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `custom_code` | Statement | CODE(field_multilinetext) | `custom_code()` | (dynamic code) |
| `custom_code2` | Value | CODE(field_multilinetext) | `custom_code2()` | (dynamic code) |
| `custom_macro` | Statement | NAME(field_input), VALUE(field_input) | `custom_macro("LED_PIN", "13")` | `` |
| `custom_library` | Statement | LIB_NAME(field_input) | `custom_library("Wire.h")` | `` |
| `custom_function` | Statement | NAME(field_input), RETURN(dropdown), PARAMS(field_input), BODY(input_statement) | `custom_function("myFunction", void, "params")` @BODY: ... | `` |
| `custom_function_text` | Statement | NAME(field_input), RETURN(dropdown), PARAMS(field_input), BODY(field_multilinetext) | `custom_function_text("myFunction", void, "int x, int y")` | `` |
| `custom_function_call` | Statement | NAME(field_input), ARGS(field_input) | `custom_function_call("myFunction", "args")` | (dynamic code) |
| `custom_function_call_return` | Value | NAME(field_input), ARGS(field_input) | `custom_function_call_return("myFunction", "args")` | (dynamic code) |
| `custom_return` | Statement | VALUE(input_value) | `custom_return(math_number(0))` | `return` |
| `custom_return_void` | Statement | (none) | `custom_return_void()` | `return;\n` |
| `custom_insert_code` | Statement | POSITION(dropdown), CODE(field_multilinetext) | `custom_insert_code(macro)` | `` |
| `custom_ifdef` | Statement | MACRO(field_input), CODE(input_statement) | `custom_ifdef("DEBUG")` @CODE: ... | `#ifdef` |
| `custom_ifndef` | Statement | MACRO(field_input), CODE(input_statement) | `custom_ifndef("RELEASE")` @CODE: ... | `#ifndef` |
| `custom_ifdef_else` | Statement | MACRO(field_input), IF_CODE(input_statement), ELSE_CODE(input_statement) | `custom_ifdef_else("DEBUG")` @IF_CODE: ... @ELSE_CODE: ... | `#ifdef` |
| `comment` | Statement | TEXT(field_input) | `comment("注释内容")` | `//` |
| `comment_multiline` | Statement | TEXT(field_multilinetext) | `comment_multiline()` | `/*\n` |
| `comment_wrapper` | Statement | TEXT(field_input), STATEMENTS(input_statement) | `comment_wrapper("代码区域")` @STATEMENTS: ... | `// ===== [BEGIN]` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| RETURN | void, int, long, float, double, bool, char, String, int*, char*, void*, uint8_t, uint16_t, uint32_t | void / int / long / float / double / bool / char / String / int* / char* / void* / uint8_t / uint16_t / uint32_t |
| POSITION | macro, library, variable, object, function | 宏定义区 / 库引用区 / 变量定义区 / 对象定义区 / 函数定义区 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, custom_code2())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

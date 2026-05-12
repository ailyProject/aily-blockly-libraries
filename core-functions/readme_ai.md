# Custom function

Provides building blocks for defining and using custom functions, supporting multiple parameter types and return values

## Library Info
- **Name**: @aily-project/lib-core-functions
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `custom_function_def` | Hat | FUNC_NAME(field_input), RETURN_TYPE(dropdown), STACK(input_statement) | `custom_function_def("myFunction", void) @STACK: child_block()` | + returnValue + |
| `custom_function_return` | Statement | VALUE(input_value) | `custom_function_return(math_number(0))` | return |
| `custom_function_return_void` | Statement | (none) | `custom_function_return_void()` | return;\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| RETURN_TYPE | void, int8_t, int16_t, int32_t, int64_t, uint8_t, uint16_t, uint32_t, uint64_t, ---, int, long, float, double, unsigned int, unsigned long, ---, bool, char, byte, ... | custom_function_def |

## ABS Examples

### Basic Usage
```
arduino_setup()
    custom_function_return(math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    custom_function_def("myFunction", void) @STACK: child_block()
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

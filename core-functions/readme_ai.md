# Arduino Custom Functions Library

Core library for defining and calling custom functions with parameters and return values

## Library Information
- **Library Name**: @aily-project/lib-core-functions
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters | ABS Format | Generated Code |
|------------|------------|------------|------------|----------------|
| `custom_function_def` | Statement (Hat) | FUNC_NAME(field_input), RETURN_TYPE(dropdown), PARAM_TYPEn(dropdown), PARAM_NAMEn(field_input), STACK(input_statement), RETURN(input_value) | `custom_function_def("myFunc", int, int, "a", float, "b")` | `int myFunc(int a, float b) { ... }` |
| `custom_function_call` | Statement | FUNC_NAME(dropdown), INPUT0..N(input_value) | `custom_function_call(myFunc, math_number(10))` | `myFunc(10);` |
| `custom_function_call_return` | Value | FUNC_NAME(dropdown), INPUT0..N(input_value) | `custom_function_call_return(myFunc, math_number(10))` | `myFunc(10)` |
| `custom_function_return` | Statement | VALUE(input_value) | `custom_function_return(math_number(0))` | `return 0;` |
| `custom_function_return_void` | Statement | (none) | `custom_function_return_void()` | `return;` |

### Dynamic Parameters (Mutator)

`custom_function_def` uses a **mutator** (click `+` to add parameters, `-` to remove). Each parameter has a **type dropdown** and a **name text field**. In ABS, parameters are written inline after RETURN_TYPE as `TYPE, "name"` pairs. The function body is expressed as indented child statements. If RETURN_TYPE is non-void, a `custom_function_return(value)` inside the body provides the return value.

```
custom_function_def("funcName", RETURN_TYPE, TYPE, "paramName", TYPE, "paramName")
    statements
    custom_function_return(returnValue)
```

`custom_function_call` and `custom_function_call_return` automatically sync their input count with the function definition. In ABS, pass arguments positionally after the function name.

## ABS Examples

### Simple Void Function (No Parameters)
```
custom_function_def("sayHello", void)
    serial_println(Serial, text("Hello World!"))

arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    custom_function_call(sayHello)
    time_delay(math_number(2000))
```

### Function with Parameters
```
custom_function_def("setLED", void, int, "pin", int, "state")
    digital_write(variables_get($pin), variables_get($state))

arduino_setup()
    pin_mode(math_number(13), OUTPUT)

arduino_loop()
    custom_function_call(setLED, math_number(13), math_number(1))
    time_delay(math_number(1000))
    custom_function_call(setLED, math_number(13), math_number(0))
    time_delay(math_number(1000))
```

### Function with Return Value
```
custom_function_def("addNumbers", int, int, "a", int, "b")
    ;; (empty body, return handles it)
    return math_arithmetic(ADD, variables_get($a), variables_get($b))

arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, custom_function_call_return(addNumbers, math_number(3), math_number(5)))
    time_delay(math_number(1000))
```

### Function with Early Return
```
custom_function_def("checkSensor", bool, int, "pin")
    controls_if()
        @IF0: logic_compare(GT, analog_read(variables_get($pin)), math_number(512))
        @DO0:
            custom_function_return(logic_boolean(TRUE))
    custom_function_return(logic_boolean(FALSE))

arduino_loop()
    controls_if()
        @IF0: custom_function_call_return(checkSensor, math_number(0))
        @DO0:
            serial_println(Serial, text("Sensor triggered"))
```

### Void Return (Exit Early)
```
custom_function_def("processData", void, int, "value")
    controls_if()
        @IF0: logic_compare(LT, variables_get($value), math_number(0))
        @DO0:
            custom_function_return_void()
    serial_println(Serial, variables_get($value))
```

## Parameter Options

| Parameter | Available Values | Description |
|-----------|------------------|-------------|
| RETURN_TYPE | void, int8_t, int16_t, int32_t, int64_t, uint8_t, uint16_t, uint32_t, uint64_t, int, long, float, double, unsigned int, unsigned long, bool, char, byte, String, void*, size_t, unsigned char, int*, float*, char*, byte*, uint8_t*, const char*, int&, float&, String& | Function return type |
| PARAM TYPE | (same as RETURN_TYPE, excluding void) | Parameter data type |
| FUNC_NAME (def) | any text | Function name (auto-sanitized, Chinese converted to pinyin) |
| FUNC_NAME (call) | dropdown of defined functions | Select which function to call |

## Important Notes

1. **Definition Placement**: `custom_function_def` blocks are placed at the **top level** (not inside `arduino_setup` or `arduino_loop`). They generate standalone C/C++ functions.
2. **Auto Variable Registration**: Parameters defined in `custom_function_def` are automatically registered as workspace variables. Use `$paramName` (i.e., `variables_get($paramName)`) to reference them in the function body.
3. **Call Block Sync**: `custom_function_call` / `custom_function_call_return` automatically sync their input slots with the function definition. No manual parameter count adjustment needed.
4. **Return Value**: Set RETURN_TYPE to a non-void type to enable the return input. Use `custom_function_return` inside the function body. For void functions, use `custom_function_return_void` to exit early.
5. **Name Sanitization**: Chinese function/parameter names are auto-converted to pinyin. Special characters are replaced with `_`.
6. **Unique Names**: Each function definition must have a unique name. Duplicate names are auto-suffixed with a number.
7. **Two Call Block Types**: Use `custom_function_call` (statement) for void functions or when ignoring the return value. Use `custom_function_call_return` (value) when you need the return value in an expression.

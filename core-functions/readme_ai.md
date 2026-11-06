# Custom Functions

Defines typed Arduino functions and calls them with dynamically generated call blocks.

## Library Info

- **Name**: `@aily-project/lib-core-functions`
- **Version**: `1.0.2`

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `custom_function_def` | Hat | FUNC_NAME(field_input), RETURN_TYPE(dropdown), STACK(input_statement); runtime variants: returning-two-parameters: PARAM_TYPE0(dropdown), PARAM_NAME0(field_input), PARAM_TYPE1(dropdown), PARAM_NAME1(field_input), RETURN(input_value); void-one-parameter: PARAM_TYPE0(dropdown), PARAM_NAME0(field_input) | `custom_function_def("addTwo", int, int, "left", int, "right", math_arithmetic(variables_get($left), ADD, variables_get($right)))` | `void 0() { ↵ }` |
| `custom_function_return` | Statement | VALUE(input_value) | `custom_function_return(math_number(0))` | `return 1;` |
| `custom_function_return_void` | Statement | (none) | `custom_function_return_void()` | `return;` |
| `custom_function_call_advance` | Statement | FUNC_NAME(field_variable); variadic: INPUT{0...}(input_value) | `custom_function_call_advance(FUNC_NAME=$printValue, INPUT0=math_number(7))` | `myFunction();` |
| `custom_function_call_return_advance` | Value | FUNC_NAME(field_variable); variadic: INPUT{0...}(input_value) | `custom_function_call_return_advance(FUNC_NAME=$addTwo, INPUT0=math_number(2), INPUT1=math_number(3))` | `myFunction()` |

The two call blocks are defined by `generator.js` at runtime rather than by `block.json`; their serializable ABS signatures are documented in the table below and follow the same parameter rules.

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| `RETURN_TYPE` / `PARAM_TYPE` | `void`, integer types, floating-point types, `bool`, `char`, `byte`, `String`, pointer types, reference types | `RETURN_TYPE` selects the result type; each `PARAM_TYPE` selects one parameter type. |

## Dynamic Signatures

`custom_function_def` uses this positional layout:

`custom_function_def(FUNC_NAME, RETURN_TYPE, PARAM_TYPE0, PARAM_NAME0, PARAM_TYPE1, PARAM_NAME1, [more type/name pairs], RETURN)`

- Parameter type/name pairs are repeated in declaration order.
- A non-`void` definition ends with the value connected to `RETURN`.
- The indented body connects to `STACK`; it is not written as an inline `@STACK` suffix.
- Function definitions are root Hat blocks. Do not nest them inside `arduino_setup()` or `arduino_loop()`.
- Function parameters become normal value variables and are referenced as `$parameterName`.

## ABS Examples

### Function with a return value

```abs
custom_function_def("addTwo", int, int, "left", int, "right", math_arithmetic(variables_get($left), ADD, variables_get($right)))

arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, custom_function_call_return_advance(FUNC_NAME=$addTwo, INPUT0=math_number(2), INPUT1=math_number(3)))
    time_delay(math_number(1000))
```

This defines `int addTwo(int left, int right)` and prints `addTwo(2, 3)` from `loop()`.

### Void function with a statement body

```abs
custom_function_def("printValue", void, int, "value")
    serial_println(Serial, variables_get($value))

arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    custom_function_call_advance(FUNC_NAME=$printValue, INPUT0=math_number(7))
    time_delay(math_number(1000))
```

## Rules for Agents

1. Use the exact dynamic parameter order shown above; never emit placeholder calls such as `child_block()` or `...`.
2. On runtime-generated call blocks, write the function selector as `FUNC_NAME=$functionName` and every argument as the stable indexed slot `INPUT0=...`, `INPUT1=...`, and so on.
3. Match `INPUT0`, `INPUT1`, and later indexes to the definition's parameter order.
4. Use an indented child statement for a function body. Use `custom_function_return(...)` or `custom_function_return_void()` only when an explicit early return is needed.
5. `RETURN_TYPE` accepts the dropdown value stored by the block, such as `void`, `int`, `float`, `bool`, `String`, pointer types, or reference types.

Loading retains saved function model IDs and types. A partially loaded workspace is not evidence that a shared function model is unused; initialization does not delete such models. An explicit saved function ID that no longer matches its name/type is a loading error, not permission to create a replacement identity.

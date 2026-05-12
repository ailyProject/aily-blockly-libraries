# logic control

Core library for logic control

## Library Info
- **Name**: @aily-project/lib-core-logic
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `controls_if` | Statement | IF0(input_value), DO0(input_statement) | `controls_if(math_number(0)) @DO0: child_block()` | Dynamic code |
| `controls_ifelse` | Statement | IF0(input_value), DO0(input_statement), ELSE(input_statement) | `controls_ifelse(math_number(0)) @DO0: child_block() @ELSE: child_block()` | See generator |
| `controls_switch` | Statement | SWITCH(input_value), CASE0(input_value), DO0(input_statement), DEFAULT(input_statement) | `controls_switch(math_number(0), math_number(0)) @DO0: child_block() @DEFAULT: child_block()` | Dynamic code |
| `logic_compare` | Value | A(input_value), OP(dropdown), B(input_value) | `logic_compare(math_number(0), EQ, math_number(0))` | Dynamic code |
| `logic_operation` | Value | A(input_value), OP(dropdown), B(input_value) | `logic_operation(math_number(0), AND, math_number(0))` | Dynamic code |
| `logic_negate` | Value | BOOL(input_value) | `logic_negate(logic_boolean(TRUE))` | Dynamic code |
| `logic_boolean` | Value | BOOL(dropdown) | `logic_boolean(true)` | Dynamic code |
| `logic_ternary` | Value | IF(input_value), THEN(input_value), ELSE(input_value) | `logic_ternary(logic_boolean(TRUE), math_number(0), math_number(0))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| OP | EQ, NEQ, LT, GT, GTE, LTE | logic_compare |
| OP | AND, OR | logic_operation |
| BOOL | true, false | logic_boolean |

## ABS Examples

### Basic Usage
```
arduino_setup()
    controls_if(math_number(0)) @DO0: child_block()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, logic_compare(math_number(0), EQ, math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **Dynamic fields**: `controls_if`, `controls_ifelse`, `logic_operation`, `logic_ternary` may add fields at runtime through Blockly extensions.

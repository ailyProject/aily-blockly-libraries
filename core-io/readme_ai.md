# Arduino Logic Control Library

Core library for logic control and conditional operations

## Library Information
- **Library Name**: @aily-project/lib-core-logic
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters | ABS Format | Generated Code |
|------------|------------|------------|------------|----------------|
| `controls_if` | Statement | IF0(input_value), DO0(input_statement) | `controls_if() @IF0: condition @DO0: statements` | `if (condition) { statements }` |
| `controls_ifelse` | Statement | IF0(input_value), DO0(input_statement), ELSE(input_statement) | `controls_if() @IF0: condition @DO0: statements @ELSE: else_statements` | `if (condition) { statements } else { else_statements }` |
| `controls_switch` | Statement | SWITCH(input_value), CASE0(input_value), DO0(input_statement), DEFAULT(input_statement) | `controls_switch() @SWITCH: variable @CASE0: value @DO0: statements @DEFAULT: default_statements` | `switch (variable) { case value: statements; break; default: default_statements; }` |
| `logic_compare` | Value | A(input_value), OP(dropdown), B(input_value) | `logic_compare(EQ, variables_get($a), math_number(10))` | `(a == 10)` |
| `logic_operation` | Value | A(input_value), OP(dropdown), B(input_value) | `logic_operation(AND, condition1, condition2)` | `(condition1 && condition2)` |
| `logic_negate` | Value | BOOL(input_value) | `logic_negate(condition)` | `!(condition)` |
| `logic_boolean` | Value | BOOL(dropdown) | `logic_boolean(TRUE)` | `true` |
| `logic_ternary` | Value | IF(input_value), THEN(input_value), ELSE(input_value) | `logic_ternary(condition, value1, value2)` | `(condition ? value1 : value2)` |

## ABS Examples

### Multiple Else-If Conditions
> **Note**: Both `controls_if` and `controls_ifelse` blocks can be used for conditional logic. They support the same syntax for multiple else-if branches using `@IF1:`, `@IF2:`, etc.

```
variable_define("temperature", int, math_number(25))

arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    controls_if()
        @IF0: logic_compare(GT, variables_get($temperature), math_number(35))
        @DO0:
            serial_println(Serial, text("Very hot!"))
        @IF1: logic_compare(GT, variables_get($temperature), math_number(25))
        @DO1:
            serial_println(Serial, text("Warm"))
        @IF2: logic_compare(GT, variables_get($temperature), math_number(15))
        @DO2:
            serial_println(Serial, text("Cool"))
        @ELSE:
            serial_println(Serial, text("Cold"))
    time_delay(math_number(1000))
```

### Switch Case Statement
```
variable_define("dayOfWeek", int, math_number(3))

arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    controls_switch()
        @SWITCH: variables_get($dayOfWeek)
        @CASE0: math_number(1)
        @DO0:
            serial_println(Serial, text("Monday"))
        @CASE1: math_number(2)
        @DO1:
            serial_println(Serial, text("Tuesday"))
        @DEFAULT:
            serial_println(Serial, text("Other day"))
```

### Complex Logic with Negation
```
variable_define("sensor1", bool, logic_boolean(TRUE))
variable_define("sensor2", bool, logic_boolean(FALSE))

arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    controls_if()
        @IF0: logic_operation(OR,
                variables_get($sensor1),
                logic_negate(variables_get($sensor2)))
        @DO0:
            serial_println(Serial, text("Condition met"))
```

### Ternary Conditional Operator
```
arduino_setup()
    variable_define("score", int, math_number(85))
    variable_define("grade", String, logic_ternary(
        logic_compare(GTE, variables_get($score), math_number(90)),
        text("A"),
        text("B")))
    
    serial_begin(Serial, 9600)
    serial_print(Serial, text("Grade: "))
    serial_println(Serial, variables_get($grade))
```

## Parameter Options

| Parameter | Available Values | Description |
|-----------|------------------|-------------|
| Compare Operators | EQ, NE, LT, LTE, GT, GTE | Equal, Not Equal, Less Than, Less/Equal, Greater Than, Greater/Equal |
| Logic Operators | AND, OR | Logical AND, Logical OR |
| Boolean Values | TRUE, FALSE | Boolean true/false values |

## Important Notes

1. **Conditional Structure**: Use `@IF0:`, `@DO0:`, `@ELSE:` syntax for if-else blocks. For multiple conditions, use `@IF1:`, `@DO1:`, `@IF2:`, `@DO2:`, etc. for else-if branches
2. **Multiple Conditions**: Chain conditions using `logic_operation` with AND/OR
3. **Switch Cases**: Add multiple cases using `@CASE0:`, `@CASE1:`, etc., each with corresponding `@DO0:`, `@DO1:`
4. **Boolean Logic**: Combine `logic_negate` with other operations for complex conditions
5. **Ternary Operator**: Use for simple conditional value assignments
6. **Operator Precedence**: Use parentheses in complex expressions for clarity
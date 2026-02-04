# Arduino Math Library

Core library for mathematical operations and calculations

## Library Information
- **Library Name**: @aily-project/lib-core-math
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters | ABS Format | Generated Code |
|------------|------------|------------|------------|----------------|
| `math_number` | Value | NUM(field_number) | `math_number(42)` | `42` |
| `math_number_base` | Value | BASE(dropdown), NUM(field_input) | `math_number_base(HEX, "FF")` | `0xFF` |
| `math_arithmetic` | Value | A(input_value), OP(dropdown), B(input_value) | `math_arithmetic(ADD, math_number(5), math_number(3))` | `(5 + 3)` |
| `math_single` | Value | OP(dropdown), NUM(input_value) | `math_single(ROOT, math_number(16))` | `sqrt(16)` |
| `math_trig` | Value | OP(dropdown), NUM(input_value) | `math_trig(SIN, math_number(90))` | `sin(90)` |
| `math_constant` | Value | CONSTANT(dropdown) | `math_constant(PI)` | `PI` |
| `math_number_property` | Value | NUMBER(input_value), PROPERTY(dropdown) | `math_number_property(math_number(-5), ABS)` | `abs(-5)` |
| `math_round` | Value | OP(dropdown), NUM(input_value) | `math_round(ROUND, math_number(3.7))` | `round(3.7)` |
| `math_on_list` | Value | OP(dropdown), LIST(input_value) | `math_on_list(SUM, list_create())` | `sum_of_list` |
| `math_modulo` | Value | DIVIDEND(input_value), DIVISOR(input_value) | `math_modulo(math_number(10), math_number(3))` | `(10 % 3)` |
| `math_constrain` | Value | VALUE(input_value), LOW(input_value), HIGH(input_value) | `math_constrain(math_number(15), math_number(0), math_number(10))` | `constrain(15, 0, 10)` |
| `math_random_int` | Value | FROM(input_value), TO(input_value) | `math_random_int(math_number(1), math_number(6))` | `random(1, 7)` |
| `math_random_float` | Value | None | `math_random_float()` | `random(0, 1000) / 1000.0` |

## ABS Examples

### Basic Arithmetic Operations
```
arduino_setup()
    variable_define("result", int, math_arithmetic(ADD, math_number(10), math_number(5)))
    serial_begin(Serial, 9600)
    serial_print(Serial, text("10 + 5 = "))
    serial_println(Serial, variables_get($result))

arduino_loop()
    variable_define("a", float, math_number(7.5))
    variable_define("b", float, math_number(2.3))
    variable_define("product", float, math_arithmetic(MULTIPLY, variables_get($a), variables_get($b)))
    
    serial_print(Serial, text("7.5 × 2.3 = "))
    serial_println(Serial, variables_get($product))
    time_delay(math_number(2000))
```

### Trigonometric Functions
```
arduino_setup()
    variable_define("angle", float, math_number(90))
    variable_define("radians", float, math_arithmetic(MULTIPLY, 
        variables_get($angle), 
        math_arithmetic(DIVIDE, math_constant(PI), math_number(180))))
    
    serial_begin(Serial, 9600)
    serial_print(Serial, text("sin(90°) = "))
    serial_println(Serial, math_trig(SIN, variables_get($radians)))
```

### Number Base Conversions
```
arduino_setup()
    variable_define("hexValue", int, math_number_base(HEX, "FF"))
    variable_define("binValue", int, math_number_base(BIN, "1010"))
    
    serial_begin(Serial, 9600)
    serial_print(Serial, text("0xFF = "))
    serial_println(Serial, variables_get($hexValue))
    serial_print(Serial, text("0b1010 = "))
    serial_println(Serial, variables_get($binValue))
```

### Mathematical Functions
```
arduino_setup()
    variable_define("number", float, math_number(-3.7))
    
    serial_begin(Serial, 9600)
    serial_print(Serial, text("abs(-3.7) = "))
    serial_println(Serial, math_number_property(variables_get($number), ABS))
    
    serial_print(Serial, text("round(-3.7) = "))
    serial_println(Serial, math_round(ROUND, variables_get($number)))
    
    serial_print(Serial, text("sqrt(16) = "))
    serial_println(Serial, math_single(ROOT, math_number(16)))
```

### Random Numbers and Constraints
```
arduino_setup()
    variable_define("sensor", int, math_random_int(math_number(0), math_number(100)))
    variable_define("constrained", int, math_constrain(variables_get($sensor), math_number(10), math_number(90)))
    
    serial_begin(Serial, 9600)

arduino_loop()
    serial_print(Serial, text("Random: "))
    serial_print(Serial, variables_get($sensor))
    serial_print(Serial, text(", Constrained: "))
    serial_println(Serial, variables_get($constrained))
    
    variables_set($sensor, math_random_int(math_number(0), math_number(100)))
    variables_set($constrained, math_constrain(variables_get($sensor), math_number(10), math_number(90)))
    
    time_delay(math_number(1000))
```

## Parameter Options

| Parameter | Available Values | Description |
|-----------|------------------|-------------|
| Arithmetic OP | ADD, MINUS, MULTIPLY, DIVIDE, MODULO, POWER | Basic arithmetic operations |
| Single OP | ROOT, ABS, NEG, LN, LOG10, EXP, POW10 | Single-argument math functions |
| Trig OP | SIN, COS, TAN, ASIN, ACOS, ATAN | Trigonometric functions |
| Constants | PI, E, GOLDEN_RATIO, SQRT2, SQRT1_2, INFINITY | Mathematical constants |
| Properties | EVEN, ODD, PRIME, WHOLE, POSITIVE, NEGATIVE, DIVISIBLE_BY | Number properties |
| Round OP | ROUND, ROUNDUP, ROUNDDOWN | Rounding operations |
| Base | DEC, HEX, BIN | Number base systems |

## Important Notes

1. **Angle Units**: Trigonometric functions expect radians, not degrees
2. **Floating Point**: Use `float` or `double` variables for decimal calculations
3. **Integer Division**: Division between integers truncates decimal part
4. **Random Seed**: Use `randomSeed()` in setup for different random sequences
5. **Constraints**: `math_constrain` keeps values within specified bounds
6. **Constants**: Mathematical constants like PI and E are predefined
7. **Precision**: Be aware of floating-point precision limitations
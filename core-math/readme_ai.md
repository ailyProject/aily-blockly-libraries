# math support

Mathematics related function support library

## Library Info
- **Name**: @aily-project/lib-core-math
- **Version**: 0.0.3

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `math_number` | Value | NUM(field_number) | `math_number(0)` | `0` |
| `math_number_base` | Value | BASE(dropdown), NUM(field_input) | `math_number_base(DEC, "0")` | `0` |
| `math_arithmetic` | Value | A(input_value), OP(dropdown), B(input_value) | `math_arithmetic(math_number(0), ADD, math_number(0))` | `1 + 1` |
| `math_change` | Statement | VAR(field_variable), OP(dropdown), DELTA(input_value) | `math_change($variable, ADD, math_number(1))` | `variable += 1;` |
| `math_single` | Value | OP(dropdown), NUM(input_value) | `math_single(ROOT, math_number(0))` | `sqrt(1)` |
| `math_trig` | Value | OP(dropdown), NUM(input_value) | `math_trig(SIN, math_number(0))` | `sin(1 / 180 * PI)` |
| `math_constant` | Value | CONSTANT(dropdown) | `math_constant(PI)` | `PI` |
| `math_number_property` | Value | NUMBER_TO_CHECK(input_value), PROPERTY(dropdown); runtime variants: unary-property: (none); divisible-by: DIVISOR(input_value) | `math_number_property(math_number(0), EVEN)` | `1 % 2 == 0` |
| `math_round` | Value | OP(dropdown), NUM(input_value) | `math_round(ROUND, math_number(0))` | `round(1)` |
| `math_modulo` | Value | DIVIDEND(input_value), DIVISOR(input_value) | `math_modulo(math_number(0), math_number(0))` | `1 % 1` |
| `math_constrain` | Value | VALUE(input_value), LOW(input_value), HIGH(input_value) | `math_constrain(math_number(0), math_number(0), math_number(0))` | `constrain(1, 1, 1)` |
| `math_random_int` | Value | FROM(input_value), TO(input_value) | `math_random_int(math_number(0), math_number(0))` | `random(1, 1 + 1)` |
| `math_random_float` | Value | (none) | `math_random_float()` | `(random(0, 1000) / 1000.0)` |
| `math_atan2` | Value | X(input_value), Y(input_value) | `math_atan2(math_number(0), math_number(0))` | `atan2(1, 1) * 180.0 / PI` |
| `math_round_to_decimal` | Value | NUMBER(input_value), DECIMALS(input_value) | `math_round_to_decimal(math_number(0), math_number(0))` | `(round(1 * pow(10, 1)) / pow(10, 1))` |
| `math_bitwise_not` | Value | NUM(input_value) | `math_bitwise_not(math_number(0))` | `~1` |
| `map_to` | Value | NUM(input_value), FIRST_START(input_value), FIRST_END(input_value), LAST_START(input_value), LAST_END(input_value) | `map_to(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `map(1, 1, 1, 1, 1)` |
| `math_bitwise_shift` | Value | A(input_value), OP(dropdown), B(input_value) | `math_bitwise_shift(math_number(0), LEFT, math_number(0))` | `1 << 1` |
| `math_bitwise_logic` | Value | A(input_value), OP(dropdown), B(input_value) | `math_bitwise_logic(math_number(0), AND, math_number(0))` | `1 & 1` |
| `math_extract_bits` | Value | OP(dropdown), NUM(input_value) | `math_extract_bits(HIGH_BYTE, math_number(0))` | `highByte(1)` |
| `math_bitread` | Value | NUM(input_value), BIT(input_value) | `math_bitread(math_number(0), math_number(0))` | `bitRead(1, 1)` |
| `math_bitwrite` | Value | NUM(input_value), BIT(input_value), VALUE(input_value) | `math_bitwrite(math_number(0), math_number(0), math_number(0))` | `((1) ? ((1) &#124; (1 << (1))) : ((1) & ~(1 << (1))))` |
| `math_bitset` | Value | NUM(input_value), BIT(input_value) | `math_bitset(math_number(0), math_number(0))` | `(1 &#124; (1 << 1))` |
| `math_bitclear` | Value | NUM(input_value), BIT(input_value) | `math_bitclear(math_number(0), math_number(0))` | `(1 & ~(1 << 1))` |
| `math_combine_bits` | Value | OP(dropdown), HIGH(input_value), LOW(input_value) | `math_combine_bits(MAKE_WORD, math_number(0), math_number(0))` | `word(1, 1)` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BASE | DEC, HEX, BIN | math_number_base |
| OP | ADD, MINUS, MULTIPLY, DIVIDE, MODULO, POWER | math_arithmetic |
| OP | ADD, MINUS, MULTIPLY, DIVIDE | math_change |
| OP | ROOT, ABS, NEG, LN, LOG10, EXP, POW10 | math_single |
| OP | SIN, COS, TAN, ASIN, ACOS, ATAN | math_trig |
| CONSTANT | PI, E, GOLDEN_RATIO, SQRT2, SQRT1_2, INFINITY | math_constant |
| PROPERTY | EVEN, ODD, PRIME, WHOLE, POSITIVE, NEGATIVE, DIVISIBLE_BY | math_number_property |
| OP | ROUND, ROUNDUP, ROUNDDOWN | math_round |
| OP | LEFT, RIGHT | math_bitwise_shift |
| OP | AND, OR, XOR | math_bitwise_logic |
| OP | HIGH_BYTE, LOW_BYTE, HIGH_WORD, LOW_WORD | math_extract_bits |
| OP | MAKE_WORD, MAKE_DWORD | math_combine_bits |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, math_number(0))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **Runtime shape**: only `math_number_property` changes its ABS signature: `PROPERTY=DIVISIBLE_BY` adds `DIVISOR`. Tooltip/help extensions on `math_number`, `math_arithmetic`, `math_single`, and `math_trig` are UI-only.
4. **Compound assignment**: `math_change` supports `+=`, `-=`, `*=`, and `/=`. Division follows the C++ variable type (integer division truncates); use a nonzero divisor.

## Runtime Variant Examples

### Runtime Variant: math_number_property/divisible-by
```abs
arduino_loop()
    serial_println(Serial, math_number_property(math_number(0), DIVISIBLE_BY, math_number(2)))
```

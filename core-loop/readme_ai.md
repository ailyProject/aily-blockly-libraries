# loop control

Core library for loop control

## Library Info
- **Name**: @aily-project/lib-core-loop
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `arduino_setup` | Hat | ARDUINO_SETUP(input_statement) | `arduino_setup() @ARDUINO_SETUP: child_block()` | setup() {\n...}\n |
| `arduino_loop` | Hat | ARDUINO_LOOP(input_statement) | `arduino_loop() @ARDUINO_LOOP: child_block()` | loop() {\n...}\n |
| `arduino_global` | Hat | ARDUINO_GLOBAL(input_statement) | `arduino_global() @ARDUINO_GLOBAL: child_block()` | Dynamic code |
| `controls_repeat_ext` | Statement | TIMES(input_value), DO(input_statement) | `controls_repeat_ext(math_number(1000)) @DO: child_block()` | Dynamic code |
| `controls_repeat` | Statement | TIMES(field_number), DO(input_statement) | `controls_repeat(10) @DO: child_block()` | See generator |
| `controls_whileUntil` | Statement | MODE(dropdown), BOOL(input_value), DO(input_statement) | `controls_whileUntil(WHILE, logic_boolean(TRUE)) @DO: child_block()` | while ( |
| `controls_for` | Statement | VAR(field_variable), FROM(input_value), TO(input_value), BY(input_value), DO(input_statement) | `controls_for(variables_get($var), math_number(0), math_number(0), math_number(0)) @DO: child_block()` | Dynamic code |
| `controls_flow_statements` | Statement | FLOW(dropdown) | `controls_flow_statements(BREAK)` | Dynamic code |
| `controls_whileForever` | Statement | DO(input_statement) | `controls_whileForever() @DO: child_block()` | while (1) {\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | WHILE, UNTIL | controls_whileUntil |
| FLOW | BREAK, CONTINUE | controls_flow_statements |

## ABS Examples

### Basic Usage
```
arduino_setup()
    arduino_setup() @ARDUINO_SETUP: child_block()
    serial_begin(Serial, 9600)

arduino_loop()
    arduino_loop() @ARDUINO_LOOP: child_block()
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **Dynamic fields**: `controls_whileUntil`, `controls_for` may add fields at runtime through Blockly extensions.

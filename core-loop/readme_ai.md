# Arduino Loop Control Library

Core library for loop control structures and program flow

## Library Information
- **Library Name**: @aily-project/lib-core-loop
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters | ABS Format | Generated Code |
|------------|------------|------------|------------|----------------|
| `arduino_setup` | Hat | ARDUINO_SETUP(input_statement) | `arduino_setup() statements` | `void setup() { statements }` |
| `arduino_loop` | Hat | ARDUINO_LOOP(input_statement) | `arduino_loop() statements` | `void loop() { statements }` |
| `arduino_global` | Hat | ARDUINO_GLOBAL(input_statement) | `arduino_global() statements` | `// Global declarations statements` |
| `controls_repeat_ext` | Statement | TIMES(input_value), DO(input_statement) | `controls_repeat_ext(math_number(5)) statements` | `for (int i = 0; i < 5; i++) { statements }` |
| `controls_repeat` | Statement | TIMES(field_number), DO(input_statement) | `controls_repeat(10) statements` | `for (int i = 0; i < 10; i++) { statements }` |
| `controls_whileUntil` | Statement | MODE(dropdown), BOOL(input_value), DO(input_statement) | `controls_whileUntil(WHILE, condition) statements` | `while (condition) { statements }` |
| `controls_for` | Statement | VAR(field_variable), FROM(input_value), TO(input_value), BY(input_value), DO(input_statement) | `controls_for($i, math_number(1), math_number(10), math_number(1)) statements` | `for (int i = 1; i <= 10; i += 1) { statements }` |
| `controls_flow_statements` | Statement | FLOW(dropdown) | `controls_flow_statements(BREAK)` | `break;` |
| `controls_whileForever` | Statement | DO(input_statement) | `controls_whileForever() statements` | `while (true) { statements }` |

## ABS Examples

### Arduino Program Structure
```
arduino_setup()
    serial_begin(Serial, 9600)
    io_pinmode(io_pin_digi(13), io_mode(OUTPUT))
    serial_println(Serial, text("Arduino started"))

arduino_loop()
    io_digitalwrite(io_pin_digi(13), io_state(HIGH))
    time_delay(math_number(1000))
    io_digitalwrite(io_pin_digi(13), io_state(LOW))
    time_delay(math_number(1000))
```

### Basic Repeat Loops
```
arduino_setup()
    serial_begin(Serial, 9600)
    
    // Fixed number repeat
    controls_repeat(5)
        serial_print(Serial, text("Count: "))
        serial_println(Serial, math_number(i + 1))
        time_delay(math_number(500))
    
    // Variable repeat
    variable_define("times", int, math_number(3))
    controls_repeat_ext(variables_get($times))
        serial_println(Serial, text("Variable repeat"))
        time_delay(math_number(1000))

arduino_loop()
    time_delay(math_number(5000))
```

### For Loop with Counter Variable
```
arduino_setup()
    serial_begin(Serial, 9600)
    
    // Count up
    controls_for($i, math_number(1), math_number(10), math_number(1))
        serial_print(Serial, text("i = "))
        serial_println(Serial, variables_get($i))
    
    // Count down with step
    controls_for($j, math_number(20), math_number(0), math_number(-2))
        serial_print(Serial, text("j = "))
        serial_println(Serial, variables_get($j))

arduino_loop()
    time_delay(math_number(10000))
```

### While and Until Loops
```
arduino_setup()
    variable_define("counter", int, math_number(0))
    variable_define("sensor", int, math_number(0))
    serial_begin(Serial, 9600)
    
    // While loop
    controls_whileUntil(WHILE, logic_compare(LT, variables_get($counter), math_number(5)))
        serial_print(Serial, text("While counter: "))
        serial_println(Serial, variables_get($counter))
        variables_set($counter, math_arithmetic(ADD, variables_get($counter), math_number(1)))
        time_delay(math_number(1000))
    
    // Until loop
    variables_set($sensor, math_number(0))
    controls_whileUntil(UNTIL, logic_compare(GT, variables_get($sensor), math_number(50)))
        variables_set($sensor, math_random_int(math_number(0), math_number(100)))
        serial_print(Serial, text("Sensor value: "))
        serial_println(Serial, variables_get($sensor))
        time_delay(math_number(500))
    
    serial_println(Serial, text("Sensor threshold reached!"))

arduino_loop()
    time_delay(math_number(1000))
```

### Loop Control with Break and Continue
```
arduino_setup()
    serial_begin(Serial, 9600)
    
    // Break example
    controls_for($i, math_number(1), math_number(20), math_number(1))
        controls_if()
            @IF0: logic_compare(EQ, math_arithmetic(MODULO, variables_get($i), math_number(2)), math_number(0))
            @DO0:
                controls_flow_statements(CONTINUE)
        
        serial_print(Serial, text("Odd number: "))
        serial_println(Serial, variables_get($i))
        
        controls_if()
            @IF0: logic_compare(GT, variables_get($i), math_number(10))
            @DO0:
                serial_println(Serial, text("Breaking at 10+"))
                controls_flow_statements(BREAK)

arduino_loop()
    time_delay(math_number(5000))
```

### Nested Loops
```
arduino_setup()
    serial_begin(Serial, 9600)
    
    // Nested for loops - multiplication table
    controls_for($i, math_number(1), math_number(3), math_number(1))
        controls_for($j, math_number(1), math_number(3), math_number(1))
            variable_define("product", int, math_arithmetic(MULTIPLY, variables_get($i), variables_get($j)))
            serial_print(Serial, variables_get($i))
            serial_print(Serial, text(" × "))
            serial_print(Serial, variables_get($j))
            serial_print(Serial, text(" = "))
            serial_println(Serial, variables_get($product))
        
        serial_println(Serial, text("---"))

arduino_loop()
    time_delay(math_number(10000))
```

### Infinite Loop with Conditions
```
arduino_setup()
    variable_define("buttonPressed", bool, logic_boolean(FALSE))
    io_pinmode(io_pin_digi(2), io_mode(INPUT_PULLUP))
    serial_begin(Serial, 9600)

arduino_loop()
    // Main program loop with exit condition
    controls_whileForever()
        variable_define("buttonState", bool, logic_compare(EQ, io_digitalread(io_pin_digi(2)), io_state(LOW)))
        
        controls_if()
            @IF0: variables_get($buttonState)
            @DO0:
                serial_println(Serial, text("Button pressed - exiting infinite loop"))
                controls_flow_statements(BREAK)
        
        serial_println(Serial, text("Waiting for button press..."))
        time_delay(math_number(1000))
    
    serial_println(Serial, text("Continuing main program"))
    time_delay(math_number(2000))
```

## Parameter Options

| Parameter | Available Values | Description |
|-----------|------------------|-------------|
| MODE (whileUntil) | WHILE, UNTIL | Loop continues while true or until true |
| FLOW | BREAK, CONTINUE | Break exits loop, continue skips to next iteration |
| TIMES | Number | Number of iterations for repeat loops |

## Important Notes

1. **Program Structure**: Every Arduino program needs `arduino_setup()` and `arduino_loop()`
2. **Setup vs Loop**: 
   - `setup()` runs once at startup
   - `loop()` runs continuously after setup
3. **Variable Scope**: Loop variables (`i`, `j`) are automatically created and managed
4. **Break/Continue**: Only work within loops, not in main program flow
5. **Infinite Loops**: Use `controls_whileForever()` cautiously; always provide exit conditions
6. **Performance**: Nested loops can consume significant processing time
7. **Memory Usage**: Deep nesting can consume stack memory
8. **Timing**: Long loops can block other operations; consider using non-blocking patterns
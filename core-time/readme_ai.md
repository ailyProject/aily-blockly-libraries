# Arduino Time Control Library

Core library for time-related functions and delays

## Library Information
- **Library Name**: @aily-project/lib-core-time
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters | ABS Format | Generated Code |
|------------|------------|------------|------------|----------------|
| `time_delay` | Statement | DELAY_TIME(input_value) | `time_delay(math_number(1000))` | `delay(1000);` |
| `time_delay_microseconds` | Statement | DELAY_TIME(input_value) | `time_delay_microseconds(math_number(500))` | `delayMicroseconds(500);` |
| `time_millis` | Value | None | `time_millis()` | `millis()` |
| `time_micros` | Value | None | `time_micros()` | `micros()` |
| `system_time` | Value | None | `system_time()` | `system_time()` |
| `system_date` | Value | None | `system_date()` | `system_date()` |

## ABS Examples

### Basic Delay Operations
```
arduino_setup()
    serial_begin(Serial, 9600)
    serial_println(Serial, text("Starting..."))

arduino_loop()
    serial_println(Serial, text("Hello World"))
    time_delay(math_number(1000))  // Wait 1 second
    
    serial_println(Serial, text("Short delay"))
    time_delay_microseconds(math_number(500))  // Wait 500 microseconds
```

### Timing Measurements
```
arduino_setup()
    variable_define("startTime", "unsigned long", time_millis())
    serial_begin(Serial, 9600)

arduino_loop()
    variable_define("currentTime", "unsigned long", time_millis())
    variable_define("elapsed", "unsigned long", math_arithmetic(MINUS, 
        variables_get($currentTime), 
        variables_get($startTime)))
    
    serial_print(Serial, text("Elapsed time: "))
    serial_print(Serial, variables_get($elapsed))
    serial_println(Serial, text(" ms"))
    
    time_delay(math_number(1000))
```

### Non-blocking Timing Pattern
```
arduino_setup()
    variable_define("previousMillis", "unsigned long", math_number(0))
    variable_define("interval", "unsigned long", math_number(1000))
    variable_define("ledState", "bool", logic_boolean(FALSE))
    
    io_pinmode(io_pin_digi(13), io_mode(OUTPUT))
    serial_begin(Serial, 9600)

arduino_loop()
    variable_define("currentMillis", "unsigned long", time_millis())
    
    controls_if()
        @IF0: logic_compare(GTE, 
                math_arithmetic(MINUS, variables_get($currentMillis), variables_get($previousMillis)),
                variables_get($interval))
        @DO0:
            variables_set($previousMillis, variables_get($currentMillis))
            variables_set($ledState, logic_negate(variables_get($ledState)))
            
            controls_if()
                @IF0: variables_get($ledState)
                @DO0:
                    io_digitalwrite(io_pin_digi(13), io_state(HIGH))
                    serial_println(Serial, text("LED ON"))
                @ELSE:
                    io_digitalwrite(io_pin_digi(13), io_state(LOW))
                    serial_println(Serial, text("LED OFF"))
```

### Precise Microsecond Timing
```
arduino_setup()
    variable_define("startMicros", "unsigned long", time_micros())
    serial_begin(Serial, 9600)

arduino_loop()
    variable_define("currentMicros", "unsigned long", time_micros())
    variable_define("duration", "unsigned long", math_arithmetic(MINUS,
        variables_get($currentMicros),
        variables_get($startMicros)))
    
    controls_if()
        @IF0: logic_compare(GTE, variables_get($duration), math_number(10000))
        @DO0:
            serial_print(Serial, text("10ms elapsed, actual: "))
            serial_print(Serial, variables_get($duration))
            serial_println(Serial, text(" μs"))
            
            variables_set($startMicros, time_micros())
```

### Multiple Timer Management
```
arduino_setup()
    variable_define("timer1", "unsigned long", math_number(0))
    variable_define("timer2", "unsigned long", math_number(0))
    variable_define("interval1", "unsigned long", math_number(500))
    variable_define("interval2", "unsigned long", math_number(2000))
    
    serial_begin(Serial, 9600)

arduino_loop()
    variable_define("now", "unsigned long", time_millis())
    
    // Timer 1 - Fast blinking
    controls_if()
        @IF0: logic_compare(GTE,
                math_arithmetic(MINUS, variables_get($now), variables_get($timer1)),
                variables_get($interval1))
        @DO0:
            variables_set($timer1, variables_get($now))
            serial_println(Serial, text("Fast timer"))
    
    // Timer 2 - Slow reporting
    controls_if()
        @IF0: logic_compare(GTE,
                math_arithmetic(MINUS, variables_get($now), variables_get($timer2)),
                variables_get($interval2))
        @DO0:
            variables_set($timer2, variables_get($now))
            serial_print(Serial, text("Uptime: "))
            serial_print(Serial, variables_get($now))
            serial_println(Serial, text(" ms"))
```

## Parameter Options

| Parameter | Type | Description |
|-----------|------|-------------|
| DELAY_TIME | Number | Time duration in milliseconds or microseconds |

## Important Notes

1. **Blocking vs Non-blocking**: 
   - `time_delay()` blocks program execution
   - Use `time_millis()` for non-blocking timing patterns

2. **Precision**:
   - `time_delay()` - millisecond precision, suitable for general timing
   - `time_delay_microseconds()` - microsecond precision for precise timing

3. **Overflow Handling**: 
   - `millis()` overflows after ~49.7 days
   - `micros()` overflows after ~71.6 minutes
   - Handle overflow in long-running applications

4. **Timer Resolution**:
   - Millisecond functions have 1ms resolution
   - Microsecond functions have 4μs resolution on most Arduino boards

5. **Interrupt Safety**: 
   - `millis()` and `micros()` rely on timer interrupts
   - May be affected by `noInterrupts()`/`interrupts()`

6. **Best Practices**:
   - Avoid `delay()` in interrupt service routines
   - Use non-blocking patterns for responsive programs
   - Store timing variables as `unsigned long` type
# external interrupt

Arduino external interrupt support library

## Library Info
- **Name**: @aily-project/lib-core-interrupt
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `io_attach_interrupt` | Hat | PIN(dropdown), MODE(dropdown), HANDLER(input_statement) | `io_attach_interrupt(PIN, MODE) @HANDLER: child_block()` | Dynamic code |
| `io_detach_interrupt` | Statement | PIN(dropdown) | `io_detach_interrupt(PIN)` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    io_attach_interrupt(PIN, MODE) @HANDLER: child_block()
    serial_begin(Serial, 9600)

arduino_loop()
    io_detach_interrupt(PIN)
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

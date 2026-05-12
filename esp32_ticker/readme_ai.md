# ESP32 timer

ESP32 timer library (Ticker) supports periodic or one-time scheduled execution of tasks, suitable for ESP32 series development boards

## Library Info
- **Name**: @aily-project/lib-esp32-ticker
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ticker_attach_ms` | Statement | TICKER(field_input), INTERVAL(input_value), CALLBACK(input_statement) | `ticker_attach_ms("ticker1", math_number(1000)) @CALLBACK: child_block()` | ....attach_ms(..., ...);\n |
| `ticker_once_ms` | Statement | TICKER(field_input), INTERVAL(input_value), CALLBACK(input_statement) | `ticker_once_ms("ticker1", math_number(1000)) @CALLBACK: child_block()` | ....once_ms(..., ...);\n |
| `ticker_detach` | Statement | TICKER(field_variable) | `ticker_detach(variables_get($ticker1))` | ....detach();\n |
| `ticker_active` | Value | TICKER(field_variable) | `ticker_active(variables_get($ticker1))` | ....active() |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ticker_attach_ms("ticker1", math_number(1000)) @CALLBACK: child_block()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ticker_active(variables_get($ticker1)))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

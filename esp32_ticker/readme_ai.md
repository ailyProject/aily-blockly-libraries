# ESP32定时器

ESP32定时器库(Ticker),支持周期性或一次性定时执行任务,适用于ESP32系列开发板

## Library Info
- **Name**: @aily-project/lib-esp32_ticker
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ticker_attach_ms` | Statement | TICKER(field_input), INTERVAL(input_value) | `ticker_attach_ms("ticker1", math_number(1000))` | `....attach_ms(..., ...);\n` |
| `ticker_once_ms` | Statement | TICKER(field_input), INTERVAL(input_value) | `ticker_once_ms("ticker1", math_number(1000))` | `....once_ms(..., ...);\n` |
| `ticker_detach` | Statement | TICKER(field_variable) | `ticker_detach($ticker1)` | `....detach();\n` |
| `ticker_active` | Value | TICKER(field_variable) | `ticker_active($ticker1)` | `....active()` |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ticker_active($ticker1))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

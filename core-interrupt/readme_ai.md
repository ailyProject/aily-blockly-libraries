# 外部中断

Arduino外部中断支持库

## Library Info
- **Name**: @aily-project/lib-core-interrupt
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `io_attach_interrupt` | Statement | PIN(dropdown) | `io_attach_interrupt(PIN)` | — |
| `io_detach_interrupt` | Statement | PIN(dropdown) | `io_detach_interrupt(PIN)` | — |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

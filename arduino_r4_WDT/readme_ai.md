# R4看门狗

适用于Arduino UNO R4的看门狗库

## Library Info
- **Name**: @aily-project/lib-r4-wdt
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `wdt_begin` | Statement | TIMEOUT(field_number) | `wdt_begin(2000)` | `WDT.begin(` |
| `wdt_refresh` | Statement | (none) | `wdt_refresh()` | `WDT.refresh();\n` |
| `wdt_gettimeout` | Value | (none) | `wdt_gettimeout()` | `WDT.getTimeout()` |

## ABS Examples

### Basic Usage
```
arduino_setup()
    wdt_begin(2000)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, wdt_gettimeout())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

# EEPROM repository

eeprom

## Library Info
- **Name**: @aily-project/lib-core-eeprom
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `eeprom_read` | Value | ADDRESS(input_value) | `eeprom_read(math_number(0))` | EEPROM.read(...) |
| `eeprom_length` | Value | (none) | `eeprom_length()` | EEPROM.length() |
| `eeprom_write` | Statement | ADDRESS(input_value), VALUE(input_value) | `eeprom_write(math_number(0), math_number(0))` | EEPROM.put(..., ...);\n |

## ABS Examples

### Basic Usage
```
arduino_setup()
    eeprom_write(math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, eeprom_read(math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# EEPROM存储库

eeprom

## Library Info
- **Name**: @aily-project/lib-core-eeprom
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `eeprom_read` | Value | ADDRESS(input_value) | `eeprom_read(math_number(0))` | — |
| `eeprom_length` | Value | (none) | `eeprom_length()` | — |
| `eeprom_write` | Statement | ADDRESS(input_value), VALUE(input_value) | `eeprom_write(math_number(0), math_number(0))` | — |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, eeprom_read(math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

# AHT温湿度传感器

适用于AHT10、AHT20温湿度传感器

## Library Info
- **Name**: @aily-project/lib-aht-sensor
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ahtx0_begin` | Statement | (none) | `ahtx0_begin()` | `` |
| `ahtx0_read` | Statement | (none) | `ahtx0_read()` | `aht.getEvent(&humidity, &temp);\n` |
| `ahtx0_get_temperature` | Value | (none) | `ahtx0_get_temperature()` | `temp.temperature` |
| `ahtx0_get_humidity` | Value | (none) | `ahtx0_get_humidity()` | `humidity.relative_humidity` |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ahtx0_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ahtx0_get_temperature())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

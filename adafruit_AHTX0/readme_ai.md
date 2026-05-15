# AHT temperature and humidity sensor

Applicable to AHT10, AHT20 temperature and humidity sensors

## Library Info
- **Name**: @aily-project/lib-adafruit-ahtx0
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ahtx0_begin` | Statement | (none) | `ahtx0_begin()` | Dynamic code |
| `ahtx0_read` | Statement | (none) | `ahtx0_read()` | aht.getEvent(&humidity, &temp);\n |
| `ahtx0_get_temperature` | Value | (none) | `ahtx0_get_temperature()` | temp.temperature |
| `ahtx0_get_humidity` | Value | (none) | `ahtx0_get_humidity()` | humidity.relative_humidity |

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

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

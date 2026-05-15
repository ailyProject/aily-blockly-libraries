# Seeed Aht20

Blockly library for Seeed Aht20.

## Library Info
- **Name**: @aily-project/lib-seeed-aht20
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `aht20_init` | Statement | (none) | `aht20_init()` | Wire.begin();\naht20_sensor.begin();\n |
| `aht20_read_temperature` | Value | (none) | `aht20_read_temperature()` | aht20_getTemperature() |
| `aht20_read_humidity` | Value | (none) | `aht20_read_humidity()` | aht20_getHumidity() |

## ABS Examples

### Basic Usage
```
arduino_setup()
    aht20_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, aht20_read_temperature())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

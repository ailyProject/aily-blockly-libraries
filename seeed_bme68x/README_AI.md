# Seeed Bme68x

Blockly library for Seeed Bme68x.

## Library Info
- **Name**: @aily-project/lib-seeed-bme68x
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bme68x_init` | Statement | ADDRESS(dropdown) | `bme68x_init("0x76")` | Wire.begin();\nbme68x_sensor.init();\n |
| `bme68x_read_temperature` | Value | (none) | `bme68x_read_temperature()` | bme68x_sensor.read_temperature() |
| `bme68x_read_humidity` | Value | (none) | `bme68x_read_humidity()` | bme68x_sensor.read_humidity() |
| `bme68x_read_pressure` | Value | (none) | `bme68x_read_pressure()` | (bme68x_sensor.read_pressure() / 100.0) |
| `bme68x_read_gas` | Value | (none) | `bme68x_read_gas()` | bme68x_sensor.read_gas() |
| `bme68x_update` | Statement | (none) | `bme68x_update()` | bme68x_sensor.read_sensor_data();\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x76, 0x77 | bme68x_init |

## ABS Examples

### Basic Usage
```
arduino_setup()
    bme68x_init("0x76")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, bme68x_read_temperature())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

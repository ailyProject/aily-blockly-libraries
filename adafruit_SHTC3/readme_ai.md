# SHTC3 temperature and humidity sensor

SHTC3 digital temperature and humidity sensor library, supports I2C communication, low power consumption mode, suitable for accurate temperature and humidity detection

## Library Info
- **Name**: @aily-project/lib-adafruit-shtc3
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `shtc3_init` | Statement | (none) | `shtc3_init()` | Dynamic code |
| `shtc3_read_temperature` | Value | (none) | `shtc3_read_temperature()` | Dynamic code |
| `shtc3_read_humidity` | Value | (none) | `shtc3_read_humidity()` | Dynamic code |
| `shtc3_read_both` | Statement | (none) | `shtc3_read_both()` | sensors_event_t humidity, temp;\n |
| `shtc3_is_connected` | Value | (none) | `shtc3_is_connected()` | Dynamic code |
| `shtc3_sleep` | Statement | MODE(dropdown) | `shtc3_sleep(sleep)` | shtc3.sleep( |
| `shtc3_set_power_mode` | Statement | POWER_MODE(dropdown) | `shtc3_set_power_mode(normal)` | shtc3.lowPowerMode( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | sleep, wakeup | shtc3_sleep |
| POWER_MODE | normal, lowpower | shtc3_set_power_mode |

## ABS Examples

### Basic Usage
```
arduino_setup()
    shtc3_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, shtc3_read_temperature())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

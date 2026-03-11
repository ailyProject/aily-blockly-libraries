# SHTC3温湿度传感器

SHTC3数字温湿度传感器库，支持I2C通信，低功耗模式，适用于精确温湿度检测

## Library Info
- **Name**: @aily-project/lib-adafruit-shtc3
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `shtc3_init` | Statement | (none) | `shtc3_init()` | `` |
| `shtc3_read_temperature` | Value | (none) | `shtc3_read_temperature()` | (dynamic code) |
| `shtc3_read_humidity` | Value | (none) | `shtc3_read_humidity()` | (dynamic code) |
| `shtc3_read_both` | Statement | (none) | `shtc3_read_both()` | `sensors_event_t humidity, temp;\n` |
| `shtc3_is_connected` | Value | (none) | `shtc3_is_connected()` | (dynamic code) |
| `shtc3_sleep` | Statement | MODE(dropdown) | `shtc3_sleep(sleep)` | `shtc3.sleep(` |
| `shtc3_set_power_mode` | Statement | POWER_MODE(dropdown) | `shtc3_set_power_mode(normal)` | `shtc3.lowPowerMode(` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | sleep, wakeup | 睡眠 / 唤醒 |
| POWER_MODE | normal, lowpower | 正常 / 低功耗 |

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

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

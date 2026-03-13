# Si7021温湿度传感器

Si7021温湿度传感器控制库，通过I2C接口实现环境温度与湿度的高精度测量，适用于Arduino、ESP32等开发板。

## Library Info
- **Name**: @aily-project/lib-adafruit-si7021
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `si7021_begin` | Statement | OBJECT(field_variable), WIRE(dropdown) | `si7021_begin($sensor, WIRE)` | `if (!` |
| `si7021_read_temperature` | Value | OBJECT(field_variable) | `si7021_read_temperature($sensor)` | (dynamic code) |
| `si7021_read_humidity` | Value | OBJECT(field_variable) | `si7021_read_humidity($sensor)` | (dynamic code) |
| `si7021_heater_control` | Statement | OBJECT(field_variable), STATE(dropdown) | `si7021_heater_control($sensor, true)` | (dynamic code) |
| `si7021_is_heater_enabled` | Value | OBJECT(field_variable) | `si7021_is_heater_enabled($sensor)` | (dynamic code) |
| `si7021_set_heat_level` | Statement | OBJECT(field_variable), LEVEL(dropdown) | `si7021_set_heat_level($sensor, SI_HEATLEVEL_LOWEST)` | (dynamic code) |
| `si7021_get_model` | Value | OBJECT(field_variable) | `si7021_get_model($sensor)` | `String(` |
| `si7021_get_revision` | Value | OBJECT(field_variable) | `si7021_get_revision($sensor)` | (dynamic code) |
| `si7021_reset` | Statement | OBJECT(field_variable) | `si7021_reset($sensor)` | (dynamic code) |
| `si7021_read_serial_number` | Statement | OBJECT(field_variable) | `si7021_read_serial_number($sensor)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| STATE | true, false | 启用 / 禁用 |
| LEVEL | SI_HEATLEVEL_LOWEST, SI_HEATLEVEL_LOW, SI_HEATLEVEL_MEDIUM, SI_HEATLEVEL_HIGH, SI_HEATLEVEL_HIGHER, SI_HEATLEVEL_HIGHEST | 最低 / 低 / 中 / 高 / 更高 / 最高 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    si7021_begin($sensor, WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, si7021_read_temperature($sensor))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

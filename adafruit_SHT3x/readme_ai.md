# SHT3x温湿度传感器

SHT30/SHT31/SHT35温湿度传感器控制库，I2C通讯，包含温度、湿度读取及加热器控制功能

## Library Info
- **Name**: @aily-project/lib-adafruit-sht3x
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sht31_init` | Statement | ADDRESS(dropdown) | `sht31_init(0x44)` | `` |
| `sht31_heater_control` | Statement | STATE(dropdown) | `sht31_heater_control(true)` | `sht31.heater(...);\n` |
| `sht31_is_heater_enabled` | Value | (none) | `sht31_is_heater_enabled()` | `sht31.isHeaterEnabled()` |
| `sht31_reset` | Statement | (none) | `sht31_reset()` | `sht31.reset();\n` |
| `sht31_simple_read` | Value | TYPE(dropdown) | `sht31_simple_read(temperature)` | `sht31.readTemperature()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x44, 0x45 | 0x44 (默认) / 0x45 (备用) |
| STATE | true, false | 开启 / 关闭 |
| TYPE | temperature, humidity | 温度(°C) / 湿度(%) |

## ABS Examples

### Basic Usage
```
arduino_setup()
    sht31_init(0x44)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, sht31_is_heater_enabled())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

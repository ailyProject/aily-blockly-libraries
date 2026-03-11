# NTC热敏电阻

NTC热敏电阻库，支持Esp32等开发板，提供摄氏度、华氏度、开尔文温度读取，硬件可搭配ojmbBxx09ESP32-S3 AIOT综合板中NTC模块使用。

## Library Info
- **Name**: @aily-project/lib-ntc
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ntc_init` | Statement | PIN(dropdown), REF_RESISTANCE(field_number), NOMINAL_RESISTANCE(field_number), NOMINAL_TEMP(field_number), B_VALUE(field_number) | `ntc_init(PIN, 10000, 10000, 25, 3950)` | `` |
| `ntc_read_celsius` | Value | PIN(dropdown) | `ntc_read_celsius(PIN)` | `...->readCelsius()` |
| `ntc_read_fahrenheit` | Value | PIN(dropdown) | `ntc_read_fahrenheit(PIN)` | `...->readFahrenheit()` |
| `ntc_read_kelvin` | Value | PIN(dropdown) | `ntc_read_kelvin(PIN)` | `...->readKelvin()` |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ntc_init(PIN, 10000, 10000, 25, 3950)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ntc_read_celsius(PIN))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

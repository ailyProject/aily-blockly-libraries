# NTC thermistor

The NTC thermistor library supports development boards such as Esp32 and provides temperature readings in degrees Celsius, Fahrenheit and Kelvin. The hardware can be used with the NTC module in the ojmbBxx09ESP32-S3 A...

## Library Info
- **Name**: @aily-project/lib-ntc
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ntc_init` | Statement | PIN(dropdown), REF_RESISTANCE(field_number), NOMINAL_RESISTANCE(field_number), NOMINAL_TEMP(field_number), B_VALUE(field_number) | `ntc_init(PIN, 10000, 10000, 25, 3950)` | Dynamic code |
| `ntc_read_celsius` | Value | PIN(dropdown) | `ntc_read_celsius(PIN)` | ...->readCelsius() |
| `ntc_read_fahrenheit` | Value | PIN(dropdown) | `ntc_read_fahrenheit(PIN)` | ...->readFahrenheit() |
| `ntc_read_kelvin` | Value | PIN(dropdown) | `ntc_read_kelvin(PIN)` | ...->readKelvin() |

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

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

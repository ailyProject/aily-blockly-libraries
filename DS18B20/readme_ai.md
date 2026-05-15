# Dallas temperature sensor

Dallas digital temperature sensor library supports DS18B20, DS18S20, DS1820, DS1822, DS1825, MAX31820, MAX31850 and other Dallas/MAXIM temperature sensors

## Library Info
- **Name**: @aily-project/lib-ds18b20
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ds18b20_init_pin` | Statement | PIN(input_value) | `ds18b20_init_pin(math_number(2))` | Dynamic code |
| `ds18b20_read_temperature_c_pin` | Value | PIN(input_value) | `ds18b20_read_temperature_c_pin(math_number(2))` | Dynamic code |
| `ds18b20_read_temperature_f_pin` | Value | PIN(input_value) | `ds18b20_read_temperature_f_pin(math_number(2))` | Dynamic code |
| `ds18b20_get_device_count_pin` | Value | PIN(input_value) | `ds18b20_get_device_count_pin(math_number(2))` | sensors_ |
| `ds18b20_read_temperature_by_index_pin` | Value | PIN(input_value), INDEX(input_value) | `ds18b20_read_temperature_by_index_pin(math_number(2), math_number(0))` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ds18b20_init_pin(math_number(2))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ds18b20_read_temperature_c_pin(math_number(2)))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

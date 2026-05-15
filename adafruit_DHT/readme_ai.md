# DHT temperature and humidity sensor

DHT11/DHT22(AM2302)/DHT21(AM2301)/DHT20(I2C) temperature and humidity sensor library supports temperature and humidity data collection, low-power operation, fast response speed, and strong anti-interference ability.

## Library Info
- **Name**: @aily-project/lib-adafruit-dht
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `dht_init` | Statement | VAR(field_input), TYPE(dropdown) | `dht_init("dht", DHT11)` | Dynamic code |
| `dht_read_temperature` | Value | VAR(field_variable) | `dht_read_temperature(variables_get($dht))` | Dynamic code |
| `dht_read_humidity` | Value | VAR(field_variable) | `dht_read_humidity(variables_get($dht))` | Dynamic code |
| `dht_read_success` | Value | VAR(field_variable) | `dht_read_success(variables_get($dht))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | DHT11, DHT22, DHT21, DHT20 | dht_init |

## ABS Examples

### Basic Usage
```
arduino_setup()
    dht_init("dht", DHT11)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, dht_read_temperature(variables_get($dht)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `dht_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Dynamic fields**: `dht_init` may add fields at runtime through Blockly extensions.

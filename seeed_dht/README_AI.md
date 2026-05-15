# Seeed DHT

Blockly library for Seeed DHT.

## Library Info
- **Name**: @aily-project/lib-seeed-dht
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `dht_init` | Statement | PIN(input_value), TYPE(dropdown) | `dht_init(math_number(2), DHT11)` | dht_sensor.begin();\n |
| `dht_read_temperature` | Value | UNIT(dropdown) | `dht_read_temperature(C)` | dht_sensor.readTemperature( |
| `dht_read_humidity` | Value | (none) | `dht_read_humidity()` | dht_sensor.readHumidity() |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | DHT11, DHT22, DHT10 | dht_init |
| UNIT | C, F | dht_read_temperature |

## ABS Examples

### Basic Usage
```
arduino_setup()
    dht_init(math_number(2), DHT11)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, dht_read_temperature(C))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

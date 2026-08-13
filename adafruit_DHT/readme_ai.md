# DHT temperature and humidity sensor

DHT11/DHT22(AM2302)/DHT21(AM2301)/DHT20(I2C) temperature and humidity sensor library supports temperature and humidity data collection, low-power operation, fast response speed, and strong anti-interference ability.

## Library Info
- **Name**: @aily-project/lib-adafruit-dht
- **Version**: 1.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `dht_init` | Statement | VAR(field_input), TYPE(dropdown); runtime variants: single-wire-pin: PIN(dropdown); dht20-i2c: WIRE(dropdown) | `dht_init("dht", DHT11, 2)` | `dht.begin();` |
| `dht_read_temperature` | Value | VAR(field_variable) | `dht_read_temperature($dht)` | `dht.readTemperature()` |
| `dht_read_humidity` | Value | VAR(field_variable) | `dht_read_humidity($dht)` | `dht.readHumidity()` |
| `dht_read_success` | Value | VAR(field_variable) | `dht_read_success($dht)` | `!isnan(dht.readTemperature()) && !isnan(dht.readHumidity())` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | DHT11, DHT22, DHT21, DHT20 | dht_init |
| PIN | A board digital-pin value such as `2` | Required third argument for DHT11, DHT21, and DHT22 |
| WIRE | A board I2C interface such as `Wire` | Required third argument for DHT20 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 9600)
    dht_init("dht", DHT11, 2)

arduino_loop()
    serial_println(Serial, dht_read_temperature($dht))
    serial_println(Serial, dht_read_humidity($dht))
    time_delay(math_number(1000))
```

### DHT20 over I2C
```
arduino_setup()
    serial_begin(Serial, 9600)
    dht_init("dht", DHT20, Wire)

arduino_loop()
    serial_println(Serial, dht_read_temperature($dht))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `dht_init("dht", DHT11, 2)` creates `$dht`; pass `$dht` directly to DHT field_variable slots. Use `variables_get($dht)` only when a different block expects an input_value.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Dynamic fields**: the third positional argument is `PIN` for DHT11/DHT21/DHT22 and `WIRE` for DHT20; it is required even though it is injected by a Blockly extension rather than listed in static `args0`.
5. **Custom names**: custom sensor names are supported, but the initializer and every later field-variable reference must match exactly, for example `dht_init("roomSensor", DHT20, Wire)` with `$roomSensor`.
6. **CI13XX compatibility**: the bundled DHT 1.4.6 source adds a guarded `microsecondsToClockCycles` fallback for ChipIntelli CI13XX cores; other upstream behavior is unchanged.
7. **Upstream licenses**: see `THIRD_PARTY_NOTICES.md` and the `LICENSES` directory for the exact upstream tags, retained notices, and license texts.

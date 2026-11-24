# SGP30 air quality sensor

SGP30 gas/air quality sensor support library, which realizes real-time detection of total volatile organic compounds (TVOC) and carbon dioxide equivalent (eCO₂) in the air through I2C interface, suitable for developme...

## Library Info
- **Name**: @aily-project/lib-adafruit-sgp30
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format |
|------------|------------|--------------------------|------------|
| `sgp30_init` | Statement | WIRE(dropdown) | `sgp30_init(WIRE)` |
| `sgp30_measure` | Statement | (none) | `sgp30_measure()` |
| `sgp30_get_tvoc` | Value | (none) | `sgp30_get_tvoc()` |
| `sgp30_get_eco2` | Value | (none) | `sgp30_get_eco2()` |
| `sgp30_measure_raw` | Statement | (none) | `sgp30_measure_raw()` |
| `sgp30_get_raw_h2` | Value | (none) | `sgp30_get_raw_h2()` |
| `sgp30_get_raw_ethanol` | Value | (none) | `sgp30_get_raw_ethanol()` |
| `sgp30_set_humidity` | Statement | TEMPERATURE(input_value), HUMIDITY(input_value) | `sgp30_set_humidity(math_number(0), math_number(0))` |
| `sgp30_get_baseline` | Statement | ECO2_BASE(field_variable), TVOC_BASE(field_variable) | `sgp30_get_baseline($eco2_baseline, $tvoc_baseline)` |
| `sgp30_set_baseline` | Statement | ECO2_BASE(input_value), TVOC_BASE(input_value) | `sgp30_set_baseline(math_number(0), math_number(0))` |
| `sgp30_get_serial` | Value | (none) | `sgp30_get_serial()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| WIRE | ${board.i2c} | sgp30_init |

## ABS Examples

### Basic Usage
```
arduino_setup()
    sgp30_init(WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    sgp30_measure()
    serial_println(Serial, sgp30_get_tvoc())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

If the sensor is absent, initialization reports the failure and the sketch continues. Measurement blocks retry initialization at most once per second. A failed measurement yields zero for the corresponding cached readings.

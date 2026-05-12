# SGP30 air quality sensor

SGP30 gas/air quality sensor support library, which realizes real-time detection of total volatile organic compounds (TVOC) and carbon dioxide equivalent (eCO₂) in the air through I2C interface, suitable for developme...

## Library Info
- **Name**: @aily-project/lib-adafruit-sgp30
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sgp30_init` | Statement | WIRE(dropdown) | `sgp30_init(WIRE)` | if (!sgp.begin()) {\n |
| `sgp30_measure` | Statement | (none) | `sgp30_measure()` | if (!sgp.IAQmeasure()) {\n |
| `sgp30_get_tvoc` | Value | (none) | `sgp30_get_tvoc()` | sgp.TVOC |
| `sgp30_get_eco2` | Value | (none) | `sgp30_get_eco2()` | sgp.eCO2 |
| `sgp30_measure_raw` | Statement | (none) | `sgp30_measure_raw()` | if (!sgp.IAQmeasureRaw()) {\n |
| `sgp30_get_raw_h2` | Value | (none) | `sgp30_get_raw_h2()` | sgp.rawH2 |
| `sgp30_get_raw_ethanol` | Value | (none) | `sgp30_get_raw_ethanol()` | sgp.rawEthanol |
| `sgp30_set_humidity` | Statement | TEMPERATURE(input_value), HUMIDITY(input_value) | `sgp30_set_humidity(math_number(0), math_number(0))` | sgp.setHumidity(getAbsoluteHumidity( |
| `sgp30_get_baseline` | Statement | ECO2_BASE(field_variable), TVOC_BASE(field_variable) | `sgp30_get_baseline(variables_get($eco2_baseline), variables_get($tvoc_baseline))` | if (!sgp.getIAQBaseline(& |
| `sgp30_set_baseline` | Statement | ECO2_BASE(input_value), TVOC_BASE(input_value) | `sgp30_set_baseline(math_number(0), math_number(0))` | sgp.setIAQBaseline( |
| `sgp30_get_serial` | Value | (none) | `sgp30_get_serial()` | String(sgp.serialnumber[0], HEX) + String(sgp.serialnumber[1], HEX) + String(sgp.serialnum |

## ABS Examples

### Basic Usage
```
arduino_setup()
    sgp30_init(WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, sgp30_get_tvoc())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

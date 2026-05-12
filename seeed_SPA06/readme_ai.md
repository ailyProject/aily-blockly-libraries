# SPA06 air pressure temperature sensor

Used to read data from Grove SPA06 (SPL07-003) air pressure and temperature sensor, including air pressure, temperature and altitude

## Library Info
- **Name**: @aily-project/lib-seeed-spa06
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `spa06_init` | Statement | ADDRESS(dropdown) | `spa06_init("0x77")` | Dynamic code |
| `spa06_read_temperature` | Value | (none) | `spa06_read_temperature()` | spa06.readTemperature() |
| `spa06_read_pressure` | Value | (none) | `spa06_read_pressure()` | spa06.readPressure() |
| `spa06_read_altitude` | Value | (none) | `spa06_read_altitude()` | spa06.calcAltitude() |
| `spa06_pressure_available` | Value | (none) | `spa06_pressure_available()` | spa06.pressureAvailable() |
| `spa06_temperature_available` | Value | (none) | `spa06_temperature_available()` | spa06.temperatureAvailable() |
| `spa06_set_mode` | Statement | MODE(dropdown) | `spa06_set_mode(SPL07_IDLE)` | spa06.setMode( |
| `spa06_set_pressure_config` | Statement | RATE(dropdown), OVERSAMPLE(dropdown) | `spa06_set_pressure_config(SPL07_1HZ, SPL07_1SAMPLE)` | spa06.setPressureConfig( |
| `spa06_set_temperature_config` | Statement | RATE(dropdown), OVERSAMPLE(dropdown) | `spa06_set_temperature_config(SPL07_1HZ, SPL07_1SAMPLE)` | spa06.setTemperatureConfig( |
| `spa06_set_pressure_offset` | Statement | OFFSET(input_value) | `spa06_set_pressure_offset(math_number(0))` | spa06.setPressureOffset( |
| `spa06_set_temperature_offset` | Statement | OFFSET(input_value) | `spa06_set_temperature_offset(math_number(0))` | spa06.setTemperatureOffset( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x77, 0x76 | spa06_init |
| MODE | SPL07_IDLE, SPL07_ONE_PRESSURE, SPL07_ONE_TEMPERATURE, SPL07_CONT_PRESSURE, SPL07_CONT_TEMPERATURE, SPL07_CONT_PRES_TEMP | spa06_set_mode |
| RATE | SPL07_1HZ, SPL07_2HZ, SPL07_4HZ, SPL07_8HZ, SPL07_16HZ, SPL07_32HZ, SPL07_64HZ, SPL07_128HZ | spa06_set_pressure_config, spa06_set_temperature_config |
| OVERSAMPLE | SPL07_1SAMPLE, SPL07_2SAMPLES, SPL07_4SAMPLES, SPL07_8SAMPLES, SPL07_16SAMPLES, SPL07_32SAMPLES, SPL07_64SAMPLES, SPL07_128SAMPLES | spa06_set_pressure_config, spa06_set_temperature_config |

## ABS Examples

### Basic Usage
```
arduino_setup()
    spa06_init("0x77")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, spa06_read_temperature())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

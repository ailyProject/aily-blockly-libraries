# SPA06 air pressure temperature sensor

SPA06-003 barometric pressure and temperature sensor library supports I2C and SPI communication, providing high-precision pressure and temperature measurement

## Library Info
- **Name**: @aily-project/lib-spa06
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `spa06_create_i2c` | Statement | VAR(field_input), ADDR(dropdown) | `spa06_create_i2c("spa06", "0x76")` | Dynamic code |
| `spa06_create_spi` | Statement | VAR(field_input), PIN(field_input) | `spa06_create_spi("spa06", "SS")` | Dynamic code |
| `spa06_set_pressure_sampling` | Statement | VAR(field_variable), RATE(dropdown), OVERSAMPLE(dropdown) | `spa06_set_pressure_sampling(variables_get($spa06), SPL07_1HZ, SPL07_1SAMPLE)` | ....setPressureConfig(..., ...);\n |
| `spa06_set_temperature_sampling` | Statement | VAR(field_variable), RATE(dropdown), OVERSAMPLE(dropdown) | `spa06_set_temperature_sampling(variables_get($spa06), SPL07_1HZ, SPL07_1SAMPLE)` | ....setTemperatureConfig(..., ...);\n |
| `spa06_set_mode` | Statement | VAR(field_variable), MODE(dropdown) | `spa06_set_mode(variables_get($spa06), SPL07_IDLE)` | ....setMode(...);\n |
| `spa06_set_temperature_source` | Statement | VAR(field_variable), SOURCE(dropdown) | `spa06_set_temperature_source(variables_get($spa06), SPL07_TSRC_ASIC)` | ....setTemperatureSource(...);\n |
| `spa06_read_pressure` | Value | VAR(field_variable) | `spa06_read_pressure(variables_get($spa06))` | ....readPressure() |
| `spa06_read_temperature` | Value | VAR(field_variable) | `spa06_read_temperature(variables_get($spa06))` | ....readTemperature() |
| `spa06_calc_altitude` | Value | VAR(field_variable) | `spa06_calc_altitude(variables_get($spa06))` | ....calcAltitude() |
| `spa06_pressure_available` | Value | VAR(field_variable) | `spa06_pressure_available(variables_get($spa06))` | ....pressureAvailable() |
| `spa06_temperature_available` | Value | VAR(field_variable) | `spa06_temperature_available(variables_get($spa06))` | ....temperatureAvailable() |
| `spa06_set_interrupt` | Statement | VAR(field_variable), INTERRUPT(dropdown) | `spa06_set_interrupt(variables_get($spa06), SPL07_INT_OFF)` | ....configureInterrupt(...);\n |
| `spa06_get_interrupt_status` | Value | VAR(field_variable) | `spa06_get_interrupt_status(variables_get($spa06))` | ....getInterruptStatus() |
| `spa06_set_pressure_offset` | Statement | VAR(field_variable), OFFSET(input_value) | `spa06_set_pressure_offset(variables_get($spa06), math_number(0))` | ....setPressureOffset(...);\n |
| `spa06_set_temperature_offset` | Statement | VAR(field_variable), OFFSET(input_value) | `spa06_set_temperature_offset(variables_get($spa06), math_number(0))` | ....setTemperatureOffset(...);\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDR | 0x76, 0x77 | spa06_create_i2c |
| RATE | SPL07_1HZ, SPL07_2HZ, SPL07_4HZ, SPL07_8HZ, SPL07_16HZ, SPL07_32HZ, SPL07_64HZ, SPL07_128HZ | spa06_set_pressure_sampling, spa06_set_temperature_sampling |
| OVERSAMPLE | SPL07_1SAMPLE, SPL07_2SAMPLES, SPL07_4SAMPLES, SPL07_8SAMPLES, SPL07_16SAMPLES, SPL07_32SAMPLES, SPL07_64SAMPLES, SPL07_128SAMPLES | spa06_set_pressure_sampling, spa06_set_temperature_sampling |
| MODE | SPL07_IDLE, SPL07_ONE_PRESSURE, SPL07_ONE_TEMPERATURE, SPL07_CONT_PRESSURE, SPL07_CONT_TEMPERATURE, SPL07_CONT_PRES_TEMP | spa06_set_mode |
| SOURCE | SPL07_TSRC_ASIC, SPL07_TSRC_MEMS | spa06_set_temperature_source |
| INTERRUPT | SPL07_INT_OFF, SPL07_INT_PRES, SPL07_INT_TEMP, SPL07_INT_PRES_TEMP, SPL07_INT_FIFO, SPL07_INT_FIFO_PRES, SPL07_INT_FIFO_TEMP, SPL07_INT_ALL | spa06_set_interrupt |

## ABS Examples

### Basic Usage
```
arduino_setup()
    spa06_create_i2c("spa06", "0x76")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, spa06_read_pressure(variables_get($spa06)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `spa06_create_i2c("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Dynamic fields**: `spa06_create_i2c` may add fields at runtime through Blockly extensions.

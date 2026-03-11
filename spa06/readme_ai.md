# SPA06气压温度传感器

SPA06-003气压温度传感器库，支持I2C和SPI通信，提供高精度压力和温度测量

## Library Info
- **Name**: @aily-project/lib-spa06
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `spa06_create_i2c` | Statement | VAR(field_input), ADDR(dropdown) | `spa06_create_i2c("spa06", 0x76)` | `` |
| `spa06_create_spi` | Statement | VAR(field_input), PIN(field_input) | `spa06_create_spi("spa06", "SS")` | (dynamic code) |
| `spa06_set_pressure_sampling` | Statement | VAR(field_variable), RATE(dropdown), OVERSAMPLE(dropdown) | `spa06_set_pressure_sampling(variables_get($spa06), SPL07_1HZ, SPL07_1SAMPLE)` | `....setPressureConfig(..., ...);\n` |
| `spa06_set_temperature_sampling` | Statement | VAR(field_variable), RATE(dropdown), OVERSAMPLE(dropdown) | `spa06_set_temperature_sampling(variables_get($spa06), SPL07_1HZ, SPL07_1SAMPLE)` | `....setTemperatureConfig(..., ...);\n` |
| `spa06_set_mode` | Statement | VAR(field_variable), MODE(dropdown) | `spa06_set_mode(variables_get($spa06), SPL07_IDLE)` | `....setMode(...);\n` |
| `spa06_set_temperature_source` | Statement | VAR(field_variable), SOURCE(dropdown) | `spa06_set_temperature_source(variables_get($spa06), SPL07_TSRC_ASIC)` | `....setTemperatureSource(...);\n` |
| `spa06_read_pressure` | Value | VAR(field_variable) | `spa06_read_pressure(variables_get($spa06))` | `....readPressure()` |
| `spa06_read_temperature` | Value | VAR(field_variable) | `spa06_read_temperature(variables_get($spa06))` | `....readTemperature()` |
| `spa06_calc_altitude` | Value | VAR(field_variable) | `spa06_calc_altitude(variables_get($spa06))` | `....calcAltitude()` |
| `spa06_pressure_available` | Value | VAR(field_variable) | `spa06_pressure_available(variables_get($spa06))` | `....pressureAvailable()` |
| `spa06_temperature_available` | Value | VAR(field_variable) | `spa06_temperature_available(variables_get($spa06))` | `....temperatureAvailable()` |
| `spa06_set_interrupt` | Statement | VAR(field_variable), INTERRUPT(dropdown) | `spa06_set_interrupt(variables_get($spa06), SPL07_INT_OFF)` | `....configureInterrupt(...);\n` |
| `spa06_get_interrupt_status` | Value | VAR(field_variable) | `spa06_get_interrupt_status(variables_get($spa06))` | `....getInterruptStatus()` |
| `spa06_set_pressure_offset` | Statement | VAR(field_variable), OFFSET(input_value) | `spa06_set_pressure_offset(variables_get($spa06), math_number(0))` | `....setPressureOffset(...);\n` |
| `spa06_set_temperature_offset` | Statement | VAR(field_variable), OFFSET(input_value) | `spa06_set_temperature_offset(variables_get($spa06), math_number(0))` | `....setTemperatureOffset(...);\n` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDR | 0x76, 0x77 | 0x76 (默认) / 0x77 |
| RATE | SPL07_1HZ, SPL07_2HZ, SPL07_4HZ, SPL07_8HZ, SPL07_16HZ, SPL07_32HZ, SPL07_64HZ, SPL07_128HZ | 1 Hz / 2 Hz / 4 Hz / 8 Hz / 16 Hz / 32 Hz / 64 Hz / 128 Hz |
| OVERSAMPLE | SPL07_1SAMPLE, SPL07_2SAMPLES, SPL07_4SAMPLES, SPL07_8SAMPLES, SPL07_16SAMPLES, SPL07_32SAMPLES, SPL07_64SAMPLES, SPL07_128SAMPLES | 1次 / 2次 / 4次 / 8次 / 16次 / 32次 / 64次 / 128次 |
| MODE | SPL07_IDLE, SPL07_ONE_PRESSURE, SPL07_ONE_TEMPERATURE, SPL07_CONT_PRESSURE, SPL07_CONT_TEMPERATURE, SPL07_CONT_PRES_TEMP | 空闲 / 单次压力 / 单次温度 / 连续压力 / 连续温度 / 连续压力温度 |
| SOURCE | SPL07_TSRC_ASIC, SPL07_TSRC_MEMS | ASIC内部 / MEMS外部 |
| INTERRUPT | SPL07_INT_OFF, SPL07_INT_PRES, SPL07_INT_TEMP, SPL07_INT_PRES_TEMP, SPL07_INT_FIFO, SPL07_INT_FIFO_PRES, SPL07_INT_FIFO_TEMP, SPL07_INT_ALL | 关闭 / 压力就绪 / 温度就绪 / 压力或温度就绪 / FIFO满 / FIFO满或压力就绪 / FIFO满或温度就绪 / 所有中断 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    spa06_create_i2c("spa06", 0x76)
    spa06_create_spi("spa06", "SS")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, spa06_read_pressure(variables_get($spa06)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `spa06_create_i2c("varName", ...)` creates variable `$varName`; reference with `variables_get($varName)`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

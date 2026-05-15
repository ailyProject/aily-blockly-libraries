# R4 I/O Control Library

Suitable for Arduino UNO R4 special I/O control library, such as ADC, DAC

## Library Info
- **Name**: @aily-project/lib-r4-io
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `r4_io_adc_resolution` | Statement | RESOLUTION(dropdown) | `r4_io_adc_resolution("10")` | analogReadResolution(...);\n |
| `r4_io_dac_init` | Statement | CHANNEL(dropdown), FREQUENCY(input_value) | `r4_io_dac_init(sine, math_number(0))` | Dynamic code |
| `r4_io_dac_set_frequency` | Statement | FREQUENCY(input_value) | `r4_io_dac_set_frequency(math_number(0))` | wave.freq(...);\n |
| `r4_io_dac_set_amplitude` | Statement | AMPLITUDE(input_value) | `r4_io_dac_set_amplitude(math_number(0))` | wave.amplitude(...);\n |
| `r4_io_dac_set_offset` | Statement | OFFSET(input_value) | `r4_io_dac_set_offset(math_number(0))` | wave.offset(...);\n |
| `r4_io_dac_start` | Statement | (none) | `r4_io_dac_start()` | wave.start();\n |
| `r4_io_dac_stop` | Statement | (none) | `r4_io_dac_stop()` | wave.stop();\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| RESOLUTION | 10, 12, 14 | r4_io_adc_resolution |
| CHANNEL | sine, square, saw | r4_io_dac_init |

## ABS Examples

### Basic Usage
```
arduino_setup()
    r4_io_dac_init(sine, math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    r4_io_adc_resolution("10")
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

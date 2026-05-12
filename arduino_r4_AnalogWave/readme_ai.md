# R4 analog waveform

Analog waveform generation library for Arduino UNO R4 WiFi, supporting sine, square and sawtooth wave outputs

## Library Info
- **Name**: @aily-project/lib-r4-analogwave
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `analogwave_init` | Statement | VAR(field_input), PIN(dropdown) | `analogwave_init("wave", DAC)` | Dynamic code |
| `analogwave_sine` | Statement | VAR(field_variable), FREQ(input_value) | `analogwave_sine(variables_get($wave), math_number(0))` | Dynamic code |
| `analogwave_square` | Statement | VAR(field_variable), FREQ(input_value) | `analogwave_square(variables_get($wave), math_number(0))` | Dynamic code |
| `analogwave_saw` | Statement | VAR(field_variable), FREQ(input_value) | `analogwave_saw(variables_get($wave), math_number(0))` | Dynamic code |
| `analogwave_freq` | Statement | VAR(field_variable), FREQ(input_value) | `analogwave_freq(variables_get($wave), math_number(0))` | Dynamic code |
| `analogwave_amplitude` | Statement | VAR(field_variable), AMP(input_value) | `analogwave_amplitude(variables_get($wave), math_number(0))` | Dynamic code |
| `analogwave_start` | Statement | VAR(field_variable) | `analogwave_start(variables_get($wave))` | Dynamic code |
| `analogwave_stop` | Statement | VAR(field_variable) | `analogwave_stop(variables_get($wave))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PIN | DAC, DAC0, DAC1, A0 | analogwave_init |

## ABS Examples

### Basic Usage
```
arduino_setup()
    analogwave_init("wave", DAC)
    serial_begin(Serial, 9600)

arduino_loop()
    analogwave_sine(variables_get($wave), math_number(0))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `analogwave_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

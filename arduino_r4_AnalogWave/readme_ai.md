# R4 模拟波形

用于Arduino UNO R4 WiFi的模拟波形生成库，支持正弦波、方波和锯齿波输出

## Library Info
- **Name**: @aily-project/lib-r4-analogwave
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `analogwave_init` | Statement | VAR(field_input), PIN(dropdown) | `analogwave_init("wave", DAC)` | `` |
| `analogwave_sine` | Statement | VAR(field_variable), FREQ(input_value) | `analogwave_sine($wave, math_number(0))` | (dynamic code) |
| `analogwave_square` | Statement | VAR(field_variable), FREQ(input_value) | `analogwave_square($wave, math_number(0))` | (dynamic code) |
| `analogwave_saw` | Statement | VAR(field_variable), FREQ(input_value) | `analogwave_saw($wave, math_number(0))` | (dynamic code) |
| `analogwave_freq` | Statement | VAR(field_variable), FREQ(input_value) | `analogwave_freq($wave, math_number(0))` | (dynamic code) |
| `analogwave_amplitude` | Statement | VAR(field_variable), AMP(input_value) | `analogwave_amplitude($wave, math_number(0))` | (dynamic code) |
| `analogwave_start` | Statement | VAR(field_variable) | `analogwave_start($wave)` | (dynamic code) |
| `analogwave_stop` | Statement | VAR(field_variable) | `analogwave_stop($wave)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PIN | DAC, DAC0, DAC1, A0 | DAC / DAC0 / DAC1 / A0 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    analogwave_init("wave", DAC)
    serial_begin(Serial, 9600)

arduino_loop()
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `analogwave_init("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

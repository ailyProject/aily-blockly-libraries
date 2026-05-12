# SparkFun MiniGen Signal Generator

Blockly wrapper for the SparkFun MiniGen SPI signal generator (AD9837-based).

## Library Info
- **Name**: @aily-project/lib-sparkfun-minigen
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `minigen_init` | Statement | VAR(field_input), FSYNC_PIN(field_number) | `minigen_init("minigen", 10)` | Dynamic code |
| `minigen_reset` | Statement | VAR(field_variable) | `minigen_reset(variables_get($minigen))` | Dynamic code |
| `minigen_set_mode` | Statement | VAR(field_variable), MODE(dropdown) | `minigen_set_mode(variables_get($minigen), MiniGen::SINE)` | Dynamic code |
| `minigen_set_freq` | Statement | VAR(field_variable), REG(dropdown), FREQ(input_value) | `minigen_set_freq(variables_get($minigen), MiniGen::FREQ0, math_number(0))` | Dynamic code |
| `minigen_select_freq_reg` | Statement | VAR(field_variable), REG(dropdown) | `minigen_select_freq_reg(variables_get($minigen), MiniGen::FREQ0)` | Dynamic code |
| `minigen_set_phase` | Statement | VAR(field_variable), REG(dropdown), PHASE(input_value) | `minigen_set_phase(variables_get($minigen), MiniGen::PHASE0, math_number(0))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | MiniGen::SINE, MiniGen::TRIANGLE, MiniGen::SQUARE, MiniGen::SQUARE_2 | minigen_set_mode |
| REG | MiniGen::FREQ0, MiniGen::FREQ1 | minigen_set_freq, minigen_select_freq_reg |
| REG | MiniGen::PHASE0, MiniGen::PHASE1 | minigen_set_phase |

## ABS Examples

### Basic Usage
```
arduino_setup()
    minigen_init("minigen", 10)
    serial_begin(Serial, 9600)

arduino_loop()
    minigen_reset(variables_get($minigen))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `minigen_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

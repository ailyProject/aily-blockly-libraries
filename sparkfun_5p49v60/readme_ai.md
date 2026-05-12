# SparkFun 5P49V60 Clock Generator

Blockly wrapper for the SparkFun 5P49V60 programmable clock generator.

## Library Info
- **Name**: @aily-project/lib-sparkfun-5p49v60
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `5p49v60_init` | Statement | VAR(field_input), ADDRESS(dropdown) | `5p49v60_init("clockGen", DEF)` | Wire.begin();\n |
| `5p49v60_set_vco` | Statement | VAR(field_variable), FREQ(input_value) | `5p49v60_set_vco(variables_get($clockGen), math_number(0))` | Dynamic code |
| `5p49v60_mux_pll_to_fod` | Statement | VAR(field_variable), CHANNEL(dropdown) | `5p49v60_mux_pll_to_fod(variables_get($clockGen), "1")` | Dynamic code |
| `5p49v60_set_clock_freq` | Statement | VAR(field_variable), CHANNEL(dropdown), FREQ(input_value) | `5p49v60_set_clock_freq(variables_get($clockGen), "1", math_number(0))` | Dynamic code |
| `5p49v60_set_clock_mode` | Statement | VAR(field_variable), CHANNEL(dropdown), MODE(dropdown) | `5p49v60_set_clock_mode(variables_get($clockGen), "1", "0")` | Dynamic code |
| `5p49v60_skew_clock` | Statement | VAR(field_variable), CHANNEL(dropdown), SKEW(input_value) | `5p49v60_skew_clock(variables_get($clockGen), "1", math_number(0))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | DEF, ALT | 5p49v60_init |
| CHANNEL | 1, 2, 3, 4 | 5p49v60_mux_pll_to_fod, 5p49v60_set_clock_freq, 5p49v60_set_clock_mode |
| MODE | 0, 1, 2, 3, 4, 5, 6 | 5p49v60_set_clock_mode |

## ABS Examples

### Basic Usage
```
arduino_setup()
    5p49v60_init("clockGen", DEF)
    serial_begin(Serial, 9600)

arduino_loop()
    5p49v60_set_vco(variables_get($clockGen), math_number(0))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `5p49v60_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

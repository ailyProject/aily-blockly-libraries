# SparkFun UG2856 transparent OLED

Blockly wrapper for WiseChip UG2856KLBAG01 transparent OLED display.

## Library Info
- **Name**: @aily-project/lib-sparkfun-hyperdisplay-ug2856klbag01
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ug2856_init_i2c` | Statement | VAR(field_input), WIRE(dropdown) | `ug2856_init_i2c("oled", WIRE)` | Dynamic code |
| `ug2856_init_spi` | Statement | VAR(field_input), SPI(dropdown), CS(input_value), DC(input_value) | `ug2856_init_spi("oled", SPI, math_number(0), math_number(0))` | Dynamic code |
| `ug2856_clear` | Statement | VAR(field_variable) | `ug2856_clear(variables_get($oled))` | Dynamic code |
| `ug2856_pixel` | Statement | VAR(field_variable), ACTION(dropdown), X(input_value), Y(input_value) | `ug2856_pixel(variables_get($oled), Set, math_number(0), math_number(0))` | Dynamic code |
| `ug2856_line` | Statement | VAR(field_variable), ACTION(dropdown), X0(input_value), Y0(input_value), X1(input_value), Y1(input_value), WIDTH(input_value) | `ug2856_line(variables_get($oled), Set, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `ug2856_rectangle` | Statement | VAR(field_variable), ACTION(dropdown), X0(input_value), Y0(input_value), X1(input_value), Y1(input_value), FILLED(dropdown) | `ug2856_rectangle(variables_get($oled), Set, math_number(0), math_number(0), math_number(0), math_number(0), true)` | Dynamic code |
| `ug2856_circle` | Statement | VAR(field_variable), ACTION(dropdown), X(input_value), Y(input_value), RADIUS(input_value), FILLED(dropdown) | `ug2856_circle(variables_get($oled), Set, math_number(0), math_number(0), math_number(0), true)` | Dynamic code |
| `ug2856_print` | Statement | VAR(field_variable), COLOR(dropdown), X(input_value), Y(input_value), TEXT(input_value) | `ug2856_print(variables_get($oled), Set, math_number(0), math_number(0), text("value"))` | Dynamic code |
| `ug2856_contrast` | Statement | VAR(field_variable), VALUE(input_value) | `ug2856_contrast(variables_get($oled), math_number(0))` | Dynamic code |
| `ug2856_invert` | Statement | VAR(field_variable), ON(dropdown) | `ug2856_invert(variables_get($oled), true)` | Dynamic code |
| `ug2856_power` | Statement | VAR(field_variable), ON(dropdown) | `ug2856_power(variables_get($oled), true)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ACTION | Set, Clear | ug2856_pixel, ug2856_line, ug2856_rectangle |
| FILLED | true, false | ug2856_rectangle, ug2856_circle |
| COLOR | Set, Clear | ug2856_print |
| ON | true, false | ug2856_invert, ug2856_power |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ug2856_init_i2c("oled", WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    ug2856_init_spi("oled", SPI, math_number(0), math_number(0))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `ug2856_init_i2c("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

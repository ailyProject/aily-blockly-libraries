# SparkFun HyperDisplay Graphics Framework

Blockly wrapper for the SparkFun HyperDisplay abstract graphics framework library.

## Library Info
- **Name**: @aily-project/lib-sparkfun-hyperdisplay
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `hyperdisplay_include` | Statement | (none) | `hyperdisplay_include()` | Dynamic code |
| `hyperdisplay_fill_window` | Statement | VAR(field_input) | `hyperdisplay_fill_window("myDisplay")` | Dynamic code |
| `hyperdisplay_pixel` | Statement | VAR(field_input), X(input_value), Y(input_value) | `hyperdisplay_pixel("myDisplay", math_number(0), math_number(0))` | Dynamic code |
| `hyperdisplay_line` | Statement | VAR(field_input), X0(input_value), Y0(input_value), X1(input_value), Y1(input_value), WIDTH(field_number) | `hyperdisplay_line("myDisplay", math_number(0), math_number(0), math_number(0), math_number(0), 1)` | Dynamic code |
| `hyperdisplay_rectangle` | Statement | VAR(field_input), X0(input_value), Y0(input_value), X1(input_value), Y1(input_value), FILLED(dropdown) | `hyperdisplay_rectangle("myDisplay", math_number(0), math_number(0), math_number(0), math_number(0), false)` | Dynamic code |
| `hyperdisplay_circle` | Statement | VAR(field_input), X(input_value), Y(input_value), R(input_value), FILLED(dropdown) | `hyperdisplay_circle("myDisplay", math_number(0), math_number(0), math_number(0), false)` | Dynamic code |
| `hyperdisplay_print` | Statement | VAR(field_input), X(input_value), Y(input_value), TEXT(input_value) | `hyperdisplay_print("myDisplay", math_number(0), math_number(0), text("value"))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FILLED | false, true | hyperdisplay_rectangle, hyperdisplay_circle |

## ABS Examples

### Basic Usage
```
arduino_setup()
    hyperdisplay_include()
    serial_begin(Serial, 9600)

arduino_loop()
    hyperdisplay_fill_window("myDisplay")
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `hyperdisplay_fill_window("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

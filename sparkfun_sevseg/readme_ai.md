# SparkFun SevSeg display

Blockly wrapper for SevSeg seven-segment displays.

## Library Info
- **Name**: @aily-project/lib-sparkfun-sevseg
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sevseg_init` | Statement | VAR(field_input), MODE(dropdown), DIGITS(input_value), D1(input_value), D2(input_value), D3(input_value), D4(input_value), A(input_value), B(input_value), C(... | `sevseg_init("display", COMMON_CATHODE, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), ma...` | Dynamic code |
| `sevseg_display_text` | Statement | VAR(field_variable), TEXT(input_value), DECIMAL(input_value) | `sevseg_display_text(variables_get($display), text("value"), math_number(0))` | sevsegDisplayText( |
| `sevseg_set_brightness` | Statement | VAR(field_variable), BRIGHTNESS(input_value) | `sevseg_set_brightness(variables_get($display), math_number(0))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | COMMON_CATHODE, COMMON_ANODE | sevseg_init |

## ABS Examples

### Basic Usage
```
arduino_setup()
    sevseg_init("display", COMMON_CATHODE, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    sevseg_display_text(variables_get($display), text("value"), math_number(0))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `sevseg_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# Shift register driver library

Shift register 74HC595 control library, supports Arduino UNO, MEGA, ESP8266, ESP32 and other development boards

## Library Info
- **Name**: @aily-project/lib-shiftregister
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `74hc595_create` | Statement | VAR(field_input), HCNUMBER(input_value), HCDATA_PIN(dropdown), HCCLOCK_PIN(dropdown), HCLATCH_PIN(dropdown) | `74hc595_create("hc1", math_number(0), HCDATA_PIN, HCCLOCK_PIN, HCLATCH_PIN)` | Dynamic code |
| `74hc595_set` | Statement | VAR(field_variable), HCPIN(input_value), VALUE(dropdown) | `74hc595_set(variables_get($hc1), math_number(2), HIGH)` | Dynamic code |
| `74hc595_setAll` | Statement | VAR(field_variable), ALLSTATE(dropdown) | `74hc595_setAll(variables_get($hc1), High)` | Dynamic code |
| `74hc595_setAllBin` | Statement | VAR(field_variable), HCARRAY(field_input) | `74hc595_setAllBin(variables_get($hc1), "arrayname")` | Dynamic code |
| `74hc595_getstate` | Statement | VAR(field_variable), HCOUTPSTATE(input_value) | `74hc595_getstate(variables_get($hc1), math_number(0))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| VALUE | HIGH, LOW | 74hc595_set |
| ALLSTATE | High, Low | 74hc595_setAll |

## ABS Examples

### Basic Usage
```
arduino_setup()
    74hc595_create("hc1", math_number(0), HCDATA_PIN, HCCLOCK_PIN, HCLATCH_PIN)
    serial_begin(Serial, 9600)

arduino_loop()
    74hc595_set(variables_get($hc1), math_number(2), HIGH)
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `74hc595_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

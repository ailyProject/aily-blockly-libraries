# Shift register driver library

Shift register 74HC595 control library, supports Arduino UNO, MEGA, ESP8266, ESP32 and other development boards

## Library Info
- **Name**: @aily-project/lib-shiftregister
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `74hc595_create` | Statement | VAR(field_input), HCNUMBER(input_value), HCDATA_PIN(dropdown), HCCLOCK_PIN(dropdown), HCLATCH_PIN(dropdown) | `74hc595_create("hc1", math_number(0), HCDATA_PIN, HCCLOCK_PIN, HCLATCH_PIN)` | `ShiftRegister74HC595<1> hc1; hc1.begin(HCDATA_PIN, HCCLOCK_PIN, HCLATCH_PIN);` |
| `74hc595_set` | Statement | VAR(field_variable), HCPIN(input_value), VALUE(dropdown) | `74hc595_set($hc1, math_number(2), HIGH)` | `hc1.set(1, HIGH);` |
| `74hc595_setAll` | Statement | VAR(field_variable), ALLSTATE(dropdown) | `74hc595_setAll($hc1, High)` | `hc1.setAllHigh();` |
| `74hc595_setAllBin` | Statement | VAR(field_variable), HCARRAY(field_input) | `74hc595_setAllBin($hc1, "arrayname")` | `hc1.setAll(arrayname);` |
| `74hc595_getstate` | Statement | VAR(field_variable), HCOUTPSTATE(input_value) | `74hc595_getstate($hc1, math_number(0))` | `hc1.get(1);` |

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
    74hc595_set($hc1, math_number(2), HIGH)
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `74hc595_create("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

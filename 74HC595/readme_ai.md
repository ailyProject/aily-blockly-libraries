# 移位寄存器驱动库

移位寄存器74HC595控制库，支持Arduino UNO、MEGA、ESP8266、ESP32等开发板

## Library Info
- **Name**: @aily-project/lib-shiftregister
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `74hc595_create` | Statement | VAR(field_input), HCNUMBER(input_value), HCDATA_PIN(dropdown), HCCLOCK_PIN(dropdown), HCLATCH_PIN(dropdown) | `74hc595_create("hc1", math_number(0), HCDATA_PIN, HCCLOCK_PIN, HCLATCH_PIN)` | `` |
| `74hc595_set` | Statement | VAR(field_variable), HCPIN(input_value), VALUE(dropdown) | `74hc595_set(variables_get($hc1), math_number(2), HIGH)` | (dynamic code) |
| `74hc595_setAll` | Statement | VAR(field_variable), ALLSTATE(dropdown) | `74hc595_setAll(variables_get($hc1), High)` | (dynamic code) |
| `74hc595_setAllBin` | Statement | VAR(field_variable), HCARRAY(field_input) | `74hc595_setAllBin(variables_get($hc1), "arrayname")` | (dynamic code) |
| `74hc595_getstate` | Statement | VAR(field_variable), HCOUTPSTATE(input_value) | `74hc595_getstate(variables_get($hc1), math_number(0))` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| VALUE | HIGH, LOW | HIGH / LOW |
| ALLSTATE | High, Low | HIGH / LOW |

## ABS Examples

### Basic Usage
```
arduino_setup()
    74hc595_create("hc1", math_number(0), HCDATA_PIN, HCCLOCK_PIN, HCLATCH_PIN)
    serial_begin(Serial, 9600)

arduino_loop()
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `74hc595_create("varName", ...)` creates variable `$varName`; reference with `variables_get($varName)`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

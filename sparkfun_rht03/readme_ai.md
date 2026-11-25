# SparkFun RHT03 Humidity and Temperature Sensor

Blockly wrapper for the SparkFun RHT03 single-wire humidity and temperature sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-rht03
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `rht03_init` | Statement | VAR(field_input), PIN(field_number) | `rht03_init("rht", 2)` | `rht.begin(2);` |
| `rht03_update` | Value | VAR(field_variable) | `rht03_update($rht)` | `rht.update()` |
| `rht03_temp_c` | Value | VAR(field_variable) | `rht03_temp_c($rht)` | `rht.tempC()` |
| `rht03_temp_f` | Value | VAR(field_variable) | `rht03_temp_f($rht)` | `rht.tempF()` |
| `rht03_humidity` | Value | VAR(field_variable) | `rht03_humidity($rht)` | `rht.humidity()` |

## ABS Examples

### Basic Usage
```
arduino_setup()
    rht03_init("rht", 2)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, rht03_update($rht))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `rht03_init("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

Read the RHT03 after its two-second power-up period. The driver leaves interrupts enabled during the two millisecond-based start delays and masks interrupts for the timing-sensitive response. A successful update returns 1.

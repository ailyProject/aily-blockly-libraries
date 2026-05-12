# LTR308 light sensor

LTR308 digital light intensity sensor control library, suitable for ESP32 development boards such as control board 3.0

## Library Info
- **Name**: @aily-project/lib-ltr308
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ltr308_init_with_wire` | Statement | VAR(field_input), GAIN(dropdown), INTEGRATION_TIME(dropdown), MEASUREMENT_RATE(dropdown), WIRE(dropdown) | `ltr308_init_with_wire("ltr308", LTR308_GAIN_1, LTR308_INTEGRATION_25MS, LTR308_RATE_25MS, WIRE)` | Dynamic code |
| `ltr308_read_light_level` | Value | VAR(field_variable) | `ltr308_read_light_level(variables_get($ltr308))` | Dynamic code |
| `ltr308_read_raw_data` | Value | VAR(field_variable) | `ltr308_read_raw_data(variables_get($ltr308))` | Dynamic code |
| `ltr308_is_data_ready` | Value | VAR(field_variable) | `ltr308_is_data_ready(variables_get($ltr308))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| GAIN | LTR308_GAIN_1, LTR308_GAIN_3, LTR308_GAIN_6, LTR308_GAIN_9, LTR308_GAIN_18 | ltr308_init_with_wire |
| INTEGRATION_TIME | LTR308_INTEGRATION_25MS, LTR308_INTEGRATION_50MS, LTR308_INTEGRATION_100MS, LTR308_INTEGRATION_200MS, LTR308_INTEGRATION_400MS | ltr308_init_with_wire |
| MEASUREMENT_RATE | LTR308_RATE_25MS, LTR308_RATE_50MS, LTR308_RATE_100MS, LTR308_RATE_200MS, LTR308_RATE_500MS, LTR308_RATE_1000MS, LTR308_RATE_2000MS | ltr308_init_with_wire |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ltr308_init_with_wire("ltr308", LTR308_GAIN_1, LTR308_INTEGRATION_25MS, LTR308_RATE_25MS, WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ltr308_read_light_level(variables_get($ltr308)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `ltr308_init_with_wire("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Dynamic fields**: `ltr308_init_with_wire` may add fields at runtime through Blockly extensions.

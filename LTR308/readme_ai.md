# LTR308光照传感器

LTR308数字光照强度传感器控制库，适用于掌控板3.0等ESP32开发板

## Library Info
- **Name**: @aily-project/lib-ltr308
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ltr308_init_with_wire` | Statement | VAR(field_input), GAIN(dropdown), INTEGRATION_TIME(dropdown), MEASUREMENT_RATE(dropdown), WIRE(dropdown) | `ltr308_init_with_wire("ltr308", LTR308_GAIN_1, LTR308_INTEGRATION_25MS, LTR308_RATE_25MS, WIRE)` | (dynamic code) |
| `ltr308_read_light_level` | Value | VAR(field_variable) | `ltr308_read_light_level($ltr308)` | (dynamic code) |
| `ltr308_read_raw_data` | Value | VAR(field_variable) | `ltr308_read_raw_data($ltr308)` | (dynamic code) |
| `ltr308_is_data_ready` | Value | VAR(field_variable) | `ltr308_is_data_ready($ltr308)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| GAIN | LTR308_GAIN_1, LTR308_GAIN_3, LTR308_GAIN_6, LTR308_GAIN_9, LTR308_GAIN_18 | 1x (1-64k lux) / 3x (0.3-21k lux) / 6x (0.15-10.6k lux) / 9x (0.1-7k lux) / 18x (0.05-3.5k lux) |
| INTEGRATION_TIME | LTR308_INTEGRATION_25MS, LTR308_INTEGRATION_50MS, LTR308_INTEGRATION_100MS, LTR308_INTEGRATION_200MS, LTR308_INTEGRATION_400MS | 25ms / 50ms / 100ms (默认) / 200ms / 400ms |
| MEASUREMENT_RATE | LTR308_RATE_25MS, LTR308_RATE_50MS, LTR308_RATE_100MS, LTR308_RATE_200MS, LTR308_RATE_500MS, LTR308_RATE_1000MS, LTR308_RATE_2000MS | 25ms / 50ms / 100ms / 200ms / 500ms (默认) / 1000ms / 2000ms |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ltr308_init_with_wire("ltr308", LTR308_GAIN_1, LTR308_INTEGRATION_25MS, LTR308_RATE_25MS, WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ltr308_read_light_level($ltr308))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `ltr308_init_with_wire("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

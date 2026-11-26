# LTR308 light sensor

LTR308 digital light intensity sensor control library, suitable for ESP32 development boards such as control board 3.0

## Library Info
- **Name**: @aily-project/lib-ltr308
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ltr308_init_with_wire` | Statement | VAR(field_input), GAIN(dropdown), INTEGRATION_TIME(dropdown), MEASUREMENT_RATE(dropdown), WIRE(dropdown) | `ltr308_init_with_wire("ltr308", LTR308_GAIN_1, LTR308_INTEGRATION_25MS, LTR308_RATE_25MS, WIRE)` | `// 初始化LTR308光照传感器 ltr308 ↵ if (ltr308.beginConfigured(&WIRE, LTR308_GAIN_1, LTR308_INTEGRATION_25MS, LTR308_RATE_25MS)) { ↵ Serial.println("LTR308传感器 ltr308 初始化成功!"); ↵ } else { ↵ Serial.println("警告: LTR308传感器 ltr308 初始化失败，请检查接线和配置!"); ↵ }` |
| `ltr308_read_light_level` | Value | VAR(field_variable) | `ltr308_read_light_level($ltr308)` | `ltr308.getLux()` |
| `ltr308_read_raw_data` | Value | VAR(field_variable) | `ltr308_read_raw_data($ltr308)` | `ltr308.getRawData()` |
| `ltr308_is_data_ready` | Value | VAR(field_variable) | `ltr308_is_data_ready($ltr308)` | `ltr308.isDataReady()` |

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
    serial_println(Serial, ltr308_read_light_level($ltr308))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `ltr308_init_with_wire("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **UI-only extension**: `ltr308_init_with_wire` refreshes board/I2C presentation only; it does not add ABS arguments.

5. A failed transfer returns `UINT32_MAX` from `getRawData()` and `NaN` from `getLux()`. The four-block interface retains the legacy 200 ms repeat selection for saved projects and reports a configuration error. All five integration times are supported.

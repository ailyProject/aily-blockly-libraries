# Five-way line tracking sensor

Emakefun five-channel line-following sensor module v3 supports analog and digital value reading

## Library Info
- **Name**: @aily-project/lib-emakefun-five-line-tracker
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `five_line_tracker_v3_setup` | Statement | VAR(field_input), I2C_ADDRESS(dropdown) | `five_line_tracker_v3_setup("lineTracker", "0x50")` | Dynamic code |
| `five_line_tracker_v3_get_device_id` | Value | VAR(field_variable) | `five_line_tracker_v3_get_device_id(variables_get($lineTracker))` | Dynamic code |
| `five_line_tracker_v3_get_firmware_version` | Value | VAR(field_variable) | `five_line_tracker_v3_get_firmware_version(variables_get($lineTracker))` | Dynamic code |
| `five_line_tracker_v3_set_high_threshold` | Statement | VAR(field_variable), CHANNEL(dropdown), THRESHOLD(input_value) | `five_line_tracker_v3_set_high_threshold(variables_get($lineTracker), "0", math_number(0))` | Dynamic code |
| `five_line_tracker_v3_set_low_threshold` | Statement | VAR(field_variable), CHANNEL(dropdown), THRESHOLD(input_value) | `five_line_tracker_v3_set_low_threshold(variables_get($lineTracker), "0", math_number(0))` | Dynamic code |
| `five_line_tracker_v3_get_analog_value` | Value | VAR(field_variable), CHANNEL(dropdown) | `five_line_tracker_v3_get_analog_value(variables_get($lineTracker), "0")` | Dynamic code |
| `five_line_tracker_v3_get_digital_value` | Value | VAR(field_variable), CHANNEL(dropdown) | `five_line_tracker_v3_get_digital_value(variables_get($lineTracker), "0")` | Dynamic code |
| `five_line_tracker_v3_get_all_digital_values` | Value | VAR(field_variable) | `five_line_tracker_v3_get_all_digital_values(variables_get($lineTracker))` | Dynamic code |
| `five_line_tracker_v3_check_error` | Value | VAR(field_variable) | `five_line_tracker_v3_check_error(variables_get($lineTracker))` | (emakefun::FiveLineTracker::kOK == |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| I2C_ADDRESS | 0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57 | five_line_tracker_v3_setup |
| CHANNEL | 0, 1, 2, 3, 4 | five_line_tracker_v3_set_high_threshold, five_line_tracker_v3_set_low_threshold, five_line_tracke... |

## ABS Examples

### Basic Usage
```
arduino_setup()
    five_line_tracker_v3_setup("lineTracker", "0x50")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, five_line_tracker_v3_get_device_id(variables_get($lineTracker)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `five_line_tracker_v3_setup("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

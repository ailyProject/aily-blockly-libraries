# SparkFun MAX30105 Pulse Oximeter & Heart Rate Sensor

Blockly wrapper for SparkFun MAX30105 pulse oximeter and heart rate sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-max30105
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `max30105_init` | Statement | VAR(field_input) | `max30105_init("heartSensor")` | Wire.begin();\n |
| `max30105_setup` | Statement | VAR(field_variable), LED_PWR(dropdown), SAMPLE_AVG(dropdown), LED_MODE(dropdown), SAMPLE_RATE(dropdown), PULSE_WIDTH(dropdown), ADC_RANGE(dropdown) | `max30105_setup(variables_get($heartSensor), "60", "4", "2", "100", "411", "16384")` | Dynamic code |
| `max30105_safe_check` | Value | VAR(field_variable), TIMEOUT(input_value) | `max30105_safe_check(variables_get($heartSensor), math_number(1000))` | Dynamic code |
| `max30105_get_red` | Value | VAR(field_variable) | `max30105_get_red(variables_get($heartSensor))` | Dynamic code |
| `max30105_get_ir` | Value | VAR(field_variable) | `max30105_get_ir(variables_get($heartSensor))` | Dynamic code |
| `max30105_get_green` | Value | VAR(field_variable) | `max30105_get_green(variables_get($heartSensor))` | Dynamic code |
| `max30105_shutdown` | Statement | VAR(field_variable) | `max30105_shutdown(variables_get($heartSensor))` | Dynamic code |
| `max30105_wakeup` | Statement | VAR(field_variable) | `max30105_wakeup(variables_get($heartSensor))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| LED_PWR | 60, 20, 6 | max30105_setup |
| SAMPLE_AVG | 4, 8, 1, 16, 32 | max30105_setup |
| LED_MODE | 2, 1, 3 | max30105_setup |
| SAMPLE_RATE | 100, 400, 800, 1000 | max30105_setup |
| PULSE_WIDTH | 411, 118, 215 | max30105_setup |
| ADC_RANGE | 16384, 4096, 8192, 32768 | max30105_setup |

## ABS Examples

### Basic Usage
```
arduino_setup()
    max30105_init("heartSensor")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, max30105_safe_check(variables_get($heartSensor), math_number(1000)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `max30105_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

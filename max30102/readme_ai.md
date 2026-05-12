# MAX30102 pulse oximeter

Blockly wrapper for the MAX30102 pulse oximeter library. It wraps MAX30102_by_RF sampling and calculation flow for SpO2, heart rate, temperature, raw red/IR values, and signal quality.

## Library Info
- **Name**: @aily-project/lib-max30102
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `max30102_init` | Statement | SDA_PIN(dropdown), SCL_PIN(dropdown), INT_PIN(dropdown) | `max30102_init(SDA_PIN, SCL_PIN, INT_PIN)` | ailyMax30102Begin( |
| `max30102_measure` | Statement | TIMEOUT(input_value) | `max30102_measure(math_number(1000))` | ailyMax30102Measure( |
| `max30102_get_value` | Value | VALUE(dropdown) | `max30102_get_value(SPO2)` | Dynamic code |
| `max30102_is_valid` | Value | TARGET(dropdown) | `max30102_is_valid(MEASURE)` | Dynamic code |
| `max30102_reset` | Statement | (none) | `max30102_reset()` | maxim_max30102_reset();\n |
| `max30102_set_led_amplitude` | Statement | LED1(input_value), LED2(input_value) | `max30102_set_led_amplitude(math_number(0), math_number(0))` | setLED1PulseAmplitude((uint8_t)( |
| `max30102_config_spo2` | Statement | AVERAGING(dropdown), ADC_RANGE(dropdown), SAMPLE_RATE(dropdown), PULSE_WIDTH(dropdown) | `max30102_config_spo2(NO_AVERAGING, ADC_RANGE_2048, SPO2_RATE_50, PW_69)` | ailyMax30102SetSpO2Config( |
| `max30102_set_finger_threshold` | Statement | THRESHOLD(input_value) | `max30102_set_finger_threshold(math_number(0))` | _ailyMax30102FingerThreshold = (uint32_t)( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| VALUE | SPO2, HEART_RATE, TEMPERATURE, RED, IR, RATIO, CORRELATION | max30102_get_value |
| TARGET | MEASURE, INIT, SPO2, HEART_RATE, FINGER | max30102_is_valid |
| AVERAGING | NO_AVERAGING, AVG_2, AVG_4, AVG_8, AVG_16, AVG_32 | max30102_config_spo2 |
| ADC_RANGE | ADC_RANGE_2048, ADC_RANGE_4096, ADC_RANGE_8192, ADC_RANGE_16384 | max30102_config_spo2 |
| SAMPLE_RATE | SPO2_RATE_50, SPO2_RATE_100, SPO2_RATE_200, SPO2_RATE_400, SPO2_RATE_800, SPO2_RATE_1000, SPO2_RATE_1600, SPO2_RATE_3200 | max30102_config_spo2 |
| PULSE_WIDTH | PW_69, PW_118, PW_215, PW_411 | max30102_config_spo2 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    max30102_init(SDA_PIN, SCL_PIN, INT_PIN)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, max30102_get_value(SPO2))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

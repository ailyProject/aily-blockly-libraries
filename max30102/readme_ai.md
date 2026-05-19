# MAX30102 Pulse Oximeter

Blockly wrapper for the MAX30102_by_RF driver and RF algorithm. It initializes the sensor, captures one FIFO batch, runs SpO2 and heart-rate calculation, and exposes the latest results as Blockly value blocks.

## Library Info
- **Name**: @aily-project/lib-max30102
- **Version**: 0.0.2
- **Compatible Cores**: esp32:esp32, esp32:esp32s3, arduino:samd

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `max30102_init` | Statement | SDA_PIN(dynamic dropdown), SCL_PIN(dynamic dropdown), INT_PIN(dynamic dropdown) | `max30102_init(21, 22, 4)` | `ailyMax30102Begin(21, 22, 4);` |
| `max30102_measure` | Statement | TIMEOUT(input_value Number) | `max30102_measure(math_number(5000))` | `ailyMax30102Measure(5000);` |
| `max30102_get_value` | Value Number | VALUE(field_dropdown) | `max30102_get_value(SPO2)` | `SPO2 -> _ailyMax30102SpO2` |
| `max30102_is_valid` | Value Boolean | TARGET(field_dropdown) | `max30102_is_valid(MEASURE)` | `MEASURE -> _ailyMax30102LastOK` |
| `max30102_reset` | Statement | none | `max30102_reset()` | `maxim_max30102_reset();` |
| `max30102_set_led_amplitude` | Statement | LED1(input_value Number), LED2(input_value Number) | `max30102_set_led_amplitude(math_number(36), math_number(36))` | `setLED1PulseAmplitude(...); setLED2PulseAmplitude(...);` |
| `max30102_config_spo2` | Statement | AVERAGING(field_dropdown), ADC_RANGE(field_dropdown), SAMPLE_RATE(field_dropdown), PULSE_WIDTH(field_dropdown) | `max30102_config_spo2(AVG_4, ADC_RANGE_4096, SPO2_RATE_100, PW_411)` | `setSampleAveraging(...); setSPO2ADCRange(...); setSPO2SampleRate(...); setSPO2PulseWidth(...);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| VALUE | SPO2, HEART_RATE, TEMPERATURE, RED, IR, RATIO, CORRELATION | Latest calculated or sampled output |
| TARGET | MEASURE, SPO2, HEART_RATE, FINGER | Validity check selector |
| AVERAGING | NO_AVERAGING, AVG_2, AVG_4, AVG_8, AVG_16, AVG_32 | Sample averaging setting |
| ADC_RANGE | ADC_RANGE_2048, ADC_RANGE_4096, ADC_RANGE_8192, ADC_RANGE_16384 | SPO2 ADC range |
| SAMPLE_RATE | SPO2_RATE_50, SPO2_RATE_100, SPO2_RATE_200, SPO2_RATE_400, SPO2_RATE_800, SPO2_RATE_1000, SPO2_RATE_1600, SPO2_RATE_3200 | Sensor sample rate |
| PULSE_WIDTH | PW_69, PW_118, PW_215, PW_411 | LED pulse width / ADC resolution |

## ABS Examples

### Basic Measurement
```text
arduino_setup()
    serial_begin(Serial, 115200)
    max30102_init(21, 22, 4)
    max30102_set_led_amplitude(math_number(36), math_number(36))
    max30102_config_spo2(AVG_4, ADC_RANGE_4096, SPO2_RATE_100, PW_411)

arduino_loop()
    max30102_measure(math_number(5000))
    controls_if()
        @IF0: max30102_is_valid(MEASURE)
        @DO0:
            serial_print(Serial, text("SpO2: "))
            serial_println(Serial, max30102_get_value(SPO2))
            serial_print(Serial, text("HR: "))
            serial_println(Serial, max30102_get_value(HEART_RATE))
    time_delay(math_number(1000))
```

## Notes

1. The library stores all results in global helper state. No Blockly variable is required.
2. `max30102_measure` must execute before `max30102_get_value(...)` returns fresh data.
3. `max30102_is_valid(MEASURE)` reflects whether both SpO2 and heart-rate calculations succeeded. `max30102_is_valid(FINGER)` is generated as `(_ailyMax30102LastIr > 50000)`.
4. SDA, SCL, and INT must all be wired. On ESP32, the selected SDA/SCL pins are passed to `Wire.begin(sda, scl)`; on non-ESP32 cores the code falls back to default `Wire.begin()`.
5. `max30102_reset()` only sends a software reset. Re-run `max30102_init(...)` after reset before measuring again.
6. The default configuration is tuned for the bundled RF algorithm. Changing averaging or sample rate can reduce result quality.
7. Avoid small-SRAM AVR boards because the implementation allocates two `BUFFER_SIZE` sample buffers plus algorithm state.

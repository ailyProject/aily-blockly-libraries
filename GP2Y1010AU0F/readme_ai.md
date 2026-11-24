# Dust sensor driver library

Read the value of the GP2Y1010AU0F dust sensor and calculate and print the dust concentration

## Library Info
- **Name**: @aily-project/lib-gp2y1010au0f
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `gp2y1010au0f_init` | Statement | LED_PIN(dropdown), MEASURE_PIN(dropdown) | `gp2y1010au0f_init(LED_PIN, MEASURE_PIN)` | `GP2Y1010AU0F dustSensor(LED_PIN, MEASURE_PIN); ↵ dustSensor.begin();` |
| `gp2y1010au0f_read` | Value | (none) | `gp2y1010au0f_read()` | `dustSensor.read()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| LED_PIN | ${board.digitalPins} | gp2y1010au0f_init |
| MEASURE_PIN | ${board.digitalPins} | gp2y1010au0f_init |

## ABS Examples

### Basic Usage
```
arduino_setup()
    gp2y1010au0f_init(LED_PIN, MEASURE_PIN)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, gp2y1010au0f_read())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

## ADC and timing

The LED control is active low. Sample 280 µs after assertion and release at 320 µs when conversion time permits. The nominal period is 10 ms. Measure AOUT only with an ADC-capable pin. The sensor requires a 5 V supply; select a compatible carrier or use level shifting and a suitable divider for a 3.3 V MCU. On ESP32 the default uses calibrated ADC millivolts. If an ESP32-S3 lacks factory eFuse coefficients, the default assumes 3.3 V at the startup ADC resolution. Configure the ADC scale explicitly after changing resolution or attenuation in that case. On STM32duino with ADC enabled it uses a 12-bit conversion with nominal 3.3 V VDDA. Other cores retain the original 5 V, 10-bit convention. Use the optional `gp2y1010au0f_adc_scale` block or call `dustSensor.setAdcScale(referenceMillivolts, maxCode)` for a different reference or a divider. Use the equivalent full-scale voltage at the sensor and the sketch's actual analogRead maximum code. The existing driver curve is 0.17 × millivolts − 100 µg/m³. Values below zero read as zero. A specific physical sensor may require optical calibration.

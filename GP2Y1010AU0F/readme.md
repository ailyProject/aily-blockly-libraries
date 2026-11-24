# Dust sensor driver library

Read the value of the GP2Y1010AU0F dust sensor and calculate and print the dust concentration

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-gp2y1010au0f |
| Version | 0.1.0 |
| Author | 奈何col |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Read the value of the GP2Y1010AU0F dust sensor and calculate and print the dust concentration

## Quick Start

1. Enable `@aily-project/lib-gp2y1010au0f` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

## ADC and timing

The LED control is active low. Sample 280 µs after assertion and release at 320 µs when conversion time permits. The nominal period is 10 ms. Measure AOUT only with an ADC-capable pin. The sensor requires a 5 V supply; select a compatible carrier or use level shifting and a suitable divider for a 3.3 V MCU. On ESP32 the default uses calibrated ADC millivolts. If an ESP32-S3 lacks factory eFuse coefficients, the default assumes 3.3 V at the startup ADC resolution. Configure the ADC scale explicitly after changing resolution or attenuation in that case. On STM32duino with ADC enabled it uses a 12-bit conversion with nominal 3.3 V VDDA. Other cores retain the original 5 V, 10-bit convention. Use the optional `gp2y1010au0f_adc_scale` block or call `dustSensor.setAdcScale(referenceMillivolts, maxCode)` for a different reference or a divider. Use the equivalent full-scale voltage at the sensor and the sketch's actual analogRead maximum code. The existing driver curve is 0.17 × millivolts − 100 µg/m³. Values below zero read as zero. A specific physical sensor may require optical calibration.

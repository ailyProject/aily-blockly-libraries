# SparkFun HIH4030 Humidity Sensor

Blockly wrapper for the SparkFun HIH4030 analog humidity sensor.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-hih4030 |
| Version | 0.0.2 |
| Author | SparkFun |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Blockly wrapper for the SparkFun HIH4030 analog humidity sensor.

## Quick Start

1. Enable `@aily-project/lib-sparkfun-hih4030` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

### ADC calibration

The two-argument constructor retains the original 10-bit conversion with the sensor supply as the ADC reference. If the ADC range, reference or wiring differs, call `setAdcCalibration(maxCode, referenceVolts, pinRatio)` after initialization. The equivalent Blockly block configures the sensor instance. `maxCode` is 1023 for 10 bits or 4095 for 12 bits. `pinRatio` is the ADC pin voltage divided by the breakout OUT voltage. The method leaves the board's ADC configuration untouched and returns false for invalid calibration values.

The HIH-4030 supply is 4.0–5.8 V. For a 5 V breakout and a simulated 3.3 V ADC, a 17 kΩ upper resistor and 33 kΩ lower resistor give a pin ratio of 0.66. With a 12-bit ADC use `sensor.setAdcCalibration(4095, 3.3f, 0.66f)`. Use the actual ADC reference, resolution and divider for the board.

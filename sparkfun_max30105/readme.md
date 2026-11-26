# SparkFun MAX30105 Pulse Oximeter & Heart Rate Sensor

Blockly wrapper for SparkFun MAX30105 pulse oximeter and heart rate sensor.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-max30105 |
| Version | 0.0.2 |
| Author | SparkFun |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Blockly wrapper for SparkFun MAX30105 pulse oximeter and heart rate sensor.

## Quick Start

1. Enable `@aily-project/lib-sparkfun-max30105` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

### FIFO transport

Initialize the sensor before setup. A failed identity check suppresses configuration writes. FIFO reads commit complete samples only. A short read retries from the interrupted chunk on a later poll. If the hardware read pointer cannot be restored, initialize and set up the sensor again. The local FIFO holds the four most recent unread samples in chronological order. Individual immediate channel getters may wait for different frames. Use check(), getFIFORed()/getFIFOIR()/getFIFOGreen() and nextSample() to read channels of one frame.

The LED power field is the 8-bit amplitude register code. Project files saved with ADC choice 32768 retain the original driver behavior (2048 nA full scale).

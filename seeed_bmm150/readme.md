# BMM150 three-axis magnetometer

## Library Info

@aily-project/lib-seeed-bmm150 0.0.3 · Seeed Studio Grove 3-Axis Digital Compass v2.

## Supported Boards

Arduino-compatible boards with Wire.

## Quick Start

Initialize once on Wire at 0x13. The block leaves the serial port available to the sketch. Check the initialized block after startup and retry after connecting the board. Initialization verifies the chip ID, factory calibration and configuration writes.

## Description

Axis readings are in µT. A failed transfer or axis overflow returns NaN. Heading uses atan2(X, Y) in [0°, 360°) with no tilt or declination correction. An invalid or zero horizontal vector returns NaN.

In Coder, readSample() reads all three axes in one transfer. Check its boolean result, then use mag_data.x, .y and .z. BMM150_OVERFLOW_OUTPUT marks an invalid axis.

[Seeed driver and examples](https://github.com/Seeed-Studio/Grove_3_Axis_Compass_V2.0_BMM150)

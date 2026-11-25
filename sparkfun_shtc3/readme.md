# SparkFun SHTC3 Humidity and Temperature Sensor

Blockly wrapper for the SparkFun SHTC3 I2C humidity and temperature sensor.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-shtc3 |
| Version | 0.0.2 |
| Author | SparkFun |
| Source | [SparkFun driver](https://github.com/sparkfun/SparkFun_SHTC3_Arduino_Library) and Aily’s 0.0.1 archive |
| License | [SparkFun source license](LICENSE.sparkfun.md) |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Blockly wrapper for the SparkFun SHTC3 I2C humidity and temperature sensor.

## Quick Start

1. Enable `@aily-project/lib-sparkfun-shtc3` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

## I²C conversion mode

The Blockly initialization block selects humidity-first normal power with
clock stretching disabled. The driver waits for conversion before reading.
This mode works with controllers whose I²C timeout is shorter than the sensor's
normal conversion time.

For Coder, select the same mode after initialization:

```cpp
Wire.begin();
if (shtc3.begin() == SHTC3_Status_Nominal) {
  shtc3.setMode(SHTC3_CMD_CSD_RHF_NPM);
}
```

`update()` waits 14 ms in normal power or 2 ms in low power before the single
read in a CSD mode. The C++ constructor and explicit CSE modes retain their
original clock-stretching behavior.

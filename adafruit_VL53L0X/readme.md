# VL53L0X laser ranging sensor

The VL53L0X laser ranging sensor driver library uses I2C communication, supports millimeter-level distance detection, has fast measurement speed, strong resistance to ambient light interference, is small in size, and...

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-adafruit-vl53l0x |
| Version | 1.0.0 |
| Author | OpenJumper |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

The VL53L0X laser ranging sensor driver library uses I2C communication, supports millimeter-level distance detection, has fast measurement speed, strong resistance to ambient light interference, is small in size, and...

## Quick Start

1. Enable `@aily-project/lib-adafruit-vl53l0x` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.


## 1.0.1 timing compatibility candidate

The Arduino platform polling delay uses a 200 µs time interval. The
measurement-ready register and existing retry limits remain authoritative.
This candidate profiled the default one-shot mode, 33 ms. The ST API
version, I²C commands, generated Blockly code and public C++ calls remain
the same.


## 1.0.2 measurement polling candidate

The original measurement-completion API checks the hardware ready status at
2 ms intervals while a measurement is pending. Each call uses the configured
measurement budget (at least 33 ms) plus 100 ms of timeout margin. A separate
poll-count bound handles a stalled timer. Short NVM, controller start/stop,
and other platform waits retain their 1.0.1 behavior. This changes the host
poll cadence only. Device and calibration timing follow the sensor.

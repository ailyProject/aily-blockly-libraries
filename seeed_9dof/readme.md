# Seeed 9DOF IMU

Blockly library for Grove IMU 9DOF (ICM20600 + AK09918), covering acceleration, gyroscope, magnetometer, calibration and heading readings.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-seeed-9dof |
| Version | 0.0.1 |
| Author | Seeed Studio |
| Source | https://github.com/Seeed-Studio/Seeed_ICM20600_AK09918 |
| License | MIT |

## Supported Boards

Arduino-compatible boards with I2C support. The Grove module supports 3.3V and 5V systems.

## Description

This package wraps Seeed's ICM20600 + AK09918 Arduino library for visual programming. It creates one Blockly variable for the combined 9DOF sensor and exposes blocks for six-axis motion data, magnetic field data, device status, magnetic calibration and heading calculation.

## Quick Start

Connect the Grove 9DOF module to I2C, place `seeed_9dof_init` in setup, then read motion or magnetic values in loop.
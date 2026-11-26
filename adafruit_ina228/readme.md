# Adafruit INA228

Blocks for the INA228 high-precision current, voltage, power, energy and charge monitor.

中文简介：用于 INA228 高精度电流、电压、功率、能量和电荷监测器。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-adafruit-ina228 |
| Version | 0.1.2 |
| Author | Adafruit |
| Source | https://github.com/adafruit/Adafruit_INA228 |
| License | BSD-3-Clause |

## Supported Boards

Arduino-compatible boards using I2C.

## Description

Measures bus and shunt voltage, current, power, energy, charge and die temperature.

## Quick Start

Initialize once in setup and check the initialized block. After reconnecting the sensor, retry in the program flow and reapply shunt calibration. A failed measurement returns NaN.

初始化失败后程序继续运行。重新接线后可重试，并按实际电阻校准。Adafruit #5832 使用 0.015 Ω。

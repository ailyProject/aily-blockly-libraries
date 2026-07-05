# BMP58X Barometer

BMP58X reads pressure, temperature, and altitude through I2C, SPI, or UART.

## Library Info

| Field | Value |
|-------|-------|
| Package | `@aily-project/lib-dfrobot-bmp58x` |
| Version | `0.1.0` |
| Author | DFRobot |
| Source | https://gitee.com/dfrobot/DFRobot_BMP58X |
| License | MIT |

## Supported Boards

Arduino-compatible boards supported by the upstream library.

## Description

Supports BMP581/BMP585 pressure and temperature reading, altitude calculation, ODR, OSR, IIR filter, measurement mode, and altitude calibration. DFRobot_RTU is bundled for UART mode.

## Quick Start

Initialize by I2C, SPI, or UART, set measurement mode to normal, optionally configure ODR/OSR/IIR, then read temperature, pressure, or altitude in the loop.

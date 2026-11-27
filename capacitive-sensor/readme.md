# CapacitiveSensor

Capacitive touch sensor library providing touch sensing readouts and auto-calibration configuration blocks

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-capacitive-sensor |
| Version | 0.0.1 |
| Author | ericoding |
| Source | https://github.com/PaulStoffregen/CapacitiveSensor |
| License | Original license |

## Supported Boards

Arduino AVR, ESP32, RP2040

## Description

Capacitive touch sensor library providing touch sensing readouts and auto-calibration configuration blocks

## Quick Start

1. Enable `@aily-project/lib-capacitive-sensor` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

### ESP32-S3

0.0.2 在 ESP32-S3 上使用所选 Arduino 板卡的 GPIO 编号与输入输出 API。发送与接收脚之间需要高值电阻，触摸电极接在接收脚。原始读数是固件轮询计数，其量级随电阻、走线电容、芯片主频和 Core 实现变化。

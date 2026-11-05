# Software I2C PCA9685

## Library Info

- Package: @aily-project/lib-swi2c-pca9685
- Version: 0.0.1
- Author: leisure-zhou
- License: UNLICENSED

## Supported Boards

Arduino boards with two available GPIO pins. Arduino Uno C++11 compilation is verified.

## Description

Drive 16 PCA9685 servo channels using software I2C on selected SDA/SCL pins. Set servo angles or pulse widths and check device presence. Defaults: address 0x40, 50 Hz, 500–2500 us pulses. Pulse conversion follows the programmed frequency divider.

## Quick Start

Connect SDA/SCL with pull-ups and use a separate servo supply with shared ground. Initialize, then set an angle or pulse width. See [ABS examples](readme_ai.md). Locales without translations currently use English labels.

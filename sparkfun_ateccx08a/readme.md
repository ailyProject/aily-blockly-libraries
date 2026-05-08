# SparkFun ATECCX08A

SparkFun ATECCX08A cryptographic co-processor Blockly library.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-ateccx08a |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_ATECCX08a_Arduino_Library |
| License | GPL-3.0 |

## Supported Boards

Arduino UNO, ESP32, and other Wire-compatible boards.

## Description

This library wraps the SparkFun ATECCX08A Arduino library for Blockly. It supports I2C initialization, wake/sleep, configuration-zone reads, lock-status fields, random values, key-pair creation, public-key generation, and explicit configuration/lock commands.

## Quick Start

Connect by Qwiic/I2C, call `ateccx08a_init`, then use random, key, or configuration blocks. Locking blocks are permanent device operations.
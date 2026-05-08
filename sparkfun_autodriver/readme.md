# SparkFun L6470 AutoDriver

SparkFun L6470 AutoDriver stepper motor Blockly library.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-autodriver |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_AutoDriver_Arduino_Library |
| License | Beerware |

## Supported Boards

Arduino AVR and other SPI-compatible boards supported by the upstream library.

## Description

This library wraps the SparkFun L6470 AutoDriver for Blockly. It supports object creation, SPI setup, microstepping, speed, acceleration, KVAL, run, move, go-to, position, status, stop, high-impedance, and reset commands.

## Quick Start

Wire the AutoDriver SPI pins, call `autodriver_init`, configure step mode and speed, then call `autodriver_move` or `autodriver_run`.
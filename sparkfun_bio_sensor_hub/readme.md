# SparkFun Bio Sensor Hub

SparkFun MAX32664 Bio Sensor Hub heart-rate and SpO2 Blockly library.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-bio-sensor-hub |
| Version | 0.0.1 |
| Author | Elias Santistevan / SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_Bio_Sensor_Hub_Library |
| License | MIT |

## Supported Boards

Arduino UNO, ESP32, and other Wire-compatible boards with reset and MFIO pins.

## Description

This library wraps the SparkFun Bio Sensor Hub for Blockly. It supports initialization, BPM configuration, sensor+BPM reads, cached heart-rate, oxygen, confidence, status, LED values, pulse width, sample rate, and ADC range.

## Quick Start

Connect SDA/SCL plus RESET/MFIO, call `biohub_init`, configure with `biohub_config_bpm`, wait briefly, then call `biohub_read_bpm` before reading fields with `biohub_value`.
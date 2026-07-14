# R4 FreeRTOS

FreeRTOS multitasking support for Arduino UNO R4

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-arduino-freertos |
| Version | 1.0.0 |
| Author | Arduino |
| Source | https://github.com/arduino/ArduinoCore-renesas/tree/main/libraries/Arduino_FreeRTOS |
| License | GPL-2.0-or-later OR LGPL-2.1-or-later |

## Supported Boards

Arduino UNO R4

## Description

FreeRTOS multitasking support for Arduino UNO R4

## Quick Start

1. Enable `@aily-project/lib-arduino-freertos` in Aily Blockly.
2. Create tasks in setup; define bodies with top-level `r4_freertos_task_function` blocks.
3. Put delays in task bodies; both accept any Number-output block.
4. Task creation auto-starts the scheduler; the explicit block shares that deduplicated action.

Task code runs in FreeRTOS tasks, not `arduino_loop()`.

Legacy `freertos_*` blocks must be recreated as `r4_freertos_*` when upgrading.

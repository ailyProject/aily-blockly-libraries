# Seeed FreeRTOS

## Library Info
- Name: @aily-project/lib-seeed-freertos
- Version: 1.0.0
- Source: https://github.com/Seeed-Studio/Seeed_Arduino_FreeRTOS
- License: MIT

## Supported Boards
- Seeed Wio Terminal
- Seeeduino XIAO
- Seeeduino Zero series
- Other Arduino SAMD21/SAMD51 boards supported by the Seeed FreeRTOS port

## Description
This library wraps Seeed_Arduino_FreeRTOS for Blockly projects. It supports task creation, task functions, scheduler startup, task delays, queues, semaphores, task notifications, interrupt-safe helpers, and runtime diagnostics such as stack high-water mark and free heap size.

## Quick Start
Create a task, define the matching task function, then place task work inside that function. Creating a task automatically adds the scheduler startup at the end of setup with a short `vNopDelayMS(1000)` startup delay. Use queue or semaphore blocks when tasks need to exchange data or synchronize work.

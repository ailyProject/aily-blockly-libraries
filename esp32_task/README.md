# ESP32 multitasking

Define, start and stop named ESP32 tasks using the DFRobot_Task FreeRTOS wrapper.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-esp32-task |
| Version | 1.0.0 |
| Author | Vonweller |
| Source | N/A |
| License | Original license |

## Supported Boards

ESP32

## Description

Each task has an initialization section that runs once per start and a repeating loop section. On single-core chips such as ESP32-C3, tasks share one core; multitasking does not imply separate-core parallel execution.

## Quick Start

1. Enable `@aily-project/lib-esp32-task` in Aily Blockly.
2. Define a task with the top-level `esp32_task_new` Hat, outside `arduino_setup()` and `arduino_loop()`.
3. Initialize shared hardware/resources in `arduino_setup()` before starting the matching task name.
4. Include a positive task delay or another blocking wait in the task loop. See [ABS examples and execution limits](readme_ai.md).

## Limits and stopping tasks

The current ESP32 wrapper supports up to 8 tasks, with fixed priority 1 and stack size 2048 bytes. These blocks do not configure priority/stack or return task-creation status. A periodically waiting task may remain alive for the application's lifetime.

Deleting a task does not automatically free its user allocations or release shared resources; arrange cleanup and a safe stop first. Moving code into a task does not make blocking functions nonblocking or guarantee that serial buffers will not overflow. Bound receive storage/work, handle incomplete frames and coordinate shared access explicitly.

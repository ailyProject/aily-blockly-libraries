# ESP32 multitasking

Define, start and stop named ESP32 tasks using the DFRobot_Task FreeRTOS wrapper.

## Library Info
- **Name**: @aily-project/lib-esp32-task
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_task_new` | Hat | TASK_NAME(field_input), SETUP(input_statement), LOOP(input_statement) | `esp32_task_new("task1")` | `newTask(task1); ↵ void task1::setup() { ↵ } ↵ void task1::loop() { ↵ }` |
| `esp32_task_start` | Statement | TASK_NAME(input_value) | `esp32_task_start(text("task1"))` | `taskStart(task1);` |
| `esp32_task_start_all` | Statement | (none) | `esp32_task_start_all()` | `taskStart();` |
| `esp32_task_free` | Statement | TASK_NAME(input_value) | `esp32_task_free(text("task1"))` | `taskFree(task1);` |
| `esp32_task_free_all` | Statement | (none) | `esp32_task_free_all()` | `taskFree();` |
| `esp32_task_delay` | Statement | DELAY_TIME(input_value) | `esp32_task_delay(math_number(1000))` | `delay(1000);` |

## ABS Examples

### Basic Usage
```abs
esp32_task_new("task1")
    @SETUP:
        serial_println(Serial, text("Task started"))
    @LOOP:
        serial_println(Serial, text("Task running"))
        esp32_task_delay(math_number(1000))

arduino_setup()
    serial_begin(Serial, 9600)
    esp32_task_start(text("task1"))

arduino_loop()
    time_delay(math_number(1000))
```

`esp32_task_new` is a **top-level Hat**, not a statement inside `arduino_setup()`, `arduino_loop()` or another task. Its `@SETUP` runs once on each successful start; its `@LOOP` repeats. Use unique C++ identifier names, and pass the same name to start/free. Initialize shared hardware and resources **before** starting a task: it may run immediately. The example also uses the core serial and time libraries.

## Execution limits and lifecycle

- This wrapper registers at most **8 tasks**. Its ESP32 implementation fixes each task's **priority to 1** and **stack to 2048 bytes**; neither is configurable through these blocks. The wrapper selects core 0 for unicore builds and core 1 otherwise. **ESP32-C3 is single-core**, so tasks share core 0 rather than execute in parallel on separate cores.
- Start checks task creation internally but **does not return a creation status** to the application. An unknown task name or failed allocation must not be treated as successful execution. Use another suitable API/library when explicit priority, stack or creation-status control is required.
- Put a positive task delay or another blocking wait in a periodic task's `@LOOP`. The wrapper's automatic `yield()` is not a timed wait. A delay runs only after preceding code completes; it does not bound a blocking function's runtime or guarantee a response deadline.
- A long-lived task that periodically waits is a normal lifecycle, not a resource leak by itself. Stop it only when its work is no longer needed. `esp32_task_free` deletes the registered task handle but **does not automatically free user allocations or release application-held resources**; arrange cleanup and a safe stop before deletion. Do not delete a worker while it owns a shared resource.
- Moving serial processing into a task **does not guarantee that serial buffers cannot overflow**. Give each stream one deliberate consumer, bound message storage and parsing work, define incomplete-frame/overflow handling, and coordinate shared resources. Calls such as `readStringUntil()` may still wait for a terminator or timeout; an added task delay does not make them nonblocking.

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

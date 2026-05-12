# ESP32 multitasking

ESP32 multi-threaded task management library implements parallel task execution based on FreeRTOS and supports task creation, startup and release

## Library Info
- **Name**: @aily-project/lib-esp32-task
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_task_new` | Hat | TASK_NAME(field_input), SETUP(input_statement), LOOP(input_statement) | `esp32_task_new("task1") @SETUP: child_block() @LOOP: child_block()` | newTask( |
| `esp32_task_start` | Statement | TASK_NAME(input_value) | `esp32_task_start(text("value"))` | taskStart( |
| `esp32_task_start_all` | Statement | (none) | `esp32_task_start_all()` | taskStart();\n |
| `esp32_task_free` | Statement | TASK_NAME(input_value) | `esp32_task_free(text("value"))` | taskFree( |
| `esp32_task_free_all` | Statement | (none) | `esp32_task_free_all()` | taskFree();\n |
| `esp32_task_delay` | Statement | DELAY_TIME(input_value) | `esp32_task_delay(math_number(1000))` | delay( |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_task_start(text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    esp32_task_new("task1") @SETUP: child_block() @LOOP: child_block()
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

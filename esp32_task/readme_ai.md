# ESP32多任务

ESP32多线程任务管理库，基于FreeRTOS实现并行任务执行，支持任务创建、启动和释放

## Library Info
- **Name**: @aily-project/lib-esp32-task
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_task_new` | Statement | TASK_NAME(field_input) | `esp32_task_new("task1")` | `` |
| `esp32_task_start` | Statement | TASK_NAME(input_value) | `esp32_task_start(math_number(0))` | `taskStart(` |
| `esp32_task_start_all` | Statement | (none) | `esp32_task_start_all()` | `taskStart();\n` |
| `esp32_task_free` | Statement | TASK_NAME(input_value) | `esp32_task_free(math_number(0))` | `taskFree(` |
| `esp32_task_free_all` | Statement | (none) | `esp32_task_free_all()` | `taskFree();\n` |
| `esp32_task_delay` | Statement | DELAY_TIME(input_value) | `esp32_task_delay(math_number(1000))` | `delay(` |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

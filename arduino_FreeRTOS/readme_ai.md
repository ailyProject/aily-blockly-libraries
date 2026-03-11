# Arduino freeRTOS

适用于Arduino UNO R4的freeRTOS支持库

## Library Info
- **Name**: @aily-project/lib-arduino-freertos
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `freertos_task_create` | Statement | TASK_NAME(field_input), STACK_SIZE(field_number), PRIORITY(field_number) | `freertos_task_create("TaskBlink", 128, 1)` | (dynamic code) |
| `freertos_task_function` | Statement | TASK_NAME(field_input), TASK_CODE(input_statement) | `freertos_task_function("TaskBlink")` @TASK_CODE: ... | `` |
| `freertos_task_delay` | Statement | DELAY_MS(field_number) | `freertos_task_delay(1000)` | `vTaskDelay(... / portTICK_PERIOD_MS);\n` |
| `freertos_task_suspend` | Statement | TASK_HANDLE(field_input) | `freertos_task_suspend("TaskBlink_Handler")` | `vTaskSuspend(...);\n` |
| `freertos_task_resume` | Statement | TASK_HANDLE(field_input) | `freertos_task_resume("TaskBlink_Handler")` | `vTaskResume(...);\n` |
| `freertos_task_delete` | Statement | TASK_HANDLE(dropdown) | `freertos_task_delete(NULL)` | `vTaskDelete(...);\n` |
| `freertos_queue_create` | Statement | QUEUE_NAME(field_input), QUEUE_LENGTH(field_number), DATA_TYPE(dropdown) | `freertos_queue_create("myQueue", 10, int)` | `... = xQueueCreate(..., ...);\n` |
| `freertos_queue_send` | Statement | QUEUE_NAME(field_input), DATA(input_value) | `freertos_queue_send("myQueue", math_number(0))` | `xQueueSend(..., &..., portMAX_DELAY);\n` |
| `freertos_queue_receive` | Statement | QUEUE_NAME(field_input), VARIABLE(field_input) | `freertos_queue_receive("myQueue", "receivedData")` | `if (xQueueReceive(..., &..., portMAX_DELAY) == pdPASS) {\n` |
| `freertos_semaphore_create` | Statement | SEMAPHORE_TYPE(dropdown), SEMAPHORE_NAME(field_input) | `freertos_semaphore_create(Binary, "mySemaphore")` | `... = ...;\n` |
| `freertos_semaphore_take` | Value | SEMAPHORE_NAME(field_input), WAIT_TIME(field_number) | `freertos_semaphore_take("mySemaphore", 1000)` | `xSemaphoreTake(..., ... / portTICK_PERIOD_MS)` |
| `freertos_semaphore_give` | Statement | SEMAPHORE_NAME(field_input) | `freertos_semaphore_give("mySemaphore")` | `xSemaphoreGive(...);\n` |
| `freertos_interrupt_handler` | Statement | PIN(field_number), MODE(dropdown), INTERRUPT_CODE(input_statement) | `freertos_interrupt_handler(2, LOW)` @INTERRUPT_CODE: ... | `` |
| `freertos_task_notification_send` | Statement | TASK_HANDLE(field_input) | `freertos_task_notification_send("TaskHandle")` | `xTaskNotifyGive(...);\n` |
| `freertos_task_notification_wait` | Value | (none) | `freertos_task_notification_wait()` | `ulTaskNotifyTake(pdTRUE, portMAX_DELAY)` |
| `freertos_get_tick_count` | Value | (none) | `freertos_get_tick_count()` | `xTaskGetTickCount()` |
| `freertos_get_task_name` | Value | TASK_HANDLE(dropdown) | `freertos_get_task_name(NULL)` | `pcTaskGetName(...)` |
| `freertos_get_free_heap_size` | Value | (none) | `freertos_get_free_heap_size()` | `xPortGetFreeHeapSize()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TASK_HANDLE | NULL, HANDLE | 当前任务 / 指定任务 |
| DATA_TYPE | int, String, struct, array | 整数 / 字符串 / 结构体 / 数组 |
| SEMAPHORE_TYPE | Binary, Mutex, Counting | 二进制 / 互斥锁 / 计数 |
| MODE | LOW, RISING, FALLING, CHANGE | 低电平 / 上升沿 / 下降沿 / 变化 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    freertos_task_create("TaskBlink", 128, 1)
    freertos_queue_create("myQueue", 10, int)
    freertos_semaphore_create(Binary, "mySemaphore")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, freertos_semaphore_take("mySemaphore", 1000))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

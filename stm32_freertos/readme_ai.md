# STM32 FreeRTOS

FreeRTOS multitasking support for STM32 Arduino

## Library Info
- **Name**: @aily-project/lib-stm32-freertos
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `stm32_freertos_task_create` | Statement | VAR(field_input), STACK_SIZE(field_number), PRIORITY(field_number) | `stm32_freertos_task_create("TaskBlink", 256, 2)` | xTaskCreate(\n |
| `stm32_freertos_task_function` | Hat | VAR(field_variable), TASK_CODE(input_statement) | `stm32_freertos_task_function(variables_get($TaskBlink)) @TASK_CODE: child_block()` | Dynamic code |
| `stm32_freertos_start_scheduler` | Statement | (none) | `stm32_freertos_start_scheduler()` | Dynamic code |
| `stm32_freertos_task_delay_ms` | Statement | MS(input_value) | `stm32_freertos_task_delay_ms(math_number(1000))` | vTaskDelay(pdMS_TO_TICKS( |
| `stm32_freertos_task_delay_ticks` | Statement | TICKS(input_value) | `stm32_freertos_task_delay_ticks(math_number(0))` | vTaskDelay( |
| `stm32_freertos_task_suspend` | Statement | VAR(field_variable) | `stm32_freertos_task_suspend(variables_get($TaskBlink))` | vTaskSuspend( |
| `stm32_freertos_task_resume` | Statement | VAR(field_variable) | `stm32_freertos_task_resume(variables_get($TaskBlink))` | vTaskResume( |
| `stm32_freertos_task_delete` | Statement | VAR(field_variable) | `stm32_freertos_task_delete(variables_get($TaskBlink))` | vTaskDelete( |
| `stm32_freertos_task_delete_current` | Statement | (none) | `stm32_freertos_task_delete_current()` | vTaskDelete(NULL);\n |
| `stm32_freertos_task_notify` | Statement | VAR(field_variable) | `stm32_freertos_task_notify(variables_get($TaskBlink))` | xTaskNotifyGive( |
| `stm32_freertos_task_notify_from_isr` | Statement | VAR(field_variable) | `stm32_freertos_task_notify_from_isr(variables_get($TaskBlink))` | Dynamic code |
| `stm32_freertos_task_wait_notification` | Value | WAIT_MODE(dropdown), WAIT_MS(input_value) | `stm32_freertos_task_wait_notification(MS, math_number(1000))` | (ulTaskNotifyTake(pdTRUE, |
| `stm32_freertos_queue_create` | Statement | VAR(field_input), QUEUE_LENGTH(field_number), DATA_TYPE(dropdown) | `stm32_freertos_queue_create("sensorQueue", 10, int)` | Dynamic code |
| `stm32_freertos_queue_send` | Statement | VAR(field_variable), DATA(input_value), DATA_TYPE(dropdown), WAIT_MODE(dropdown), WAIT_MS(input_value) | `stm32_freertos_queue_send(variables_get($sensorQueue), math_number(0), int, MS, math_number(1000))` | Dynamic code |
| `stm32_freertos_queue_receive_do` | Statement | VAR(field_variable), DATA_TYPE(dropdown), ITEM_VAR(field_input), WAIT_MODE(dropdown), WAIT_MS(input_value), HANDLER(input_statement) | `stm32_freertos_queue_receive_do(variables_get($sensorQueue), int, "queueValue", MS, math_number(1000)) @HANDLER: child_block()` | Dynamic code |
| `stm32_freertos_queue_messages_waiting` | Value | VAR(field_variable) | `stm32_freertos_queue_messages_waiting(variables_get($sensorQueue))` | uxQueueMessagesWaiting( |
| `stm32_freertos_semaphore_create` | Statement | VAR(field_input), SEMAPHORE_TYPE(dropdown), MAX_COUNT(field_number), INITIAL_COUNT(field_number) | `stm32_freertos_semaphore_create("syncSem", BINARY, 10, 0)` | Dynamic code |
| `stm32_freertos_semaphore_take` | Value | VAR(field_variable), WAIT_MODE(dropdown), WAIT_MS(input_value) | `stm32_freertos_semaphore_take(variables_get($syncSem), MS, math_number(1000))` | (xSemaphoreTake( |
| `stm32_freertos_semaphore_give` | Statement | VAR(field_variable) | `stm32_freertos_semaphore_give(variables_get($syncSem))` | xSemaphoreGive( |
| `stm32_freertos_semaphore_give_from_isr` | Statement | VAR(field_variable) | `stm32_freertos_semaphore_give_from_isr(variables_get($syncSem))` | Dynamic code |
| `stm32_freertos_attach_interrupt` | Hat | PIN(field_number), MODE(dropdown), ISR_CODE(input_statement) | `stm32_freertos_attach_interrupt(2, LOW) @ISR_CODE: child_block()` | Dynamic code |
| `stm32_freertos_get_tick_count` | Value | (none) | `stm32_freertos_get_tick_count()` | xTaskGetTickCount() |
| `stm32_freertos_get_task_count` | Value | (none) | `stm32_freertos_get_task_count()` | uxTaskGetNumberOfTasks() |
| `stm32_freertos_get_task_name` | Value | VAR(field_variable) | `stm32_freertos_get_task_name(variables_get($TaskBlink))` | pcTaskGetName( |
| `stm32_freertos_get_current_task_name` | Value | (none) | `stm32_freertos_get_current_task_name()` | pcTaskGetName(NULL) |
| `stm32_freertos_get_stack_high_water_mark` | Value | VAR(field_variable) | `stm32_freertos_get_stack_high_water_mark(variables_get($TaskBlink))` | uxTaskGetStackHighWaterMark( |
| `stm32_freertos_get_idle_stack_high_water_mark` | Value | (none) | `stm32_freertos_get_idle_stack_high_water_mark()` | uxTaskGetStackHighWaterMark(xTaskGetIdleTaskHandle()) |
| `stm32_freertos_get_free_heap_size` | Value | (none) | `stm32_freertos_get_free_heap_size()` | xPortGetFreeHeapSize() |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| WAIT_MODE | MS, FOREVER | stm32_freertos_task_wait_notification, stm32_freertos_queue_send, stm32_freertos_queue_receive_do |
| DATA_TYPE | int, long, uint32_t, int32_t, float, double, uint8_t, bool | stm32_freertos_queue_create, stm32_freertos_queue_send, stm32_freertos_queue_receive_do |
| SEMAPHORE_TYPE | BINARY, MUTEX, COUNTING | stm32_freertos_semaphore_create |
| MODE | LOW, RISING, FALLING, CHANGE | stm32_freertos_attach_interrupt |

## ABS Examples

### Basic Usage
```
arduino_setup()
    stm32_freertos_task_create("TaskBlink", 256, 2)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, stm32_freertos_task_wait_notification(MS, math_number(1000)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `stm32_freertos_task_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

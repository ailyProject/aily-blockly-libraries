# R4 FreeRTOS

FreeRTOS multitasking support for Arduino UNO R4

## Library Info
- **Name**: @aily-project/lib-arduino-freertos
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `r4_freertos_task_create` | Statement | VAR(field_input), STACK_SIZE(field_number), PRIORITY(field_number) | `r4_freertos_task_create("TaskBlink", 128, 1)` | xTaskCreate(\n |
| `r4_freertos_task_function` | Hat | VAR(field_variable), TASK_CODE(input_statement) | `r4_freertos_task_function(variables_get($TaskBlink)) @TASK_CODE: child_block()` | Dynamic code |
| `r4_freertos_start_scheduler` | Statement | (none) | `r4_freertos_start_scheduler()` | setup end: vTaskStartScheduler(); |
| `r4_freertos_task_delay_ms` | Statement | MS(input_value) | `r4_freertos_task_delay_ms(math_number(1000))` | vTaskDelay(pdMS_TO_TICKS( |
| `r4_freertos_task_delay_ticks` | Statement | TICKS(input_value) | `r4_freertos_task_delay_ticks(math_number(1))` | vTaskDelay( |
| `r4_freertos_task_suspend` | Statement | VAR(field_variable) | `r4_freertos_task_suspend(variables_get($TaskBlink))` | vTaskSuspend( |
| `r4_freertos_task_resume` | Statement | VAR(field_variable) | `r4_freertos_task_resume(variables_get($TaskBlink))` | vTaskResume( |
| `r4_freertos_task_delete` | Statement | VAR(field_variable) | `r4_freertos_task_delete(variables_get($TaskBlink))` | vTaskDelete( |
| `r4_freertos_task_delete_current` | Statement | (none) | `r4_freertos_task_delete_current()` | vTaskDelete(NULL);\n |
| `r4_freertos_task_notify` | Statement | VAR(field_variable) | `r4_freertos_task_notify(variables_get($TaskBlink))` | xTaskNotifyGive( |
| `r4_freertos_task_notify_from_isr` | Statement | VAR(field_variable) | `r4_freertos_task_notify_from_isr(variables_get($TaskBlink))` | Dynamic code |
| `r4_freertos_task_wait_notification` | Value | WAIT_MODE(dropdown), WAIT_MS(input_value) | `r4_freertos_task_wait_notification(MS, math_number(1000))` | (ulTaskNotifyTake(pdTRUE, |
| `r4_freertos_queue_create` | Statement | VAR(field_input), QUEUE_LENGTH(field_number), DATA_TYPE(dropdown) | `r4_freertos_queue_create("sensorQueue", 10, int)` | Dynamic code |
| `r4_freertos_queue_send` | Statement | VAR(field_variable), DATA(input_value), DATA_TYPE(dropdown), WAIT_MODE(dropdown), WAIT_MS(input_value) | `r4_freertos_queue_send(variables_get($sensorQueue), math_number(0), int, MS, math_number(1000))` | Dynamic code |
| `r4_freertos_queue_receive_do` | Statement | VAR(field_variable), DATA_TYPE(dropdown), ITEM_VAR(field_input), WAIT_MODE(dropdown), WAIT_MS(input_value), HANDLER(input_statement) | `r4_freertos_queue_receive_do(variables_get($sensorQueue), int, "queueValue", MS, math_number(1000)) @HANDLER: child_block()` | Dynamic code |
| `r4_freertos_queue_messages_waiting` | Value | VAR(field_variable) | `r4_freertos_queue_messages_waiting(variables_get($sensorQueue))` | uxQueueMessagesWaiting( |
| `r4_freertos_semaphore_create` | Statement | VAR(field_input), SEMAPHORE_TYPE(dropdown), MAX_COUNT(field_number), INITIAL_COUNT(field_number) | `r4_freertos_semaphore_create("syncSem", BINARY, 10, 0)` | Dynamic code |
| `r4_freertos_semaphore_take` | Value | VAR(field_variable), WAIT_MODE(dropdown), WAIT_MS(input_value) | `r4_freertos_semaphore_take(variables_get($syncSem), MS, math_number(1000))` | (xSemaphoreTake( |
| `r4_freertos_semaphore_give` | Statement | VAR(field_variable) | `r4_freertos_semaphore_give(variables_get($syncSem))` | xSemaphoreGive( |
| `r4_freertos_semaphore_give_from_isr` | Statement | VAR(field_variable) | `r4_freertos_semaphore_give_from_isr(variables_get($syncSem))` | Dynamic code |
| `r4_freertos_attach_interrupt` | Hat | PIN(field_number), MODE(dropdown), ISR_CODE(input_statement) | `r4_freertos_attach_interrupt(2, LOW) @ISR_CODE: child_block()` | Dynamic code |
| `r4_freertos_get_tick_count` | Value | (none) | `r4_freertos_get_tick_count()` | xTaskGetTickCount() |
| `r4_freertos_get_task_count` | Value | (none) | `r4_freertos_get_task_count()` | uxTaskGetNumberOfTasks() |
| `r4_freertos_get_task_name` | Value | VAR(field_variable) | `r4_freertos_get_task_name(variables_get($TaskBlink))` | pcTaskGetName( |
| `r4_freertos_get_current_task_name` | Value | (none) | `r4_freertos_get_current_task_name()` | pcTaskGetName(NULL) |
| `r4_freertos_get_free_heap_size` | Value | (none) | `r4_freertos_get_free_heap_size()` | xPortGetFreeHeapSize() |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| WAIT_MODE | MS, FOREVER | r4_freertos_task_wait_notification, r4_freertos_queue_send, r4_freertos_queue_receive_do |
| DATA_TYPE | int, long, uint32_t, int32_t, float, double, uint8_t, bool | r4_freertos_queue_create, r4_freertos_queue_send, r4_freertos_queue_receive_do |
| SEMAPHORE_TYPE | BINARY, COUNTING | r4_freertos_semaphore_create |
| MODE | LOW, RISING, FALLING, CHANGE | r4_freertos_attach_interrupt |

## ABS Examples

### Basic Usage
```
arduino_setup()
    r4_freertos_task_create("TaskBlink", 128, 1)

r4_freertos_task_function(variables_get($TaskBlink)) @TASK_CODE:
    r4_freertos_task_delay_ms(math_arithmetic(math_number(750), ADD, math_number(250)))
```

## Notes

1. **Variable**: `r4_freertos_task_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Number inputs**: `MS`, `TICKS`, and `WAIT_MS` accept `math_number(n)`, arithmetic, numeric variables, or any Number-output block; other inputs follow their block's declared check.
4. **Scheduler**: task creation adds the setup-end action automatically. Use `r4_freertos_start_scheduler()` only for explicit control; both paths share one key, so `vTaskStartScheduler();` is deduplicated.
5. **Execution**: put runtime logic in `r4_freertos_task_function`; the scheduler starts at the end of setup and does not continue into the normal Arduino loop.
6. **Upgrade**: legacy projects using generic `freertos_*` block IDs have no automatic migration; recreate those blocks with the corresponding `r4_freertos_*` types.

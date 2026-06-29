# Seeed FreeRTOS

FreeRTOS multitasking support for Seeed SAMD boards and Wio Terminal.

## Library Info
- **Name**: @aily-project/lib-seeed-freertos
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_freertos_task_create` | Statement | VAR(field_input), STACK_SIZE(field_number), PRIORITY(field_number) | `seeed_freertos_task_create("TaskBlink", 256, 2)` | `xTaskCreate(...)` |
| `seeed_freertos_task_function` | Hat | VAR(field_variable), TASK_CODE(input_statement) | `seeed_freertos_task_function(variables_get($TaskBlink)) @TASK_CODE: child_block()` | task function with `for (;;)` |
| `seeed_freertos_start_scheduler` | Statement | (none) | `seeed_freertos_start_scheduler()` | setup-end `vTaskStartScheduler();` |
| `seeed_freertos_start_tinyusb_task` | Statement | (none) | `seeed_freertos_start_tinyusb_task()` | guarded `tinyusb_task();` |
| `seeed_freertos_task_delay_ms` | Statement | MS(input_value) | `seeed_freertos_task_delay_ms(math_number(1000))` | `vTaskDelay(pdMS_TO_TICKS(...));` |
| `seeed_freertos_task_delay_ticks` | Statement | TICKS(input_value) | `seeed_freertos_task_delay_ticks(math_number(1))` | `vTaskDelay(...);` |
| `seeed_freertos_nop_delay_ms` | Statement | MS(input_value) | `seeed_freertos_nop_delay_ms(math_number(1000))` | `vNopDelayMS(...);` |
| `seeed_freertos_task_suspend` | Statement | VAR(field_variable) | `seeed_freertos_task_suspend(variables_get($TaskBlink))` | `vTaskSuspend(...)` |
| `seeed_freertos_task_resume` | Statement | VAR(field_variable) | `seeed_freertos_task_resume(variables_get($TaskBlink))` | `vTaskResume(...)` |
| `seeed_freertos_task_delete` | Statement | VAR(field_variable) | `seeed_freertos_task_delete(variables_get($TaskBlink))` | `vTaskDelete(...)` |
| `seeed_freertos_task_delete_current` | Statement | (none) | `seeed_freertos_task_delete_current()` | `vTaskDelete(NULL);` |
| `seeed_freertos_task_notify` | Statement | VAR(field_variable) | `seeed_freertos_task_notify(variables_get($TaskBlink))` | `xTaskNotifyGive(...)` |
| `seeed_freertos_task_notify_from_isr` | Statement | VAR(field_variable) | `seeed_freertos_task_notify_from_isr(variables_get($TaskBlink))` | ISR-safe notify |
| `seeed_freertos_task_wait_notification` | Value | WAIT_MODE(dropdown), WAIT_MS(input_value) | `seeed_freertos_task_wait_notification(MS, math_number(1000))` | `ulTaskNotifyTake(...) > 0` |
| `seeed_freertos_queue_create` | Statement | VAR(field_input), QUEUE_LENGTH(field_number), DATA_TYPE(dropdown) | `seeed_freertos_queue_create("sensorQueue", 10, int)` | `xQueueCreate(...)` |
| `seeed_freertos_queue_send` | Statement | VAR(field_variable), DATA(input_value), DATA_TYPE(dropdown), WAIT_MODE(dropdown), WAIT_MS(input_value) | `seeed_freertos_queue_send(variables_get($sensorQueue), math_number(0), int, MS, math_number(1000))` | `xQueueSend(...)` |
| `seeed_freertos_queue_receive_do` | Statement | VAR(field_variable), DATA_TYPE(dropdown), ITEM_VAR(field_input), WAIT_MODE(dropdown), WAIT_MS(input_value), HANDLER(input_statement) | `seeed_freertos_queue_receive_do(variables_get($sensorQueue), int, "queueValue", MS, math_number(1000)) @HANDLER: child_block()` | guarded `xQueueReceive(...)` |
| `seeed_freertos_queue_messages_waiting` | Value | VAR(field_variable) | `seeed_freertos_queue_messages_waiting(variables_get($sensorQueue))` | `uxQueueMessagesWaiting(...)` |
| `seeed_freertos_semaphore_create` | Statement | VAR(field_input), SEMAPHORE_TYPE(dropdown), MAX_COUNT(field_number), INITIAL_COUNT(field_number) | `seeed_freertos_semaphore_create("syncSem", BINARY, 10, 0)` | semaphore creation |
| `seeed_freertos_semaphore_take` | Value | VAR(field_variable), WAIT_MODE(dropdown), WAIT_MS(input_value) | `seeed_freertos_semaphore_take(variables_get($syncSem), MS, math_number(1000))` | `xSemaphoreTake(...) == pdTRUE` |
| `seeed_freertos_semaphore_give` | Statement | VAR(field_variable) | `seeed_freertos_semaphore_give(variables_get($syncSem))` | `xSemaphoreGive(...)` |
| `seeed_freertos_semaphore_give_from_isr` | Statement | VAR(field_variable) | `seeed_freertos_semaphore_give_from_isr(variables_get($syncSem))` | ISR-safe semaphore give |
| `seeed_freertos_attach_interrupt` | Hat | PIN(field_number), MODE(dropdown), ISR_CODE(input_statement) | `seeed_freertos_attach_interrupt(2, RISING) @ISR_CODE: child_block()` | `attachInterrupt(...)` |
| `seeed_freertos_set_error_serial` | Statement | SERIAL(dropdown), BAUD(field_number) | `seeed_freertos_set_error_serial(Serial, 115200)` | `vSetErrorSerial(&Serial);` |
| `seeed_freertos_set_error_led` | Statement | PIN(field_number), ACTIVE_STATE(dropdown) | `seeed_freertos_set_error_led(13, HIGH)` | `vSetErrorLed(...)` |
| `seeed_freertos_get_tick_count` | Value | (none) | `seeed_freertos_get_tick_count()` | `xTaskGetTickCount()` |
| `seeed_freertos_get_task_count` | Value | (none) | `seeed_freertos_get_task_count()` | `uxTaskGetNumberOfTasks()` |
| `seeed_freertos_get_task_name` | Value | VAR(field_variable) | `seeed_freertos_get_task_name(variables_get($TaskBlink))` | `pcTaskGetName(...)` |
| `seeed_freertos_get_current_task_name` | Value | (none) | `seeed_freertos_get_current_task_name()` | `pcTaskGetName(NULL)` |
| `seeed_freertos_get_stack_high_water_mark` | Value | VAR(field_variable) | `seeed_freertos_get_stack_high_water_mark(variables_get($TaskBlink))` | `uxTaskGetStackHighWaterMark(...)` |
| `seeed_freertos_get_idle_stack_high_water_mark` | Value | (none) | `seeed_freertos_get_idle_stack_high_water_mark()` | `uxTaskGetStackHighWaterMark(xTaskGetIdleTaskHandle())` |
| `seeed_freertos_get_free_heap_size` | Value | (none) | `seeed_freertos_get_free_heap_size()` | `xPortGetFreeHeapSize()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| WAIT_MODE | MS, FOREVER | Convert milliseconds to ticks, or wait forever with `portMAX_DELAY`. |
| DATA_TYPE | int, long, uint32_t, int32_t, float, double, uint8_t, bool | Queue item type. Use the same type for create, send, and receive. |
| SEMAPHORE_TYPE | BINARY, MUTEX, COUNTING | Semaphore creation mode. MAX_COUNT and INITIAL_COUNT only apply to COUNTING. |
| MODE | LOW, RISING, FALLING, CHANGE | Arduino external interrupt trigger mode. |
| ACTIVE_STATE | HIGH, LOW | Active level for the FreeRTOS error LED. |

## ABS Examples

### Two Tasks
```
arduino_setup()
    seeed_freertos_task_create("TaskA", 256, 2)
    seeed_freertos_task_create("TaskB", 256, 1)

seeed_freertos_task_function(variables_get($TaskA))
    serial_println(Serial, text("A"))
    seeed_freertos_task_delay_ms(math_number(500))

seeed_freertos_task_function(variables_get($TaskB))
    serial_println(Serial, text("B"))
    seeed_freertos_task_delay_ms(math_number(2000))
```

### Queue Between Tasks
```
arduino_setup()
    seeed_freertos_queue_create("sensorQueue", 10, int)
    seeed_freertos_task_create("Producer", 256, 2)
    seeed_freertos_task_create("Consumer", 256, 1)

seeed_freertos_task_function(variables_get($Producer))
    seeed_freertos_queue_send(variables_get($sensorQueue), math_number(42), int, MS, math_number(0))
    seeed_freertos_task_delay_ms(math_number(1000))

seeed_freertos_task_function(variables_get($Consumer))
    seeed_freertos_queue_receive_do(variables_get($sensorQueue), int, "queueValue", FOREVER, math_number(0))
        serial_println(Serial, variables_get($queueValue))
```

## Notes

1. **Variable**: `seeed_freertos_task_create("TaskName", ...)` creates variable `$TaskName`; reference it later with `variables_get($TaskName)`.
2. **Scheduler**: creating a task automatically adds `vNopDelayMS(1000);` and `vTaskStartScheduler();` at setup end.
3. **Priority**: the priority field is generated as `tskIDLE_PRIORITY + value`.
4. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

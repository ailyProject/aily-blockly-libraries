# ESP32 FreeRTOS

FreeRTOS multitasking support for ESP32 Arduino

## Library Info
- **Name**: @aily-project/lib-esp32-freertos
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_freertos_task_create` | Statement | VAR(field_input), STACK_SIZE(field_number), PRIORITY(field_number), CORE(dropdown) | `esp32_freertos_task_create("TaskBlink", 4096, 1, AUTO)` | xTaskCreate(\n |
| `esp32_freertos_task_function` | Hat | VAR(field_variable), TASK_CODE(input_statement) | `esp32_freertos_task_function(variables_get($TaskBlink)) @TASK_CODE: child_block()` | Dynamic code |
| `esp32_freertos_task_delay_ms` | Statement | MS(input_value) | `esp32_freertos_task_delay_ms(math_number(1000))` | vTaskDelay(pdMS_TO_TICKS( |
| `esp32_freertos_task_delay_ticks` | Statement | TICKS(input_value) | `esp32_freertos_task_delay_ticks(math_number(0))` | vTaskDelay( |
| `esp32_freertos_task_suspend` | Statement | VAR(field_variable) | `esp32_freertos_task_suspend(variables_get($TaskBlink))` | vTaskSuspend( |
| `esp32_freertos_task_resume` | Statement | VAR(field_variable) | `esp32_freertos_task_resume(variables_get($TaskBlink))` | vTaskResume( |
| `esp32_freertos_task_delete` | Statement | VAR(field_variable) | `esp32_freertos_task_delete(variables_get($TaskBlink))` | vTaskDelete( |
| `esp32_freertos_task_delete_current` | Statement | (none) | `esp32_freertos_task_delete_current()` | vTaskDelete(NULL);\n |
| `esp32_freertos_task_notify` | Statement | VAR(field_variable) | `esp32_freertos_task_notify(variables_get($TaskBlink))` | xTaskNotifyGive( |
| `esp32_freertos_task_notify_from_isr` | Statement | VAR(field_variable) | `esp32_freertos_task_notify_from_isr(variables_get($TaskBlink))` | Dynamic code |
| `esp32_freertos_task_wait_notification` | Value | WAIT_MODE(dropdown), WAIT_MS(input_value) | `esp32_freertos_task_wait_notification(MS, math_number(1000))` | (ulTaskNotifyTake(pdTRUE, |
| `esp32_freertos_queue_create` | Statement | VAR(field_input), QUEUE_LENGTH(field_number), DATA_TYPE(dropdown) | `esp32_freertos_queue_create("sensorQueue", 10, int)` | Dynamic code |
| `esp32_freertos_queue_send` | Statement | VAR(field_variable), DATA(input_value), DATA_TYPE(dropdown), WAIT_MODE(dropdown), WAIT_MS(input_value) | `esp32_freertos_queue_send(variables_get($sensorQueue), math_number(0), int, MS, math_number(1000))` | Dynamic code |
| `esp32_freertos_queue_receive_do` | Statement | VAR(field_variable), DATA_TYPE(dropdown), ITEM_VAR(field_input), WAIT_MODE(dropdown), WAIT_MS(input_value), HANDLER(input_statement) | `esp32_freertos_queue_receive_do(variables_get($sensorQueue), int, "queueValue", MS, math_number(1000)) @HANDLER: child_block()` | Dynamic code |
| `esp32_freertos_queue_messages_waiting` | Value | VAR(field_variable) | `esp32_freertos_queue_messages_waiting(variables_get($sensorQueue))` | uxQueueMessagesWaiting( |
| `esp32_freertos_semaphore_create` | Statement | VAR(field_input), SEMAPHORE_TYPE(dropdown), MAX_COUNT(field_number), INITIAL_COUNT(field_number) | `esp32_freertos_semaphore_create("syncSem", BINARY, 10, 0)` | Dynamic code |
| `esp32_freertos_semaphore_take` | Value | VAR(field_variable), WAIT_MODE(dropdown), WAIT_MS(input_value) | `esp32_freertos_semaphore_take(variables_get($syncSem), MS, math_number(1000))` | (xSemaphoreTake( |
| `esp32_freertos_semaphore_give` | Statement | VAR(field_variable) | `esp32_freertos_semaphore_give(variables_get($syncSem))` | xSemaphoreGive( |
| `esp32_freertos_semaphore_give_from_isr` | Statement | VAR(field_variable) | `esp32_freertos_semaphore_give_from_isr(variables_get($syncSem))` | Dynamic code |
| `esp32_freertos_attach_interrupt` | Hat | PIN(field_number), MODE(dropdown), ISR_CODE(input_statement) | `esp32_freertos_attach_interrupt(2, LOW) @ISR_CODE: child_block()` | Dynamic code |
| `esp32_freertos_get_tick_count` | Value | (none) | `esp32_freertos_get_tick_count()` | xTaskGetTickCount() |
| `esp32_freertos_get_task_count` | Value | (none) | `esp32_freertos_get_task_count()` | uxTaskGetNumberOfTasks() |
| `esp32_freertos_get_task_name` | Value | VAR(field_variable) | `esp32_freertos_get_task_name(variables_get($TaskBlink))` | pcTaskGetName( |
| `esp32_freertos_get_current_task_name` | Value | (none) | `esp32_freertos_get_current_task_name()` | pcTaskGetName(NULL) |
| `esp32_freertos_get_stack_high_water_mark` | Value | VAR(field_variable) | `esp32_freertos_get_stack_high_water_mark(variables_get($TaskBlink))` | uxTaskGetStackHighWaterMark( |
| `esp32_freertos_get_current_stack_high_water_mark` | Value | (none) | `esp32_freertos_get_current_stack_high_water_mark()` | uxTaskGetStackHighWaterMark(NULL) |
| `esp32_freertos_get_free_heap_size` | Value | (none) | `esp32_freertos_get_free_heap_size()` | xPortGetFreeHeapSize() |
| `esp32_freertos_get_current_core` | Value | (none) | `esp32_freertos_get_current_core()` | xPortGetCoreID() |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| CORE | AUTO, 0, 1 | esp32_freertos_task_create |
| WAIT_MODE | MS, FOREVER | esp32_freertos_task_wait_notification, esp32_freertos_queue_send, esp32_freertos_queue_receive_do |
| DATA_TYPE | int, long, uint32_t, int32_t, float, double, uint8_t, bool | esp32_freertos_queue_create, esp32_freertos_queue_send, esp32_freertos_queue_receive_do |
| SEMAPHORE_TYPE | BINARY, MUTEX, COUNTING | esp32_freertos_semaphore_create |
| MODE | LOW, RISING, FALLING, CHANGE | esp32_freertos_attach_interrupt |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_freertos_task_create("TaskBlink", 4096, 1, AUTO)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_freertos_task_wait_notification(MS, math_number(1000)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `esp32_freertos_task_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

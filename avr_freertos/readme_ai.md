# AVR FreeRTOS

FreeRTOS for AVR Arduino multitasking

## Library Info
- **Name**: @aily-project/lib-avr-freertos
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `avr_freertos_task_create` | Statement | VAR(field_input), STACK_SIZE(field_number), PRIORITY(field_number) | `avr_freertos_task_create("TaskBlink", 128, 1)` | xTaskCreate(\n |
| `avr_freertos_task_function` | Hat | VAR(field_variable), TASK_CODE(input_statement) | `avr_freertos_task_function(variables_get($TaskBlink)) @TASK_CODE: child_block()` | Dynamic code |
| `avr_freertos_task_delay_ms` | Statement | MS(input_value) | `avr_freertos_task_delay_ms(math_number(1000))` | vTaskDelay( |
| `avr_freertos_task_delay_ticks` | Statement | TICKS(input_value) | `avr_freertos_task_delay_ticks(math_number(0))` | vTaskDelay( |
| `avr_freertos_task_suspend` | Statement | VAR(field_variable) | `avr_freertos_task_suspend(variables_get($TaskBlink))` | vTaskSuspend( |
| `avr_freertos_task_resume` | Statement | VAR(field_variable) | `avr_freertos_task_resume(variables_get($TaskBlink))` | vTaskResume( |
| `avr_freertos_task_delete` | Statement | VAR(field_variable) | `avr_freertos_task_delete(variables_get($TaskBlink))` | vTaskDelete( |
| `avr_freertos_task_delete_current` | Statement | (none) | `avr_freertos_task_delete_current()` | vTaskDelete(NULL);\n |
| `avr_freertos_task_notify` | Statement | VAR(field_variable) | `avr_freertos_task_notify(variables_get($TaskBlink))` | xTaskNotifyGive( |
| `avr_freertos_task_notify_from_isr` | Statement | VAR(field_variable) | `avr_freertos_task_notify_from_isr(variables_get($TaskBlink))` | Dynamic code |
| `avr_freertos_task_wait_notification` | Value | WAIT_MODE(dropdown), WAIT_MS(input_value) | `avr_freertos_task_wait_notification(MS, math_number(1000))` | (ulTaskNotifyTake(pdTRUE, |
| `avr_freertos_queue_create` | Statement | VAR(field_input), QUEUE_LENGTH(field_number), DATA_TYPE(dropdown) | `avr_freertos_queue_create("sensorQueue", 10, int)` | Dynamic code |
| `avr_freertos_queue_send` | Statement | VAR(field_variable), DATA(input_value), DATA_TYPE(dropdown), WAIT_MODE(dropdown), WAIT_MS(input_value) | `avr_freertos_queue_send(variables_get($sensorQueue), math_number(0), int, MS, math_number(1000))` | Dynamic code |
| `avr_freertos_queue_receive_do` | Statement | VAR(field_variable), DATA_TYPE(dropdown), ITEM_VAR(field_input), WAIT_MODE(dropdown), WAIT_MS(input_value), HANDLER(input_statement) | `avr_freertos_queue_receive_do(variables_get($sensorQueue), int, "queueValue", MS, math_number(1000)) @HANDLER: child_block()` | Dynamic code |
| `avr_freertos_queue_messages_waiting` | Value | VAR(field_variable) | `avr_freertos_queue_messages_waiting(variables_get($sensorQueue))` | uxQueueMessagesWaiting( |
| `avr_freertos_semaphore_create` | Statement | VAR(field_input), SEMAPHORE_TYPE(dropdown), MAX_COUNT(field_number), INITIAL_COUNT(field_number) | `avr_freertos_semaphore_create("syncSem", BINARY, 10, 0)` | Dynamic code |
| `avr_freertos_semaphore_take` | Value | VAR(field_variable), WAIT_MODE(dropdown), WAIT_MS(input_value) | `avr_freertos_semaphore_take(variables_get($syncSem), MS, math_number(1000))` | (xSemaphoreTake( |
| `avr_freertos_semaphore_give` | Statement | VAR(field_variable) | `avr_freertos_semaphore_give(variables_get($syncSem))` | xSemaphoreGive( |
| `avr_freertos_semaphore_give_from_isr` | Statement | VAR(field_variable) | `avr_freertos_semaphore_give_from_isr(variables_get($syncSem))` | Dynamic code |
| `avr_freertos_attach_interrupt` | Hat | PIN(field_number), MODE(dropdown), ISR_CODE(input_statement) | `avr_freertos_attach_interrupt(2, LOW) @ISR_CODE: child_block()` | Dynamic code |
| `avr_freertos_get_tick_count` | Value | (none) | `avr_freertos_get_tick_count()` | xTaskGetTickCount() |
| `avr_freertos_get_task_count` | Value | (none) | `avr_freertos_get_task_count()` | uxTaskGetNumberOfTasks() |
| `avr_freertos_get_task_name` | Value | VAR(field_variable) | `avr_freertos_get_task_name(variables_get($TaskBlink))` | pcTaskGetName( |
| `avr_freertos_get_current_task_name` | Value | (none) | `avr_freertos_get_current_task_name()` | pcTaskGetName(NULL) |
| `avr_freertos_get_stack_high_water_mark` | Value | VAR(field_variable) | `avr_freertos_get_stack_high_water_mark(variables_get($TaskBlink))` | uxTaskGetStackHighWaterMark( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| WAIT_MODE | MS, FOREVER | avr_freertos_task_wait_notification, avr_freertos_queue_send, avr_freertos_queue_receive_do |
| DATA_TYPE | int, long, float, byte, char, bool | avr_freertos_queue_create, avr_freertos_queue_send, avr_freertos_queue_receive_do |
| SEMAPHORE_TYPE | BINARY, MUTEX, COUNTING | avr_freertos_semaphore_create |
| MODE | LOW, RISING, FALLING, CHANGE | avr_freertos_attach_interrupt |

## ABS Examples

### Basic Usage
```
arduino_setup()
    avr_freertos_task_create("TaskBlink", 128, 1)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, avr_freertos_task_wait_notification(MS, math_number(1000)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `avr_freertos_task_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

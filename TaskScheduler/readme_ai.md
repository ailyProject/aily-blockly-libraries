# task scheduler

TaskScheduler cooperative multi-task library supports advanced functions such as scheduled tasks, task synchronization, and timeout control.

## Library Info
- **Name**: @aily-project/lib-task-scheduler
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `taskscheduler_config` | Statement | STATUS_REQUEST(field_checkbox), TIMEOUT(field_checkbox), SLEEP_ON_IDLE(field_checkbox), PRIORITY(field_checkbox), LTS_POINTER(field_checkbox), MICRO_RES(fiel... | `taskscheduler_config(FALSE, FALSE, FALSE, FALSE, FALSE, FALSE)` | Dynamic code |
| `taskscheduler_create` | Statement | SCHEDULER(field_input) | `taskscheduler_create("scheduler")` | Dynamic code |
| `taskscheduler_execute` | Statement | SCHEDULER(field_variable) | `taskscheduler_execute(variables_get($scheduler))` | Dynamic code |
| `task_create` | Statement | TASK(field_input), INTERVAL(input_value), ITERATIONS(input_value), CALLBACK(field_input) | `task_create("task1", math_number(1000), math_number(0), "taskCallback")` | Dynamic code |
| `task_create_simple` | Statement | TASK(field_input), INTERVAL(input_value), DO(input_statement) | `task_create_simple("task1", math_number(1000)) @DO: child_block()` | Dynamic code |
| `scheduler_add_task` | Statement | SCHEDULER(field_variable), TASK(field_variable) | `scheduler_add_task(variables_get($scheduler), variables_get($task1))` | Dynamic code |
| `task_enable` | Statement | TASK(field_variable) | `task_enable(variables_get($task1))` | Dynamic code |
| `task_disable` | Statement | TASK(field_variable) | `task_disable(variables_get($task1))` | Dynamic code |
| `task_restart` | Statement | TASK(field_variable) | `task_restart(variables_get($task1))` | Dynamic code |
| `task_delay` | Statement | TASK(field_variable), DELAY(input_value) | `task_delay(variables_get($task1), math_number(1000))` | Dynamic code |
| `task_set_interval` | Statement | TASK(field_variable), INTERVAL(input_value) | `task_set_interval(variables_get($task1), math_number(1000))` | Dynamic code |
| `task_is_enabled` | Value | TASK(field_variable) | `task_is_enabled(variables_get($task1))` | Dynamic code |
| `task_is_first_iteration` | Value | TASK(field_variable) | `task_is_first_iteration(variables_get($task1))` | Dynamic code |
| `task_is_last_iteration` | Value | TASK(field_variable) | `task_is_last_iteration(variables_get($task1))` | Dynamic code |
| `task_get_run_counter` | Value | TASK(field_variable) | `task_get_run_counter(variables_get($task1))` | Dynamic code |
| `status_request_create` | Statement | STATUS_REQUEST(field_input) | `status_request_create("statusRequest")` | Dynamic code |
| `status_request_set_waiting` | Statement | STATUS_REQUEST(field_variable), COUNT(input_value) | `status_request_set_waiting(variables_get($statusRequest), math_number(0))` | // 状态请求功能未启用\n |
| `status_request_signal` | Statement | STATUS_REQUEST(field_variable) | `status_request_signal(variables_get($statusRequest))` | // 状态请求功能未启用\n |
| `task_wait_for` | Statement | TASK(field_variable), STATUS_REQUEST(field_variable) | `task_wait_for(variables_get($task1), variables_get($statusRequest))` | // 状态请求功能未启用\n |
| `task_set_timeout` | Statement | TASK(field_variable), TIMEOUT(input_value) | `task_set_timeout(variables_get($task1), math_number(1000))` | // 任务超时功能未启用\n |
| `task_is_timed_out` | Value | TASK(field_variable) | `task_is_timed_out(variables_get($task1))` | false |

## ABS Examples

### Basic Usage
```
arduino_setup()
    taskscheduler_config(FALSE, FALSE, FALSE, FALSE, FALSE, FALSE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, task_is_enabled(variables_get($task1)))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

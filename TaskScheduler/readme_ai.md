# 任务调度器

TaskScheduler合作式多任务库，支持定时任务、任务同步、超时控制等高级功能

## Library Info
- **Name**: @aily-project/lib-task-scheduler
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `taskscheduler_config` | Statement | STATUS_REQUEST(field_checkbox), TIMEOUT(field_checkbox), SLEEP_ON_IDLE(field_checkbox), PRIORITY(field_checkbox), LTS_POINTER(field_checkbox), MICRO_RES(field_checkbox) | `taskscheduler_config(FALSE, FALSE, FALSE, FALSE, FALSE, FALSE)` | — |
| `taskscheduler_create` | Statement | SCHEDULER(field_input) | `taskscheduler_create("scheduler")` | — |
| `taskscheduler_execute` | Statement | SCHEDULER(field_variable) | `taskscheduler_execute($scheduler)` | — |
| `task_create` | Statement | TASK(field_input), INTERVAL(input_value), ITERATIONS(input_value), CALLBACK(field_input) | `task_create("task1", math_number(1000), math_number(0), "taskCallback")` | — |
| `task_create_simple` | Statement | TASK(field_input), INTERVAL(input_value), DO(input_statement) | `task_create_simple("task1", math_number(1000))` @DO: ... | — |
| `scheduler_add_task` | Statement | SCHEDULER(field_variable), TASK(field_variable) | `scheduler_add_task($scheduler, $task1)` | — |
| `task_enable` | Statement | TASK(field_variable) | `task_enable($task1)` | — |
| `task_disable` | Statement | TASK(field_variable) | `task_disable($task1)` | — |
| `task_restart` | Statement | TASK(field_variable) | `task_restart($task1)` | — |
| `task_delay` | Statement | TASK(field_variable), DELAY(input_value) | `task_delay($task1, math_number(1000))` | — |
| `task_set_interval` | Statement | TASK(field_variable), INTERVAL(input_value) | `task_set_interval($task1, math_number(1000))` | — |
| `task_is_enabled` | Value | TASK(field_variable) | `task_is_enabled($task1)` | — |
| `task_is_first_iteration` | Value | TASK(field_variable) | `task_is_first_iteration($task1)` | — |
| `task_is_last_iteration` | Value | TASK(field_variable) | `task_is_last_iteration($task1)` | — |
| `task_get_run_counter` | Value | TASK(field_variable) | `task_get_run_counter($task1)` | — |
| `status_request_create` | Statement | STATUS_REQUEST(field_input) | `status_request_create("statusRequest")` | — |
| `status_request_set_waiting` | Statement | STATUS_REQUEST(field_variable), COUNT(input_value) | `status_request_set_waiting($statusRequest, math_number(0))` | — |
| `status_request_signal` | Statement | STATUS_REQUEST(field_variable) | `status_request_signal($statusRequest)` | — |
| `task_wait_for` | Statement | TASK(field_variable), STATUS_REQUEST(field_variable) | `task_wait_for($task1, $statusRequest)` | — |
| `task_set_timeout` | Statement | TASK(field_variable), TIMEOUT(input_value) | `task_set_timeout($task1, math_number(1000))` | — |
| `task_is_timed_out` | Value | TASK(field_variable) | `task_is_timed_out($task1)` | — |

## ABS Examples

### Basic Usage
```
arduino_setup()
    taskscheduler_create("scheduler")
    task_create("task1", math_number(1000), math_number(0), "taskCallback")
    task_create_simple("task1", math_number(1000)) @DO: ...
    status_request_create("statusRequest")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, task_is_enabled($task1))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

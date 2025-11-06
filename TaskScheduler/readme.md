# 任务调度器 (TaskScheduler)

TaskScheduler合作式多任务库，支持定时任务、任务同步、超时控制等高级功能。

## 库信息
- **库名**: @aily-project/lib-task-scheduler
- **版本**: 0.0.1
- **兼容**: 通用库，兼容所有开发板

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|---|---|---|---|---|
| `taskscheduler_config` | 语句块 | - | `{"fields": {"STATUS_REQUEST": true}}` | `#define _TASK_STATUS_REQUEST` |
| `taskscheduler_create` | 语句块 | SCHEDULER(field_variable) | `{"fields": {"SCHEDULER": {"id": "..."}}}` | `Scheduler scheduler;` |
| `taskscheduler_execute` | 语句块 | SCHEDULER(field_variable) | `{"fields": {"SCHEDULER": {"id": "..."}}}` | `scheduler.execute();` |
| `task_create` | 语句块 | TASK(field_variable), INTERVAL(input_value), ITERATIONS(input_value), CALLBACK(field_input) | `{"fields": {"CALLBACK": "task1_cb"}}` | `Task task1(1000, -1, &task1_cb);` |
| `task_create_simple` | 语句块 | TASK(field_variable), INTERVAL(input_value), DO(input_statement) | `{"inputs": {"DO": {"block": ...}}}` | `Task task1(1000, TASK_FOREVER, &task1Callback);` |
| `scheduler_add_task` | 语句块 | SCHEDULER(field_variable), TASK(field_variable) | `{"fields": {"TASK": {"id": "..."}}}` | `scheduler.addTask(task1);` |
| `task_enable` | 语句块 | TASK(field_variable) | `{"fields": {"TASK": {"id": "..."}}}` | `task1.enable();` |
| `task_disable` | 语句块 | TASK(field_variable) | `{"fields": {"TASK": {"id": "..."}}}` | `task1.disable();` |
| `task_restart` | 语句块 | TASK(field_variable) | `{"fields": {"TASK": {"id": "..."}}}` | `task1.restart();` |
| `task_delay` | 语句块 | TASK(field_variable), DELAY(input_value) | `{"inputs": {"DELAY": {"shadow": ...}}}` | `task1.delay(1000);` |
| `task_set_interval` | 语句块 | TASK(field_variable), INTERVAL(input_value) | `{"inputs": {"INTERVAL": {"shadow": ...}}}` | `task1.setInterval(500);` |
| `task_is_enabled` | 值块 | TASK(field_variable) | `{"fields": {"TASK": {"id": "..."}}}` | `task1.isEnabled()` |
| `task_is_first_iteration` | 值块 | TASK(field_variable) | `{"fields": {"TASK": {"id": "..."}}}` | `task1.isFirstIteration()` |
| `task_is_last_iteration` | 值块 | TASK(field_variable) | `{"fields": {"TASK": {"id": "..."}}}` | `task1.isLastIteration()` |
| `task_get_run_counter` | 值块 | TASK(field_variable) | `{"fields": {"TASK": {"id": "..."}}}` | `task1.getRunCounter()` |
| `status_request_create` | 语句块 | STATUS_REQUEST(field_variable) | `{"fields": {"STATUS_REQUEST": {"id": "..."}}}` | `StatusRequest sr;` |
| `status_request_set_waiting` | 语句块 | STATUS_REQUEST(field_variable), COUNT(input_value) | `{"inputs": {"COUNT": {"shadow": ...}}}` | `sr.setWaiting(1);` |
| `status_request_signal` | 语句块 | STATUS_REQUEST(field_variable) | `{"fields": {"STATUS_REQUEST": {"id": "..."}}}` | `sr.signal();` |
| `task_wait_for` | 语句块 | TASK(field_variable), STATUS_REQUEST(field_variable) | `{"fields": {"TASK": {"id": "..."}}}` | `task1.waitFor(&sr);` |
| `task_set_timeout` | 语句块 | TASK(field_variable), TIMEOUT(input_value) | `{"inputs": {"TIMEOUT": {"shadow": ...}}}` | `task1.setTimeout(5000);` |
| `task_is_timed_out` | 值块 | TASK(field_variable) | `{"fields": {"TASK": {"id": "..."}}}` | `task1.timedOut()` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|---|---|---|
| field_input | 字符串 | `"FIELD": "value"` |
| field_dropdown | 字符串 | `"TYPE": "option"` |
| field_variable | 对象 | `"VAR": {"id": "var_id"}` |
| input_value | 块连接 | `"inputs": {"INPUT": {"block": {...}}}` |
| input_statement | 块连接 | `"inputs": {"DO": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **Hat块**: 无连接属性，通过`inputs`连接内部语句

## 使用示例

### 每秒闪烁LED

```json
{
    "type": "program",
    "blocks": [
        {
            "type": "taskscheduler_create",
            "id": "scheduler_create_1",
            "fields": {
                "SCHEDULER": {
                    "id": "scheduler_var"
                }
            },
            "next": {
                "block": {
                    "type": "task_create_simple",
                    "id": "task_create_1",
                    "fields": {
                        "TASK": {
                            "id": "led_task_var"
                        }
                    },
                    "inputs": {
                        "INTERVAL": {
                            "shadow": {
                                "type": "math_number",
                                "fields": { "NUM": 1000 }
                            }
                        },
                        "DO": {
                            "block": {
                                "type": "core_io_digital_write",
                                "id": "digital_write_1",
                                "fields": {},
                                "inputs": {
                                    "PIN": { "shadow": { "type": "core_io_pin", "fields": { "PIN": "13" }}},
                                    "LEVEL": { "block": { "type": "core_logic_boolean", "fields": { "BOOL": "true" }}}
                                }
                            }
                        }
                    },
                    "next": {
                        "block": {
                            "type": "scheduler_add_task",
                            "id": "add_task_1",
                            "fields": {
                                "SCHEDULER": { "id": "scheduler_var" },
                                "TASK": { "id": "led_task_var" }
                            }
                        }
                    }
                }
            }
        },
        {
            "type": "taskscheduler_execute",
            "id": "scheduler_execute_1",
            "fields": {
                "SCHEDULER": {
                    "id": "scheduler_var"
                }
            }
        }
    ]
}
```

## 重要规则

1. **必须在loop中执行**: `调度器执行任务` 块必须放在主循环 `loop` 中，以确保任务可以被持续调度。
2. **先配置后使用**: `状态请求` 和 `超时功能` 相关的块，必须先在程序开始处使用 `任务调度器配置` 块启用相应功能后才能生效。
3. **先创建后添加**: 必须先使用 `创建调度器` 和 `创建任务` 块，然后才能使用 `调度器添加任务` 块将任务加入调度器。
4. **回调函数**: 使用 `创建任务` 块时，需要提供一个回调函数名，生成器会自动创建该函数的存根。你需要自行在生成的函数中填充任务逻辑。`创建简单任务` 块则可以直接在内部嵌套语句。

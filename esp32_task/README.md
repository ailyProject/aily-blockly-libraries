# ESP32多任务库

ESP32多任务管理库，基于FreeRTOS实现并行任务执行

## 库信息
- **库名**: @aily-project/lib-esp32-task
- **版本**: 1.0.0  
- **兼容**: ESP32系列开发板
- **作者**: Vonweller

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `esp32_task_new` | Hat块 | TASK_NAME(field_input), SETUP(input_statement), LOOP(input_statement) | `"TASK_NAME":"task1"` | `newTask(task1); void task1::setup(){...} void task1::loop(){...}` |
| `esp32_task_start` | 语句块 | TASK_NAME(input_value) | `"inputs":{"TASK_NAME":{"shadow":{"type":"text"}}}` | `taskStart(task1);` |
| `esp32_task_start_all` | 语句块 | 无 | 无 | `taskStart();` |
| `esp32_task_free` | 语句块 | TASK_NAME(input_value) | `"inputs":{"TASK_NAME":{"shadow":{"type":"text"}}}` | `taskFree(task1);` |
| `esp32_task_free_all` | 语句块 | 无 | 无 | `taskFree();` |
| `esp32_task_delay` | 语句块 | DELAY_TIME(input_value) | `"inputs":{"DELAY_TIME":{"shadow":{"type":"math_number"}}}` | `delay(1000);` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"TASK_NAME": "task1"` |
| input_value | 块连接 | `"inputs": {"TASK_NAME": {"block": {...}}}` |
| input_statement | 块连接 | `"inputs": {"SETUP": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **Hat块**: 无连接属性，通过`inputs`连接内部语句
- **任务定义块**: `esp32_task_new`是Hat块，独立放置，不能连接到程序流程中
- **任务控制块**: 其他块都是语句块，在setup或loop中使用

## 使用示例

### 创建并启动任务
```json
{
  "type": "esp32_task_new",
  "id": "task_def_1",
  "fields": {
    "TASK_NAME": "task1"
  },
  "inputs": {
    "SETUP": {
      "block": {
        "type": "serial_begin",
        "id": "serial_1"
      }
    },
    "LOOP": {
      "block": {
        "type": "serial_println",
        "id": "print_1"
      }
    }
  }
}
```

### 在主程序中控制任务
```json
{
  "type": "arduino_setup",
  "inputs": {
    "ARDUINO_SETUP": {
      "block": {
        "type": "esp32_task_start_all",
        "id": "start_all_1"
      }
    }
  }
}
```

## 重要规则

1. **任务定义必须独立**: `esp32_task_new`不能放在setup或loop中
2. **任务名称唯一**: 每个任务必须有不同的名称
3. **最多8个任务**: 系统最多支持8个并行任务
4. **ESP32专用**: 仅支持ESP32系列开发板
5. **字符串字面量**: 任务名称支持字符串字面量或变量

## 支持的功能

- ✅ 创建多个并行任务
- ✅ 独立的setup和loop代码
- ✅ 启动/释放单个或所有任务
- ✅ 任务间延时控制
- ✅ 基于FreeRTOS的真正多任务

## 典型应用场景

- 传感器数据采集与显示分离
- LED闪烁与按键检测并行
- 网络通信与本地控制同时运行
- 多个独立功能模块并行执行

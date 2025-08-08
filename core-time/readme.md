# 时间控制 (Time Control) 核心库

Arduino/C++编程中的时间管理核心库，提供延时控制、时间获取和系统时间功能。

## 库信息
- **库名**: @aily-project/lib-core-time
- **版本**: 0.0.1
- **作者**: aily Project
- **描述**: 核心库，包含delay、millis、micros等函数
- **依赖**: @aily-project/lib-core-math (0.0.1)

## Blockly 工具箱分类

### Time 控制
- `time_delay` - 毫秒延时
- `time_millis` - 设备运行时间
- `system_time` - 系统时间
- `system_date` - 系统日期
- `time_delay_microseconds` - 微秒延时
- `time_micros` - 设备运行微秒数

## 详细块定义

### 延时控制块

#### time_delay
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 暂停程序执行指定的毫秒数
**值输入**:
- `DELAY_TIME`: 数字输入 - 延时毫秒数 (检查类型: Number)
**生成代码**: `delay(1000);`
**特性**: 阻塞式延时，程序完全停止执行
**用途**: LED闪烁、传感器读取间隔、简单定时操作

#### time_delay_microseconds
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 暂停程序执行指定的微秒数
**值输入**:
- `DELAY_TIME`: 数字输入 - 延时微秒数 (检查类型: Number)
**生成代码**: `delayMicroseconds(500);`
**特性**: 微秒级精确延时，范围3-16383微秒
**用途**: 超声波传感器、PWM信号、高频通信、精确时序控制

### 时间获取块

#### time_millis
**类型**: 值块 (output: Number)
**描述**: 获取设备启动后运行的毫秒数
**生成代码**: `millis()`
**特性**: 非阻塞，约49.7天后溢出，1毫秒分辨率
**用途**: 非阻塞定时器、时间测量、事件记录、性能测试

#### time_micros
**类型**: 值块 (output: Number)
**描述**: 获取设备启动后运行的微秒数
**生成代码**: `micros()`
**特性**: 约70分钟后溢出，4微秒分辨率（16MHz Arduino）
**用途**: 高精度时间测量、性能分析、精确间隔计算

#### system_time
**类型**: 值块 (output: Any)
**描述**: 获取程序编译时的系统时间
**生成代码**: `__TIME__`
**格式**: "HH:MM:SS"（24小时制）
**用途**: 固件版本标识、调试信息、编译时间戳

#### system_date
**类型**: 值块 (output: Any)
**描述**: 获取程序编译时的系统日期
**生成代码**: `__DATE__`
**格式**: "MMM DD YYYY"（如 "Jan 01 2024"）
**用途**: 固件版本管理、构建信息追踪、发布日期标记

## .abi 文件生成规范

### 块连接规则
- **语句块**: 有 `previousStatement/nextStatement`，通过 `next` 连接
- **值块**: 有 `output`，连接到 `inputs` 中，不含 `next` 字段

### 工具箱默认配置
- `time_delay.DELAY_TIME`: 默认数字 1000
- `time_delay_microseconds.DELAY_TIME`: 默认数字 1000

### 时间函数对比
| 函数 | 精度 | 溢出时间 | 用途 | 阻塞 |
|------|------|----------|------|------|
| `delay()` | 1毫秒 | - | 简单延时 | 是 |
| `delayMicroseconds()` | 1微秒 | - | 精确延时 | 是 |
| `millis()` | 1毫秒 | ~49.7天 | 时间测量 | 否 |
| `micros()` | 4微秒 | ~70分钟 | 高精度测量 | 否 |

## 使用示例

### 基本延时
```json
{
  "type": "time_delay",
  "inputs": {
    "DELAY_TIME": {"shadow": {"type": "math_number", "fields": {"NUM": 1000}}}
  }
}
```

### 时间测量
```json
{
  "type": "time_millis"
}
```

### 微秒延时
```json
{
  "type": "time_delay_microseconds",
  "inputs": {
    "DELAY_TIME": {"shadow": {"type": "math_number", "fields": {"NUM": 500}}}
  }
}
```

### 非阻塞定时器模式
```json
{
  "type": "controls_if",
  "inputs": {
    "IF0": {
      "block": {
        "type": "logic_compare",
        "inputs": {
          "A": {
            "block": {
              "type": "math_arithmetic",
              "inputs": {
                "A": {"block": {"type": "time_millis"}},
                "B": {"block": {"type": "variables_get", "fields": {"VAR": {"id": "previousTime"}}}}
              }
            }
          },
          "B": {"shadow": {"type": "math_number", "fields": {"NUM": 1000}}}
        }
      }
    }
  }
}
```

## 技术特性
- **精确延时**: 支持毫秒和微秒级延时控制
- **时间测量**: 提供高精度时间测量功能
- **编译信息**: 获取程序编译时间和日期
- **溢出安全**: 正确处理时间溢出情况
- **无依赖**: 直接调用Arduino标准时间函数
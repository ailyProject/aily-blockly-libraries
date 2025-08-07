# 时间控制 (Time Control) 核心库

Arduino/C++编程中的时间管理核心库，提供延时控制、时间获取和系统时间功能。

## 库信息
- **库名**: @aily-project/lib-core-time
- **版本**: 1.0.0
- **作者**: aily Project
- **描述**: 核心库，包含delay、millis、micros等函数
- **依赖**: @aily-project/lib-core-math (0.0.1)

## 可用模块

### 延时（毫秒） (`time_delay`)
暂停程序执行指定毫秒数，调用 `delay()` 函数
- **特性**: 阻塞式延时，程序完全停止执行
- **用途**: LED闪烁、传感器读取间隔、简单定时操作
- **注意**: 延时期间无法响应其他操作

### 延时（微秒） (`time_delay_microseconds`)
暂停程序执行指定微秒数，调用 `delayMicroseconds()` 函数
- **特性**: 微秒级精确延时，范围3-16383微秒
- **用途**: 超声波传感器、PWM信号、高频通信、精确时序控制

### 设备运行时间 (`time_millis`)
获取设备启动后运行的毫秒数，调用 `millis()` 函数
- **特性**: 非阻塞，约49.7天后溢出，1毫秒分辨率
- **用途**: 非阻塞定时器、时间测量、事件记录、性能测试

### 设备运行微秒数 (`time_micros`)
获取设备启动后运行的微秒数，调用 `micros()` 函数
- **特性**: 约70分钟后溢出，4微秒分辨率（16MHz Arduino）
- **用途**: 高精度时间测量、性能分析、精确间隔计算

### 系统时间 (`system_time`)
获取编译时的系统时间，返回 `__TIME__` 宏值
- **格式**: "HH:MM:SS"（24小时制）
- **用途**: 固件版本标识、调试信息、编译时间戳

获取编译时的系统日期，返回 `__DATE__` 宏值
- **格式**: "MMM DD YYYY"（如 "Jan 01 2024"）
- **用途**: 固件版本管理、构建信息追踪、发布日期标记

## 时间函数对比

| 函数 | 精度 | 溢出时间 | 用途 | 阻塞 |
|------|------|----------|------|------|
| `delay()` | 1毫秒 | - | 简单延时 | 是 |
| `delayMicroseconds()` | 1微秒 | - | 精确延时 | 是 |
| `millis()` | 1毫秒 | ~49.7天 | 时间测量 | 否 |
| `micros()` | 4微秒 | ~70分钟 | 高精度测量 | 否 |

## 使用建议

### 延时选择
- **简单延时**: 使用 `delay()` 毫秒延时
- **精确短延时**: 使用 `delayMicroseconds()` 微秒延时
- **非阻塞定时**: 使用 `millis()` 配合条件判断

### 非阻塞定时器示例
```cpp
unsigned long previousTime = 0;
const long interval = 1000;

void loop() {
  unsigned long currentTime = millis();
  if (currentTime - previousTime >= interval) {
    previousTime = currentTime;
    // 执行定时任务
  }
  // 其他代码正常执行
}
```

### 溢出处理
```cpp
// 安全的溢出处理方法
if (millis() - previousTime >= interval) {
  // 即使溢出也能正确比较
}
```

## 注意事项
- 延时函数是阻塞式的，会停止程序执行
- `millis()` 和 `micros()` 会溢出，需正确处理
- 系统时间是编译时常量，不能用于实时时钟
- 长时间延时会影响程序响应性
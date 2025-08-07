# 外部中断 (External Interrupt) 核心库

Arduino/C++编程中的外部中断核心库，提供硬件中断的设置和管理功能。

## 库信息
- **库名**: @aily-project/lib-core-interrupt
- **版本**: 0.0.1
- **作者**: Arduino
- **描述**: Arduino外部中断支持库
- **测试者**: 奈何col

## 可用模块

### 硬件中断 (`io_attach_interrupt`)
设置硬件中断并定义中断处理函数
- **参数**: 中断引脚、触发模式、中断处理代码
- **引脚**: 根据开发板动态显示可用的中断引脚
- **触发模式**:
  - **RISING**: 上升沿触发
  - **FALLING**: 下降沿触发
  - **CHANGE**: 电平变化触发
  - **LOW**: 低电平触发
- **实现**: 自动生成中断处理函数并调用 `attachInterrupt()`

### 取消硬件中断 (`io_detach_interrupt`)
取消指定引脚的硬件中断
- **参数**: 中断引脚
- **实现**: 调用 `detachInterrupt()` 取消中断

## 使用说明

### 基本用法
```cpp
// 中断处理函数（自动生成）
void interrupt_handler_2() {
  // 中断处理代码
  digitalWrite(13, !digitalRead(13));
}

void setup() {
  // 设置中断（自动添加到setup）
  attachInterrupt(digitalPinToInterrupt(2), interrupt_handler_2, RISING);
}

void loop() {
  // 主程序代码
  // 中断会异步执行，不影响主循环
}
```

### 中断模式说明
- **RISING**: 信号从低电平变为高电平时触发
- **FALLING**: 信号从高电平变为低电平时触发
- **CHANGE**: 信号电平发生任何变化时触发
- **LOW**: 信号为低电平时持续触发（谨慎使用）

### 智能代码生成
- 自动为每个中断引脚生成唯一的处理函数
- 自动在setup()中添加attachInterrupt调用
- 支持多个中断引脚同时使用
- 取消中断时自动在loop末尾添加detachInterrupt

## 注意事项
- 中断处理函数应尽可能简短和快速
- 避免在中断中使用delay()、Serial.print()等阻塞函数
- 中断中修改的全局变量应声明为volatile
- 不同开发板支持的中断引脚数量不同
- 中断优先级高于主程序，会立即响应

## 技术特性
- **开发板适配**: 根据开发板动态显示可用中断引脚和模式
- **自动管理**: 自动生成中断处理函数和注册代码
- **多语言支持**: 支持中文、英文、日文、韩文等多种界面语言
- **安全机制**: 自动处理中断函数命名和冲突避免
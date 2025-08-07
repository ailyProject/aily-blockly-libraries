# 串口通信 (Serial Communication) 核心库

Arduino/C++编程中的串口通信核心库，提供串口初始化、数据发送和接收功能。

## 库信息
- **库名**: @aily-project/lib-core-serial
- **版本**: 0.0.1
- **作者**: aily Project
- **描述**: 串口通信库，支持串口发送和接收

## 可用模块

### 初始化串口 (`serial_begin`)
初始化指定串口并设置波特率，自动跟踪已初始化的串口

### 数据发送
- **串口输出** (`serial_print`): 发送数据不换行
- **串口输出换行** (`serial_println`): 发送数据并换行
- **原始输出** (`serial_write`): 发送字节数据

### 数据接收
- **检查可用性** (`serial_available`): 返回缓冲区可读字节数
- **读取数据** (`serial_read`): 支持read/peek/parseInt/parseFloat四种方式
- **读取字符串** (`serial_read_string`): 读取完整字符串

## 使用说明

### 基本用法
```cpp
// 初始化串口
Serial.begin(9600);

// 发送数据
Serial.print("Hello");
Serial.println(" World");

// 接收数据
if (Serial.available() > 0) {
  int data = Serial.read();
  String message = Serial.readString();
}
```

### 常用波特率
9600（标准）、115200（高速）、57600（中等）、38400（兼容）

## 注意事项
- 串口通信是异步的，可能有延迟
- 读取前建议先检查 `available()`
- 串口0通常用于USB调试
- 库会自动管理串口初始化状态

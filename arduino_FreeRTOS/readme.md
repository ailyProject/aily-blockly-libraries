# Arduino FreeRTOS Blockly库

## 概述
这是一个基于Arduino FreeRTOS的Blockly库，提供了多任务实时编程的可视化块接口。该库封装了FreeRTOS的核心功能，包括任务管理、队列通信、信号量同步、中断处理等。

## 功能特性

### 任务管理
- **任务创建**: 创建FreeRTOS任务，支持设置栈大小和优先级
- **任务函数**: 定义任务执行的代码
- **任务延时**: FreeRTOS任务延时函数 
- **任务控制**: 支持任务挂起、恢复、删除操作

### 队列通信
- **队列创建**: 创建任务间通信队列
- **队列发送**: 向队列发送数据
- **队列接收**: 从队列接收数据

### 信号量同步
- **信号量创建**: 支持二进制信号量、互斥锁、计数信号量
- **信号量获取**: 尝试获取信号量
- **信号量释放**: 释放信号量

### 中断与通知
- **中断处理**: 设置引脚中断处理
- **任务通知**: 轻量级的任务间通信机制

### 系统信息
- **系统滴答**: 获取系统滴答计数
- **任务信息**: 获取任务名称等信息
- **内存信息**: 获取空闲堆内存大小

## 使用要求

### 硬件支持
- Arduino Uno, Nano, Pro Mini (ATmega328P)
- Arduino Mega 2560 (ATmega2560)
- Arduino Leonardo, Micro (ATmega32u4)
- 其他支持FreeRTOS的Arduino兼容板

### 软件依赖
- Arduino IDE 1.8.0+
- Arduino FreeRTOS库 (10.4.0+)

## 安装方法

1. 在Arduino IDE中安装FreeRTOS库：
   ```
   库管理器 -> 搜索 "FreeRTOS" -> 安装
   ```

2. 在aily blockly系统中导入此库

## 使用示例

### 基本任务创建
使用"创建任务"块可以创建一个FreeRTOS任务：
- 设置任务名称（如：TaskBlink）
- 设置栈大小（推荐128-512字节）
- 设置优先级（0-3，数字越大优先级越高）

### 任务函数定义
使用"任务函数"块定义任务要执行的代码：
- 任务函数会自动包含无限循环
- 在任务代码中通常需要使用"任务延时"避免任务占用过多CPU时间

### 队列通信示例
1. 使用"创建队列"块创建队列
2. 在一个任务中使用"向队列发送数据"
3. 在另一个任务中使用"从队列接收数据"

## 注意事项

1. **内存限制**: Arduino UNO等8位单片机内存有限，创建任务时需要合理设置栈大小
2. **优先级设置**: FreeRTOS使用抢占式调度，高优先级任务会打断低优先级任务
3. **任务延时**: 每个任务都应该包含适当的延时，避免死循环占用CPU
4. **中断处理**: 中断服务程序应该尽可能简短，复杂操作应通过任务通知触发任务处理

## 常见问题

### Q: 程序上传后Arduino重启或死机
A: 可能是内存不足导致，请减少任务数量或降低栈大小

### Q: 任务没有按预期执行
A: 检查任务优先级设置，确保高优先级任务不会阻塞低优先级任务

### Q: 队列数据丢失
A: 检查队列长度设置，确保发送速度不超过接收速度

## 技术支持

如有问题请在GitHub仓库提交Issue：
https://github.com/ailyProject/aily-blockly-libraries

## 开源许可

本库基于MIT许可证开源，详见LICENSE文件。

## 版本历史

- v1.0.0: 初始版本，包含基础任务管理、队列、信号量功能

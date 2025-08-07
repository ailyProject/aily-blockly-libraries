# 串口通信 (Serial Communication) 核心库

Arduino/C++编程中的串口通信核心库，提供串口初始化、数据发送和接收功能。

## 库信息
- **库名**: @aily-project/lib-core-serial
- **版本**: 0.0.1
- **作者**: aily Project
- **描述**: 串口通信库，支持串口发送和接收

## Blockly 工具箱分类

### Serial 通信
- `serial_begin` - 串口初始化
- `serial_available` - 数据可用检测
- `serial_read` - 数据读取
- `serial_print` - 串口输出
- `serial_println` - 串口换行输出
- `serial_write` - 原始数据输出
- `serial_read_string` - 字符串读取
- `text` - 文本块
- `math_number` - 数字块

## 详细块定义

### 初始化块

#### serial_begin
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 初始化串口通信
**字段**:
- `SERIAL`: 下拉选择 - 串口对象 (来自 ${board.serialPort})
- `SPEED`: 下拉选择 - 波特率 (来自 ${board.serialSpeed})
**生成代码**: `Serial.begin(9600);`
**智能管理**: 自动跟踪已初始化的串口，避免重复初始化

### 输出块

#### serial_print
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 串口输出数据
**字段**:
- `SERIAL`: 下拉选择 - 串口对象 (来自 ${board.serialPort})
**值输入**:
- `VAR`: 输出内容
**生成代码**: `Serial.print("Hello");`
**自动管理**: 未初始化时自动添加默认初始化

#### serial_println
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 串口输出数据并换行
**字段**:
- `SERIAL`: 下拉选择 - 串口对象 (来自 ${board.serialPort})
**值输入**:
- `VAR`: 输出内容
**生成代码**: `Serial.println("World");`
**自动管理**: 未初始化时自动添加默认初始化

#### serial_write
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 串口输出原始字节数据
**字段**:
- `SERIAL`: 下拉选择 - 串口对象 (来自 ${board.serialPort})
**值输入**:
- `DATA`: 原始数据
**生成代码**: `Serial.write(data);`
**自动管理**: 未初始化时自动添加默认初始化

### 输入块

#### serial_available
**类型**: 值块 (output: Number)
**描述**: 检查串口缓冲区是否有数据
**字段**:
- `SERIAL`: 下拉选择 - 串口对象 (来自 ${board.serialPort})
**生成代码**: `Serial.available()`
**返回值**: 缓冲区中可读字节数
**自动管理**: 未初始化时自动添加默认初始化

#### serial_read
**类型**: 值块 (output: Any)
**描述**: 读取串口数据，支持多种读取方式
**字段**:
- `SERIAL`: 下拉选择 - 串口对象 (来自 ${board.serialPort})
- `TYPE`: 下拉选择 ["read", "peek", "parseInt", "parseFloat"]
**生成代码**:
- `Serial.read()` - 读取单个字节
- `Serial.peek()` - 查看下一个字节但不移除
- `Serial.parseInt()` - 解析整数
- `Serial.parseFloat()` - 解析浮点数
**自动管理**: 未初始化时自动添加默认初始化

#### serial_read_string
**类型**: 值块 (output: String)
**描述**: 读取串口字符串
**字段**:
- `SERIAL`: 下拉选择 - 串口对象 (来自 ${board.serialPort})
**生成代码**: `Serial.readString()`
**自动管理**: 未初始化时自动添加默认初始化

## .abi 文件生成规范

### 块连接规则
- **语句块**: 有 `previousStatement/nextStatement`，通过 `next` 连接
- **值块**: 有 `output`，连接到 `inputs` 中，不含 `next` 字段

### 工具箱默认配置
- `serial_print.VAR`: 默认空文本影子块
- `serial_println.VAR`: 默认空文本影子块

### 智能串口管理
- 系统自动跟踪已初始化的串口 (`Arduino.addedSerialInitCode`)
- 使用串口功能时自动添加默认初始化 (9600波特率)
- 避免重复初始化同一串口
- 支持自定义波特率覆盖默认设置

### 动态配置引用
- 串口对象根据开发板配置动态显示
- `${board.serialPort}` - 可用串口列表 (如 ["Serial", "Serial1"])
- `${board.serialSpeed}` - 支持的波特率列表 (如 ["9600", "115200"])

## 使用示例

### 基本串口初始化
```json
{
  "type": "serial_begin",
  "fields": {
    "SERIAL": "Serial",
    "SPEED": "9600"
  }
}
```

### 串口输出示例
```json
{
  "type": "serial_println",
  "fields": {"SERIAL": "Serial"},
  "inputs": {
    "VAR": {"shadow": {"type": "text", "fields": {"TEXT": "Hello World"}}}
  }
}
```

### 串口读取示例
```json
{
  "type": "serial_read",
  "fields": {
    "SERIAL": "Serial",
    "TYPE": "parseInt"
  }
}
```

## 技术特性
- **智能管理**: 自动处理串口初始化和去重
- **开发板适配**: 根据开发板动态显示可用串口和波特率
- **多种读取**: 支持字节、整数、浮点数、字符串读取
- **代码优化**: 避免重复的串口初始化
- **自动初始化**: 未初始化时自动添加默认设置

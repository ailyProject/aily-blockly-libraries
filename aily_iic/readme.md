# I2C通信 (I2C Communication) 库

Arduino/C++编程中的I2C通信库，提供主从设备通信、数据传输和设备扫描功能。

## 库信息
- **库名**: @aily-project/lib-aily-iic
- **版本**: 1.0.0
- **作者**: aily Project
- **描述**: I2C/TWI通信库，支持主从模式和多设备通信
- **电压**: 3.3V、5V
- **依赖**: Wire库 (Arduino标准库)

## Blockly 工具箱分类

### I2C
- `wire_begin` - I2C初始化
- `wire_begin_with_settings` - I2C初始化(自定义引脚)
- `wire_set_clock` - 设置时钟频率
- `wire_scan` - 扫描I2C设备
- `wire_begin_transmission` - 开始传输
- `wire_write` - 写入数据
- `wire_end_transmission` - 结束传输
- `wire_request_from` - 请求数据
- `wire_available` - 检查可用数据
- `wire_read` - 读取数据
- `wire_on_receive` - 接收回调
- `wire_on_request` - 请求回调

## 详细块定义

### 初始化块

#### wire_begin
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 初始化I2C通信
**字段**:
- `WIRE`: 下拉选择 - I2C接口 (来自 ${board.i2c})
- `MODE`: 下拉选择 - 工作模式 ["主设备"/"从设备"] -> ["MASTER"/"SLAVE"]
**生成代码**: 
- 主设备: `Wire.begin();`
- 从设备: `Wire.begin(address);`
**扩展**: `wire_begin_pin_info`, `wire_begin_mutator`
**自动功能**: 添加Wire库引用

#### wire_begin_with_settings
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 初始化I2C通信并自定义SDA/SCL引脚
**字段**:
- `WIRE`: 下拉选择 - I2C接口 (来自 ${board.i2c})
- `MODE`: 下拉选择 - 工作模式 ["主设备"/"从设备"] -> ["MASTER"/"SLAVE"]
**值输入**:
- `SDA`: 数字输入 - SDA引脚号
- `SCL`: 数字输入 - SCL引脚号
**生成代码**: `Wire.begin(21, 22);` (ESP32等支持自定义引脚的开发板)
**工具箱默认**: SDA=21, SCL=22

#### wire_set_clock
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 设置I2C时钟频率
**值输入**:
- `FREQUENCY`: 数字输入 - 频率值 (Hz)
**生成代码**: `Wire.setClock(100000);`
**工具箱默认**: 100000 (100kHz)
**常用频率**: 100kHz (标准), 400kHz (快速), 1MHz (高速)

### 设备扫描块

#### wire_scan
**类型**: 值块 (output: Array)
**描述**: 扫描I2C总线上的所有设备
**生成代码**: 生成完整的I2C设备扫描函数
**返回值**: 设备地址数组
**用途**: 检测连接的I2C设备

### 主设备通信块

#### wire_begin_transmission
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 开始向指定地址的设备传输数据
**值输入**:
- `ADDRESS`: 数字输入 - 设备地址 (7位或8位)
**生成代码**: `Wire.beginTransmission(0x08);`
**工具箱默认**: 0x08

#### wire_write
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 向I2C设备写入数据
**值输入**:
- `DATA`: 任意输入 - 写入的数据 (字节、字符串或数组)
**生成代码**: `Wire.write(data);`
**工具箱默认**: 0

#### wire_end_transmission
**类型**: 值块 (output: Number)
**描述**: 结束传输并返回状态码
**生成代码**: `Wire.endTransmission()`
**返回值**: 
- 0: 成功
- 1: 数据太长，超出传输缓冲区
- 2: 在地址传输时收到NACK
- 3: 在数据传输时收到NACK
- 4: 其他错误

#### wire_request_from
**类型**: 值块 (output: Number)
**描述**: 从指定设备请求数据
**值输入**:
- `ADDRESS`: 数字输入 - 设备地址
- `QUANTITY`: 数字输入 - 请求字节数
**生成代码**: `Wire.requestFrom(0x08, 10)`
**返回值**: 实际接收到的字节数
**工具箱默认**: 地址=0x08, 数量=10

### 数据读取块

#### wire_available
**类型**: 值块 (output: Number)
**描述**: 检查接收缓冲区中可用的字节数
**生成代码**: `Wire.available()`
**返回值**: 可读取的字节数

#### wire_read
**类型**: 值块 (output: Number)
**描述**: 从接收缓冲区读取一个字节
**生成代码**: `Wire.read()`
**返回值**: 读取的字节值 (0-255)

### 从设备回调块

#### wire_on_receive
**类型**: Hat块 (无连接属性)
**描述**: 设置从设备接收数据时的回调函数
**语句输入**:
- `HANDLER`: 语句输入 - 接收数据时执行的代码
**生成代码**:
```cpp
void receiveEvent(int howMany) {
  // 用户代码
}
// setup中: Wire.onReceive(receiveEvent);
```

#### wire_on_request
**类型**: Hat块 (无连接属性)
**描述**: 设置从设备被请求数据时的回调函数
**语句输入**:
- `HANDLER`: 语句输入 - 请求数据时执行的代码
**生成代码**:
```cpp
void requestEvent() {
  // 用户代码
}
// setup中: Wire.onRequest(requestEvent);
```

## .abi 文件生成规范

### 块连接规则
- **语句块**: 有 `previousStatement/nextStatement`，通过 `next` 连接
- **值块**: 有 `output`，连接到 `inputs` 中，不含 `next` 字段
- **Hat块**: 无连接属性，通过 `inputs` 连接内部语句

### 工具箱默认配置
- `wire_begin_with_settings.SDA`: 默认数字 21
- `wire_begin_with_settings.SCL`: 默认数字 22
- `wire_set_clock.FREQUENCY`: 默认数字 100000
- `wire_begin_transmission.ADDRESS`: 默认数字 0x08
- `wire_write.DATA`: 默认数字 0
- `wire_request_from.ADDRESS`: 默认数字 0x08
- `wire_request_from.QUANTITY`: 默认数字 10

### 动态配置引用
- I2C接口根据开发板配置动态显示
- `${board.i2c}` - 可用I2C接口列表 (如 ["Wire", "Wire1"])

### 自动库管理
- 自动添加库引用: `#include <Wire.h>`
- 避免重复添加库 (`ensureLibrary` 函数)
- 智能引脚信息更新

## 使用示例

### 主设备基本通信
```json
{
  "type": "wire_begin",
  "fields": {
    "WIRE": "Wire",
    "MODE": "MASTER"
  }
}
```

### 写入数据到从设备
```json
{
  "type": "wire_begin_transmission",
  "inputs": {
    "ADDRESS": {"shadow": {"type": "math_number", "fields": {"NUM": "0x08"}}}
  },
  "next": {
    "block": {
      "type": "wire_write",
      "inputs": {
        "DATA": {"shadow": {"type": "math_number", "fields": {"NUM": "123"}}}
      },
      "next": {
        "block": {"type": "wire_end_transmission"}
      }
    }
  }
}
```

### 从设备读取数据
```json
{
  "type": "wire_request_from",
  "inputs": {
    "ADDRESS": {"shadow": {"type": "math_number", "fields": {"NUM": "0x08"}}},
    "QUANTITY": {"shadow": {"type": "math_number", "fields": {"NUM": "2"}}}
  }
}
```

## 技术特性
- **多接口支持**: 支持多个I2C接口 (Wire, Wire1等)
- **主从模式**: 完整的主设备和从设备功能
- **自定义引脚**: 支持ESP32等开发板的自定义SDA/SCL引脚
- **设备扫描**: 自动扫描和检测I2C设备
- **错误处理**: 完整的传输状态检查
- **库管理**: 智能库引用管理，避免重复添加

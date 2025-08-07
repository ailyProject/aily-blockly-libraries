# 舵机控制 (Servo Control) 库

Arduino/C++编程中的舵机控制库，支持标准舵机和连续旋转舵机的精确控制。

## 库信息
- **库名**: @aily-project/lib-aily-servo
- **版本**: 1.0.0
- **作者**: aily Project
- **描述**: 舵机控制库，支持角度控制、脉宽控制和高级功能
- **电压**: 3.3V、5V
- **兼容**: Arduino (Servo库)、ESP32 (ESP32Servo库)
- **依赖**: Servo库 (Arduino) 或 ESP32Servo库 (ESP32)

## Blockly 工具箱分类

### Servo
- **基础控制**
  - `servo_write_float` - 舵机角度控制
- **读取状态**
  - `servo_read` - 读取当前角度
  - `servo_read_microseconds` - 读取脉宽
  - `servo_attached` - 检查连接状态
  - `servo_get_pin` - 获取引脚号
- **高级控制**
  - `servo_write_microseconds` - 脉宽控制
  - `servo_detach` - 断开舵机
  - `servo_attach_advanced` - 高级初始化
- **实用功能**
  - `servo_sweep` - 舵机扫描
- **角度值**
  - `servo_angle` - 角度值
  - `servo_map_angle` - 角度映射

## 详细块定义

### 初始化块

#### servo_attach
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 初始化指定引脚的舵机
**字段**:
- `PIN`: 下拉选择 - 舵机引脚 (来自 ${board.servoPins})
**生成代码**: 
```cpp
Servo servo_pin_18;
// setup中: servo_pin_18.attach(18);
```
**自动功能**: 
- 添加库引用: Arduino使用 `#include <Servo.h>`，ESP32使用 `#include <ESP32Servo.h>`
- 创建舵机对象: `Servo servo_pin_引脚号;`
- 自动初始化: 在setup中调用 `attach()`

#### servo_attach_advanced
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 初始化舵机并设置脉宽范围
**字段**:
- `PIN`: 下拉选择 - 舵机引脚 (来自 ${board.servoPins})
**值输入**:
- `MIN_PULSE_WIDTH`: 数字输入 - 最小脉宽 (微秒)
- `MAX_PULSE_WIDTH`: 数字输入 - 最大脉宽 (微秒)
**生成代码**: `servo_pin_18.attach(18, 544, 2400);`
**工具箱默认**: 最小脉宽=544, 最大脉宽=2400
**用途**: 适配不同规格的舵机

### 基础控制块

#### servo_write_float
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 控制舵机转到指定角度
**字段**:
- `PIN`: 下拉选择 - 舵机引脚 (来自 ${board.servoPins})
**值输入**:
- `ANGLE`: 角度输入 - 目标角度 (0-180度)
**生成代码**: `servo_pin_18.write(90);`
**工具箱默认**: 角度=90度
**自动管理**: 未初始化时自动添加舵机初始化

#### servo_write_microseconds
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 通过脉宽控制舵机
**字段**:
- `PIN`: 下拉选择 - 舵机引脚 (来自 ${board.servoPins})
**值输入**:
- `MICROSECONDS`: 数字输入 - 脉宽值 (微秒)
**生成代码**: `servo_pin_18.writeMicroseconds(1500);`
**工具箱默认**: 脉宽=1500微秒 (中位)
**用途**: 精确控制，适用于连续旋转舵机

### 状态读取块

#### servo_read
**类型**: 值块 (output: Number)
**描述**: 读取舵机当前角度
**字段**:
- `PIN`: 下拉选择 - 舵机引脚 (来自 ${board.servoPins})
**生成代码**: `servo_pin_18.read()`
**返回值**: 当前角度 (0-180度)

#### servo_read_microseconds
**类型**: 值块 (output: Number)
**描述**: 读取舵机当前脉宽
**字段**:
- `PIN`: 下拉选择 - 舵机引脚 (来自 ${board.servoPins})
**生成代码**: `servo_pin_18.readMicroseconds()`
**返回值**: 当前脉宽 (微秒)

#### servo_attached
**类型**: 值块 (output: Boolean)
**描述**: 检查舵机是否已连接
**字段**:
- `PIN`: 下拉选择 - 舵机引脚 (来自 ${board.servoPins})
**生成代码**: `servo_pin_18.attached()`
**返回值**: true表示已连接

#### servo_get_pin
**类型**: 值块 (output: Number)
**描述**: 获取舵机连接的引脚号
**字段**:
- `PIN`: 下拉选择 - 舵机引脚 (来自 ${board.servoPins})
**生成代码**: `servo_pin_18.pin()`
**返回值**: 引脚号

### 高级功能块

#### servo_detach
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 断开舵机连接，停止PWM信号
**字段**:
- `PIN`: 下拉选择 - 舵机引脚 (来自 ${board.servoPins})
**生成代码**: `servo_pin_18.detach();`
**用途**: 释放PWM资源，舵机进入自由状态

#### servo_sweep
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 舵机在指定角度范围内扫描
**字段**:
- `PIN`: 下拉选择 - 舵机引脚 (来自 ${board.servoPins})
**值输入**:
- `START_ANGLE`: 角度输入 - 起始角度
- `END_ANGLE`: 角度输入 - 结束角度
- `DELAY_MS`: 数字输入 - 每步延时 (毫秒)
**生成代码**: 生成完整的扫描循环代码
**工具箱默认**: 起始角度=0, 结束角度=180, 延时=20ms

### 角度值块

#### servo_angle
**类型**: 值块 (output: Number)
**描述**: 创建角度值，带范围限制
**字段**:
- `ANGLE`: 数字输入 - 角度值 (0-180)
**生成代码**: `90`
**特性**: 自动限制在0-180度范围内

#### servo_map_angle
**类型**: 值块 (output: Number)
**描述**: 将数值映射到角度范围
**值输入**:
- `VALUE`: 数字输入 - 待映射值
- `FROM_MIN`: 数字输入 - 原始范围最小值
- `FROM_MAX`: 数字输入 - 原始范围最大值
- `TO_MIN`: 角度输入 - 目标角度最小值
- `TO_MAX`: 角度输入 - 目标角度最大值
**生成代码**: `map(512, 0, 1023, 0, 180)`
**工具箱默认**: 将0-1023映射到0-180度
**用途**: 传感器值转换为舵机角度

## .abi 文件生成规范

### 块连接规则
- **语句块**: 有 `previousStatement/nextStatement`，通过 `next` 连接
- **值块**: 有 `output`，连接到 `inputs` 中，不含 `next` 字段

### 工具箱默认配置
- `servo_write_float.ANGLE`: 默认 `servo_angle` 影子块，角度=90
- `servo_write_microseconds.MICROSECONDS`: 默认数字 1500
- `servo_attach_advanced.MIN_PULSE_WIDTH`: 默认数字 544
- `servo_attach_advanced.MAX_PULSE_WIDTH`: 默认数字 2400
- `servo_sweep.START_ANGLE`: 默认 `servo_angle` 影子块，角度=0
- `servo_sweep.END_ANGLE`: 默认 `servo_angle` 影子块，角度=180
- `servo_sweep.DELAY_MS`: 默认数字 20
- `servo_map_angle.VALUE`: 默认数字 512
- `servo_map_angle.FROM_MIN`: 默认数字 0
- `servo_map_angle.FROM_MAX`: 默认数字 1023
- `servo_map_angle.TO_MIN`: 默认 `servo_angle` 影子块，角度=0
- `servo_map_angle.TO_MAX`: 默认 `servo_angle` 影子块，角度=180

### 平台适配
- **Arduino**: 使用标准 `Servo.h` 库
- **ESP32**: 使用 `ESP32Servo.h` 库，自动检测平台
- **引脚支持**: 根据开发板配置动态显示可用舵机引脚
- **ESP32推荐引脚**: 4, 5, 12-19, 21-23, 25-27, 32, 33
- **ESP32避免引脚**: 6-11 (SPI闪存), 34-39 (仅输入), 0,2 (启动控制)

### 自动对象管理
- 舵机对象命名格式: `servo_pin_引脚号`
- 自动创建对象声明: `Servo servo_pin_18;`
- 自动添加初始化: 在setup中调用 `attach()`
- 避免重复创建相同引脚的舵机对象

## 使用示例

### 基本舵机控制
```json
{
  "type": "servo_write_float",
  "fields": {"PIN": "18"},
  "inputs": {
    "ANGLE": {"shadow": {"type": "servo_angle", "fields": {"ANGLE": "90"}}}
  }
}
```

### 高级初始化
```json
{
  "type": "servo_attach_advanced",
  "fields": {"PIN": "18"},
  "inputs": {
    "MIN_PULSE_WIDTH": {"shadow": {"type": "math_number", "fields": {"NUM": "544"}}},
    "MAX_PULSE_WIDTH": {"shadow": {"type": "math_number", "fields": {"NUM": "2400"}}}
  }
}
```

### 舵机扫描
```json
{
  "type": "servo_sweep",
  "fields": {"PIN": "18"},
  "inputs": {
    "START_ANGLE": {"shadow": {"type": "servo_angle", "fields": {"ANGLE": "0"}}},
    "END_ANGLE": {"shadow": {"type": "servo_angle", "fields": {"ANGLE": "180"}}},
    "DELAY_MS": {"shadow": {"type": "math_number", "fields": {"NUM": "20"}}}
  }
}
```

## 技术特性
- **平台自适应**: 自动检测Arduino/ESP32平台并使用相应库
- **智能对象管理**: 自动创建和管理舵机对象，避免重复
- **角度限制**: 自动限制角度在有效范围内 (0-180度)
- **精确控制**: 支持角度和脉宽两种控制方式
- **实用功能**: 提供扫描、映射等常用功能
- **引脚适配**: 根据开发板动态显示可用引脚

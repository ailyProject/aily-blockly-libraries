# I/O控制 (Input/Output Control) 核心库

Arduino/C++编程中的输入输出控制核心库，提供数字和模拟信号的读写功能。

## 库信息
- **库名**: @aily-project/lib-core-io
- **版本**: 1.0.0
- **作者**: aily Project
- **描述**: 基础I/O控制，支持使用Arduino框架的开发板
- **电压**: 3.3V、5V
- **测试者**: 奈何col

## Blockly 工具箱分类

### I/O 控制
- `io_digitalwrite` - 数字输出
- `io_digitalread` - 数字读取
- `io_analogwrite` - PWM输出
- `io_analogread` - 模拟读取
- `io_pinmode` - 引脚模式设置
- `io_pin_digi` - 数字引脚选择器
- `io_pin_adc` - 模拟引脚选择器
- `io_pin_pwm` - PWM引脚选择器
- `io_state` - 电平状态选择器
- `io_mode` - 引脚模式选择器

## 详细块定义

### 控制块

#### io_pinmode
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 设置引脚的工作模式
**值输入**:
- `PIN`: 引脚号输入
- `MODE`: 模式输入
**生成代码**: `pinMode(13, OUTPUT);`
**智能管理**: 自动跟踪已设置的引脚，避免重复设置

#### io_digitalwrite
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 向引脚输出数字信号（高低电平）
**值输入**:
- `PIN`: 引脚号输入
- `STATE`: 电平状态输入
**生成代码**: `digitalWrite(13, HIGH);`
**自动管理**: 未设置模式时自动添加 `pinMode(pin, OUTPUT);`

#### io_analogwrite
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 向引脚输出PWM信号
**值输入**:
- `PIN`: PWM引脚号输入
- `PWM`: PWM值输入 (0-255)
**生成代码**: `analogWrite(9, 128);`

### 读取块

#### io_digitalread
**类型**: 值块 (output: Boolean)
**描述**: 读取引脚的数字信号
**值输入**:
- `PIN`: 引脚号输入
**生成代码**: `digitalRead(2)`
**自动管理**: 未设置模式时自动添加 `pinMode(pin, INPUT);`

#### io_analogread
**类型**: 值块 (output: Number)
**描述**: 读取引脚的模拟信号
**值输入**:
- `PIN`: 模拟引脚号输入
**生成代码**: `analogRead(A0)`
**返回值**: 0-1023 (10位ADC)

### 选择器块

#### io_pin_digi
**类型**: 值块 (output: Any)
**描述**: 数字引脚选择器
**字段**:
- `PIN`: 下拉选择 - 数字引脚 (来自 ${board.digitalPins})
**生成代码**: 引脚号 (如 `13`)

#### io_pin_adc
**类型**: 值块 (output: Any)
**描述**: 模拟引脚选择器
**字段**:
- `PIN`: 下拉选择 - 模拟引脚 (来自 ${board.analogPins})
**生成代码**: 引脚号 (如 `A0`)

#### io_pin_pwm
**类型**: 值块 (output: Any)
**描述**: PWM引脚选择器
**字段**:
- `PIN`: 下拉选择 - PWM引脚 (来自 ${board.pwmPins})
**生成代码**: 引脚号 (如 `9`)

#### io_mode
**类型**: 值块 (output: Any)
**描述**: 引脚模式选择器
**字段**:
- `MODE`: 下拉选择 ["INPUT", "OUTPUT", "INPUT_PULLUP"]
**生成代码**: 模式常量 (如 `OUTPUT`)

#### io_state
**类型**: 值块 (output: Any)
**描述**: 电平状态选择器
**字段**:
- `STATE`: 下拉选择 ["LOW", "HIGH"]
**生成代码**: 电平常量 (如 `HIGH`)

## .abi 文件生成规范

### 块连接规则
- **语句块**: 有 `previousStatement/nextStatement`，通过 `next` 连接
- **值块**: 有 `output`，连接到 `inputs` 中，不含 `next` 字段

### 工具箱默认配置
- `io_digitalwrite.PIN`: 默认 `io_pin_digi` 影子块
- `io_digitalwrite.STATE`: 默认 `io_state` 影子块
- `io_digitalread.PIN`: 默认 `io_pin_digi` 影子块
- `io_analogwrite.PIN`: 默认 `io_pin_pwm` 影子块
- `io_analogwrite.PWM`: 默认数字 255
- `io_analogread.PIN`: 默认 `io_pin_adc` 影子块
- `io_pinmode.PIN`: 默认 `io_pin_digi` 影子块
- `io_pinmode.MODE`: 默认 `io_mode` 影子块 (INPUT)

### 智能引脚管理
- 系统自动跟踪已设置模式的引脚 (`generator.pinModeSet`)
- 数字读写时自动添加相应的 `pinMode()` 到 setup
- 避免重复设置引脚模式

### 动态配置引用
- 引脚选择器根据开发板配置动态显示可用引脚
- `${board.digitalPins}` - 数字引脚列表
- `${board.analogPins}` - 模拟引脚列表
- `${board.pwmPins}` - PWM引脚列表

## 使用示例

### 基本数字输出
```json
{
  "type": "io_digitalwrite",
  "inputs": {
    "PIN": {"shadow": {"type": "io_pin_digi", "fields": {"PIN": "13"}}},
    "STATE": {"shadow": {"type": "io_state", "fields": {"STATE": "HIGH"}}}
  }
}
```

### 模拟读取示例
```json
{
  "type": "io_analogread",
  "inputs": {
    "PIN": {"shadow": {"type": "io_pin_adc", "fields": {"PIN": "A0"}}}
  }
}
```

### PWM输出示例
```json
{
  "type": "io_analogwrite",
  "inputs": {
    "PIN": {"shadow": {"type": "io_pin_pwm", "fields": {"PIN": "9"}}},
    "PWM": {"shadow": {"type": "math_number", "fields": {"NUM": 255}}}
  }
}
```

## 技术特性
- **智能管理**: 自动处理引脚模式设置和跟踪
- **开发板适配**: 根据开发板动态显示可用引脚
- **类型安全**: 区分数字、模拟、PWM引脚类型
- **代码优化**: 避免重复的pinMode调用
- **自动初始化**: 未设置模式时自动添加相应的pinMode
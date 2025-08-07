# 数学运算 (Math Operations) 核心库

Arduino/C++编程中的数学运算核心库，提供基础运算、高级函数、三角函数和随机数功能。

## 库信息
- **库名**: @aily-project/lib-core-math
- **版本**: 0.0.1
- **作者**: aily Project
- **描述**: 数学相关功能支持库
- **兼容**: arduino:avr, esp32:esp32
- **电压**: 3.3V、5V

## Blockly 工具箱分类

### Math 运算
- `math_number` - 数字常量
- `math_arithmetic` - 四则运算
- `math_single` - 高级函数
- `math_trig` - 三角函数
- `math_constant` - 数学常量
- `math_number_property` - 数字属性检查
- `math_round` - 舍入函数
- `math_on_list` - 列表运算
- `math_modulo` - 取余运算
- `math_constrain` - 数值约束
- `math_random_int` - 随机整数
- `math_random_float` - 随机小数
- `math_atan2` - 方位角计算
- `math_round_to_decimal` - 小数保留
- `math_bitwise_not` - 按位取反
- `map_to` - 数值映射

## 详细块定义

### 基础运算块

#### math_number
**类型**: 值块 (output: Number)
**描述**: 创建数字常量
**字段**:
- `NUM`: 数字输入 - 数值 (默认: 0)
**生成代码**: `123`

#### math_arithmetic
**类型**: 值块 (output: Number)
**描述**: 基础四则运算和幂运算
**字段**:
- `OP`: 下拉选择 ["ADD", "MINUS", "MULTIPLY", "DIVIDE", "MODULO", "POWER"]
**值输入**:
- `A`: 数字输入 - 第一个操作数
- `B`: 数字输入 - 第二个操作数
**生成代码**:
- `(1 + 1)` - 加法
- `(1 - 1)` - 减法
- `(1 * 1)` - 乘法
- `(1 / 1)` - 除法
- `(1 % 1)` - 取余
- `pow(1, 1)` - 幂运算

#### math_modulo
**类型**: 值块 (output: Number)
**描述**: 计算除法余数
**值输入**:
- `DIVIDEND`: 数字输入 - 被除数
- `DIVISOR`: 数字输入 - 除数
**生成代码**: `(64 % 10)`

### 高级函数块

#### math_single
**类型**: 值块 (output: Number)
**描述**: 高级数学函数
**字段**:
- `OP`: 下拉选择 ["ROOT", "ABS", "NEG", "LN", "LOG10", "EXP", "POW10"]
**值输入**:
- `NUM`: 数字输入 - 操作数
**生成代码**:
- `sqrt(9)` - 平方根
- `abs(9)` - 绝对值
- `(-9)` - 负数
- `log(9)` - 自然对数
- `log10(9)` - 常用对数
- `exp(9)` - 指数函数
- `pow(10, 9)` - 10的幂

#### math_trig
**类型**: 值块 (output: Number)
**描述**: 三角函数（角度制）
**字段**:
- `OP`: 下拉选择 ["SIN", "COS", "TAN", "ASIN", "ACOS", "ATAN"]
**值输入**:
- `NUM`: 数字输入 - 角度值
**生成代码**:
- `sin(45 / 180.0 * PI)` - 正弦
- `cos(45 / 180.0 * PI)` - 余弦
- `tan(45 / 180.0 * PI)` - 正切
- `asin(45) * 180.0 / PI` - 反正弦
- `acos(45) * 180.0 / PI` - 反余弦
- `atan(45) * 180.0 / PI` - 反正切

#### math_atan2
**类型**: 值块 (output: Number)
**描述**: 计算点(x,y)的方位角
**值输入**:
- `X`: 数字输入 - X坐标
- `Y`: 数字输入 - Y坐标
**生成代码**: `atan2(1, 1) * 180.0 / PI`

### 数字处理块

#### math_round
**类型**: 值块 (output: Number)
**描述**: 数字舍入函数
**字段**:
- `OP`: 下拉选择 ["ROUND", "ROUNDUP", "ROUNDDOWN"]
**值输入**:
- `NUM`: 数字输入 - 待舍入数字
**生成代码**:
- `round(3.1)` - 四舍五入
- `ceil(3.1)` - 向上取整
- `floor(3.1)` - 向下取整

#### math_number_property
**类型**: 值块 (output: Boolean)
**描述**: 检查数字属性
**字段**:
- `PROPERTY`: 下拉选择 ["EVEN", "ODD", "PRIME", "WHOLE", "POSITIVE", "NEGATIVE", "DIVISIBLE_BY"]
**值输入**:
- `NUMBER_TO_CHECK`: 数字输入 - 待检查数字
**生成代码**: 根据属性生成相应的检查表达式

#### math_constrain
**类型**: 值块 (output: Number)
**描述**: 限制数字在指定范围内
**值输入**:
- `VALUE`: 数字输入 - 待约束值
- `LOW`: 数字输入 - 最小值
- `HIGH`: 数字输入 - 最大值
**生成代码**: `constrain(50, 1, 100)`

#### math_round_to_decimal
**类型**: 值块 (output: Number)
**描述**: 保留指定位数小数
**值输入**:
- `NUMBER`: 数字输入 - 待处理数字
- `DECIMALS`: 数字输入 - 小数位数
**生成代码**: 生成保留小数的表达式

### 常量和随机数块

#### math_constant
**类型**: 值块 (output: Number)
**描述**: 数学常量
**字段**:
- `CONSTANT`: 下拉选择 ["PI", "E", "GOLDEN_RATIO", "SQRT2", "SQRT1_2", "INFINITY"]
**生成代码**:
- `PI` - 圆周率
- `E` - 自然常数
- `((1 + sqrt(5)) / 2)` - 黄金比例
- `sqrt(2)` - 根号2
- `sqrt(0.5)` - 根号二分之一
- `INFINITY` - 无穷大

#### math_random_int
**类型**: 值块 (output: Number)
**描述**: 生成指定范围内的随机整数
**值输入**:
- `FROM`: 数字输入 - 最小值
- `TO`: 数字输入 - 最大值
**生成代码**: `random(1, 101)` (包含最小值，不包含最大值)

#### math_random_float
**类型**: 值块 (output: Number)
**描述**: 生成0-1之间的随机小数
**生成代码**: `(random(0, 1000000) / 1000000.0)`

### 特殊功能块

#### math_on_list
**类型**: 值块 (output: Number)
**描述**: 列表运算（求和、最值、平均值等）
**字段**:
- `OP`: 下拉选择 ["SUM", "MIN", "MAX", "AVERAGE", "MEDIAN", "MODE", "STD_DEV", "RANDOM"]
**值输入**:
- `LIST`: 列表输入 - 待处理列表
**生成代码**: 根据操作类型生成相应的列表处理代码

#### math_bitwise_not
**类型**: 值块 (output: Number)
**描述**: 按位取反运算
**值输入**:
- `NUM`: 数字输入 - 待取反数字
**生成代码**: `(~5)`

#### map_to
**类型**: 值块 (output: Number)
**描述**: 将数值从一个范围映射到另一个范围
**值输入**:
- `NUM`: 数字输入 - 待映射值
- `FIRST_START`: 数字输入 - 原始范围最小值
- `FIRST_END`: 数字输入 - 原始范围最大值
- `LAST_START`: 数字输入 - 目标范围最小值
- `LAST_END`: 数字输入 - 目标范围最大值
**生成代码**: `map(0, 0, 1023, 0, 255)`

## .abi 文件生成规范

### 块连接规则
- **值块**: 有 `output`，连接到 `inputs` 中，不含 `next` 字段
- **所有数学块都是值块**，用于计算和返回数值

### 工具箱默认配置
- `math_number`: 默认值 123
- `math_arithmetic`: 默认操作数 1 和 1
- `math_single`: 默认操作数 9
- `math_trig`: 默认角度 45
- `math_number_property`: 默认检查数字 0，属性 EVEN
- `math_round`: 默认数字 3.1
- `math_modulo`: 默认被除数 64，除数 10
- `math_constrain`: 默认值 50，范围 1-100
- `math_random_int`: 默认范围 1-100
- `math_atan2`: 默认坐标 (1,1)
- `math_round_to_decimal`: 默认数字 123.456，小数位 2
- `math_bitwise_not`: 默认数字 5
- `map_to`: 默认映射 0-1023 到 0-255

## 使用示例

### 基本运算
```json
{
  "type": "math_arithmetic",
  "fields": {"OP": "ADD"},
  "inputs": {
    "A": {"block": {"type": "math_number", "fields": {"NUM": 5}}},
    "B": {"block": {"type": "math_number", "fields": {"NUM": 3}}}
  }
}
```

### 三角函数
```json
{
  "type": "math_trig",
  "fields": {"OP": "SIN"},
  "inputs": {
    "NUM": {"block": {"type": "math_number", "fields": {"NUM": 30}}}
  }
}
```

### 数值映射
```json
{
  "type": "map_to",
  "inputs": {
    "NUM": {"block": {"type": "io_analogread"}},
    "FIRST_START": {"block": {"type": "math_number", "fields": {"NUM": 0}}},
    "FIRST_END": {"block": {"type": "math_number", "fields": {"NUM": 1023}}},
    "LAST_START": {"block": {"type": "math_number", "fields": {"NUM": 0}}},
    "LAST_END": {"block": {"type": "math_number", "fields": {"NUM": 255}}}
  }
}
```

## 技术特性
- **Arduino优化**: 针对Arduino平台优化的数学函数
- **角度制支持**: 三角函数直接支持角度输入，自动转换弧度
- **类型安全**: 自动处理整数和浮点数转换
- **内存高效**: 避免使用Arduino不支持的复杂数据结构
- **精度控制**: 提供小数位数控制和舍入功能
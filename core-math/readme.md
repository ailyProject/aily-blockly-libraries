# 数学运算 (Math Operations) 核心库

Arduino/C++编程中的数学运算核心库，提供基础运算、高级函数、三角函数和随机数功能。

## 库信息
- **库名**: @aily-project/lib-core-math
- **版本**: 0.0.1
- **作者**: aily Project
- **描述**: 数学相关功能支持库
- **兼容**: arduino:avr, esp32:esp32
- **电压**: 3.3V、5V

## 可用模块

### 基础运算
- **数字** (`math_number`): 创建数字常量
- **四则运算** (`math_arithmetic`): 加减乘除、取余、幂运算
- **取余** (`math_modulo`): 计算除法余数

### 高级函数 (`math_single`)
- **平方根** (ROOT): `sqrt(x)`
- **绝对值** (ABS): `abs(x)`
- **负数** (NEG): `-x`
- **自然对数** (LN): `log(x)`
- **常用对数** (LOG10): `log10(x)`
- **指数** (EXP): `exp(x)` (e^x)
- **10的幂** (POW10): `pow(10,x)`

### 三角函数 (`math_trig`)
- **正弦** (SIN): `sin(x°)`
- **余弦** (COS): `cos(x°)`
- **正切** (TAN): `tan(x°)`
- **反三角函数**: ASIN, ACOS, ATAN
- **方位角** (`math_atan2`): 计算点(x,y)的方位角

### 数字处理
- **舍入** (`math_round`): 四舍五入、向上取整、向下取整
- **数字属性** (`math_number_property`): 检查偶数、奇数、质数、整数、正数、负数
- **数字约束** (`math_constrain`): 限制数字在指定范围内
- **小数保留** (`math_round_to_decimal`): 保留指定位数小数

### 数学常量 (`math_constant`)
- **π** (PI): 圆周率
- **e** (E): 自然常数
- **φ** (GOLDEN_RATIO): 黄金比例
- **√2** (SQRT2): 根号2
- **√½** (SQRT1_2): 根号二分之一
- **∞** (INFINITY): 无穷大

### 随机数
- **随机整数** (`math_random_int`): 指定范围内的随机整数
- **随机小数** (`math_random_float`): 0-1之间的随机小数

### 列表运算 (`math_on_list`)
- **求和** (SUM): 计算列表总和
- **最值** (MIN/MAX): 找出最小值/最大值
- **平均值** (AVERAGE): 计算平均数
- **统计** (MEDIAN/MODE/STD_DEV): 中位数、众数、标准差（需手动实现）

### 位运算
- **按位取反** (`math_bitwise_not`): `~x`

### 映射函数
- **数值映射** (`map_to`): 将数值从一个范围映射到另一个范围

## 使用说明

### 基本运算
```cpp
// 基础运算
int result = 5 + 3;
float power = pow(2, 3);

// 高级函数
float root = sqrt(16);
int absolute = abs(-5);

// 三角函数（角度制）
float sine = sin(30 * PI / 180);
```

### 随机数生成
```cpp
// 随机整数 1-10
int randomInt = random(1, 11);

// 随机小数 0-1
float randomFloat = random(0, 1000) / 1000.0;
```

### 数值约束和映射
```cpp
// 限制在0-255范围
int constrained = constrain(value, 0, 255);

// 映射传感器值到PWM范围
int pwm = map(sensorValue, 0, 1023, 0, 255);
```

## 注意事项
- 三角函数使用角度制（自动转换为弧度）
- 部分列表统计函数在Arduino中需要手动实现
- 随机数需要在setup()中调用randomSeed()初始化
- 浮点运算可能有精度误差
- 位运算仅适用于整数类型

## 技术特性
- **Arduino优化**: 针对Arduino平台优化的数学函数
- **角度制支持**: 三角函数直接支持角度输入
- **类型安全**: 自动处理整数和浮点数转换
- **内存高效**: 避免使用Arduino不支持的复杂数据结构
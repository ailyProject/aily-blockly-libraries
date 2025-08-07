# I/O控制 (Input/Output Control) 核心库

Arduino/C++编程中的输入输出控制核心库，提供数字和模拟信号的读写功能。

## 库信息
- **库名**: @aily-project/lib-core-io
- **版本**: 1.0.0
- **作者**: aily Project
- **描述**: 基础I/O控制，支持使用Arduino框架的开发板
- **电压**: 3.3V、5V
- **测试者**: 奈何col

## 可用模块

### 引脚模式设置 (`io_pinmode`)
设置引脚的工作模式
- **参数**: 引脚号、模式（INPUT/OUTPUT/INPUT_PULLUP）
- **实现**: `pinMode(pin, mode)`
- **智能管理**: 自动跟踪已设置的引脚，避免重复设置

### 数字信号操作
- **数字输出** (`io_digitalwrite`): 向引脚输出高低电平，调用 `digitalWrite()`
- **数字读取** (`io_digitalread`): 读取引脚的数字信号，调用 `digitalRead()`
- **自动模式**: 未设置模式时自动添加 `pinMode()`

### 模拟信号操作
- **PWM输出** (`io_analogwrite`): 输出PWM信号，调用 `analogWrite()`
- **模拟读取** (`io_analogread`): 读取模拟信号，调用 `analogRead()`

### 引脚选择器
- **数字引脚** (`io_pin_digi`): 选择数字引脚，根据开发板动态显示
- **模拟引脚** (`io_pin_adc`): 选择ADC引脚
- **PWM引脚** (`io_pin_pwm`): 选择PWM引脚

### 状态和模式
- **电平状态** (`io_state`): HIGH/LOW电平选择
- **引脚模式** (`io_mode`): INPUT/OUTPUT/INPUT_PULLUP模式选择

## 使用说明

### 基本用法
```cpp
// 设置引脚模式
pinMode(13, OUTPUT);

// 数字输出
digitalWrite(13, HIGH);

// 数字读取
int value = digitalRead(2);

// PWM输出
analogWrite(9, 128);

// 模拟读取
int sensorValue = analogRead(A0);
```

### 智能引脚管理
- 系统自动跟踪已设置模式的引脚
- 使用数字读写时自动添加相应的pinMode
- 避免重复设置引脚模式

### 引脚类型
- **数字引脚**: 支持HIGH/LOW输出和读取
- **PWM引脚**: 支持0-255的PWM输出
- **ADC引脚**: 支持0-1023的模拟读取

## 注意事项
- 引脚号根据开发板类型动态显示
- PWM值范围为0-255
- ADC读取值范围为0-1023（10位）
- 注意引脚的电流和电压限制
- 某些引脚可能有特殊功能限制

## 技术特性
- **智能管理**: 自动处理引脚模式设置
- **开发板适配**: 根据开发板动态显示可用引脚
- **类型安全**: 区分数字、模拟、PWM引脚类型
- **代码优化**: 避免重复的pinMode调用
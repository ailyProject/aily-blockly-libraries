# Grove GSR传感器库 - AI使用说明

## 库概述

Grove GSR传感器库用于测量皮肤电导率变化，检测情绪和生理反应。基于Arduino平台，提供简单易用的API接口。

## 核心API

### 类定义
```cpp
class Grove_GSR_Sensor {
public:
    Grove_GSR_Sensor(int pin = A0);  // 构造函数，默认A0引脚
    void begin();                    // 初始化传感器
    int readRaw();                   // 读取原始ADC值
    int readAverage(int samples = 10); // 读取平均值，默认10次采样
    float getConductance();          // 获取电导率值
private:
    int _pin;                        // 传感器引脚
};
```

### 使用模式

1. **初始化模式**：创建对象并初始化
2. **读取模式**：获取原始值、平均值或电导率
3. **调试模式**：通过串口输出数据

## Blockly块设计

### 块类型映射

| 块类型 | 功能 | 连接属性 | 字段类型 |
|--------|------|----------|----------|
| grove_gsr_create | 创建传感器对象 | 语句块 | field_input + field_dropdown |
| grove_gsr_read_raw | 读取原始值 | 值块 | field_variable |
| grove_gsr_read_average | 读取平均值 | 值块 | field_variable + input_value |
| grove_gsr_get_conductance | 获取电导率 | 值块 | field_variable |
| grove_gsr_print_value | 串口输出 | 语句块 | field_variable |

### 变量管理

- **创建块**使用`field_input`让用户输入变量名
- **调用块**使用`field_variable`选择已创建的变量
- **变量类型**：`Grove_GSR_Sensor`
- **自动注册**：使用`registerVariableToBlockly()`函数

### 代码生成要点

1. **库引用**：自动添加`#include <Grove_GSR_Sensor.h>`
2. **变量声明**：自动生成`Grove_GSR_Sensor varName(pin);`
3. **初始化代码**：自动调用`begin()`方法
4. **串口初始化**：调试块自动添加Serial.begin(9600)

## 示例代码生成

### 基础使用
```cpp
#include <Grove_GSR_Sensor.h>

Grove_GSR_Sensor gsr(A0);

void setup() {
  gsr.begin();
}

void loop() {
  int value = gsr.readAverage(10);
  // 处理数据
}
```

### 调试输出
```cpp
#include <Grove_GSR_Sensor.h>

Grove_GSR_Sensor gsr(A0);

void setup() {
  Serial.begin(9600);
  gsr.begin();
}

void loop() {
  Serial.print("GSR Value: ");
  Serial.println(gsr.readAverage(10));
}
```

## 技术实现细节

### 采样算法
- 使用多次采样求平均值提高稳定性
- 每次采样间隔5ms避免信号干扰
- 默认采样10次，可自定义采样次数

### 电导率计算
```cpp
float conductance = (float)rawValue / 1024.0 * 5.0;
```

### 引脚配置
- 支持A0-A5模拟引脚
- 自动配置为输入模式
- 兼容3.3V和5V系统

## 应用场景

1. **情绪监测**：检测压力、紧张等情绪状态
2. **生物反馈**：实时生理信号监测
3. **睡眠分析**：睡眠质量评估
4. **人机交互**：基于生理信号的交互控制

## 注意事项

1. **信号稳定性**：需要多次采样求平均值
2. **环境因素**：温度、湿度会影响测量结果
3. **个体差异**：不同人群基准值不同
4. **电极接触**：确保良好接触皮肤

## 兼容性

- **开发板**：支持所有Arduino兼容板
- **电压**：3.3V-5V
- **接口**：模拟输入引脚
- **依赖**：Arduino核心库
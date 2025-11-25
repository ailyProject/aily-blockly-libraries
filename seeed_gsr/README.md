# Grove GSR传感器库

GSR (Galvanic Skin Response) 皮肤电反应传感器库，用于测量皮肤电导率变化，检测情绪和生理反应。

## 功能特性

- 测量皮肤电导率
- 支持原始值读取
- 支持平均值计算
- 支持电导率转换
- 适用于情绪监测、睡眠质量分析等应用

## 硬件连接

将GSR传感器的两个电极分别连接到同一只手的两个手指上，传感器连接到Arduino的模拟引脚（A0-A5）。

## 使用方法

### 1. 创建传感器对象

```cpp
Grove_GSR_Sensor gsr(A0);
```

### 2. 初始化传感器

```cpp
gsr.begin();
```

### 3. 读取数据

```cpp
// 读取原始值
int rawValue = gsr.readRaw();

// 读取平均值（默认10次采样）
int avgValue = gsr.readAverage(10);

// 获取电导率
float conductance = gsr.getConductance();
```

## 示例代码

```cpp
#include <Grove_GSR_Sensor.h>

Grove_GSR_Sensor gsr(A0);

void setup() {
  Serial.begin(9600);
  gsr.begin();
}

void loop() {
  int gsrValue = gsr.readAverage(10);
  Serial.println(gsrValue);
  delay(100);
}
```

## 应用场景

- 情绪监测
- 压力检测
- 睡眠质量分析
- 生物反馈训练
- 人机交互研究

## 技术参数

- 工作电压：3.3V-5V
- 接口类型：模拟输入
- 测量范围：0-1023（10位ADC）
- 响应时间：<100ms

## 注意事项

1. 使用前确保手指清洁干燥
2. 电极应紧密接触皮肤
3. 测量环境应保持相对稳定
4. 避免在强电磁干扰环境下使用
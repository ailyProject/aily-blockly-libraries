# DHT温湿度传感器 (DHT Temperature & Humidity Sensor) 库

基于Adafruit DHT传感器库的可视化编程模块，支持DHT11、DHT22、DHT21温湿度传感器。

## 库信息
- **库名**: @aily-project/lib-dht
- **版本**: 1.0.0
- **作者**: adafruit
- **描述**: DHT11/DHT22(AM2302)/DHT21(AM2301)温湿度传感器库
- **电压**: 3.3V、5V
- **测试者**: 奈何col
- **官方库**: https://github.com/adafruit/DHT-sensor-library

## 支持的传感器型号

### DHT11
- **温度范围**: 0-50°C (±2°C精度)
- **湿度范围**: 20-90%RH (±5%RH精度)
- **采样频率**: 1Hz (每秒1次)
- **特点**: 低成本，精度较低

### DHT22 (AM2302)
- **温度范围**: -40-80°C (±0.5°C精度)
- **湿度范围**: 0-100%RH (±2-5%RH精度)
- **采样频率**: 0.5Hz (每2秒1次)
- **特点**: 高精度，推荐使用

### DHT21 (AM2301)
- **温度范围**: -40-80°C (±0.5°C精度)
- **湿度范围**: 0-100%RH (±3%RH精度)
- **采样频率**: 0.5Hz (每2秒1次)
- **特点**: 中等精度和成本

## 可用模块

### 初始化传感器 (`dht_init`)
初始化DHT传感器并设置引脚
- **参数**: 传感器型号（DHT11/DHT22/DHT21）、数字引脚
- **实现**: 创建DHT对象并在setup中调用begin()
- **自动功能**: 添加DHT库引用，创建全局对象，自动初始化

### 读取温度 (`dht_read_temperature`)
读取传感器温度值（摄氏度）
- **参数**: 传感器型号、引脚号
- **返回值**: 浮点数，温度值（°C）
- **实现**: 调用 `dht.readTemperature()`
- **智能管理**: 自动创建对应的DHT对象（如果不存在）

### 读取湿度 (`dht_read_humidity`)
读取传感器湿度值（相对湿度百分比）
- **参数**: 传感器型号、引脚号
- **返回值**: 浮点数，湿度值（%RH）
- **实现**: 调用 `dht.readHumidity()`
- **智能管理**: 自动创建对应的DHT对象（如果不存在）

### 读取状态检查 (`dht_read_success`)
检查传感器读取是否成功
- **参数**: 传感器型号、引脚号
- **返回值**: 布尔值，true表示读取成功
- **实现**: 检查温度和湿度读取值是否为NaN
- **用途**: 在读取数据前验证传感器工作状态

## 使用说明

### 基本用法
```cpp
#include <DHT.h>

// 自动生成的DHT对象
DHT dht_2_dht22(2, DHT22);

void setup() {
  Serial.begin(9600);
  // 自动初始化
  dht_2_dht22.begin();
}

void loop() {
  // 检查读取状态
  if (!isnan(dht_2_dht22.readTemperature()) &&
      !isnan(dht_2_dht22.readHumidity())) {

    // 读取温度和湿度
    float temperature = dht_2_dht22.readTemperature();
    float humidity = dht_2_dht22.readHumidity();

    Serial.print("温度: ");
    Serial.print(temperature);
    Serial.println("°C");

    Serial.print("湿度: ");
    Serial.print(humidity);
    Serial.println("%");
  }

  delay(2000); // DHT22建议2秒间隔
}
```

### 智能对象管理
- 系统根据传感器型号和引脚自动创建唯一的DHT对象
- 对象命名格式：`dht_引脚号_传感器型号`
- 避免重复创建相同配置的对象
- 自动添加必要的库引用和初始化代码

### 错误处理
```cpp
// 使用读取状态检查
if (dht_read_success) {
  float temp = dht_read_temperature;
  float hum = dht_read_humidity;
  // 处理有效数据
} else {
  Serial.println("传感器读取失败!");
}
```

## 接线说明

### 标准接线（3线制）
- **VCC**: 连接3.3V或5V电源
- **GND**: 连接地线
- **DATA**: 连接数字引脚（如D2）
- **上拉电阻**: DATA线需要4.7kΩ-10kΩ上拉电阻

### 4线制模块
某些DHT模块有4个引脚，其中一个为NC（不连接）

## 注意事项
- DHT传感器读取间隔不能太频繁（DHT11最少1秒，DHT22最少2秒）
- 需要在DATA线上添加上拉电阻（4.7kΩ-10kΩ）
- 传感器启动需要1-2秒稳定时间
- 读取失败时会返回NaN，需要进行错误检查
- 避免在潮湿环境中长期使用DHT11

## 技术特性
- **自动管理**: 智能创建和管理DHT对象
- **多传感器支持**: 同时支持多个不同型号的DHT传感器
- **错误检测**: 提供读取状态检查功能
- **库集成**: 自动添加Adafruit DHT库依赖
- **引脚适配**: 根据开发板动态显示可用数字引脚
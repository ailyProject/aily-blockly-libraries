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

## Blockly 工具箱分类

### DHT传感器
- `dht_init` - 初始化传感器
- `dht_read_temperature` - 读取温度
- `dht_read_humidity` - 读取湿度
- `dht_read_success` - 读取状态检查

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

## 详细块定义

### 初始化块

#### dht_init
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 初始化DHT传感器并设置引脚
**字段**:
- `TYPE`: 下拉选择 - 传感器型号 ["DHT11", "DHT22", "DHT21"]
- `PIN`: 下拉选择 - 数字引脚 (来自 ${board.digitalPins})
**生成代码**:
```cpp
DHT dht_2_dht22(2, DHT22);
// setup中: dht_2_dht22.begin();
```
**自动功能**:
- 添加库引用: `#include <DHT.h>`
- 创建全局对象: `DHT dht_引脚号_传感器型号(引脚, 传感器型号);`
- 自动初始化: 在setup中调用 `begin()`

### 读取块

#### dht_read_temperature
**类型**: 值块 (output: Number)
**描述**: 读取传感器温度值（摄氏度）
**字段**:
- `TYPE`: 下拉选择 - 传感器型号 ["DHT11", "DHT22", "DHT21"]
- `PIN`: 下拉选择 - 数字引脚 (来自 ${board.digitalPins})
**生成代码**: `dht_2_dht22.readTemperature()`
**返回值**: 浮点数，温度值（°C）
**智能管理**: 自动创建对应的DHT对象（如果不存在）

#### dht_read_humidity
**类型**: 值块 (output: Number)
**描述**: 读取传感器湿度值（相对湿度百分比）
**字段**:
- `TYPE`: 下拉选择 - 传感器型号 ["DHT11", "DHT22", "DHT21"]
- `PIN`: 下拉选择 - 数字引脚 (来自 ${board.digitalPins})
**生成代码**: `dht_2_dht22.readHumidity()`
**返回值**: 浮点数，湿度值（%RH）
**智能管理**: 自动创建对应的DHT对象（如果不存在）

#### dht_read_success
**类型**: 值块 (output: Boolean)
**描述**: 检查传感器读取是否成功
**字段**:
- `TYPE`: 下拉选择 - 传感器型号 ["DHT11", "DHT22", "DHT21"]
- `PIN`: 下拉选择 - 数字引脚 (来自 ${board.digitalPins})
**生成代码**: `(!isnan(dht_2_dht22.readTemperature()) && !isnan(dht_2_dht22.readHumidity()))`
**返回值**: 布尔值，true表示读取成功
**用途**: 在读取数据前验证传感器工作状态

## .abi 文件生成规范

### 块连接规则
- **语句块**: 有 `previousStatement/nextStatement`，通过 `next` 连接
- **值块**: 有 `output`，连接到 `inputs` 中，不含 `next` 字段

### 智能对象管理
- 系统根据传感器型号和引脚自动创建唯一的DHT对象
- 对象命名格式：`dht_引脚号_传感器型号` (如 `dht_2_dht22`)
- 避免重复创建相同配置的对象 (`Arduino.addedDHTInitCode`)
- 自动添加必要的库引用和初始化代码

### 自动代码生成
- **库引用**: `#include <DHT.h>`
- **对象声明**: `DHT dht_2_dht22(2, DHT22);`
- **初始化代码**: 在setup中添加 `dht_2_dht22.begin();`
- **跟踪机制**: 使用 `Arduino.initializedDHTSensors` 和 `Arduino.addedDHTInitCode` 避免重复

### 动态配置引用
- 引脚选择器根据开发板配置动态显示可用数字引脚
- `${board.digitalPins}` - 数字引脚列表

## 使用示例

### 初始化传感器
```json
{
  "type": "dht_init",
  "fields": {
    "TYPE": "DHT22",
    "PIN": "2"
  }
}
```

### 读取温度
```json
{
  "type": "dht_read_temperature",
  "fields": {
    "TYPE": "DHT22",
    "PIN": "2"
  }
}
```

### 读取湿度
```json
{
  "type": "dht_read_humidity",
  "fields": {
    "TYPE": "DHT22",
    "PIN": "2"
  }
}
```

### 状态检查
```json
{
  "type": "dht_read_success",
  "fields": {
    "TYPE": "DHT22",
    "PIN": "2"
  }
}
```

### 完整使用示例
```json
{
  "type": "controls_if",
  "inputs": {
    "IF0": {
      "block": {
        "type": "dht_read_success",
        "fields": {"TYPE": "DHT22", "PIN": "2"}
      }
    },
    "DO0": {
      "block": {
        "type": "serial_println",
        "inputs": {
          "VAR": {
            "block": {
              "type": "dht_read_temperature",
              "fields": {"TYPE": "DHT22", "PIN": "2"}
            }
          }
        }
      }
    }
  }
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
- **自动管理**: 智能创建和管理DHT对象，避免重复初始化
- **多传感器支持**: 同时支持多个不同型号的DHT传感器
- **错误检测**: 提供读取状态检查功能
- **库集成**: 自动添加Adafruit DHT库依赖
- **引脚适配**: 根据开发板动态显示可用数字引脚
- **代码优化**: 智能跟踪和管理传感器对象生命周期
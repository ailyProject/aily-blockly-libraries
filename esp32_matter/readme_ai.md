# ESP32 Matter - AI 使用说明

## 适用范围

ESP32 Matter 设备积木，覆盖配网状态、开关灯、调光灯及常用传感器端点。

芯片/配置约束：构建配置必须启用 ESP Matter 数据模型并选用 Matter 分区；端点必须在 Matter.begin() 之前创建。

## 代码生成约定

- 所有积木类型均使用 `esp32_` 前缀。
- generator.js 会自动添加 SDK 头文件和必要的全局对象。
- 创建对象类积木应在初始化阶段执行；状态查询积木可在循环或条件中使用。
- 不打包 SDK 源码，也不生成 src.7z。

## 积木

- `esp32_matter_begin`：启动 Matter 节点；端点需先创建。
- `esp32_matter_status`：查询 Matter 配网或连接状态。
- `esp32_matter_pairing_code`：获取 Matter 配对码或二维码 URL。
- `esp32_matter_decommission`：清除当前 Matter Fabric 配网信息。
- `esp32_matter_create_onoff_light`：创建开关灯端点。
- `esp32_matter_create_dimmable_light`：创建调光灯端点。
- `esp32_matter_light_set`：设置灯的开关或亮度。
- `esp32_matter_light_get`：读取灯的开关或亮度。
- `esp32_matter_create_numeric_sensor`：创建常用数值传感器端点。
- `esp32_matter_numeric_sensor_set`：更新并上报数值传感器值。
- `esp32_matter_create_boolean_sensor`：创建常用布尔传感器端点。
- `esp32_matter_boolean_sensor_set`：更新并上报布尔传感器值。

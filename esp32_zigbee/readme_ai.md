# ESP32 Zigbee - AI 使用说明

## 适用范围

ESP32 Zigbee 设备积木，支持网络角色、开放入网以及灯、温度、占用和接触传感器端点。

芯片/配置约束：仅适用于带 IEEE 802.15.4 的 ESP32-C5/C6/H2，Arduino 构建菜单必须选择与 begin 角色一致的 Zigbee 模式和分区。

## 代码生成约定

- 所有积木类型均使用 `esp32_` 前缀。
- generator.js 会自动添加 SDK 头文件和必要的全局对象。
- 创建对象类积木应在初始化阶段执行；状态查询积木可在循环或条件中使用。
- 不打包 SDK 源码，也不生成 src.7z。

## 积木

- `esp32_zigbee_begin`：以指定角色启动 Zigbee。
- `esp32_zigbee_connected`：检查 Zigbee 是否已加入网络。
- `esp32_zigbee_network`：控制设备加入网络。
- `esp32_zigbee_factory_reset`：清除 Zigbee 网络配置并重启。
- `esp32_zigbee_create_light`：创建开关灯端点并加入 Zigbee。
- `esp32_zigbee_set_light`：更新 Zigbee 灯状态。
- `esp32_zigbee_get_light`：读取 Zigbee 灯当前状态。
- `esp32_zigbee_create_temp`：创建温度传感器端点并加入 Zigbee。
- `esp32_zigbee_set_temp`：设置并上报温度。
- `esp32_zigbee_create_occupancy`：创建占用传感器端点并加入 Zigbee。
- `esp32_zigbee_set_occupancy`：设置并上报占用状态。
- `esp32_zigbee_create_contact`：创建接触传感器端点并加入 Zigbee。
- `esp32_zigbee_set_contact`：设置并上报接触状态。

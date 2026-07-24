# ESP32 RainMaker - AI 使用说明

## 适用范围

ESP32 RainMaker 云端设备积木，支持节点、标准设备、服务、参数上报与重置。

芯片/配置约束：构建配置必须包含 ESP RainMaker 工作队列；实际联网通常还需配合 WiFiProv 完成配网。

## 代码生成约定

- 所有积木类型均使用 `esp32_` 前缀。
- generator.js 会自动添加 SDK 头文件和必要的全局对象。
- 创建对象类积木应在初始化阶段执行；状态查询积木可在循环或条件中使用。
- 不打包 SDK 源码，也不生成 src.7z。

## 积木

- `esp32_rainmaker_init_node`：创建 RainMaker 节点。
- `esp32_rainmaker_add_device`：创建标准设备并添加到节点。
- `esp32_rainmaker_enable_service`：启用 RainMaker 标准服务。
- `esp32_rainmaker_start`：启动 RainMaker 云服务。
- `esp32_rainmaker_stop`：停止 RainMaker 云服务。
- `esp32_rainmaker_report`：更新并上报设备参数。
- `esp32_rainmaker_reset`：延时执行 RainMaker 恢复出厂或 Wi-Fi 重置。
- `esp32_rainmaker_node_id`：读取 RainMaker 节点 ID。

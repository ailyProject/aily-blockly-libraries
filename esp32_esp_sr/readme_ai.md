# ESP32 语音识别 - AI 使用说明

## 适用范围

ESP32-S3/P4 ESP-SR 离线唤醒词与命令词识别积木。

芯片/配置约束：仅适用于 ESP32-S3/P4，构建分区必须启用语音模型（Flash 或 SD）；I2S 输入需先由 esp32_i2s 库配置。

## 代码生成约定

- 所有积木类型均使用 `esp32_` 前缀。
- generator.js 会自动添加 SDK 头文件和必要的全局对象。
- 创建对象类积木应在初始化阶段执行；状态查询积木可在循环或条件中使用。
- 不打包 SDK 源码，也不生成 src.7z。

## 积木

- `esp32_esp_sr_begin`：启动离线语音识别并为四个短语分配命令 ID 1-4。
- `esp32_esp_sr_control`：结束、暂停或恢复语音识别。
- `esp32_esp_sr_set_mode`：切换唤醒词或命令识别模式。
- `esp32_esp_sr_last_event`：返回最近的 sr_event_t 数值。
- `esp32_esp_sr_last_command`：返回最近识别到的命令 ID。
- `esp32_esp_sr_last_phrase`：返回最近识别到的短语 ID。
- `esp32_esp_sr_event_constant`：返回语音事件常量。

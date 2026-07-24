# ESP32 PPP 蜂窝网络 - AI 使用说明

## 适用范围

ESP32 PPP 蜂窝调制解调器积木，支持 APN、串口引脚、联网、状态、短信和 AT 命令。

芯片/配置约束：开发板构建配置必须启用 LWIP PPP 与 esp-modem，且硬件供电应满足蜂窝模块峰值电流。

## 代码生成约定

- 所有积木类型均使用 `esp32_` 前缀。
- generator.js 会自动添加 SDK 头文件和必要的全局对象。
- 创建对象类积木应在初始化阶段执行；状态查询积木可在循环或条件中使用。
- 不打包 SDK 源码，也不生成 src.7z。

## 积木

- `esp32_ppp_set_apn`：设置蜂窝网络 APN 与可选 SIM PIN。
- `esp32_ppp_set_pins`：设置调制解调器 UART 和流控引脚。
- `esp32_ppp_set_reset`：设置调制解调器硬件复位引脚。
- `esp32_ppp_begin`：启动 PPP 调制解调器。
- `esp32_ppp_end`：停止 PPP 数据连接。
- `esp32_ppp_attached`：检查调制解调器是否附着网络。
- `esp32_ppp_sync`：检查调制解调器是否响应 AT。
- `esp32_ppp_info_number`：读取调制解调器数值状态。
- `esp32_ppp_info_text`：读取调制解调器身份或运营商文本。
- `esp32_ppp_sms`：发送 SMS 短信。
- `esp32_ppp_at`：发送 AT 命令并返回文本响应。

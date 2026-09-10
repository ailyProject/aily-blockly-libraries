# InkSight 墨水屏内容

把开源项目 [InkSight](https://github.com/datascale-ai/inksight) 的服务端渲染内容拉取并显示到 Aily Blockly 的 GxEPD2 墨水屏上。

## Library Info

| Field   | Value                 |
| ------- | --------------------- |
| Package | @aily-project/lib-inksight |
| Version | 0.1.0                 |
| Author  | Aily adaptation of datascale-ai/inksight |
| Source  | https://github.com/datascale-ai/inksight |
| License | MIT                   |

## Supported Boards

带 WiFi 的 ESP32 系列（已在 ESP32-C3 目标编译），配合已安装 `@aily-project/lib-gxepd2` 的 4.2 寸 400x300 墨水屏（如 GDEW042Z15 三色屏，按黑白方式显示）。

## Description

本库实现 InkSight 设备端的内容获取协议：向 InkSight 后端（官方站点或自建部署）请求 `GET /api/render`，流式解码服务端渲染好的 1-bit BMP（400x300），并提供把位图绘制到 GxEPD2 显示对象的积木。三色屏的第三色不参与渲染（内容为黑白，与 InkSight 官方固件一致）。

## Quick Start

1. `InkSight 连接WiFi` 填入路由器账号密码；
2. `InkSight 服务器/设备令牌` 填后端地址（如 `https://www.inksight.site` 或自建地址）与网站配对得到的设备令牌；
3. 循环里 `拉取 InkSight 内容` 成功后，在 `GxEPD2 整屏刷新` 的绘制区内放 `InkSight 内容绘制到 display`。

库内置 ESP32 网络栈源码（WiFi/Network/HTTPClient/NetworkClientSecure，源自 arduino-esp32 核心）。HTTPS 连接未做证书校验（setInsecure），请在可信网络使用或改用自建 HTTP 后端。

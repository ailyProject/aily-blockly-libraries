# 空气质量 WAQI (lib-waqi)

从 waqi.info（aqicn.org）接口获取空气质量数据，并在 GxEPD2 电子墨水屏上绘制完整监测界面：AQI 分级黄色警示（整框网点渐变）、12 项指标网格、PM2.5 七日与紫外线预测图，中文显示。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-waqi |
| Version | 1.0.0 |
| Source | 本地创建 |
| License | UNLICENSED |

## Supported Boards

ESP32 系列（含 ESP32-C3），3.3V。依赖 `@aily-project/lib-gxepd2`（墨水屏驱动与显示对象）。

## Quick Start

1. `连接WiFi` 积木填入 2.4G WiFi 名称和密码。
2. `获取空气质量数据` 积木填入站点 ID（如 `10214`）和 waqi.info 令牌。
3. 用 lib-gxepd2 初始化墨水屏后调用 `绘制空气质量界面`；获取失败用 `绘制错误页面`。
4. 循环中建议每 30 分钟重新获取并重绘，配合 `gxepd2_sleep` 省电。

注意：含 WiFi+TLS 的固件约 1.6MB，需将板子分区方案设为 **Huge APP (3MB)**。

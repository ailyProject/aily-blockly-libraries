# 时钟显示库 (Clock Display)

NTP时钟同步、TFT时钟界面绘制、NTC室内温度读取

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-clock-display |
| Version | 1.0.0 |
| Author | ailyProject |
| License | MIT |

## Supported Boards

ESP32 系列（依赖TFT_eSPI、U8g2_for_TFT_eSPI、NTP时间同步）

## Description

- **NTP同步**：配置时区并从NTP服务器获取网络时间
- **时钟界面**：自动绘制年份/日期/星期/时分，每分钟刷新一次
- **室内温度**：NTC热敏电阻读取（10K@25°C, Beta=3950），ADC采集并换算
- **背景绘制**：夜空渐变背景 + 随机星点效果
- **时间查询**：提供年/月/日/时/分/秒/星期等数字和字符串接口

## Quick Start

1. `clk_begin` 初始化，绑定TFT和字体
2. `clk_sync_ntp` 配置NTP同步
3. loop中调用 `clk_show` 自动刷新时钟

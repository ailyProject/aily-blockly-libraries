# 农历日历库 (Lunar Calendar)

公历/农历转换、干支生肖、24节气精确计算、星期/月份工具函数

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-lunar-calendar |
| Version | 1.0.0 |
| Author | ailyProject |
| License | MIT |

## Supported Boards

ESP32 / ESP8266 / Arduino UNO R4 WiFi 等所有支持Arduino框架的开发板

## Description

提供完整的农历日历计算功能，包括：
- **公历→农历转换**：精确计算1900-2100年间的农历日期
- **干支生肖**：天干地支+生肖年份（如「丙午(马)年」）
- **24节气**：基于YearMonthBit位表算法，2000-2050年精确到天
- **日历工具**：星期几、当月天数、闰年处理

节气算法参考 EPD-nRF5 项目 Lunar.c 的 YearMonthBit 位表实现。

## Quick Start

1. 安装库后，在Blockly工具箱中找到「农历日历」分类
2. 拖拽块即可使用，无需初始化
3. 所有块均为纯计算函数，不依赖硬件外设

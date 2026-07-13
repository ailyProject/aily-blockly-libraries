# 计算器 (Calculator)

TFT屏幕计算器，支持四则运算、编辑/浏览模式切换。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-calculator |
| Version | 1.0.0 |
| Author | ailyProject |

## Supported Boards

ESP32系列（需TFT_eSPI + UI Animation库）

## Quick Start

setup中调用`calc_begin()`，loop中根据页面调用`calc_show()`和`calc_handle_btns()`。

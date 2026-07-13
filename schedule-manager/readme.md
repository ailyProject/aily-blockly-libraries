# 课程表管理

ESP32课程表显示与WiFi Web配置模块，支持上课/暑假/寒假三种模式切换。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-schedule-manager |
| Version | 1.0.0 |
| Author | ailyProject |
| Source | - |
| License | MIT |

## Supported Boards

ESP32系列（需配合TFT_eSPI屏幕和U8g2中文字体）

## Description

提供课程表屏幕渲染、Flash持久化存储、WiFi Web配置页面。用户可通过手机浏览器访问设备IP:8080编辑课程表，支持7天×8节课的上课模式和8条自定义安排的暑假/寒假模式。

## Quick Start

1. 在setup中调用 `sched_begin` → `sched_set_defaults` → `sched_load` → `sched_start_server`
2. WiFi连接后调用 `sched_start_server`，loop中调用 `sched_handle_client`
3. 页面切换时调用 `sched_show` 显示课程表

# UI动画库 (UI Animation)

开机动画、行走精灵动画、力量展示、夜空背景、按键管理、页面导航

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-ui-animation |
| Version | 1.0.0 |
| Author | ailyProject |
| License | MIT |

## Supported Boards

ESP32 系列（依赖TFT_eSPI、U8g2_for_TFT_eSPI）

## Description

- **开机动画**：彩虹条过渡 + 力量展示动画 + 标题文字展示
- **行走精灵**：基于TFT_eSprite的位图帧动画，自动缩放+透明背景合成
- **力量展示**：多帧位图循环播放（需配合img头文件）
- **夜空背景**：渐变色背景 + 随机星点效果
- **按键管理**：6路按键注册/扫描/去抖，支持边沿触发和电平检测
- **页面导航**：循环翻页逻辑，页面变化检测

## Quick Start

1. `ui_begin` 初始化，绑定TFT
2. `ui_btn_add` 注册6个按键到引脚
3. loop中 `ui_btn_scan` 扫描按键，`ui_walk_update` 更新动画

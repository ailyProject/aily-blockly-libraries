# 倒计时库 (Countdown Timer)

TFT倒计时器：启动/暂停/继续/取消，完成时播放致爱丽丝旋律

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-countdown-timer |
| Version | 1.0.0 |
| Author | ailyProject |
| License | MIT |

## Supported Boards

ESP32 系列（依赖TFT_eSPI、U8g2_for_TFT_eSPI、ESP32 LEDC PWM）

## Description

- **完整倒计时状态机**：IDLE→RUN→PAUSE→DONE，状态自动转换
- **TFT界面**：大号字体显示剩余时间，颜色随状态变化（黄/绿/橙/红）
- **致爱丽丝旋律**：倒计时结束时通过蜂鸣器循环播放，B键取消
- **按键操作**：内置上/下/A/B四个按钮的语义化操作（加减小/开始暂停/取消）
- **增量刷新**：仅在时间或状态变化时重绘，避免闪烁

## Quick Start

1. `cd_begin` 初始化，绑定TFT和蜂鸣器引脚
2. loop中调用 `cd_update` 自动处理倒计时和显示
3. 用 `cd_btn_a/b/up/down` 响应按键操作

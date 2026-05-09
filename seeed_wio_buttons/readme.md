# Wio Terminal 按键与5向开关

Wio Terminal 内置可配置按键（A/B/C）与5向摇杆开关的 Blockly 控制库。

## 库信息

| 字段 | 值 |
|------|-----|
| Package | @aily-project/lib-seeed-wio-buttons |
| Version | 1.0.0 |
| Author | Seeed Studio |
| Source | https://wiki.seeedstudio.com/Wio-Terminal-Buttons/ |
| License | MIT |

## 支持开发板

- Seeed Wio Terminal（Seeeduino SAMD51）

## 功能说明

- **可配置按键**：3个独立按键（A/B/C），按下时为低电平
- **5向开关**：支持上/下/左/右/按压5个方向，拨动时为低电平
- 所有引脚均使用内部上拉输入，无需外部电阻
- 无需额外安装库，宏定义已内置于 Wio Terminal 开发板包

## 快速上手

1. 在 `loop` 中直接使用"按键被按下"或"5向开关被按下"积木进行条件判断
2. 检测积木会自动将对应引脚的初始化代码加入 setup，无需手动操作

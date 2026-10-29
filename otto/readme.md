# OTTO 机器人 (@aily-project/lib-otto)

OTTO DIY 官方 Arduino 驱动 **OttoDIYLib 13.0.0** 的 Aily Blockly 图形化封装:舵机初始化、行走/转向/跳舞动作、表情、蜂鸣器音乐、8x8 MAX7219 点阵。

| 项目 | 说明 |
| --- | --- |
| 包名 / 版本 | `@aily-project/lib-otto` 0.0.1(项目本地库) |
| 驱动来源 | OttoDIYLib 13.0.0,作者 Otto DIY / Camilo Parra Palacio,https://www.ottodiy.com/ |
| 上游许可 | GPL-3.0(上游 `LICENSE` 随库保留,未改动) |
| 已验证板卡 | Arduino Nano(`arduino:avr:nano`),编译通过 |
| 必需依赖 | `@aily-project/lib-servo`(提供 `Servo.h`,AVR 环境必须) |

## 接线(官方 OTTO 示例)

| 部件 | 引脚 |
| --- | --- |
| 左腿舵机 | D2 |
| 右腿舵机 | D3 |
| 左脚舵机 | D4 |
| 右脚舵机 | D5 |
| 蜂鸣器 | D13 |
| 点阵 DIN / CS / CLK | A3 / A2 / A1 |

舵机请使用独立电源(如 4 节 AA 电池盒)并与主板共地。引脚在积木上可自由选择,上表只是官方示例接线。

## 最小用法

1. 「初始化」分类放入 **创建 OTTO 机器人**,按接线选好 4 个舵机引脚与蜂鸣器引脚(实例名默认 `Otto`);
2. 使用点阵/表情积木时,再加一块 **初始化 8x8 点阵**;
3. 在循环里放入 **回到初始姿态**、**行走**、**播放内置音乐** 等动作积木。

## 注意

- 实例名建议使用默认的 `Otto`;不要用 `wave`、`smile`、`one`、`two` 等名字,它们在上游头文件里是宏。
- 所有点阵相关积木(嘴型、表情、点阵控制)必须先执行 **初始化 8x8 点阵**。
- 本封装仅完成编译验证,未在真实硬件上运行验证。

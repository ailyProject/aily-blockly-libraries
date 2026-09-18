# GRBL STM32（Grbl 1.1h 移植积木库）

把 Grbl 1.1h 激光雕刻/CNC 固件的核心能力移植为 Blockly 积木：G 代码解析、前瞻梯形加减速、三轴 Bresenham 步进、圆弧插补、归位、软限位与激光 PWM，串口协议兼容 LaserGRBL 等 Grbl 发送器。

## Library Info

| Field | Value |
| --- | --- |
| Package | @aily-project/lib-grbl-stm32 |
| Version | 0.0.1 |
| Author | Aily 本地移植（参考 grbl 1.1h，Sungeun K. Jeon / Simen Svale Skogsrud） |
| Source | grbl 1.1h（20190825）算法移植 |
| License | GPL-3.0-or-later（继承 Grbl） |

## Supported Boards

STM32F103C8 等 Arduino 框架开发板（需 `analogWrite` PWM 支持）；任意带 STEP/DIR 驱动器（A4988/DRV8825 等）的 3 轴系统。

## Description

- 串口 115200，Grbl 兼容行协议：`ok`/`error:N`、实时命令 `?` `!` `~` `Ctrl-X`、状态报告 `<Idle|MPos:...|Bf:...|FS:...>`。
- 支持 G0/G1/G2/G3（I/J 或 R）、G20/21、G90/91、G92/G92.1、M0/M2/M3/M4/M5/M8/M9、F/S；`$`/`$$`/`$H`/`$X`/`$SLP`/`$G`/`$x=val`（RAM 参数，掉电不保存）。
- 前瞻梯形加减速（junction-deviation 转角速度 + 反向规划）、轮询式 DDA 步进（步频受 loop 周期限制，约几千赫兹）、逐行应答流控。
- 激光：S 值映射 PWM 占空比（`$30` 满功率），运动段同步开关，保持/复位立即关断。

## Quick Start

1. 接线：X/Y/Z 的 STEP/DIR 接驱动器；限位开关常闭接地接输入脚；激光 PWM 接驱动器 TTL（共地）。
2. `setup`：`GRBL 初始化`（填 11 个引脚号）+ `GRBL 绑定串口`。
3. `loop`：`GRBL tick`。
4. 上位机（LaserGRBL）连串口发 `$$` 查看参数，`G1 X10 F600` 试跑。

## Limitations

不移植：AMASS、实时倍率覆盖命令（0x90+）、安全门/停车、探针 G38、EEPROM 参数保存、G10/G28/G38.x、多坐标系 G55-G59、M4 动态功率。参数为 RAM 存储，复位后恢复默认。

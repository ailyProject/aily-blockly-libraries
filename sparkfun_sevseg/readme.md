# SparkFun SevSeg

用于七段数码管的 Blockly 库。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-sevseg |
| Version | 0.0.1 |
| Author | Dean Reading / SparkFun Electronics |
| Source | https://github.com/sparkfun/SevSeg |
| License | Public domain / Beerware |

## Supported Boards

Arduino UNO 等 AVR 开发板。需要按位选和段选引脚接线。

## Description

该库用于控制 1 到 4 位七段数码管，支持共阴/共阳、亮度调节和字符串显示。显示刷新需要在 loop 中反复调用显示积木。

## Quick Start

先初始化显示类型、位选引脚和段选引脚，再在 loop 中持续调用显示积木。
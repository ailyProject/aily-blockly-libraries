# NES模拟器 (Nofrendo)

基于arduino-nofrendo的NES红白机模拟器库，支持ESP32 + ST7789屏幕 + SD卡加载ROM。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-nofrendo |
| Version | 1.0.0 |
| Author | Matthew Conte (nofrendo), moononournation (arduino port) |
| Source | https://github.com/moononournation/arduino-nofrendo |
| License | LGPL-2.0 |

## Supported Boards

学思ESP32掌机 (board-xueersi_esp32) 或兼容ESP32 + ST7789 + SD卡硬件

## Description

将NES游戏ROM文件(.nes)放入SD卡，通过积木块一键启动模拟器。支持大部分常见NES游戏，画面通过ST7789屏幕显示，使用板载6键操控。

## Quick Start

1. 将`.nes`游戏ROM放入TF卡根目录
2. 初始化屏幕(`tftscr_init`)后拖入`nofrendo_start`块
3. ROM路径填写SD卡中的文件路径，如`/sdcard/game.nes`

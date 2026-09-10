# micro:bit V2 数据日志（MYDATA.CSV）

把日志写入 micro:bit V2 接口芯片存储，电脑端直接打开 MICROBIT 盘上的 MYDATA.CSV 用 Excel/WPS 查看。

## Library Info

| Field   | Value                                    |
| ------- | ---------------------------------------- |
| Package | @aily-project/lib-microbit-daplog        |
| Version | 1.5.0                                    |
| Author  | ailyProject                               |
| Source  | microbit-foundation/spec-i2c-protocol    |
| License | UNLICENSED                                |

## Supported Boards

仅 micro:bit V2（nRF52833，核心 `nRF5:BBCmicrobitV2`）。

## Description

通过 DAPLink 官方 I2C Flash Interface 协议（内部总线 Wire1，从机地址 0x72）把日志写入接口芯片的备用 Flash。DAPLink 固件把这块存储虚拟成 MICROBIT U 盘上的 `MYDATA.CSV` 文件：用电池独立记录，插上电脑后双击 `MYDATA.CSV` 即可用 Excel/WPS 打开。文件首行为格式标识行 `MBDL,v3`，其后每行一条逗号分隔记录；日志断电、重新刷固件均不丢失。

## Quick Start

1. `arduino_setup` 放「初始化数据日志」；首次运行会自动格式化存储（清空旧数据）。
2. 「记录一行数据」是容器块：里面放几个「增加列」子块就有几列，先写标题行，再在循环里记录温度、加速度等数值。
3. 插上电脑，打开 `MICROBIT` 盘，双击 `MYDATA.CSV`；「刷新电脑上的日志文件」可立即更新显示。

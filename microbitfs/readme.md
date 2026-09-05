# micro:bit V2 文件系统（microbitfs）

把 micropython-microbit-v2 的 microbitfs 文件系统完整移植到 Aily Blockly：128 字节 chunk 链表式文件系统，随机轮转分配磨损均衡、页交换碎片整理、掉电安全；积木直接完成文件的写入、追加、读取、删除与容量管理。

## Library Info

| Field | Value |
| --- | --- |
| Package | @aily-project/lib-microbitfs |
| Version | 1.1.0 |
| Author | Mark Shannon, Ayke van Laethem (microbitfs upstream) |
| Source | https://github.com/microbit-foundation/micropython-microbit-v2 |
| License | MIT |

## Supported Boards

- micro:bit V2（nRF52833，核心 `n-able-Arduino:arm-ble:BBCmicrobitV2`）

## Description

文件系统窗口与上游 `src/codal_port/filesystem.ld` 完全一致：`0x6D000–0x73000`（24KB，6 页 × 4KB，约 20KB 可用数据 = 160 chunk × 126 字节）。写入时仅将 1→0 位写入 Flash，任一时刻断电不会破坏已有文件；空间不足或碎片过多时自动执行上游的 sweep 整理。上游 os 层仅有 r/w 模式且为扁平文件系统（无目录），追加/按行读与文件夹操作均在封装层实现：文件夹为“名字前缀”虚拟目录（如 `logs/a.txt`），随第一个文件写入自动出现。

## Quick Start

1. 在开机程序中放入「初始化 micro:bit 文件系统」（默认不勾选清空重建，全新芯片会自动初始化）。
2. 用「写入文件 / 追加一行 / 追加数字」保存数据，用「读取文件…」「读取文件…第…行」读回，配合串口打印查看。
3. 文件名直接写 `data.txt` 即可（扁平命名，无目录，最长 120 字符）。

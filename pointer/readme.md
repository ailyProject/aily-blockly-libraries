# lib-pointer

指针变量演示库：在图形化工程中演示 C 指针语义（声明、取地址、解引用读写）。

## Library Info

| Field   | Value                    |
| ------- | ------------------------ |
| Package | @aily-project/lib-pointer |
| Version | 0.0.1                    |
| Author  | Aily IDE                 |
| License | UNLICENSED               |

## Supported Boards

无硬件依赖，纯语法演示库，支持全部可编译 C/C++ 的开发板（当前工程使用 ESP32-S3）。

## Description

提供 4 个积木：定义类型化指针变量（int*、char*、float* 等 8 种类型）、取变量地址（&）、读取指针指向的值（*）、通过指针写入值（*=）。生成的就是标准 C/C++ 指针代码，适合学习指针概念。

## Quick Start

1. 用「变量」库的 `variable_define` 先声明一个普通变量（如 `int a = 10`）；
2. 用 `pointer_define` 声明指针，初值接 `pointer_address_of(变量 a)`；
3. 用 `pointer_dereference_get/set` 读写指针指向的值，用串口打印观察效果。

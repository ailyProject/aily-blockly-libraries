# JQ6500 语音模块

JQ6500 串口语音模块驱动库。使用 SoftwareSerial 发送 JQ6500 串口指令帧，支持模块复位、音量设置、按序号播放指定音频与循环模式设置。驱动源码随库自带（`src/JQ6500`），仅依赖 Arduino 板载 `SoftwareSerial`。

## Library Info
- **Name**: @aily-project/lib-jq6500
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `jq6500_init` | Statement | NAME(field_input), RX_PIN(dropdown), TX_PIN(dropdown) | `jq6500_init("mp3", 11, 12)` | `#include <SoftwareSerial.h>` ↵ `#include "JQ6500.h"` ↵ `SoftwareSerial mp3_serial(11, 12);` ↵ `JQ6500_Serial mp3(mp3_serial);` ↵ setup 开头：`mp3_serial.begin(9600);` |
| `jq6500_reset` | Statement | VAR(field_variable) | `jq6500_reset($mp3)` | `mp3.reset();` |
| `jq6500_set_volume` | Statement | VAR(field_variable), VOLUME(input_value) | `jq6500_set_volume($mp3, math_number(30))` | `mp3.setVolume(30);` |
| `jq6500_play_index` | Statement | VAR(field_variable), INDEX(input_value) | `jq6500_play_index($mp3, math_number(1))` | `mp3.playFileByIndexNumber(1);` |
| `jq6500_set_loop` | Statement | VAR(field_variable), MODE(dropdown) | `jq6500_set_loop($mp3, MP3_LOOP_NONE)` | `mp3.setLoopMode(MP3_LOOP_NONE);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| RX_PIN, TX_PIN | ${board.digitalPins} | jq6500_init：RX 接模块 TX，TX 接模块 RX |
| MODE | MP3_LOOP_NONE, MP3_LOOP_ONE, MP3_LOOP_ALL | jq6500_set_loop：不循环 / 单曲循环 / 全盘循环 |

## ABS Examples

### Basic Usage
```abs
# ABS Schema: 2

arduino_setup()
    jq6500_init("mp3", 11, 12)
    jq6500_reset($mp3)
    jq6500_set_volume($mp3, math_number(30))
    jq6500_set_loop($mp3, MP3_LOOP_NONE)

arduino_loop()
    jq6500_play_index($mp3, math_number(1))
    time_delay(math_number(2000))
```

## Notes

1. **变量模型**：`jq6500_init("mp3", ...)` 创建类型为 `JQ6500_Serial` 的对象 `$mp3`；其他积木的 VAR 槽直接传 `$mp3`，不要传 `variables_get(...)`。
2. **串口参数**：软串口波特率固定 9600（与模块出厂默认一致）；RX/TX 引脚选择取决于具体开发板可用数字引脚，接线需交叉。
3. **帧格式**：`0x7E 长度 命令 参数字节… 0xEF`，长度字段 = 1 个长度字节 + 1 个命令字节 + 参数字节数。复位 `7E 02 0C EF`，设置音量 `7E 03 06 vv EF`，播放指定曲目 `7E 04 03 hh ll EF`，循环开关 `7E 03 18 xx EF` / `7E 03 19 xx EF`。
4. **取值范围**：播放序号从 1 开始（16 位序号）；音量 0-30，超过 30 时按 30 发送。
5. **循环模式**：`MP3_LOOP_NONE` 关闭单曲与全盘循环；`MP3_LOOP_ONE` 开启单曲循环；`MP3_LOOP_ALL` 开启全盘循环。
6. **放置位置**：`jq6500_init` 应放在 `arduino_setup()` 中，其余控制积木在 `arduino_setup()` / `arduino_loop()` 中均可使用。
7. **未验证**：不同 JQ6500 固件版本对 `0x18`/`0x19` 循环开关指令的响应、以及模块未插卡时的播放行为未经硬件实测。

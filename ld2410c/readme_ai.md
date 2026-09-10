# LD2410C 雷达帧存储库

通过软串口（SoftwareSerial）接收 LD2410C 雷达模块一帧数据（帧长可变：基本模式 23 字节、工程模式最长 45 字节）并存储，提供逐字节读取、实际长度查询、目标状态/运动/静止距离与能量等字段解析图形块，并支持多雷达自动轮询。

## Library Info

- **Name**: @aily-project/lib-ld2410c
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `ld2410c_init` | Statement | VAR(field_variable), RX(field_number), TX(field_number), BAUD(field_dropdown) | `ld2410c_init($ld2410c, 2, 3, 256000)` | `#include "LD2410C.h" ↵ LD2410C ld2410c(2, 3, 256000); ↵ ld2410c.begin();` |
| `ld2410c_read_frame` | Statement | VAR(field_variable) | `ld2410c_read_frame($ld2410c)` | `ld2410c.readFrame();` |
| `ld2410c_poll_auto` | Statement | (无参数) | `ld2410c_poll_auto()` | `LD2410C::poll();` |
| `ld2410c_new_frame` | Value (Boolean) | VAR(field_variable) | `ld2410c_new_frame($ld2410c)` | `ld2410c.newFrame()` |
| `ld2410c_frame_valid` | Value (Boolean) | VAR(field_variable) | `ld2410c_frame_valid($ld2410c)` | `ld2410c.frameValid()` |
| `ld2410c_frame_byte` | Value (Number) | VAR(field_variable), INDEX(input_value Number) | `ld2410c_frame_byte($ld2410c, math_number(1))` | `ld2410c.frameByte(1)` |
| `ld2410c_data_byte` | Value (Number) | VAR(field_variable), INDEX(input_value Number) | `ld2410c_data_byte($ld2410c, math_number(1))` | `ld2410c.dataByte(1)` |
| `ld2410c_frame_length` | Value (Number) | VAR(field_variable) | `ld2410c_frame_length($ld2410c)` | `ld2410c.frameLength()` |
| `ld2410c_data_length` | Value (Number) | VAR(field_variable) | `ld2410c_data_length($ld2410c)` | `ld2410c.dataLength()` |
| `ld2410c_mode` | Value (Number) | VAR(field_variable) | `ld2410c_mode($ld2410c)` | `ld2410c.mode()` |
| `ld2410c_target_status` | Value (Number) | VAR(field_variable) | `ld2410c_target_status($ld2410c)` | `ld2410c.targetStatus()` |
| `ld2410c_moving_distance` | Value (Number) | VAR(field_variable) | `ld2410c_moving_distance($ld2410c)` | `ld2410c.movingDistance()` |
| `ld2410c_moving_energy` | Value (Number) | VAR(field_variable) | `ld2410c_moving_energy($ld2410c)` | `ld2410c.movingEnergy()` |
| `ld2410c_static_distance` | Value (Number) | VAR(field_variable) | `ld2410c_static_distance($ld2410c)` | `ld2410c.staticDistance()` |
| `ld2410c_static_energy` | Value (Number) | VAR(field_variable) | `ld2410c_static_energy($ld2410c)` | `ld2410c.staticEnergy()` |
| `ld2410c_detect_distance` | Value (Number) | VAR(field_variable) | `ld2410c_detect_distance($ld2410c)` | `ld2410c.detectDistance()` |
| `ld2410c_move_gate_count` | Value (Number) | VAR(field_variable) | `ld2410c_move_gate_count($ld2410c)` | `ld2410c.moveGateCount()` |
| `ld2410c_static_gate_count` | Value (Number) | VAR(field_variable) | `ld2410c_static_gate_count($ld2410c)` | `ld2410c.staticGateCount()` |
| `ld2410c_move_gate_energy` | Value (Number) | VAR(field_variable), INDEX(input_value Number) | `ld2410c_move_gate_energy($ld2410c, math_number(1))` | `ld2410c.moveGateEnergy(1)` |
| `ld2410c_static_gate_energy` | Value (Number) | VAR(field_variable), INDEX(input_value Number) | `ld2410c_static_gate_energy($ld2410c, math_number(1))` | `ld2410c.staticGateEnergy(1)` |
| `ld2410c_photosensitive` | Value (Number) | VAR(field_variable) | `ld2410c_photosensitive($ld2410c)` | `ld2410c.photosensitive()` |

`ld2410c_init` 的对象声明为全局副作用，`begin()` 写入 setup 开头；表格其余行为块的 `#include "LD2410C.h"` 注入与 init 块共用同一键，仅出现一次。

## Parameter Options

`ld2410c_init` 的 BAUD（field_dropdown，ABS 中为不带引号的实际值）：

- `256000`（出厂默认）
- `115200`
- `57600`
- `38400`
- `19200`
- `9600`

## ABS Examples

收到新帧后，把数据区 15 个字节逐个打印到硬件串口：

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    ld2410c_init($ld2410c, 2, 3, 256000)
    serial_begin(Serial, 115200)

arduino_loop()
    ld2410c_read_frame($ld2410c)
    controls_if(ld2410c_new_frame($ld2410c))
        @DO0:
            serial_println(Serial, ld2410c_target_status($ld2410c))
            serial_println(Serial, ld2410c_moving_distance($ld2410c))
            serial_println(Serial, ld2410c_moving_energy($ld2410c))
            serial_println(Serial, ld2410c_move_gate_energy($ld2410c, math_number(1)))
```

对应生成代码（节选 loop）：

```cpp
ld2410c.readFrame();
if (ld2410c.newFrame()) {
  Serial.println(ld2410c.targetStatus());
  Serial.println(ld2410c.movingDistance());
  Serial.println(ld2410c.movingEnergy());
  Serial.println(ld2410c.moveGateEnergy(1));
}
```

连接 2 个雷达时，用自动轮询代替逐对象读取：

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    ld2410c_init($radar1, 2, 3, 256000)
    ld2410c_init($radar2, 4, 5, 256000)
    serial_begin(Serial, 115200)

arduino_loop()
    ld2410c_poll_auto()
    controls_if(ld2410c_new_frame($radar1))
        @DO0:
            serial_println(Serial, ld2410c_target_status($radar1))
    controls_if(ld2410c_new_frame($radar2))
        @DO0:
            serial_println(Serial, ld2410c_target_status($radar2))
```

对应生成代码（节选 loop）：

```cpp
LD2410C::poll();
if (radar1.newFrame()) {
  Serial.println(radar1.targetStatus());
}
if (radar2.newFrame()) {
  Serial.println(radar2.targetStatus());
}
```

## Notes

1. **Variable**: `ld2410c_init($ld2410c, 2, 3, 256000)` creates `$ld2410c`; pass `$ld2410c` directly to every field_variable slot of this library. Do not wrap it as `variables_get(...)` or a string.
2. **帧结构（帧长可变）**: 帧头（第 1~4 字节，十进制 244、243、242、241）+ 数据区（第 5 ~ 帧长-4 字节）+ 帧尾（最后 4 字节，十进制 248、247、246、245）。基本模式上报 23 字节（数据区 15 字节），工程模式上报最长 45 字节（数据区 37 字节；参考 HLKModuleConfig：MIN_FRAME_LENGTH_BASE=23、MIN_FRAME_LENGTH_ENGINEERING=45，超过 45 的帧视为无效）；长度不在 23~45 或帧尾不符的帧会被丢弃。`ld2410c_data_byte` 的第 1 字节即整帧的第 5 字节。
3. **必需调用**: `ld2410c_read_frame` 非阻塞，必须在 loop 中反复调用；每次调用读取软串口当前全部可用字节，以帧头对齐、以帧尾动态定界确定帧长，校验通过才更新存储帧（保留上一次的有效帧）。
4. **新帧/有效帧区别**: `ld2410c_new_frame` 读取后自动清零，适合“每帧处理一次”；`ld2410c_frame_valid` 自首次收到有效帧起保持为真，用于判断是否已有可用数据。INDEX 越界（0 或 >上限）返回 0；`ld2410c_frame_length` 返回实际帧长（23~45），`ld2410c_data_length` 返回帧长-8，未存有效帧时均为 0。
5. **接线**: 模块 TX → RX 引脚，模块 RX → TX 引脚（开发板 5V 逻辑时建议分压），必须共地，按模块规格供电。
6. **波特率**: LD2410C 出厂 256000；16 MHz AVR 的 SoftwareSerial 在高波特率下接收不可靠，如丢帧请将模块波特率改为 115200 或更低。同一程序多个 SoftwareSerial 只有一个可接收，`begin()` 已调用 `listen()`，后初始化的其他软串口会抢占接收权。
7. **解析字段位置**（帧字节序号从 1 起，均带越界保护，参考 HLKModuleConfig::getStatus_2410）：第 7 字节=上报模式（1=工程/2=基本）；第 9 字节=目标状态（0=无目标/1=运动/2=静止/3=运动+静止）；第 10~11 字节=运动目标距离（小端 16 位）；第 12 字节=运动目标能量 0~100；第 13~14 字节=静止目标距离（小端 16 位）；第 15 字节=静止目标能量 0~100；第 16~17 字节=探测距离（小端 16 位，即参考库的 distance）；第 18/19 字节=最远运动/静止距离门数量；第 20~28/29~37 字节=运动/静止距离门 1~9 能量；第 38 字节=光敏 0~255。距离字段返回协议原始数值（单位以模块手册为准）。仅工程模式帧（帧长 >23）存在第 18 字节及之后的字段，基本模式帧中这些解析块返回 0；未存有效帧时所有解析块返回 0。
8. **多模块自动轮询**: 每个模块用独立的 `ld2410c_init`（不同对象名、不同 RX/TX 引脚）；loop 中调用 `ld2410c_poll_auto()` 代替逐对象 `ld2410c_read_frame`。对象构造时自动注册到轮询表（最多 4 个，超出不注册仍可手动读取）。当前对象收到完整帧（帧尾处切换，保持帧边界干净）或 500ms 无帧即切换下一个。UNO 的 SoftwareSerial 同一时刻仅一个对象接收：非当前对象期间到达的帧会被丢弃，LD2410C 持续上报，切回后即可取到最新帧；单模块程序不受影响（`begin()` 行为不变，轮询块对单个对象同样有效）。

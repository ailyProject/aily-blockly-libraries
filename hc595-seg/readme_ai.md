# lib-hc595-seg Agent 契约

## 1. Library Info

- 包名：`@aily-project/lib-hc595-seg`，版本 0.0.1，license UNLICENSED
- 用途：两片 74HC595 级联驱动的多位数码管（三线 SDI/SCLK/LOAD），按位设置段码并立即锁存显示
- 驱动源码：`src/HC595Seg/HC595Seg.h`、`src/HC595Seg/HC595Seg.cpp`，仅依赖 Arduino API（pinMode/digitalWrite/delayMicroseconds）

## 2. Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| hc595seg_init | Statement | NAME(field_input), SDI(dropdown), SCLK(dropdown), LOAD(dropdown), POLARITY(dropdown) | `hc595seg_init("disp", "5", "6", "7", COMMON_CATHODE)` | `#include "HC595Seg.h"` ↵ `HC595Seg disp;`（全局）↵ setup 起始处 `disp.begin(5, 6, 7, HC595SegPolarity::HC595SEG_COMMON_CATHODE);` |
| hc595seg_set_digit | Statement | DISP(field_variable), DIGIT(dropdown), CODE(input_value) | `hc595seg_set_digit($disp, "1", hc595seg_segcode($disp, "8"))` | `disp.setSegment(1, (disp.segCode('8')));` |
| hc595seg_segcode | Value (Number) | DISP(field_variable), CHAR(dropdown) | `hc595seg_segcode($disp, "8")` | `(disp.segCode('8'))` |
| hc595seg_clear | Statement | DISP(field_variable) | `hc595seg_clear($disp)` | `disp.clear();` |

## 3. Parameter Options

- SDI/SCLK/LOAD：绑定 `${board.digitalPins}`，取值为当前板卡数字引脚下拉的存储值（示例板 EasyVoice 1306 Dev 上如 `"5"`、`"6"`、`"7"`，即 PA5/PA6/PA7；换板后以板卡引脚表为准）
- POLARITY：`COMMON_CATHODE`、`COMMON_ANODE`
- DIGIT：`"1"`、`"2"`、`"3"`、`"4"`、`"5"`、`"6"`、`"7"`、`"8"`（超出范围时驱动忽略）
- CHAR：`"0"`~`"9"`、`"A"`、`"b"`、`"C"`、`"d"`、`"E"`、`"F"`、`"H"`、`"-"`、`" "`（熄灭）、`"*"`（全亮）、`"."`（仅小数点）

## 4. ABS Examples

```abs
arduino_setup()
    hc595seg_init("disp", "5", "6", "7", COMMON_CATHODE)
    hc595seg_set_digit($disp, "1", hc595seg_segcode($disp, "8"))
    hc595seg_set_digit($disp, "2", 63)
arduino_loop()
    hc595seg_set_digit($disp, "1", hc595seg_segcode($disp, "1"))
    hc595seg_set_digit($disp, "2", hc595seg_segcode($disp, "2"))
```

## 5. Notes

- 模型创建：`hc595seg_init` 的 NAME(field_input) 注册 `$disp`，类型 `HC595Seg`；其余三块用同类型 field_variable 引用。
- 初始化：`begin()` 在 setup 起始插入（addSetupBegin），配置三引脚输出并熄灭所有位；消费块出现时自动补 `#include "HC595Seg.h"`。
- 段码语义：按共阴极逻辑给定（bit0=a…bit6=g，bit7=dp）；`segCode()` 返回共阴段码；`COMMON_ANODE` 时驱动对位选与段码字节整体取反（假定共阳模块段码与位选均低电平有效）。
- 时序：先发位选字节、再发段码字节，MSB 在前，LOAD 上升沿锁存（假定首级 595 为段码芯片、末级为位选芯片）。
- 一次锁存仅点亮一位；多位同显需在 loop 中轮流调用各位形成扫描（如示例）。
- digit 越界（<1 或 >8）静默忽略；CODE 缺省回退 `0`（全灭）。
- 硬件点亮、级联顺序与共阳取反假设均未在实物上验证，接线不同（如位选芯片在首级）时需调整驱动。

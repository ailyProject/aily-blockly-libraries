# GRBL STM32

Grbl 1.1h 核心能力的 Blockly 移植库：G 代码行解析、前瞻梯形加减速、三轴 Bresenham DDA 步进、圆弧插补、归位、软限位与激光 PWM，串口协议兼容 Grbl 发送器。

## Library Info

- **Name**: @aily-project/lib-grbl-stm32
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `grbl_init` | Statement | VAR(field_variable), ENABLE_MODE(dropdown), STEP_X(input_value), DIR_X(input_value), STEP_Y(input_value), DIR_Y(input_value), STEP_Z(input_value), DIR_Z(input_value), ENABLE(input_value), LIM_X(input_value), LIM_Y(input_value), LIM_Z(input_value), LASER(input_value) | `grbl_init($grbl, USE, math_number(0), math_number(3), math_number(1), math_number(4), math_number(2), math_number(5), math_number(6), math_number(26), math_number(27), math_number(28), math_number(8))` | `#include "GrblSTM32.h"` + 全局对象 `GrblSTM32 grbl(0,3,1,4,2,5,6,26,27,28,8);`；ENABLE_MODE=BYPASS 时第 7 参数为 `0xFFFFFFFFUL`（旁路 EN 脚，永久使能） |
| `grbl_begin` | Statement | VAR(field_variable), PORT(dropdown), BAUD(dropdown) | `grbl_begin($grbl, USART1, 115200)` | setup 副作用（USART1 形态）：`grbl.attachUSART1(115200);`（库内自建 USART1=PA9/PA10 串口对象并绑定，含引脚初始化与欢迎横幅）；Serial 形态：`Serial.begin(115200); ↵ grbl.attachSerial(Serial);` |
| `grbl_tick` | Statement | VAR(field_variable) | `grbl_tick($grbl)` | `grbl.tick();` |
| `grbl_is_idle` | Value (Boolean) | VAR(field_variable) | `grbl_is_idle($grbl)` | `grbl.isIdle()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PORT | Serial, USART1 | grbl_begin 绑定的串口；USART1 为库内自建硬件串口（PA9=TX/PA10=RX） |
| BAUD | 115200, 9600 | grbl_begin 波特率 |
| ENABLE_MODE | USE, BYPASS | USE=控制使能脚；BYPASS=旁路（生成 0xFFFFFFFFUL，电机永久使能，$SLP 也不脱力，绝不丢失绝对位置） |

## ABS Examples

### Minimal Usage

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    grbl_init($grbl, USE, math_number(0), math_number(3), math_number(1), math_number(4), math_number(2), math_number(5), math_number(6), math_number(26), math_number(27), math_number(28), math_number(8))
    grbl_begin($grbl, Serial, 115200)

arduino_loop()
    grbl_tick($grbl)
```

### With Idle Check

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    grbl_init($grbl, USE, math_number(0), math_number(3), math_number(1), math_number(4), math_number(2), math_number(5), math_number(6), math_number(26), math_number(27), math_number(28), math_number(8))
    grbl_begin($grbl, Serial1, 115200)

arduino_loop()
    grbl_tick($grbl)
    controls_if(grbl_is_idle($grbl))
        @DO0:
            time_delay(math_number(1))
```

## Notes

1. **Variable**: `grbl_init` 的 VAR 为 field_variable；后续块直接传 `$grbl`。对象为全局声明（`generator.addObject`），跨 setup/loop 引用合法。
2. **Lifecycle**: `grbl_init` 必须先于 `grbl_begin`/`grbl_tick`；`grbl_begin` 放 `arduino_setup()`；`grbl_tick` 必须放 `arduino_loop()` 且每循环恰好调用一次（串口行处理、规划、DDA 步进、归位、激光状态均由 tick 驱动）。
   - PORT=Serial：绑定板卡 generic Serial（GENERIC_F407ZG 为 UART4=PC10/PC11；GENERIC_F103C8 为 USART2=PA2/PA3）。
   - PORT=USART1：库内自建 USART1 对象（PA9=TX/PA10=RX，F103/F407 引脚相同），适用于 USB-TTL 接 A9/A10 的接法。
3. **Pins**: 全部引脚为 `input_value` 槽，两种形态：① 接 core-io 的 `io_pin_digi(Pxx)`（宿主按当前板卡自动列出全部可用数字引脚，实现自动识别与任意选择）；激光 PWM 槽接 `io_pin_pwm(Pxx)`（宿主只列出硬件 PWM 引脚，非 PWM 引脚不可选，严格限制）；② 直接接 `math_number(n)` 数字（按板卡数字引脚映射填写）。默认数字对齐 grbl-edge (STM32F103C8) 映射：步进 PA0/PA1/PA2=0/1/2，方向 PA3/PA4/PA5=3/4/5，使能 PA6=6，限位 PB10/PB11/PB12=26/27/28，激光 PA8=8。库支持所有 STM32 系列（纯 Arduino API，uint32_t 引脚）。限位开关常闭接地（INPUT_PULLUP，LOW=触发）。
4. **Enable mode**: ENABLE_MODE=BYPASS 时不初始化、不控制 EN 脚，电机驱动器保持永久使能（含 $SLP 睡眠），杜绝失能丢步丢失绝对位置；USE 时 EN 脚低电平=使能（常见 A4988/DRV8825），$SLP 会脱能省电。
4. **Protocol**: 串口兼容 Grbl 行协议（`ok`/`error:N`/`[MSG:...]`），实时命令 `?`(状态报告) `!`(进给保持) `~`(继续) `0x18`(复位) 在任意时刻生效；入队即回 `ok` 的字符计数流控，流控窗口 64 字符（`$I` 上报 `[OPT:V,7,64]`、状态报告 `Bf` 第二字段 64，与串口接收缓冲一致，防发送器过灌溢出丢字符）；软限位越界的行回 `error:15` 并丢弃（不挂起流控，不会卡死发送器缓冲区）。
5. **G-code**: G0-G3（圆弧 I/J 或 R）、G20/21、G90/91、G92/G92.1、M0/M2/M3/M4/M5/M8/M9、F/S；`$` 帮助、`$$` 参数、`$H` 归位（需 `$22=1`）、`$X` 解锁、`$SLP` 睡眠、`$G` 模态、`$x=val` 参数（$100-$102/$110-$112/$120-$122/$130-$132/$20/$22/$23/$24/$25/$27/$30/$32，RAM 存储掉电丢失）。
6. **Hardware**: 步进为轮询式 DDA（非中断），最大步频受主循环周期限制（量级为数千赫兹），适合教学/桌面激光雕刻；不支持 AMASS、倍率覆盖命令、安全门、探针、EEPROM。多段排队以独立规划位置衔接（对齐 grbl `pl.position`），解析基准/弧起点/入队增量均取规划位置，与 DDA 执行位置隔离；tick 抖动后的追赶步钳位至段名义速度上限且单次 tick 最多补发 32 步（不 burst 连发，防飞车失步）；各轴 $10x 不一致时按主导轴 steps/mm 换算速度/加速度。
7. **Laser safety**: `!` 保持、复位、限位触发时立即关闭激光输出；G0 快移不开启激光（$32=1 激光模式默认开启）；G2/G3 方向由带符号角旋转保证（CW=顺时针，对齐 grbl `mc_arc`）；段间保持激光输出仅队列排空时关断，避免逐段灭光闪断。

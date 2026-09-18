# GRBL STM32

Grbl 1.1h 核心能力的 Blockly 移植库：G 代码行解析、前瞻梯形加减速、三轴 Bresenham DDA 步进、圆弧插补、归位、软限位与激光 PWM，串口协议兼容 Grbl 发送器。

## Library Info

- **Name**: @aily-project/lib-grbl-stm32
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `grbl_init` | Statement | VAR(field_variable), STEP_X(field_number), DIR_X(field_number), STEP_Y(field_number), DIR_Y(field_number), STEP_Z(field_number), DIR_Z(field_number), ENABLE(field_number), LIM_X(field_number), LIM_Y(field_number), LIM_Z(field_number), LASER(field_number) | `grbl_init($grbl, 0, 3, 1, 4, 2, 5, 6, 26, 27, 28, 8)` | `#include "GrblSTM32.h"` + 全局对象 `GrblSTM32 grbl(0,3,1,4,2,5,6,26,27,28,8);` |
| `grbl_begin` | Statement | VAR(field_variable), PORT(dropdown), BAUD(dropdown) | `grbl_begin($grbl, USART1, 115200)` | setup 副作用（USART1 形态）：`grbl.attachUSART1(115200);`（库内自建 USART1=PA9/PA10 串口对象并绑定，含引脚初始化与欢迎横幅）；Serial 形态：`Serial.begin(115200); ↵ grbl.attachSerial(Serial);` |
| `grbl_tick` | Statement | VAR(field_variable) | `grbl_tick($grbl)` | `grbl.tick();` |
| `grbl_is_idle` | Value (Boolean) | VAR(field_variable) | `grbl_is_idle($grbl)` | `grbl.isIdle()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PORT | Serial, USART1 | grbl_begin 绑定的串口；USART1 为库内自建硬件串口（PA9=TX/PA10=RX） |
| BAUD | 115200, 9600 | grbl_begin 波特率 |

## ABS Examples

### Minimal Usage

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    grbl_init($grbl, 0, 3, 1, 4, 2, 5, 6, 26, 27, 28, 8)
    grbl_begin($grbl, Serial, 115200)

arduino_loop()
    grbl_tick($grbl)
```

### With Idle Check

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    grbl_init($grbl, 0, 3, 1, 4, 2, 5, 6, 26, 27, 28, 8)
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
3. **Pins**: 全部为数字引脚号（`field_number`）。默认值对齐 grbl-edge (STM32F103C8) 引脚映射：X/Y/Z 步进 PA0/PA1/PA2（数字 0/1/2），方向 PA3/PA4/PA5（3/4/5），使能 PA6（6），X/Y/Z 限位 PB10/PB11/PB12（26/27/28），激光 PWM PA8（8，TIM1_CH1 硬件 PWM）；串口 USART1 = PA9(TX)/PA10(RX)。若板卡或接线不同，按所用板卡的数字引脚映射填写；限位开关为常闭接地（INPUT_PULLUP，LOW=触发）。
4. **Protocol**: 串口兼容 Grbl 行协议（`ok`/`error:N`/`[MSG:...]`），实时命令 `?`(状态报告) `!`(进给保持) `~`(继续) `0x18`(复位) 在任意时刻生效；逐行应答流控（上一行运动完成后才回 ok 并接受下一行）。
5. **G-code**: G0-G3（圆弧 I/J 或 R）、G20/21、G90/91、G92/G92.1、M0/M2/M3/M4/M5/M8/M9、F/S；`$` 帮助、`$$` 参数、`$H` 归位（需 `$22=1`）、`$X` 解锁、`$SLP` 睡眠、`$G` 模态、`$x=val` 参数（$100-$102/$110-$112/$120-$122/$130-$132/$20/$22/$23/$24/$25/$27/$30/$32，RAM 存储掉电丢失）。
6. **Hardware**: 步进为轮询式 DDA（非中断），最大步频受主循环周期限制（量级为数千赫兹），适合教学/桌面激光雕刻；不支持 AMASS、倍率覆盖命令、安全门、探针、EEPROM。
7. **Laser safety**: `!` 保持、复位、限位触发时立即关闭激光输出；G0 快移不开启激光（$32=1 激光模式默认开启）。

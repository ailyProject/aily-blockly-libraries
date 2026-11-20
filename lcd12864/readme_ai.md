# @aily-project/lib-lcd12864

## Library Info

- **Name**: @aily-project/lib-lcd12864
- **Version**: 0.0.1
- **Purpose**: 内置字库版 LCD12864（ST7920，串行 CS/SID/SCLK）显示驱动。单一全局对象 `LCD12864`（`LCD12864ZK` 类，src/LCD12864/），屏幕 4 行 × 8 全角格（16 半角列）。控制器字库含 8192 个 16×16 中文与 126 个西文字符；驱动内置 7478 项 Unicode→GB2312 常量映射表（715 符号 + 全部 6763 汉字，GB2312 空位与 GBK 扩展已排除），UTF-8 文本自动转码，GB2312 字节原样透传。

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| --- | --- | --- | --- | --- |
| lcd12864_init | Statement | CS(field_dropdown ${board.digitalPins}), SID(field_dropdown ${board.digitalPins}), SCLK(field_dropdown ${board.digitalPins}) | `lcd12864_init(PB0, PB1, PB10)` | `#include "LCD12864.h"` ↵ `LCD12864.begin(PB0, PB1, PB10);` |
| lcd12864_clear | Statement | （无） | `lcd12864_clear()` | `#include "LCD12864.h"` ↵ `LCD12864.clear();` |
| lcd12864_print | Statement | TEXT(input_value) | `lcd12864_print(text("你好，Aily！"))` | `#include "LCD12864.h"` ↵ `LCD12864.print("你好，Aily！");` |
| lcd12864_autowrap | Statement | MODE(field_dropdown) | `lcd12864_autowrap(on)` | `#include "LCD12864.h"` ↵ `LCD12864.setAutoWrap(true);` |
| lcd12864_stopfull | Statement | MODE(field_dropdown) | `lcd12864_stopfull(off)` | `#include "LCD12864.h"` ↵ `LCD12864.setStopAtFull(false);` |
| lcd12864_halfpad | Statement | MODE(field_dropdown) | `lcd12864_halfpad(on)` | `#include "LCD12864.h"` ↵ `LCD12864.setHalfWidthPad(true);` |
| lcd12864_encoding | Statement | ENC(field_dropdown) | `lcd12864_encoding(utf8)` | `#include "LCD12864.h"` ↵ `LCD12864.setEncoding(LCD12864_ENC_UTF8);` |
| lcd12864_home | Statement | （无） | `lcd12864_home()` | `#include "LCD12864.h"` ↵ `LCD12864.home();` |
| lcd12864_setcursor | Statement | COL(input_value), ROW(input_value) | `lcd12864_setcursor(math_number(0), math_number(2))` | `#include "LCD12864.h"` ↵ `LCD12864.setCursor(0, 2);` |
| lcd12864_cgram | Statement | INDEX(field_dropdown), DATA(input_value) | `lcd12864_cgram("0", text("00,00,01,80,03,C0,07,E0,0F,F0,1F,F8,3F,FC,3F,FC,3F,FC,1F,F8,0F,F0,07,E0,03,C0,01,80,00,00,00,00"))` | `#include "LCD12864.h"` ↵ `LCD12864.writeCGRAM(0, "00,00,01,80,03,C0,07,E0,0F,F0,1F,F8,3F,FC,3F,FC,3F,FC,1F,F8,0F,F0,07,E0,03,C0,01,80,00,00,00,00");` |
| lcd12864_cgram_char | Statement | INDEX(field_dropdown) | `lcd12864_cgram_char("0")` | `#include "LCD12864.h"` ↵ `LCD12864.writeCGRAMChar(0);` |
| lcd12864_invert | Statement | MODE(field_dropdown) | `lcd12864_invert(off)` | `#include "LCD12864.h"` ↵ `LCD12864.setInvert(false);` |
| lcd12864_graphic | Statement | MODE(field_dropdown) | `lcd12864_graphic(off)` | `#include "LCD12864.h"` ↵ `LCD12864.exitGraphicMode();`（on 生成 `LCD12864.enterGraphicMode();`） |

## Parameter Options

- CS/SID/SCLK：`${board.digitalPins}` 板卡引脚下拉，ABS 用实际值（如 `PA0`、`PB10`），任意可数字输出的 GPIO 均可。
- MODE（autowrap/stopfull/halfpad/invert/graphic）：`on` / `off`（无引号枚举）。
- ENC：`utf8` / `gb2312`。
- INDEX（cgram/cgram_char）：`"0"` / `"1"` / `"2"` / `"3"`（4 个 16×16 自造字，字库代码 0000H-0003H）。
- DATA：32 个十六进制字节文本（按行、每行 2 字节，逗号/空格分隔，不足补 0），示例（实心心形）：`00,00,01,80,03,C0,07,E0,0F,F0,1F,F8,3F,FC,3F,FC,3F,FC,1F,F8,0F,F0,07,E0,03,C0,01,80,00,00,00,00`

## ABS Examples

```abs
# ABS Schema: 2
# Project Data Schema: 1 (external-only)

arduino_setup()
    lcd12864_init(PB0, PB1, PB10)
    lcd12864_clear()
    lcd12864_encoding(utf8)
    lcd12864_autowrap(on)
    lcd12864_stopfull(off)
    lcd12864_halfpad(on)
    lcd12864_print(text("你好，Aily！Hello LCD12864"))
    lcd12864_cgram("0", text("00,00,01,80,03,C0,07,E0,0F,F0,1F,F8,3F,FC,3F,FC,3F,FC,1F,F8,0F,F0,07,E0,03,C0,01,80,00,00,00,00"))
    lcd12864_setcursor(math_number(0), math_number(2))
    lcd12864_cgram_char("0")
    lcd12864_home()
    lcd12864_invert(off)
    lcd12864_graphic(off)
arduino_loop()
```

## Notes

- **初始化**：`lcd12864_init` 需在启动（setup）执行一次；全局单例 `LCD12864` 由库自带，无需创建对象/变量。串行时序为软件三线（CS/SID/SCLK），模块 PSB 需接地。
- **文本与光标**：软件光标半角单位（列 0-15、行 0-3），超界自动收敛。`print` 从光标处续显；换行符 `\n`、`\r`、`\r\n` 均强制换行（UTF-8 与 GB2312 两种编码下都生效，受自动换行/满屏策略约束），其他控制字符按空格显示。
- **自动换行（默认开）**：写满一行换下一行；写满整屏且「满屏时停止显示」为 off 时向上滚动一行继续显示。**满屏停止（默认关）**：on 时整屏写满即冻结光标、丢弃后续文本。**半角补空格（默认开）**：半角字符将落在全角格右半时先补一个空格对齐；off 时原样落在右半格（保留原左半显示）。
- **文本编码（默认 utf8）**：UTF-8 逐字符解码并经内置表转 GB2312，字库外字符显示全角方块（0xA1F5）；GB2312 模式字节透传（适合运行时从串口等来源取得的 GB2312 字节流，或 `"\xC4\xE3"` 形式字面量）。
- **CGRAM**：编号 0-3，各 32 字节（16×16）；写入后用「显示自定义字符」在光标处显示。
- **资源占用**：映射表约 30KB 只读常量（AVR 存 PROGMEM）；STM32F103C8（64KB Flash）可用但用户程序空间有限。RAM：影子缓冲 64B + 少量状态。
- **已验证 / 未验证**：编译（STM32F103C8）与编码表（板卡编译器 static_assert：抽查映射、全表有序、6763 汉字）已验证；**串行时序、ST7920 反白行语义（逐行 0x18/0x10 扩充指令，不同模块行为可能有差异）、GDRAM 绘图与满屏滚动等硬件行为未在实机上验证**。运行时布局逻辑（换行/滚动/补空格）因本机无宿主 C++ 编译器未做执行验证。
- **不兼容路线**：无并口/4bit 模式；不提供绘图取点/画线积木（绘图模式仅负责进入/退出与清 GDRAM）。

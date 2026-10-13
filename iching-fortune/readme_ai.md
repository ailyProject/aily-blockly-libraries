# @aily-project/lib-iching-fortune

移植自 ESP-Handheld(github.com/zistar001/ESP-Handheld) main/modules/iching 的占卜数据访问库：易经六十四卦 + 小六壬。

## Library Info

- **Name**: @aily-project/lib-iching-fortune
- **Version**: 1.0.0
- **数据来源**: `src/IchingData/iching_tables.h` 由源仓库 `iching_data.c`/`liuren_core.c` 自动提取生成(64卦×9字段 + binary_to_index 表 + 六神/断语/时辰表)
- **数据修订**: 源数据中的 ASCII 引号已转全角引号；KW34 运势字段 "Strong" 译为 "强盛"(保证 UTF-8 按字节折行对齐)

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| --- | --- | --- | --- | --- |
| `iching_kw_index` | Value | BIN(input_value) | `iching_kw_index(math_number(63))` | `ichingKwIndex(63)` |
| `iching_name` | Value | KW(input_value) | `iching_name(math_number(0))` | `ichingGetName(0)` |
| `iching_guaci` | Value | KW(input_value) | `iching_guaci(math_number(0))` | `ichingGetGuaCi(0)` |
| `iching_xiang` | Value | KW(input_value) | `iching_xiang(math_number(0))` | `ichingGetXiang(0)` |
| `iching_advice` | Value | KW(input_value), CAT(input_value) | `iching_advice(math_number(0), math_number(1))` | `ichingGetAdvice(0, 1)` |
| `iching_cat_name` | Value | CAT(input_value) | `iching_cat_name(math_number(0))` | `ichingGetCategoryName(0)` |
| `liuren_position` | Value | MONTH(input_value), DAY(input_value), HOUR(input_value) | `liuren_position(math_number(3), math_number(15), math_number(4))` | `liurenPosition(3, 15, 4)` |
| `liuren_name` | Value | POS(input_value) | `liuren_name(math_number(0))` | `liurenGetName(0)` |
| `liuren_meaning` | Value | POS(input_value) | `liuren_meaning(math_number(0))` | `liurenGetMeaning(0)` |
| `liuren_judgment` | Value | POS(input_value) | `liuren_judgment(math_number(0))` | `liurenGetJudgment(0)` |
| `liuren_hour_name` | Value | HOUR(input_value) | `liuren_hour_name(math_number(0))` | `liurenHourName(0)` |
| `fortune_lunar_month` | Value | Y(input_value), M(input_value), D(input_value) | `fortune_lunar_month(math_number(2025), math_number(6), math_number(1))` | `fortuneLunarMonth(2025, 6, 1)` |
| `fortune_lunar_day` | Value | Y(input_value), M(input_value), D(input_value) | `fortune_lunar_day(math_number(2025), math_number(6), math_number(1))` | `fortuneLunarDay(2025, 6, 1)` |
| `fortune_hour_index` | Value | H(input_value) | `fortune_hour_index(math_number(13))` | `fortuneHourIndex(13)` |
| `fortune_god_seg_x` | Value | POS(input_value) | `fortune_god_seg_x(math_number(0))` | `ichingGetGodSegX(0)` |
| `fortune_god_seg_y` | Value | POS(input_value) | `fortune_god_seg_y(math_number(0))` | `ichingGetGodSegY(0)` |
| `fortune_draw_palm` | Statement | (none) | `fortune_draw_palm()` | 注入 `#include <TFT_eSPI.h>`、`#include "cn_font.h"`、`#include "IchingData.h"` 与全局 `TFT_eSPI tft`，用 `tft.fillRect`/`tftcn_draw_string` 绘制小六壬手掌图（六宫白块+六神名+指位标签） |
| `fortune_light_god` | Statement | POS(input_value) | `fortune_light_god(math_number(3))` | 注入同上依赖，重绘六宫：命中宫黄底黑字，其余白底橙字 |

所有取值块返回 `String`；`iching_kw_index`/`liuren_position` 返回 `int`。越界输入由 C++ 端 `clampi` 钳制到合法范围。

## Parameter Options

无下拉参数；全部为数值/表达式输入：

| 输入 | 含义 | 范围 |
| --- | --- | --- |
| BIN | 六爻编码 = 上卦×8+下卦(先天卦序，每卦下爻为 bit2、上爻为 bit0) | 0..63 |
| KW | 周易卦序(文王序)数组下标，0=乾为天 | 0..63 |
| CAT | 占卜事项分类：0运势 1事业 2经商 3求名 4婚恋 5决策 | 0..5 |
| MONTH/DAY | 小六壬农历月/日 | 1..12 / 1..30 |
| HOUR | 时辰序：0=子时 … 11=亥时 | 0..11 |
| POS | 小六壬落宫：0大安 1留连 2速喜 3赤口 4小吉 5空亡 | 0..5 |

## ABS Examples

### 起卦并显示卦名与卦辞

```abs
# ABS Schema: 2
# Project Data Schema: 1 (external-only)

arduino_global()
    variable_define("kw", int, math_number(0))

arduino_setup()
    tftscr_init()
    tftscr_fill_screen(tftscr_color(TFT_BLACK))
    variables_set($kw, iching_kw_index(math_number(63)))
    tftscr_draw_cn_string(math_number(8), math_number(8), iching_name(variables_get($kw)), tftscr_color(TFT_ORANGE), math_number(2))
    tftscr_draw_cn_string(math_number(8), math_number(48), iching_guaci(variables_get($kw)), tftscr_color(TFT_WHITE), math_number(1))

arduino_loop()
    time_delay(math_number(10))
```

### 小六壬推算

```abs
# ABS Schema: 2
# Project Data Schema: 1 (external-only)

arduino_setup()
    tftscr_init()
    tftscr_fill_screen(tftscr_color(TFT_BLACK))
    tftscr_draw_cn_string(math_number(8), math_number(8), liuren_name(liuren_position(math_number(3), math_number(15), math_number(4))), tftscr_color(TFT_YELLOW), math_number(2))
    tftscr_draw_cn_string(math_number(8), math_number(48), liuren_hour_name(math_number(4)), tftscr_color(TFT_LIGHTGREY), math_number(1))

arduino_loop()
    time_delay(math_number(10))
```

示例需与 @aily-project/lib-jinyichen-st7789 同项目(提供 `tftscr_init`/`tftscr_draw_cn_string`)。

## Notes

1. **纯数据/计算库**: 不初始化任何硬件，不创建对象模型；可与任意屏幕库配合
2. **小六壬算法**: 与源仓库 `liuren_calculate` 逐步一致：`pos=(月-1)%6; pos=(pos+日-1)%6; pos=(pos+时辰)%6`(从大安起数)
3. **卦序换算**: `iching_kw_index` 使用源仓库 `binary_to_index[64]` 查表(0基文王序数组下标)，`g_iching` 按文王序排列
4. **文本折行**: 返回文本为纯 CJK/全角标点(UTF-8 3字节/字符)，可安全按 57 字节(19字)步长折行
5. **存储**: 卦文表数据为 `const` 常量(约70KB flash)；农历表 201×uint32(1900-2100)
6. **公历转农历**: `fortune_lunar_month/day` 使用标准 1900-2100 压缩表 + 经典线性搜索算法(含闰月处理)，越界(1899及以前/2101及以后)或非法日期返回 0；闰月按其序数月返回(如闰六月=6)。数据经 14 组已知节日/闰月日期断言验证(含1900基准日、2024除夕、2025闰六月初一、2033闰冬月)
7. **时辰序**: `fortune_hour_index` 与原版 `hour_index_map` 一致，按 `小时/2` 取整(0子…11亥；注意23点归亥时，是原版行为而非传统子时 23:00-01:00)

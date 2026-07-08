# 农历日历库 (Lunar Calendar)

公历/农历转换、干支生肖、24节气精确计算

## Library Info
- **Name**: @aily-project/lib-lunar-calendar
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lunar_to_lunar` | Value (String) | YEAR(input_value), MONTH(input_value), DAY(input_value) | `lunar_to_lunar(math_number(2026), math_number(7), math_number(5))` | `getLunarDateString(2026, 7, 5)` |
| `lunar_ganzhi_year` | Value (String) | YEAR(input_value) | `lunar_ganzhi_year(math_number(2026))` | `getGanzhiYear(2026)` |
| `lunar_jieqi_name` | Value (String) | YEAR(input_value), MONTH(input_value), DAY(input_value) | `lunar_jieqi_name(math_number(2026), math_number(6), math_number(5))` | `getJieqiName(2026, 6, 5)` |
| `lunar_is_jieqi` | Value (Boolean) | YEAR(input_value), MONTH(input_value), DAY(input_value) | `lunar_is_jieqi(math_number(2026), math_number(6), math_number(5))` | `isJieqiDay(2026, 6, 5)` |
| `lunar_jieqi_day` | Value (Number) | YEAR(input_value), INDEX(input_value) | `lunar_jieqi_day(math_number(2026), math_number(10))` | `getJieqiDay(2026, 10)` |
| `lunar_weekday` | Value (String) | YEAR(input_value), MONTH(input_value), DAY(input_value) | `lunar_weekday(math_number(2026), math_number(7), math_number(5))` | `getWeekdayName(calcWeekday(2026, 7, 5))` |
| `lunar_weekday_num` | Value (Number) | YEAR(input_value), MONTH(input_value), DAY(input_value) | `lunar_weekday_num(math_number(2026), math_number(7), math_number(5))` | `calcWeekday(2026, 7, 5)` |
| `lunar_days_in_month` | Value (Number) | YEAR(input_value), MONTH(input_value) | `lunar_days_in_month(math_number(2026), math_number(2))` | `getDaysInMonth(2026, 2)` |
| `lunar_jieqi_name_by_index` | Value (String) | INDEX(input_value) | `lunar_jieqi_name_by_index(math_number(10))` | `getJieqiNameByIndex(10)` |
| `lunar_zodiac_name` | Value (String) | YEAR(input_value) | `lunar_zodiac_name(math_number(2026))` | `getZodiacName(2026)` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| INDEX | 0-23 | 节气序号: 小寒=0, 大寒=1, 立春=2, 雨水=3, 惊蛰=4, 春分=5, 清明=6, 谷雨=7, 立夏=8, 小满=9, 芒种=10, 夏至=11, 小暑=12, 大暑=13, 立秋=14, 处暑=15, 白露=16, 秋分=17, 寒露=18, 霜降=19, 立冬=20, 小雪=21, 大雪=22, 冬至=23 |

## Notes

1. **无依赖**: 所有块均为纯计算函数，不需要初始化，不依赖硬件外设
2. **节气精度**: YearMonthBit位表覆盖2000-2050年，超出范围返回-1
3. **农历范围**: 农历转换覆盖1900-2100年
4. **返回值**: `lunar_jieqi_name` 在非节气日返回空字符串，`lunar_is_jieqi` 返回布尔值

# 时钟显示库 (Clock Display)

NTP时钟同步、TFT时钟界面绘制、NTC室内温度读取

## Library Info
- **Name**: @aily-project/lib-clock-display
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `clk_begin` | Statement | TFT(field_variable), FONT(field_input) | `clk_begin(variables_get($tft), "chinese_city_gb2312")` | `Clock.begin(&tft, &u8f); Clock.setFont(chinese_city_gb2312);` |
| `clk_sync_ntp` | Statement | TZ(field_input), NTP1(field_input), NTP2(field_input), NTP3(field_input) | `clk_sync_ntp("8", "ntp1.aliyun.com", "ntp2.aliyun.com", "ntp3.aliyun.com")` | `Clock.syncNTP(8*3600, "...", "...", "...");` |
| `clk_show` | Statement | (无) | `clk_show()` | `Clock.showClock();` |
| `clk_force_redraw` | Statement | (无) | `clk_force_redraw()` | `Clock.forceRedraw();` |
| `clk_read_temp` | Statement | PIN(field_input) | `clk_read_temp("39")` | `Clock.readIndoorTemp(39);` |
| `clk_get_temp` | Value (Number) | (无) | `clk_get_temp()` | `Clock.getIndoorTemp()` |
| `clk_get_year` | Value (Number) | (无) | `clk_get_year()` | `Clock.getYear()` |
| `clk_get_month` | Value (Number) | (无) | `clk_get_month()` | `Clock.getMonth()` |
| `clk_get_day` | Value (Number) | (无) | `clk_get_day()` | `Clock.getDay()` |
| `clk_get_hour` | Value (Number) | (无) | `clk_get_hour()` | `Clock.getHour()` |
| `clk_get_minute` | Value (Number) | (无) | `clk_get_minute()` | `Clock.getMinute()` |
| `clk_get_second` | Value (Number) | (无) | `clk_get_second()` | `Clock.getSecond()` |
| `clk_get_weekday` | Value (Number) | (无) | `clk_get_weekday()` | `Clock.getWeekday()` |
| `clk_get_time_str` | Value (String) | (无) | `clk_get_time_str()` | `Clock.getTimeString()` |
| `clk_get_date_str` | Value (String) | (无) | `clk_get_date_str()` | `Clock.getDateString()` |
| `clk_get_weekday_str` | Value (String) | (无) | `clk_get_weekday_str()` | `Clock.getWeekdayString()` |
| `clk_draw_bg` | Statement | X(input_value), Y(input_value), W(input_value), H(input_value) | `clk_draw_bg(math_number(0), math_number(0), math_number(160), math_number(128))` | `Clock.drawBg(0, 0, 160, 128);` |
| `clk_draw_stars` | Statement | (无) | `clk_draw_stars()` | `Clock.drawStars();` |
| `clk_show_temp` | Statement | (无) | `clk_show_temp()` | `Clock.showIndoorTemp();` |

## Notes

1. **全局对象**: 库自动声明全局对象 `Clock`，所有块直接使用
2. **依赖**: 需要 TFT_eSPI + U8g2_for_TFT_eSPI 已初始化（tftespi_setup + u8f.begin）
3. **字体**: FONT字段填入字体变量名（如 chinese_city_gb2312），需在项目中已声明
4. **温度参数**: NTC热敏电阻默认10K@25°C, Beta=3950，ADC引脚默认39
5. **时钟刷新**: `clk_show` 每分钟自动重绘，非每分钟调用不闪烁
6. **背景效果**: 渐变背景固定为夜空蓝→黑色，星空位置固定
7. **ESP32专用**: 依赖ESP32的NTP/ADC功能

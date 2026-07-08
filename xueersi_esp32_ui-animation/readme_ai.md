# UI动画库 (UI Animation)

开机动画、行走精灵动画、力量展示、夜空背景、按键管理、页面导航

## Library Info
- **Name**: @aily-project/lib-ui-animation
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ui_begin` | Statement | TFT(field_variable) | `ui_begin(variables_get($tft))` | `UI.begin(&tft, &u8f);` |
| `ui_set_font` | Statement | FONT(field_input) | `ui_set_font("chinese_city_gb2312")` | `UI.setFont(chinese_city_gb2312);` |
| `ui_welcome` | Statement | TITLE(field_input), NAME(field_input), SUBTITLE(field_input) | `ui_welcome("Powered by", "Bryan", "WEATHER STATION")` | `UI.welcome("Powered by", "Bryan", "WEATHER STATION");` |
| `ui_walk_init` | Statement | X(input_value), Y(input_value), W(input_value), H(input_value), FPS(input_value) | `ui_walk_init(math_number(70), math_number(4), math_number(60), math_number(90), math_number(80))` | `UI.walkInit(70, 4, 60, 90, 80);` |
| `ui_walk_frames` | Statement | ARR(field_input), COUNT(input_value), SW(input_value), SH(input_value) | `ui_walk_frames("epd_bitmap_allArray", math_number(7), math_number(80), math_number(120))` | `UI.walkSetFrames((const unsigned char**)epd_bitmap_allArray, 7, 80, 120);` |
| `ui_walk_update` | Statement | (无) | `ui_walk_update()` | `UI.walkUpdate();` |
| `ui_strength_init` | Statement | X, Y, W, H (input_value) | `ui_strength_init(math_number(40), math_number(4), math_number(80), math_number(120))` | `UI.strengthInit(40, 4, 80, 120);` |
| `ui_strength_frames` | Statement | ARR(field_input), COUNT(input_value) | `ui_strength_frames("strongFrames", math_number(4))` | `UI.strengthSetFrames((const unsigned char**)strongFrames, 4);` |
| `ui_strength_play` | Statement | CYCLES(input_value), DELAY(input_value) | `ui_strength_play(math_number(3), math_number(150))` | `UI.strengthPlay(3, 150);` |
| `ui_draw_bg` | Statement | X, Y, W, H (input_value) | `ui_draw_bg(math_number(0), math_number(0), math_number(160), math_number(128))` | `UI.drawBg(0, 0, 160, 128);` |
| `ui_draw_stars` | Statement | (无) | `ui_draw_stars()` | `UI.drawStars();` |
| `ui_btn_add` | Statement | ID(field_dropdown), PIN(field_input) | `ui_btn_add(0, "27")` | `UI.btnAdd(0, 27);` |
| `ui_btn_scan` | Statement | (无) | `ui_btn_scan()` | `UI.btnScan();` |
| `ui_btn_pressed` | Value (Boolean) | ID(field_dropdown) | `ui_btn_pressed(0)` | `UI.btnPressed(0)` |
| `ui_btn_is_pressed` | Value (Boolean) | ID(field_dropdown) | `ui_btn_is_pressed(4)` | `UI.btnIsPressed(4)` |
| `ui_btn_set_debounce` | Statement | MS(input_value) | `ui_btn_set_debounce(math_number(200))` | `UI.btnSetDebounce(200);` |
| `ui_page_count` | Statement | COUNT(input_value) | `ui_page_count(math_number(3))` | `UI.pageSetCount(3);` |
| `ui_page_current` | Value (Number) | (无) | `ui_page_current()` | `UI.pageGetCurrent()` |
| `ui_page_changed` | Value (Boolean) | (无) | `ui_page_changed()` | `UI.pageChanged()` |
| `ui_page_next` | Statement | (无) | `ui_page_next()` | `UI.pageNext();` |
| `ui_page_prev` | Statement | (无) | `ui_page_prev()` | `UI.pagePrev();` |
| `ui_page_set` | Statement | PAGE(input_value) | `ui_page_set(math_number(0))` | `UI.pageSetCurrent(0);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ID (Button) | 0=LEFT, 1=RIGHT, 2=UP, 3=DOWN, 4=A, 5=B | 按钮编号 |
| ID (Page) | 0=天气, 1=日历, 2=倒计时 | 页面编号(可自定义) |

## Notes

1. **全局对象**: 库自动声明全局对象 `UI`
2. **动画帧数据**: 行走/力量动画需要配合项目中的img头文件(gifwalk.h/gifstrong.h)，通过数组名引用
3. **行走动画**: 使用TFT_eSprite创建精灵缓冲区，自动缩放+背景合成，颜色固定为TFT_GREEN
4. **按键去抖**: 默认200ms去抖间隔，`ui_btn_scan` 需在loop中调用
5. **页面导航**: `ui_page_changed` 返回true后需手动更新 `lastPage`（在用户代码中处理）
6. **依赖**: TFT_eSPI + U8g2_for_TFT_eSPI 已初始化
7. **ESP32专用**: 使用ESP32 GPIO和TFT_eSPI特性

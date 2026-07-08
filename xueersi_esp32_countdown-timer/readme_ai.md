# 倒计时库 (Countdown Timer)

TFT倒计时器：启动/暂停/继续/取消，完成时播放致爱丽丝旋律

## Library Info
- **Name**: @aily-project/lib-countdown-timer
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `cd_begin` | Statement | TFT(field_variable), PIN(field_input) | `cd_begin(variables_get($tft), "14")` | `Countdown.begin(&tft, &u8f); Countdown.setBuzzerPin(14);` |
| `cd_set_font` | Statement | FONT(field_input) | `cd_set_font("chinese_city_gb2312")` | `Countdown.setFont(chinese_city_gb2312);` |
| `cd_update` | Statement | (无) | `cd_update()` | `Countdown.update();` |
| `cd_show` | Statement | (无) | `cd_show()` | `Countdown.show();` |
| `cd_force_redraw` | Statement | (无) | `cd_force_redraw()` | `Countdown.forceRedraw();` |
| `cd_start` | Statement | MIN(input_value) | `cd_start(math_number(5))` | `Countdown.start(5);` |
| `cd_pause` | Statement | (无) | `cd_pause()` | `Countdown.pause();` |
| `cd_resume` | Statement | (无) | `cd_resume()` | `Countdown.resume();` |
| `cd_cancel` | Statement | (无) | `cd_cancel()` | `Countdown.cancel();` |
| `cd_reset` | Statement | (无) | `cd_reset()` | `Countdown.reset();` |
| `cd_add_minutes` | Statement | DELTA(input_value) | `cd_add_minutes(math_number(1))` | `Countdown.addMinutes(1);` |
| `cd_get_state` | Value (Number) | (无) | `cd_get_state()` | `Countdown.getState()` |
| `cd_get_state_str` | Value (String) | (无) | `cd_get_state_str()` | `Countdown.getStateString()` |
| `cd_get_remain_min` | Value (Number) | (无) | `cd_get_remain_min()` | `Countdown.getRemainMin()` |
| `cd_get_remain_sec` | Value (Number) | (无) | `cd_get_remain_sec()` | `Countdown.getRemainSec()` |
| `cd_get_time_str` | Value (String) | (无) | `cd_get_time_str()` | `Countdown.getTimeString()` |
| `cd_get_set_min` | Value (Number) | (无) | `cd_get_set_min()` | `Countdown.getSetMinutes()` |
| `cd_btn_up` | Statement | (无) | `cd_btn_up()` | `Countdown.onBtnUp();` |
| `cd_btn_down` | Statement | (无) | `cd_btn_down()` | `Countdown.onBtnDown();` |
| `cd_btn_a` | Statement | (无) | `cd_btn_a()` | `Countdown.onBtnA();` |
| `cd_btn_b` | Statement | (无) | `cd_btn_b()` | `Countdown.onBtnB();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| STATE | 0=IDLE, 1=RUN, 2=PAUSE, 3=DONE | 倒计时状态机 |

## Notes

1. **全局对象**: 库自动声明全局对象 `Countdown`
2. **状态机**: IDLE(待机) → RUN(运行) → PAUSE(暂停) / DONE(完成)
3. **按键语义**: 上键+分钟/下键-分钟/A键开始暂停继续/B键取消
4. **音乐**: 完成时循环播放致爱丽丝片段(39音符)，用ESP32 LEDC PWM驱动蜂鸣器
5. **增量刷新**: `cd_update` 仅在时间或状态变化时重绘TFT
6. **依赖**: TFT_eSPI + U8g2_for_TFT_eSPI 已初始化
7. **ESP32专用**: 使用ledcWriteTone驱动蜂鸣器

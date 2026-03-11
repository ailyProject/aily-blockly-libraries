# HT16K33四位七段数码管

HT16K33四位七段数码管驱动库，支持数字、时间、日期显示，亮度和闪烁控制，包含传感器显示、数字时钟等实用组合功能

## Library Info
- **Name**: @aily-project/lib-ht16k33
- **Version**: 1.2.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ht16k33_init` | Statement | ADDRESS(dropdown) | `ht16k33_init(0x70)` | `` |
| `ht16k33_simple_display` | Statement | VALUE(input_value) | `ht16k33_simple_display(math_number(0))` | `// 自动选择显示格式 if (... == (int)... && ... >= -999 && ... <= 9999) {   seg.disp...` |
| `ht16k33_display_temperature` | Statement | TEMP(input_value) | `ht16k33_display_temperature(math_number(0))` | `seg.displayFloat(..., 1); delay(1000); seg.displayClear(); delay(200); //...` |
| `ht16k33_display_voltage` | Statement | VOLTAGE(input_value) | `ht16k33_display_voltage(math_number(0))` | `seg.displayFloat(..., 2);` |
| `ht16k33_clock_display` | Statement | HOUR(input_value), MINUTE(input_value), BLINK(field_checkbox) | `ht16k33_clock_display(math_number(0), math_number(0), TRUE)` | `// 时钟显示（带闪烁冒号和参数验证） int clockHour = constrain(..., 0, 23); int clockMinute ...` |
| `ht16k33_countdown` | Statement | SECONDS(input_value) | `ht16k33_countdown(math_number(0))` | `// 倒计时显示（带参数验证） int countdownSeconds = constrain(..., 0, 5999); // 最大99:59 ...` |
| `ht16k33_display_int` | Statement | VALUE(input_value) | `ht16k33_display_int(math_number(0))` | `seg.displayInt(` |
| `ht16k33_display_float` | Statement | VALUE(input_value), DECIMALS(dropdown) | `ht16k33_display_float(math_number(0), 1)` | `seg.displayFloat(` |
| `ht16k33_display_hex` | Statement | VALUE(input_value) | `ht16k33_display_hex(math_number(0))` | `seg.displayHex(` |
| `ht16k33_display_time` | Statement | HOUR(input_value), MINUTE(input_value), COLON(field_checkbox) | `ht16k33_display_time(math_number(0), math_number(0), TRUE)` | `// 显示时间（带参数验证） int displayHour = constrain(..., 0, 23); int displayMinute =...` |
| `ht16k33_display_date` | Statement | MONTH(input_value), DAY(input_value) | `ht16k33_display_date(math_number(0), math_number(0))` | `// 显示日期（带参数验证） int displayMonth = constrain(..., 1, 12); int displayDay = c...` |
| `ht16k33_display_clear` | Statement | (none) | `ht16k33_display_clear()` | `seg.displayClear();\n` |
| `ht16k33_set_brightness` | Statement | BRIGHTNESS(input_value) | `ht16k33_set_brightness(math_number(0))` | `int brightness = constrain(..., 0, 15); seg.setBrightness(brightness);` |
| `ht16k33_set_blink` | Statement | BLINK(dropdown) | `ht16k33_set_blink(0)` | `seg.setBlink(` |
| `ht16k33_display_on_off` | Statement | STATE(dropdown) | `ht16k33_display_on_off(ON)` | `seg.displayOn();\n` |
| `ht16k33_display_colon` | Statement | STATE(dropdown) | `ht16k33_display_colon(true)` | `seg.displayColon(` |
| `ht16k33_display_test` | Statement | DELAY(input_value) | `ht16k33_display_test(math_number(1000))` | `seg.displayTest(` |
| `ht16k33_sensor_display` | Statement | VALUE(input_value), LABEL(dropdown) | `ht16k33_sensor_display(math_number(0), temp)` | (dynamic code) |
| `ht16k33_digital_clock` | Statement | TIME_SOURCE(dropdown) | `ht16k33_digital_clock(millis)` | (dynamic code) |
| `ht16k33_score_display` | Statement | SCORE(input_value) | `ht16k33_score_display(math_number(0))` | `// 显示游戏得分 int displayScore = constrain(..., 0, 9999); seg.displayInt(displa...` |
| `ht16k33_counter_display` | Statement | OPERATION(dropdown), STEP(input_value) | `ht16k33_counter_display(inc, math_number(0))` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77 | 0x70 (默认) / 0x71 / 0x72 / 0x73 / 0x74 / 0x75 / 0x76 / 0x77 |
| DECIMALS | 1, 2, 3 | 1位 / 2位 / 3位 |
| BLINK | 0, 1, 2, 3 | 关闭 / 快速闪烁 / 中速闪烁 / 慢速闪烁 |
| STATE | ON, OFF | 开启 / 关闭 |
| LABEL | temp, humi, volt, curr, dist, light, none | 温度 °C / 湿度 % / 电压 V / 电流 A / 距离 cm / 亮度 / 无标签 |
| TIME_SOURCE | millis, manual, rtc | 系统毫秒数 / 手动设置 / RTC模块 |
| OPERATION | inc, dec, reset | 递增 / 递减 / 重置 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ht16k33_init(0x70)
    serial_begin(Serial, 9600)

arduino_loop()
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

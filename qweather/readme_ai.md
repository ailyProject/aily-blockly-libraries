# @aily-project/lib-qweather

## Library Info

- **Name**: `@aily-project/lib-qweather`
- **Version**: 1.0.0
- **Purpose**: 和风天气(QWeather) API 封装：实况与 7 日预报取值、天气界面面板（图标/预报/时钟）、每小时自动刷新计时。

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| --- | --- | --- | --- | --- |
| `qweather_setup` | Statement | HOST(input_value), KEY(input_value), LOC_ID(input_value), LOC_NAME(input_value) | `qweather_setup(text(host), text(key), text(locId), text(locName))` | `#include "QWeather.h"` ↵ `qweatherSetup(host, key, locId, locName);` |
| `qweather_update` | Statement | (none) | `qweather_update()` | `qweatherUpdate();` |
| `qweather_ok` | Value | (none) | `qweather_ok()` | `qweatherOk()` |
| `qweather_get_temp` | Value | (none) | `qweather_get_temp()` | `qweatherGetTemp()` |
| `qweather_get_high` | Value | (none) | `qweather_get_high()` | `qweatherGetHigh()` |
| `qweather_get_low` | Value | (none) | `qweather_get_low()` | `qweatherGetLow()` |
| `qweather_get_text` | Value | (none) | `qweather_get_text()` | `String(qweatherGetText())` |
| `qweather_get_city` | Value | (none) | `qweather_get_city()` | `String(qweatherGetCity())` |
| `qweather_f_high` | Value | DAY(input_value) | `qweather_f_high(math_number(1))` | `qweatherGetFHigh(1)` |
| `qweather_f_low` | Value | DAY(input_value) | `qweather_f_low(math_number(1))` | `qweatherGetFLow(1)` |
| `qweather_f_text` | Value | DAY(input_value) | `qweather_f_text(math_number(1))` | `String(qweatherGetFText(1))` |
| `qweather_f_date` | Value | DAY(input_value) | `qweather_f_date(math_number(1))` | `String(qweatherGetFDate(1))` |
| `qweather_ui_open` | Statement | (none) | `qweather_ui_open()` | 注册宏 `LV_FONT_MONTSERRAT_48=1` ↵ `qweatherUiOpen();` |
| `qweather_ui_show` | Statement | (none) | `qweather_ui_show()` | `qweatherUiShow();` |
| `qweather_ui_set_time` | Statement | HOUR(input_value), MINUTE(input_value), MONTH(input_value), MDAY(input_value) | `qweather_ui_set_time(math_number(17), math_number(30), math_number(10), math_number(9))` | `qweatherUiSetTime(17, 30, 10, 9);` |
| `qweather_ui_attach` | Statement | PARENT(field_variable) | `qweather_ui_attach($menuScr)` | 注册宏 `LV_FONT_MONTSERRAT_48=1` ↵ `qweatherUiAttach((void*)menuScr);` |

所有积木都会在使用时注入 `#include "QWeather.h"`。

## Parameter Options

无下拉/复选参数。预报 `DAY` 取 0~3（0=今天，1~3=明天/后天/大后天，数据来自 7 日接口的前 4 天）。

## ABS Examples

完整示例（独立天气屏，循环刷新 + 每分钟喂时间）：

```abs
# ABS Schema: 2
arduino_global()
    variable_define("wNeed", int, math_number(0))
arduino_setup()
    qweather_setup(text("devapi.qweather.com"), text("your-api-key"), text("101020900"), text("上海松江"))
    qweather_ui_open()
    variables_set($wNeed, math_number(1))
arduino_loop()
    controls_if()
        @IF0: logic_compare(variables_get($wNeed), EQ, math_number(1))
        @DO0:
            variables_set($wNeed, math_number(0))
            qweather_update()
            qweather_ui_show()
    qweather_ui_set_time(math_number(17), math_number(30), math_number(10), math_number(9))
```

挂载到已有屏幕（需该屏幕对象已由 `lvgl_screen_create` 创建）：

```abs
arduino_setup()
    qweather_setup(text("devapi.qweather.com"), text("your-api-key"), text("101020900"), text("上海松江"))
    qweather_ui_attach($menuScr)
```

Host/Key/地区ID 也可放入全局声明（String 变量，参数同时兼容字面量与变量）：

```abs
# ABS Schema: 2
arduino_global()
    variable_define("qwHost", String, text("devapi.qweather.com"))
    variable_define("qwKey", String, text("your-api-key"))
    variable_define("qwLoc", String, text("101020900"))
arduino_setup()
    qweather_setup(variables_get($qwHost), variables_get($qwKey), variables_get($qwLoc), text("上海松江"))
```

## Notes

- **联网依赖**：需项目已配置 WiFi（如 `@aily-project/lib-esp32-wifi`）并已连接；未联网时 `qweather_update` 直接失败（n=-2）。
- **显示依赖**：`qweather_ui_*` 需要项目使用 LVGL + TFT 显示（如 `lib-lvgl` + `lib-tft-espi`）。`qweather_ui_open` 创建并加载独立全屏；`qweather_ui_attach` 把面板控件挂载到传入的 lv_obj_t 屏幕，仅首次生效。
- **宏副作用**：`qweather_ui_open` / `qweather_ui_attach` 会向工程注册 `LV_FONT_MONTSERRAT_48=1` 以编译 48px 数字字体。
- **阻塞时长**：`qweather_update` 为同步 HTTPS 请求（实况+7日预报两次），约 2~8 秒；建议由按键或低频定时触发。
- **错误码**：`qweather_ok()` 为假时可读 `qweather_get_temp()` 之外的状态（见下）：n/d 状态经 `qweather_ui_show` 显示为 `失败 n=.. d=..`。n: 200 成功, -1 连接失败, -2 未联网, -3 gzip 解压失败；d 为预报请求同义码。
- **自动刷新**：面板内置小时计时——`qweather_ui_set_time` 每次被调用时对比上次刷新时刻，满 60 分钟自动执行一次 `qweatherUpdate()+qweatherUiShow()`（跨午夜已处理）；任何手动刷新（含按 B 触发的 update+show）都会重置计时。仅在调用 `qweather_ui_set_time` 的页面生效。
- **内存**：图标与字体数据位于 flash（约 250KB）；无动态分配，无需清理。
- **服务器信息**：HOST/KEY 来自和风天气控制台（项目级配置，请勿在示例中提交真实 Key）。

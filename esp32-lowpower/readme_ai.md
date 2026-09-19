# ESP32低功耗

ESP32 低功耗库：深度/浅度睡眠、定时/GPIO/触摸/ext1/UART 唤醒、RTC 数据保持与 CPU 调频。

## Library Info

- **Name**: @aily-project/lib-esp32-lowpower
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `espsleep_esp32_timer_wakeup` | Statement | SEC(input_value Number) | `espsleep_esp32_timer_wakeup(math_number(60))` | `#include <esp_sleep.h> ↵ esp_sleep_enable_timer_wakeup(60 * 1000000ULL);` |
| `espsleep_esp32_gpio_wakeup` | Statement | PIN(field_dropdown，动态 board.digitalPins), LEVEL(field_dropdown) | `espsleep_esp32_gpio_wakeup(4, 1)` | `#include <esp_sleep.h> ↵ pinMode(4, INPUT_PULLDOWN); ↵ gpio_deep_sleep_hold_dis(); ↵ #if CONFIG_IDF_TARGET_ESP32 &#124;&#124; CONFIG_IDF_TARGET_ESP32S2 &#124;&#124; CONFIG_IDF_TARGET_ESP32S3 ↵ esp_sleep_enable_ext0_wakeup(GPIO_NUM_4, 1); ↵ #else ↵ esp_deep_sleep_enable_gpio_wakeup(1ULL << GPIO_NUM_4, ESP_GPIO_WAKEUP_GPIO_HIGH); ↵ #endif` |
| `espsleep_esp32_wakeup_cause` | Value (Number) | （无参数） | `espsleep_esp32_wakeup_cause()` | `#include <esp_sleep.h> ↵ esp_sleep_get_wakeup_cause()` |
| `espsleep_esp32_touch_wakeup` | Statement | CHANNEL(field_dropdown), CALLBACK(field_input), THRESHOLD(input_value Number) | `espsleep_esp32_touch_wakeup(T6, "onTouchCallback", math_number(30000))` | `#include <esp_sleep.h> ↵ void onTouchCallback() { ↵ // 触摸唤醒回调函数（唤醒后不会调用，可在此处放唤醒后逻辑） ↵ } ↵ #if CONFIG_IDF_TARGET_ESP32 &#124;&#124; CONFIG_IDF_TARGET_ESP32S3 ↵ touchAttachInterrupt(T6, onTouchCallback, 30000); ↵ esp_sleep_enable_touchpad_wakeup(); ↵ #else ↵ #error "当前芯片无触摸传感器，不支持触摸唤醒" ↵ #endif` |
| `espsleep_esp32_ext1_wakeup` | Statement | PIN_MASK(input_value Number), MODE(field_dropdown) | `espsleep_esp32_ext1_wakeup(math_number(20), ANY_HIGH)` | `#include <esp_sleep.h> ↵ #if CONFIG_IDF_TARGET_ESP32 &#124;&#124; CONFIG_IDF_TARGET_ESP32S2 &#124;&#124; CONFIG_IDF_TARGET_ESP32S3 ↵ gpio_deep_sleep_hold_dis(); ↵ esp_sleep_enable_ext1_wakeup(20, ESP_EXT1_WAKEUP_ANY_HIGH); ↵ #else ↵ #error "当前芯片不支持 ext1 多引脚唤醒，请使用外部引脚唤醒积木" ↵ #endif` |
| `espsleep_esp32_uart_wakeup` | Statement | UART_NUM(field_dropdown), THRESHOLD(input_value Number) | `espsleep_esp32_uart_wakeup(0, math_number(3))` | `#include <esp_sleep.h> ↵ #include <driver/uart.h> ↵ // UART 唤醒仅在浅睡眠下有效，深度睡眠请使用 GPIO/定时器唤醒 ↵ uart_set_wakeup_threshold((uart_port_t)0, 3); ↵ esp_sleep_enable_uart_wakeup(0);` |
| `espsleep_esp32_disable_wakeup` | Statement | SOURCE(field_dropdown) | `espsleep_esp32_disable_wakeup(ALL)` | `#include <esp_sleep.h> ↵ esp_sleep_disable_wakeup_source(ESP_SLEEP_WAKEUP_ALL);  // 禁用唤醒源：ALL` |
| `espsleep_esp32_deep_sleep` | Statement | （无参数） | `espsleep_esp32_deep_sleep()` | `#include <esp_sleep.h> ↵ esp_deep_sleep_start();` |
| `espsleep_esp32_light_sleep` | Statement | （无参数） | `espsleep_esp32_light_sleep()` | `#include <esp_sleep.h> ↵ esp_light_sleep_start();` |
| `espsleep_esp32_quick_sleep` | Statement | SEC(input_value Number) | `espsleep_esp32_quick_sleep(math_number(60))` | `#include <esp_sleep.h> ↵ esp_deep_sleep(60 * 1000000ULL);  // 定时唤醒后重启运行 setup()` |
| `espsleep_esp32_rtc_int` | Statement | VAR_NAME(field_input), INIT_VAL(input_value) | `espsleep_esp32_rtc_int("rtcCounter", math_number(0))` | 行内无代码；写入全局声明区：`RTC_DATA_ATTR int rtcCounter = 0;`（经 addObject 登记，同名 tag 去重） |
| `espsleep_esp32_set_rtc` | Statement | VAR_NAME(field_input), VALUE(input_value) | `espsleep_esp32_set_rtc("rtcCounter", math_number(1))` | `rtcCounter = 1;` ↵ 另登记全局声明 `RTC_DATA_ATTR int rtcCounter = 0;`（与 rtc_int 同 tag 去重，缺省时自动补声明） |
| `espsleep_esp32_get_rtc` | Value | VAR_NAME(field_input) | `espsleep_esp32_get_rtc("rtcCounter")` | 表达式 `rtcCounter`；另登记全局声明 `RTC_DATA_ATTR int rtcCounter = 0;`（与 rtc_int 同 tag 去重，缺省时自动补声明） |
| `espsleep_esp32_set_cpu_freq` | Statement | FREQ(field_dropdown) | `espsleep_esp32_set_cpu_freq(240)` | `#include <esp_system.h> ↵ setCpuFrequencyMhz(240);` |

## Parameter Options

| Block Type | Parameter | Options |
| ---------- | --------- | ------- |
| `espsleep_esp32_gpio_wakeup` | LEVEL | `1`, `0` |
| `espsleep_esp32_touch_wakeup` | CHANNEL | `T0`, `T1`, `T2`, `T3`, `T4`, `T5`, `T6`, `T7`, `T8`, `T9` |
| `espsleep_esp32_ext1_wakeup` | MODE | `ANY_HIGH`, `ALL_LOW` |
| `espsleep_esp32_uart_wakeup` | UART_NUM | `0`, `1` |
| `espsleep_esp32_disable_wakeup` | SOURCE | `ALL`, `TIMER`, `GPIO`, `TOUCHPAD`, `UART`, `WIFI`, `BT` |
| `espsleep_esp32_set_cpu_freq` | FREQ | `80`, `160`, `240` |

`espsleep_esp32_gpio_wakeup` 的 PIN 为动态下拉（`${board.digitalPins}`），实际取值由所选主板提供。

## ABS Examples

定时唤醒深度睡眠 + RTC 计数保持（唤醒后从头运行，计数继续累加）：

```abs
arduino_setup()
    espsleep_esp32_rtc_int("rtcCounter", math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, espsleep_esp32_wakeup_cause())
    espsleep_esp32_set_rtc("rtcCounter", math_arithmetic(espsleep_esp32_get_rtc("rtcCounter"), ADD, math_number(1)))
    espsleep_esp32_set_cpu_freq(240)
    espsleep_esp32_timer_wakeup(math_number(60))
    espsleep_esp32_deep_sleep()
```

UART 唤醒浅睡眠（浅睡眠从断点继续执行，不需 RTC 变量保数据）：

```abs
arduino_setup()
    serial_begin(Serial, 9600)
    espsleep_esp32_uart_wakeup(0, math_number(3))

arduino_loop()
    serial_println(Serial, text("sleep"))
    espsleep_esp32_disable_wakeup(TIMER)
    espsleep_esp32_light_sleep()
```

## Notes

1. **头文件由积木自动登记**：除 RTC 三个积木外，其余积木均登记 `#include <esp_sleep.h>`（同一 tag 自动去重，整个程序只出现一次）；`espsleep_esp32_uart_wakeup` 额外登记 `#include <driver/uart.h>`，`espsleep_esp32_set_cpu_freq` 登记 `#include <esp_system.h>`。无需手工添加头文件。
2. **变量说明**：`espsleep_esp32_rtc_int("rtcCounter", math_number(0))` 创建全局 `RTC_DATA_ATTR int rtcCounter = 0;`。VAR_NAME 是 field_input 文本（须为合法 C 标识符），不是 Blockly 变量，禁止写成 `$rtcCounter`；在其他积木中读取该值必须使用值积木 `espsleep_esp32_get_rtc("rtcCounter")`。`set_rtc`/`get_rtc` 与 `rtc_int` 按同名 tag 去重共享声明；未先调用 `rtc_int` 时自动补 `= 0` 声明，INIT_VAL 仅在 `rtc_int` 首次声明时生效。RTC 变量固定为 `int` 类型。
3. **深度睡眠语义**：`espsleep_esp32_deep_sleep()`/`espsleep_esp32_quick_sleep()` 执行后芯片复位重启并从头运行 `setup()`，SRAM 数据全部丢失，需用 RTC 变量保存状态；`espsleep_esp32_light_sleep()` 唤醒后从下一行继续执行。
4. **外部引脚唤醒**：PIN 必须选 RTC GPIO；LEVEL=`1`（高电平）自动配下拉、`0`（低电平）自动配上拉，并先执行 `gpio_deep_sleep_hold_dis()`。ESP32/S2/S3 生成 ext0（深度+浅睡眠均有效），C3/C6 生成 `esp_deep_sleep_enable_gpio_wakeup`（仅深度睡眠有效，且仅 RTC GPIO0~5 可用）。PIN 下拉选项来自所选主板的数字引脚表。
5. **触摸唤醒**：仅 ESP32 原版/S3 有触摸硬件，其他芯片生成 `#error "当前芯片无触摸传感器，不支持触摸唤醒"` 编译错误。回调函数唤醒后不会被调用，仅生成空函数避免链接错误；THRESHOLD 常用 20000~40000（越小越灵敏）；通道与 GPIO 对应关系因芯片而异（ESP32 原版 T0=GPIO4 … T9=GPIO32；S3/S2 为 T1=GPIO1 … T14=GPIO14）。
6. **ext1 多引脚唤醒**：仅 ESP32/S2/S3 支持（其余芯片生成 `#error`）。PIN_MASK 为位掩码，如 GPIO0+GPIO4=17、GPIO12+GPIO13+GPIO14=28672，公式 `(1ULL << GPIO_NUM_n) | ...`；`ANY_HIGH` 需外部下拉电阻，`ALL_LOW` 需外部上拉电阻。
7. **UART 唤醒**：仅浅睡眠有效，深度睡眠不支持；THRESHOLD 为唤醒所需接收字符数，通过 `uart_set_wakeup_threshold()` 单独设置。
8. **唤醒原因编号**（`espsleep_esp32_wakeup_cause()` 返回值）：0=未唤醒（首次启动/复位）、2=ext0、3=ext1、4=定时器、5=触摸、7=GPIO（C3 深度睡眠）、8=UART（仅浅睡眠）。
9. **兼容性**：`compatibility.core = esp32:esp32`，电压 3.3–5V。库不含 src，全部使用 ESP-IDF 自带头文件。多次进入睡眠前建议先 `espsleep_esp32_disable_wakeup(ALL)` 清除残留唤醒源。

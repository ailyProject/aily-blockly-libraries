# ESP32低功耗（@aily-project/lib-esp32-lowpower）

ESP32 低功耗支持库，提供深度/浅度睡眠、多种唤醒源配置、RTC 数据保持与 CPU 调频积木。
由米思齐（Mixly）库转换而来，原库制作者：李北极（QQ: 328828999）。

## 积木清单

| 积木 | 类型 | 说明 |
|------|------|------|
| 设置定时唤醒睡眠 [N] 秒 | 语句 | `esp_sleep_enable_timer_wakeup()`，N 秒后唤醒 |
| 设置外部引脚唤醒 引脚[X] 电平[高/低] | 语句 | ext0（ESP32/S2/S3）或 gpio_wakeup（C3/C6，仅深度睡眠） |
| 获取唤醒原因 | 值 | 返回 `esp_sleep_get_wakeup_cause()` 编号（0=复位 2=ext0 3=ext1 4=定时器 5=触摸 7=GPIO…） |
| 设置触摸唤醒 通道/回调/阈值 | 语句 | `touchAttachInterrupt()` + `esp_sleep_enable_touchpad_wakeup()`，仅 ESP32/S3 |
| 设置ext1多引脚唤醒 位掩码/触发模式 | 语句 | `esp_sleep_enable_ext1_wakeup()`，仅 ESP32/S2/S3 |
| 设置UART唤醒 串口/阈值字符数 | 语句 | 仅浅睡眠有效 |
| 禁用唤醒源 类型 | 语句 | `esp_sleep_disable_wakeup_source()` |
| 进入深度睡眠 | 语句 | `esp_deep_sleep_start()`，执行后不返回 |
| 进入浅度睡眠 | 语句 | `esp_light_sleep_start()` |
| 快速深度睡眠 [N] 秒 | 语句 | `esp_deep_sleep(N * 1000000ULL)` 一步到位 |
| RTC整数变量/设置RTC变量/获取RTC变量 | 语句/值 | `RTC_DATA_ATTR int` 深度睡眠中保持数据 |
| 设置CPU频率 [80/160/240] MHz | 语句 | `setCpuFrequencyMhz()` |

## 使用示例（定时唤醒 + RTC 计数）

```
main() {
  RTC整数变量 rtcCounter 初始值 0
  设置RTC变量 rtcCounter = (rtcCounter + 1)
  设置定时唤醒睡眠 60 秒
  进入深度睡眠
}
```

唤醒后设备重启运行 setup()，RTC 变量数值保留，可通过唤醒原因判断唤醒来源。

## 芯片兼容性说明

| 功能 | ESP32 | S2 | S3 | C3/C6 |
|------|-------|----|----|-------|
| 定时唤醒 | ✅ | ✅ | ✅ | ✅ |
| 外部引脚唤醒 | ✅ ext0 | ✅ ext0 | ✅ ext0 | ✅ gpio_wakeup（仅深度睡眠，RTC GPIO0~5） |
| 触摸唤醒 | ✅ | ❌ | ✅ | ❌（编译报错提示） |
| ext1 多引脚 | ✅ | ✅ | ✅ | ❌（编译报错提示） |
| UART 唤醒 | 浅睡眠 | 浅睡眠 | 浅睡眠 | 浅睡眠 |

- 外部引脚唤醒必须使用 RTC GPIO 引脚；高电平唤醒自动配置下拉、低电平唤醒自动配置上拉。
- 深度睡眠唤醒后程序从头执行（等效按复位键），SRAM 数据丢失，需用 RTC 变量保存状态。
- 触摸通道与 GPIO 对应关系因芯片而异，详见积木提示（tooltip）。

## 依赖

使用 ESP-IDF 自带头文件（`esp_sleep.h`、`esp_system.h`、`driver/uart.h`），无需额外 Arduino 库，库中不含 src.7z。

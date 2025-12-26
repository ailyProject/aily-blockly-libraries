# ESP32睡眠库

ESP32深度和浅度睡眠库，支持定时唤醒、外部引脚唤醒，包含RTC存储功能。

## 库信息
- **库名**: @aily-project/lib-esp32-sleep
- **版本**: 1.0.0
- **兼容**: ESP32系列开发板

### 唤醒方式
- **定时唤醒**: 设置睡眠时间，定时自动唤醒
- **外部引脚唤醒**: 支持RTC GPIO引脚外部触发唤醒
- **快速睡眠**: 一步完成定时设置和深度睡眠
- **浅度睡眠**: 保持内存状态，唤醒后继续执行

### 功耗优化
- **CPU频率调节**: 支持多种CPU频率设置以降低功耗
- **深度睡眠模式**: 最小化功耗，仅保持RTC运行
- **浅度睡眠模式**: 中等功耗，保持RAM和CPU状态

### RTC存储
- **RTC变量**: 支持RTC存储的整数变量，睡眠后数据不丢失
- **数据持久化**: 深度睡眠和重启后数据保持
- **快速访问**: 直接读写RTC变量

## 块定义

| 块类型 | 连接 | 字段/输入 | 生成代码 |
|--------|------|----------|----------|
| `esp32_deep_sleep_timer` | 语句块 | SECONDS(input) | `esp_sleep_enable_timer_wakeup(seconds * 1000000ULL);` |
| `esp32_deep_sleep_ext0` | 语句块 | PIN(field_dropdown), LEVEL(field_dropdown) | `esp_sleep_enable_ext0_wakeup(GPIO_NUM_X, level);` |
| `esp32_deep_sleep_start` | 语句块 | 无 | `esp_deep_sleep_start();` |
| `esp32_light_sleep_start` | 语句块 | 无 | `esp_light_sleep_start();` |
| `esp32_set_cpu_frequency` | 语句块 | FREQUENCY(field_dropdown) | `setCpuFrequencyMhz(frequency);` |
| `esp32_deep_sleep_quick` | 语句块 | SECONDS(input) | `deepSleepTimer(seconds);` |
| `esp32_rtc_variable_int` | 语句块 | VAR(field_input), VALUE(input) | `RTC_DATA_ATTR int varName = value;` |
| `esp32_rtc_set_variable` | 语句块 | VAR(field_input), VALUE(input) | `varName = value;` |
| `esp32_rtc_get_variable` | 值块 | VAR(field_input) | `varName` |

## 使用示例

### 定时唤醒示例
```json
{
  "type": "esp32_deep_sleep_timer",
  "id": "timer_setup",
  "inputs": {
    "SECONDS": {"block": {"type": "math_number", "fields": {"NUM": 60}}}
  }
}
```

### 外部引脚唤醒示例
```json
{
  "type": "esp32_deep_sleep_ext0",
  "id": "ext0_setup",
  "fields": {"PIN": "33", "LEVEL": "1"}
}
```

### 浅度睡眠示例
```json
{
  "type": "esp32_light_sleep_start",
  "id": "light_sleep"
}
```

### RTC变量使用示例
```json
{
  "type": "esp32_rtc_variable_int",
  "id": "rtc_var",
  "fields": {"VAR": "recordCounter"},
  "inputs": {
    "VALUE": {"block": {"type": "math_number", "fields": {"NUM": 0}}}
  }
}
```

### 快速睡眠示例
```json
{
  "type": "esp32_deep_sleep_quick",
  "id": "quick_sleep",
  "inputs": {
    "SECONDS": {"block": {"type": "math_number", "fields": {"NUM": 120}}}
  }
}
```

## 重要规则

1. **必须遵守**: 深度睡眠后代码从setup()重新开始执行
2. **浅度睡眠**: 浅度睡眠唤醒后继续执行当前代码，不会重启
3. **引脚限制**: 外部唤醒只能使用RTC GPIO引脚（0,2,4,12-15,25-27,32-39）
4. **功耗优化**: 建议在深度睡眠前降低CPU频率
5. **调试注意**: 深度睡眠期间Serial无法使用，浅度睡眠期间可以使用
6. **RTC变量**: RTC变量仅在深度睡眠后保留数据，断电重启后数据丢失

## 支持的CPU频率
- 240 MHz (默认最高性能)
- 160 MHz
- 80 MHz (推荐低功耗)
- 40 MHz
- 20 MHz
- 10 MHz (最低功耗)

## 技术说明

- **定时精度**: 微秒级定时精度
- **唤醒保持**: 深度睡眠后保留RTC内存中的数据
- **功耗**: 深度睡眠模式下功耗约为10μA，浅度睡眠约为1mA
- **启动时间**: 深度睡眠唤醒约需要2-6ms，浅度睡眠唤醒约需要1-2ms
- **RTC内存**: ESP32约有8KB RTC内存用于存储变量

## 常见问题

**Q: 深度睡眠和浅度睡眠有什么区别？**
A: 深度睡眠会重启，代码从setup()重新开始；浅度睡眠保持状态，唤醒后继续执行。

**Q: RTC变量在什么情况下会丢失数据？**
A: 仅在断电重启时丢失，深度睡眠和浅度睡眠都会保留数据。

**Q: 浅度睡眠期间可以使用Serial吗？**
A: 可以，浅度睡眠保持CPU和内存状态，Serial等外设继续工作。

**Q: 如何在深度睡眠后知道唤醒原因？**
A: 可以使用esp_sleep_get_wakeup_cause()函数获取唤醒原因。
```

### 快速睡眠示例
```json
{
  "type": "esp32_deep_sleep_quick",
  "id": "quick_sleep",
  "inputs": {
    "SECONDS": {"block": {"type": "math_number", "fields": {"NUM": 120}}}
  }
}
```

## 重要规则

1. **必须遵守**: 深度睡眠后代码从setup()重新开始执行
2. **引脚限制**: 外部唤醒只能使用RTC GPIO引脚（0,2,4,12-15,25-27,32-39）
3. **功耗优化**: 建议在深度睡眠前降低CPU频率
4. **调试注意**: 深度睡眠期间Serial无法使用

## 支持的CPU频率
- 240 MHz (默认最高性能)
- 160 MHz
- 80 MHz (推荐低功耗)
- 40 MHz
- 20 MHz
- 10 MHz (最低功耗)

## 技术说明

- **定时精度**: 微秒级定时精度
- **唤醒保持**: 唤醒后保留RTC内存中的数据
- **功耗**: 深度睡眠模式下功耗约为10μA
- **启动时间**: 从深度睡眠唤醒约需要2-6ms

## 常见问题

**Q: 深度睡眠后loop()函数会执行吗？**
A: 不会。深度睡眠唤醒后代码从setup()重新开始，loop()永远不会执行。

**Q: 可以同时设置多种唤醒方式吗？**
A: 可以，ESP32支持同时设置定时和外部唤醒，任一条件满足即可唤醒。

**Q: 如何选择唤醒引脚？**
A: 必须使用RTC GPIO引脚，普通GPIO无法在深度睡眠期间工作。
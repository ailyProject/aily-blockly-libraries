# Seeed RTC

Seeed SAMD21/SAMD51 RTC Blockly 库，支持校时、读 DateTime 和闹钟。

## 库信息

| 字段 | 内容 |
|---|---|
| 包名 | @aily-project/lib-seeed-rtc |
| 版本 | 1.0.0 |
| 作者 | SeeedStudio |
| 源码 | https://github.com/Seeed-Studio/Seeed_Arduino_RTC |
| License | MIT / LGPL-2.1 |

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|---|---|---|---|---|
| seeed_rtc_* | 语句/值/Hat | VAR、DateTime、闹钟参数 | 详见 readme_ai.md | RTC/DateTime API |

## 字段类型映射

`field_input` 建变量；`field_variable` 引用；`input_value` 接数字/DateTime；`dropdown` 选模式。

## 连接规则

`seeed_rtc_init` 放 setup；值块接表达式；`seeed_rtc_on_alarm` 是 Hat。

## 使用示例

`seeed_rtc_init("rtc")` 后，用 `seeed_rtc_set_time($rtc, seeed_rtc_build_time())` 校时。

## 重要规则

1. 支持 SAMD21/SAMD51，年份 2000-2099。
2. SAMD51 有闹钟0/1；SAMD21 使用闹钟0。

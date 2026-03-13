# 五路巡线传感器 v3

emakefun 五路巡线传感器模块 v3，I2C接口，支持模拟值和数字值读取

## 库信息
- **名称**: @aily-project/lib-five_line_tracker_v3
- **版本**: 1.0.0

## 块定义

| 块类型 | 连接类型 | 参数 (args0顺序) | ABS格式 | 生成的代码 |
|--------|----------|------------------|---------|------------|
| `five_line_tracker_v3_setup` | Statement | VAR(field_input), I2C_ADDRESS(dropdown) | `five_line_tracker_v3_setup("lineTracker", 0x50)` | `emakefun::FiveLineTracker lineTracker(Wire, 0x50);` + `Wire.begin();` + `lineTracker.Initialize();` |
| `five_line_tracker_v3_get_device_id` | Value | VAR(field_variable) | `five_line_tracker_v3_get_device_id($lineTracker)` | `lineTracker.DeviceId()` |
| `five_line_tracker_v3_get_firmware_version` | Value | VAR(field_variable) | `five_line_tracker_v3_get_firmware_version($lineTracker)` | `lineTracker.FirmwareVersion()` |
| `five_line_tracker_v3_set_high_threshold` | Statement | VAR(field_variable), CHANNEL(dropdown), THRESHOLD(input_value) | `five_line_tracker_v3_set_high_threshold($lineTracker, 0, math_number(850))` | `lineTracker.HighThreshold(0, 850);` |
| `five_line_tracker_v3_set_low_threshold` | Statement | VAR(field_variable), CHANNEL(dropdown), THRESHOLD(input_value) | `five_line_tracker_v3_set_low_threshold($lineTracker, 0, math_number(800))` | `lineTracker.LowThreshold(0, 800);` |
| `five_line_tracker_v3_get_analog_value` | Value | VAR(field_variable), CHANNEL(dropdown) | `five_line_tracker_v3_get_analog_value($lineTracker, 0)` | `lineTracker.AnalogValue(0)` |
| `five_line_tracker_v3_get_digital_value` | Value | VAR(field_variable), CHANNEL(dropdown) | `five_line_tracker_v3_get_digital_value($lineTracker, 0)` | `lineTracker.DigitalValue(0)` |
| `five_line_tracker_v3_get_all_digital_values` | Value | VAR(field_variable) | `five_line_tracker_v3_get_all_digital_values($lineTracker)` | `lineTracker.DigitalValues()` |
| `five_line_tracker_v3_check_error` | Value | VAR(field_variable) | `five_line_tracker_v3_check_error($lineTracker)` | `(emakefun::FiveLineTracker::kOK == lineTracker.Initialize())` |

## 参数选项

| 参数 | 值 | 描述 |
|------|-----|------|
| I2C_ADDRESS | 0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57 | I2C地址，默认0x50 |
| CHANNEL | 0, 1, 2, 3, 4 | 传感器通道(0-4) |
| THRESHOLD | 0-1023 | 阈值范围 |

## 变量说明

**自动创建变量**: `five_line_tracker_v3_setup("varName", ...)` 创建变量 `$varName`；后续使用 `variables_get($varName)` 引用。

## ABS示例

### 基本使用
```
arduino_setup()
    five_line_tracker_v3_setup("lineTracker", 0x50)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_print(Serial, text("Channel 0: "))
    serial_println(Serial, five_line_tracker_v3_get_analog_value(variables_get($lineTracker), 0))
    time_delay(math_number(100))
```

### 设置阈值并读取数字值
```
arduino_setup()
    five_line_tracker_v3_setup("lineTracker", 0x50)
    five_line_tracker_v3_set_high_threshold(variables_get($lineTracker), 0, math_number(850))
    five_line_tracker_v3_set_low_threshold(variables_get($lineTracker), 0, math_number(800))
    serial_begin(Serial, 9600)

arduino_loop()
    controls_if()
        @IF0: logic_compare(five_line_tracker_v3_get_digital_value(variables_get($lineTracker), 0), EQ, math_number(1))
        @DO0:
            serial_println(Serial, text("Line detected"))
    time_delay(math_number(100))
```

## 注意事项

1. **初始化**: 在 `arduino_setup()` 中调用 `five_line_tracker_v3_setup` 初始化传感器
2. **变量引用**: 在值槽中使用 `variables_get($varName)` 读取变量
3. **阈值设置**: 高阈值应大于低阈值，当模拟值超过高阈值时数字值为1，低于低阈值时为0
4. **I2C地址**: 默认地址为0x50，可通过硬件修改为其他地址
